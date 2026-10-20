# Updating the public resume

The PDF at `assets/documents/arpit-sidana-resume.pdf` is the approved document.
`data/resume.json` transcribes its career facts and owns the shorter homepage bio.
`scripts/resume_sync.py` generates semantic, readable HTML directly into Work and
the homepage. No JavaScript is needed to read the resume or expand role details.

## Update procedure

1. Replace the public PDF only with the user-approved version. Preserve its bytes;
   do not re-export or reformat it just to update the website.
2. Render every PDF page and inspect typography, clipping, contact links, spacing,
   and page count. The public resume should remain one page and omit phone numbers.
3. Reconcile `data/resume.json` against the actual PDF: summary, titles, dates,
   companies, project scope, metrics, education, skills, and certifications. Keep
   the homepage bio consistent in years, current positioning and domains. It is an
   editorial summary, not a duplicate of every resume bullet. Preserve investing
   and social content outside the marked career-bio block.
4. Bump `pdfVersion` in the JSON whenever the PDF changes so both actions bypass
   stale caches. Do not change the view/download behavior or download filename.
5. Run `python3 -m pip install -r scripts/requirements-resume.txt` in your selected
   Python environment, then run:

   ```sh
   python3 scripts/resume_sync.py --accept-source --write
   python3 scripts/resume_sync.py
   python3 -m unittest discover -s tests -p 'test_resume_sync.py'
   ```

6. Review the generated diff and verify desktop/mobile page scrolling, collapsed
   disclosures and keyboard navigation. The resume uses normal document flow,
   with no sidebar, nested scroll region, or programmatic focus. Confirm that
   both PDF actions deliver identical bytes. Commit the PDF, JSON, source lock,
   and generated HTML together. After deployment compare the public PDF hash.

## What the automated check enforces

- The PDF and approved content hashes match `data/resume-source.json`.
- Every resume claim, role, date, education entry and skill can be found in the PDF
  after whitespace and typography normalization. Semicolon-separated excerpts
  may omit a clause, but cannot add a new claim.
- Experience years agree between the PDF, JSON and homepage bio; numeric bio
  claims are evidenced in the PDF.
- Work's rendered content and its two PDF actions match the canonical generator.
- The homepage career paragraph matches the canonical bio exactly.
- The PDF remains one page and has no recognizable phone number or `tel:` link.

CI runs on every push and pull request and reports each mismatch by file/claim.
This is a deterministic factual and drift check, not an AI semantic guarantee:
human review still verifies nuanced wording, current positioning and visual PDF
layout. Updating the lock acknowledges that review; it is not a bypass for failed
claim checks. GitHub Pages' built-in publication is separate from this status
check. To require a passing check before merge, make `resume-consistency` a
required status in branch protection; direct pushes do not acquire that protection
just because a workflow exists.

## Source ambiguity

The current approved PDF has a malformed latency value (`P95 inference < 1.s`).
The web reader omits that latency clause rather than guessing its intended value.
The original document is unchanged. Clarify the value with the owner before
including it in a future PDF or reader update.
