# Copilot instructions for this repository

## Build, test, and lint commands

This repo is a static site with a small Node build script and a small Node server. There is no package manager or test framework.

| Task | Command |
| --- | --- |
| Build generated pages | `cd /home/anxiuser/mainpage && node scripts/build-pages.mjs` |
| Run locally | `cd /home/anxiuser/mainpage && node scripts/build-pages.mjs && node src/server/index.js` |
| Check generated page drift | `cd /home/anxiuser/mainpage && node scripts/build-pages.mjs --check` |
| Validate all pages | `cd /home/anxiuser/mainpage && for f in public/index.html public/blog.html public/portfolio.html; do xmllint --html --noout "$f"; done` |
| Validate one page | `cd /home/anxiuser/mainpage && xmllint --html --noout public/index.html` |

## High-level architecture

- The site has three generated entry pages in `public/`: `index.html`, `blog.html`, and `portfolio.html`.
- Authoring source for those pages lives in `src/site/`.
- Shared browser assets live in `public/assets/`.
- `scripts/build-pages.mjs` assembles `src/site/template.html` with the section partials declared in `src/site/pages/<page>/page.config.mjs`.
- `src/server/index.js` serves `public/` and exposes `/api/music/now-playing`.
- `public/assets/css/styles.css` imports focused CSS modules for tokens, base styles, effects, layout, components, and responsive behavior.
- `public/assets/js/main.js` orchestrates the shared shell render plus the clock, rotating status text, rain effect, theme behavior, and music polling.
- Shared shell data lives in `public/assets/js/config/`.
- Shared shell markup is rendered by `public/assets/js/ui/`.
- Feature modules live in `public/assets/js/features/`.

## Shared page pattern

- `<body>` must keep a `data-page` value of `home`, `blog`, or `portfolio`.
- Each page uses the same shell structure:
  - `<canvas id="rain-canvas">`
  - `.page`
  - `.site-header`
  - `main.layout` with `.col.col-main` and `.col.col-side`
  - `.site-footer[data-shell="footer"]`
- The sidebar and footer rely on the existing `data-shell` targets, so preserve those mounts when editing shared shell markup.

## Key conventions

- Edit page-specific copy in `src/site/pages/<page>/`, not in the generated files under `public/`.
- Keep shared nav links, rotating messages, button badges, button embed code, and footer text in `public/assets/js/config/`.
- Use the existing shell class names so the shared CSS keeps applying consistently: `.site-header`, `.layout`, `.col-main`, `.col-side`, `.box`, `.box-title`, `.compact-feed`, `.project-stack`, `.terminal-row`, `.button-badge`.
- When updating styling, prefer editing the smallest relevant CSS module rather than adding more rules to `public/assets/css/styles.css`.
- All site links are relative (`index.html`, `blog.html`, `portfolio.html`, `assets/...`), so preserve that convention for any new pages or assets.
