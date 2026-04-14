# Copilot instructions for this repository

## Build, test, and lint commands

This repo is a static website (plain HTML/CSS/JS) with no package manager, build pipeline, or test framework configured.

| Task | Command |
| --- | --- |
| Run locally | `cd /home/anxiuser/mainpage && python3 -m http.server 8000` |
| Validate all HTML files | `cd /home/anxiuser/mainpage && for f in index.html portfolio.html blog.html; do xmllint --html --noout "$f"; done` |
| Validate a single page | `cd /home/anxiuser/mainpage && xmllint --html --noout index.html` |

## High-level architecture

- The site is three top-level pages: `index.html`, `portfolio.html`, and `blog.html`.
- All pages share one stylesheet (`assets/css/styles.css`) and one script (`assets/js/main.js`).
- Shared page shell pattern across all pages:
  - `.page` wrapper
  - `.site-header` with site title/subtitle
  - `main.layout` with left sidebar and right content stack
  - `.site-footer` containing `#year`
- `assets/js/main.js` only sets the current year text for the footer element with id `year`.

## Key conventions

- Keep layout class names consistent across all pages (`.layout`, `.stack`, `.box`, `.navlink`, `.meta`, `.status-ok`) so the shared CSS continues to apply uniformly.
- Sidebar navigation is duplicated per page; the current page is marked manually with `.navlink.active`.
- All links are relative and root-page based (`index.html`, `portfolio.html`, `blog.html`, and `assets/...`), so keep new pages/assets in paths that preserve this convention.
- Visual theme is tokenized in `:root` CSS variables (`--bg`, `--panel`, `--text`, `--link`, etc.); adjust these variables first for global style changes before editing component rules.
