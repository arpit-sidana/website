import contextlib
import importlib.util
import io
import json
from pathlib import Path
import shutil
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("resume_sync", ROOT / "scripts/resume_sync.py")
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)


class ResumeConsistencyTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        for name in ["data/resume.json", "data/resume-source.json", "index.html", "work.html", "assets/documents/arpit-sidana-resume.pdf"]:
            target = self.root / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / name, target)
        self.patcher = patch.multiple(sync, ROOT=self.root, DATA=self.root / "data/resume.json", LOCK=self.root / "data/resume-source.json")
        self.patcher.start()

    def tearDown(self):
        self.patcher.stop()
        self.temp.cleanup()

    def run_check(self):
        output = io.StringIO()
        with patch("sys.argv", ["resume_sync.py"]), contextlib.redirect_stdout(output), contextlib.redirect_stderr(output):
            result = sync.main()
        return result, output.getvalue()

    def change(self, name, old, new):
        path = self.root / name
        path.write_text(path.read_text().replace(old, new))

    def test_current_sources_pass(self):
        self.assertEqual(self.run_check()[0], 0)

    def test_homepage_drift_fails(self):
        self.change("index.html", "nine years", "ten years")
        result, message = self.run_check()
        self.assertEqual(result, 1)
        self.assertIn("index.html", message)

    def test_reader_drift_fails(self):
        self.change("work.html", "82K", "92K")
        result, message = self.run_check()
        self.assertEqual(result, 1)
        self.assertIn("work.html", message)

    def test_download_link_drift_fails(self):
        self.change("work.html", 'download="Arpit-Sidana-Resume.pdf"', 'download="other.pdf"')
        self.assertEqual(self.run_check()[0], 1)

    def test_unsupported_claim_fails_even_when_accepting_source(self):
        data = json.loads(sync.DATA.read_text())
        data["summary"] += " Generated $999M revenue."
        sync.DATA.write_text(json.dumps(data))
        self.assertTrue(any("PDF mismatch" in error for error in sync.verify_source(data, True)))

    def test_pdf_replacement_requires_review(self):
        data = json.loads(sync.DATA.read_text())
        with (self.root / data["pdf"]).open("ab") as file:
            file.write(b"\n% changed document\n")
        self.assertTrue(any("Resume source changed" in error for error in sync.verify_source(data, False)))

    def test_years_mismatch_fails(self):
        data = json.loads(sync.DATA.read_text())
        data["yearsExperience"] += 1
        self.assertTrue(any("Years of experience" in error for error in sync.verify_source(data, False)))

    def test_changed_pdf_requires_new_cache_key_even_after_review(self):
        data = json.loads(sync.DATA.read_text())
        with (self.root / data["pdf"]).open("ab") as file:
            file.write(b"\n% changed document\n")
        self.assertTrue(any("pdfVersion" in error for error in sync.verify_source(data, True)))


if __name__ == "__main__":
    unittest.main()
