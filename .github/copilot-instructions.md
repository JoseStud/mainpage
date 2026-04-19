# Copilot instructions for this repository

## Build, test, and lint commands

This repo is a static website with no package manager, build pipeline, or test framework.

| Task | Command |
| --- | --- |
| Run locally | `cd /home/anxiuser/mainpage && python3 -m http.server 8000` |
| Validate all pages | `cd /home/anxiuser/mainpage && for f in index.html blog.html portfolio.html; do xmllint --html --noout "$f"; done` |
| Validate one page | `cd /home/anxiuser/mainpage && xmllint --html --noout index.html` |

## High-level architecture

- The site has three entry pages: `index.html`, `blog.html`, and `portfolio.html`.
- Each page shares the same stylesheet entrypoint (`assets/css/styles.css`) and JavaScript entrypoint (`assets/js/main.js`).
- `styles.css` imports focused CSS modules:
  - `tokens.css` for palette and glow variables
  - `base.css` for resets, typography, and default elements
  - `effects.css` for CRT overlays, animated background particles, rain canvas styling, and keyframes
  - `layout.css` for `.page`, `.layout`, `.col`, `.box`, and footer structure
  - `components.css` for the logo, feeds, status cards, buttons, terminal rows, and reusable UI blocks
  - `responsive.css` for viewport-specific layout adjustments
- `assets/js/main.js` orchestrates the shared shell render plus the clock, rotating status text, and rain effect.
- Shared sidebar/footer data lives in `assets/js/config/shell.js`.
- Shared shell markup is rendered by `assets/js/ui/shell.js` into `data-shell` targets on each page.
- Feature modules live in `assets/js/features/`:
  - `clock.js` updates `#local-time`
  - `status-rotator.js` updates `#status-rotator`
  - `rain.js` drives `#rain-canvas` and persists the rain toggle with `localStorage`

## Shared page pattern

- `<body>` must keep a `data-page` value of `home`, `blog`, or `portfolio`.
- Each page uses the same shell structure:
  - `<canvas id="rain-canvas">`
  - `.page`
  - `.site-header`
  - `main.layout` with `.col.col-main` and `.col.col-side`
  - `.site-footer[data-shell="footer"]`
- The sidebar relies on these `data-shell` targets:
  - `nav`
  - `online`
  - `now`
  - `status`
  - `buttons`
  - `buttoncode`
  - `footer`

## Key conventions

- Keep page-specific copy and content boxes in the top-level HTML files.
- Keep shared nav links, rotating messages, button badges, button embed code, and footer text in `assets/js/config/shell.js`.
- Use the existing shell class names so the shared CSS keeps applying consistently: `.site-header`, `.layout`, `.col-main`, `.col-side`, `.box`, `.box-title`, `.compact-feed`, `.project-stack`, `.terminal-row`, `.button-badge`.
- When updating styling, prefer editing the smallest relevant CSS module rather than adding more rules to `styles.css`.
- The current theme depends on `Silkscreen` and `VT323` loaded from Google Fonts in each page head.
- All site links are relative (`index.html`, `blog.html`, `portfolio.html`, `assets/...`), so preserve that convention for any new pages or assets.
