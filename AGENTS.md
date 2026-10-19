# Website maintenance

## Resume changes

Read `docs/resume-updates.md` before changing the public resume PDF, career bio,
resume reader, or view/download links. `data/resume.json` owns the website copy;
the checked-in PDF is the factual source. Do not edit generated HTML by hand.

Run `python3 scripts/resume_sync.py` before committing. If the PDF changes, inspect
its rendering, reconcile its facts with the JSON and homepage bio, refresh the PDF
cache version, then run `python3 scripts/resume_sync.py --accept-source --write`.
Run the check again and the tests in `tests/test_resume_sync.py`.

Keep the public PDF free of phone numbers. Do not publish contact details from
older source documents. Preserve the supplied PDF bytes and formatting unless
the user explicitly asks for document edits.
