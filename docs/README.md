# Project Docs (Light Guide)

This directory holds lightweight project documentation for `mainpage`.

## What this project is

`mainpage` is a static site with three generated entry pages:

- `index.html`
- `blog.html`
- `portfolio.html`

The source files for those pages live in `site-src/`, and `node scripts/build-pages.mjs` regenerates the shared document wrapper and pre-rendered shell around each page body. Each page uses shared styles from `assets/css/styles.css` and shared behavior from `assets/js/main.js` for live features like the clock, rain, music, and status updates.

## Quick start

```bash
cd /home/anxiuser/mainpage
node scripts/build-pages.mjs
node server.js
```

Open one of:

- `http://localhost:8000/index.html`
- `http://localhost:8000/blog.html`
- `http://localhost:8000/portfolio.html`

## Before opening a PR

Run HTML validation:

```bash
cd /home/anxiuser/mainpage
node scripts/build-pages.mjs --check
for f in index.html blog.html portfolio.html; do
  xmllint --html --noout "$f"
done
```

## Where to edit

- Shared document boilerplate: `site-src/template.html`
- Page-specific content: `site-src/pages/*.content.html`
- Regenerate top-level HTML: `node scripts/build-pages.mjs`
- Shared shell data: `assets/js/config/shared-shell.js` and `assets/js/config/page-shells.js`
- Shared shell build output: `assets/js/ui/shell-static.js`
- Shared shell runtime rendering: `assets/js/ui/shell-sections.js` and `assets/js/ui/shell.js`
- Shared shell fallback frame: `assets/js/ui/page-frame.js`
- Feature behavior: `assets/js/features/`
- Styling: smallest relevant file in `assets/css/`

## Extra reference

- `docs/performance.md`
- `docs/superpowers/specs/2026-04-14-dimden-style-redesign.md`

## Performance guardrail

If a change touches shared layout, background effects, theme transitions, or other interactive UI code, follow `docs/performance.md` before merging. The repo now includes `node scripts/inspect-trace.mjs` for comparing the latest saved trace in `perf/` against the previous run.
