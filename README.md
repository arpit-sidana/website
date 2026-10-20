# website

A dependency-free rebuild of Arpit Sidana's original Notion portfolio.

## Run locally

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Feature toggles

Public navigation for the Bookshelf and Substack link is controlled in `site-config.js`:

```js
window.SITE_FEATURES = Object.freeze({
  bookshelf: false,
  substack: false,
});
```

Change either value to `true` to publish that section or link again. While the Bookshelf is disabled, its content remains in the repository but is hidden, replaced by an archived message on direct visits, and marked `noindex` for search engines.

## Resume consistency

The Work page includes a continuous, in-page resume with expandable sections and
role details, collapsed by default. Career content lives in `data/resume.json` and is checked
against the approved PDF, homepage bio and both PDF actions by GitHub Actions.
See [the resume update workflow](docs/resume-updates.md) before changing any resume
content. Run `python3 scripts/resume_sync.py` to report mismatches locally.

## Hosting

The site is plain static HTML, CSS, JavaScript, fonts, and WebP images. It can be hosted free on GitHub Pages, Cloudflare Pages, Netlify, or Vercel. No build command is required; publish the repository root.
