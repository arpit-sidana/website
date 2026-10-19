#!/usr/bin/env python3
"""Render and verify the public resume against its PDF. No network or API keys."""
import argparse
import hashlib
import html
import json
from pathlib import Path
import re
import sys
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data/resume.json"
LOCK = ROOT / "data/resume-source.json"


def normalized(text):
    return re.sub(r"[^a-z0-9+%$]", "", unicodedata.normalize("NFKC", text).lower())


def esc(value):
    return html.escape(value, quote=True)


def bullets(points):
    return "<ul>" + "".join(f"<li>{esc(p)}</li>" for p in points) + "</ul>"


def render(data):
    pdf = esc(f'{data["pdf"]}?v={data["pdfVersion"]}')
    out = [
        '<!-- resume:generated:start -->',
        '<div class="resume-overview">',
        '<div><p class="section-number">01</p><h2 id="resume-heading">Resume</h2>',
        '<p>AI and technical product management, from 0 → 1 to enterprise scale.</p></div>',
        '<div class="resume-actions">',
        f'<a href="{pdf}" target="_blank" rel="noopener">view PDF</a>',
        f'<a href="{pdf}" download="Arpit-Sidana-Resume.pdf">download PDF</a></div></div>',
        '<div class="resume-reader">',
        '<nav class="resume-navigation" aria-label="Resume sections">',
        '<a href="#resume-summary" aria-current="location">Overview</a>',
        '<a href="#resume-experience">Experience</a>',
        '<a href="#resume-education">Education</a>',
        '<a href="#resume-skills">Skills</a></nav>',
        '<div class="resume-content" role="region" aria-label="Resume reader" tabindex="0">',
        '<section id="resume-summary" class="resume-chapter" aria-labelledby="resume-summary-heading">',
        '<h3 id="resume-summary-heading" tabindex="-1">Overview</h3>',
        f'<p>{esc(data["summary"])}</p></section>',
        '<section id="resume-experience" class="resume-chapter" aria-labelledby="resume-experience-heading">',
        '<h3 id="resume-experience-heading" tabindex="-1">Experience</h3>',
    ]
    for i, job in enumerate(data["experience"]):
        out += [f'<article class="resume-job"><h4>{esc(job["company"])}</h4>',
                f'<p class="resume-location">{esc(job["location"])}</p>']
        for role in job["roles"]:
            out += [f'<div class="resume-role"><p>{esc(role["title"])}</p><p class="resume-date">{esc(role["dates"])}</p></div>']
        if job.get("intro"):
            out += [f'<p class="resume-job-intro">{esc(job["intro"])}</p>']
        if job.get("projects"):
            for k, project in enumerate(job["projects"]):
                opened = " open" if k == 0 else ""
                out += [f'<details class="resume-disclosure"{opened}><summary>{esc(project["title"])}</summary>', bullets(project["points"]), '</details>']
        else:
            out += [f'<details class="resume-disclosure"><summary>Role &amp; impact<span class="sr-only"> at {esc(job["company"])}</span></summary>', bullets(job["points"]), '</details>']
        out += ['</article>']
    out += ['</section>', '<section id="resume-education" class="resume-chapter" aria-labelledby="resume-education-heading">', '<h3 id="resume-education-heading" tabindex="-1">Education</h3>']
    for item in data["education"]:
        out += [f'<div class="resume-degree"><h4>{esc(item["degree"])}</h4><p>{esc(item["school"])}</p><p class="resume-date">{esc(item["date"])}</p></div>']
    out += ['</section>', '<section id="resume-skills" class="resume-chapter" aria-labelledby="resume-skills-heading">', '<h3 id="resume-skills-heading" tabindex="-1">Skills &amp; certifications</h3>']
    for item in data["skills"]:
        out += [f'<div class="resume-skill"><h4>{esc(item["title"])}</h4><p>{esc(item["text"])}</p></div>']
    out += ['</section></div></div>', '<!-- resume:generated:end -->']
    return "\n".join("      " + line for line in out)


def replace_block(text, label, content):
    pattern = rf"^[ \t]*<!-- {label}:start -->.*?<!-- {label}:end -->"
    if len(re.findall(pattern, text, re.M | re.S)) != 1:
        raise ValueError(f"Expected exactly one {label} block")
    return re.sub(pattern, lambda _: content, text, flags=re.M | re.S)


def evidence(data):
    yield "summary", data["summary"]
    for job in data["experience"]:
        yield "employer", job["company"]
        yield "location", job["location"]
        for role in job["roles"]:
            yield "title", role["title"]
            yield "dates", role["dates"]
        if job.get("intro"):
            yield "scope", job["intro"]
        for project in job.get("projects", []):
            yield "project", project["title"]
            for p in project["points"]:
                yield "impact", p
        for p in job.get("points", []):
            yield "impact", p
    for group in ("education", "skills"):
        for item in data[group]:
            for value in item.values():
                yield group, value


def verify_source(data, accept):
    from pypdf import PdfReader
    pdf = ROOT / data["pdf"]
    raw = pdf.read_bytes()
    reader = PdfReader(pdf)
    text = " ".join(page.extract_text() for page in reader.pages)
    norm = normalized(text)
    errors = []
    for label, value in evidence(data):
        # Semicolons allow a faithfully excerpted claim to omit an unrelated clause.
        if any(normalized(part) not in norm for part in value.split(";") if part.strip()):
            errors.append(f"PDF mismatch ({label}): {value}")
    years = data["yearsExperience"]
    if not re.search(rf"\b{years}\s+years\b", text):
        errors.append("Years of experience disagree with PDF summary")
    words = {8: "eight", 9: "nine", 10: "ten", 11: "eleven", 12: "twelve"}
    if not any(f"{v} years" in data["homepageBio"] for v in (str(years), words.get(years, str(years)))):
        errors.append("Homepage years of experience disagree with PDF")
    # Career-claim additions to the bio must be evidenced in the source PDF.
    for metric in re.findall(r"\$?\d[\d,.]*(?:[KM])?\+?%?", data["homepageBio"]):
        if normalized(metric) not in norm:
            errors.append(f"Homepage metric missing from PDF: {metric}")
    if re.search(r"\b(?:\+?1[ .-]?)?\(?\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}\b", text):
        errors.append("Public PDF appears to contain a phone number")
    for page in reader.pages:
        for ref in page.get("/Annots", []):
            uri = str(ref.get_object().get("/A", {}).get("/URI", ""))
            if uri.lower().startswith("tel:"):
                errors.append("Public PDF contains a telephone link")
    lock = {"pdfSha256": hashlib.sha256(raw).hexdigest(), "dataSha256": hashlib.sha256(DATA.read_bytes()).hexdigest(), "pages": len(reader.pages), "pdfVersion": data["pdfVersion"]}
    previous = json.loads(LOCK.read_text()) if LOCK.exists() else {}
    if previous.get("pdfSha256") and previous["pdfSha256"] != lock["pdfSha256"] and previous.get("pdfVersion") == lock["pdfVersion"]:
        errors.append("PDF changed but pdfVersion did not; refresh both PDF action cache keys")
    if len(reader.pages) != 1:
        errors.append("Resume PDF must remain one page")
    if not errors and accept:
        LOCK.write_text(json.dumps(lock, indent=2) + "\n")
    elif previous != lock:
        errors.append("Resume source changed: review PDF and data, then run --accept-source --write")
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true", help="Regenerate the HTML blocks from resume.json")
    parser.add_argument("--accept-source", action="store_true", help="Record the reviewed source hashes after factual validation")
    args = parser.parse_args()
    data = json.loads(DATA.read_text())
    errors = verify_source(data, args.accept_source)
    bio = '        <!-- resume:bio:start -->\n        <p>' + esc(data["homepageBio"]) + '</p>\n        <!-- resume:bio:end -->'
    for name, label, generated in [('work.html', 'resume:generated', render(data)), ('index.html', 'resume:bio', bio)]:
        path = ROOT / name
        original = path.read_text()
        expected = replace_block(original, label, generated)
        if original != expected:
            if args.write and not errors:
                path.write_text(expected)
            else:
                errors.append(f"{name}: content out of sync with data/resume.json; run --write")
    if errors:
        print("Resume consistency FAILED:\n- " + "\n- ".join(errors), file=sys.stderr)
        return 1
    print("Resume consistency passed: homepage bio, on-page resume, source PDF, and both PDF links.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
