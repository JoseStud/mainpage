# Architecture

`mainpage` is generated from source fragments under `src/site/` into static entry pages under `public/`. The Node server serves those generated files and exposes a small now-playing API backed by multi-scrobbler.

## Build Pipeline

- `src/site/template.html` defines the shared document boilerplate for every generated page.
- `src/site/pages/home/`, `src/site/pages/blog/`, and `src/site/pages/portfolio/` hold page manifests plus the ordered section partials for each page.
- `public/index.html`, `public/blog.html`, and `public/portfolio.html` are generated artifacts and should not be edited by hand.
- `docs/sections/` documents every section partial and provides page-level section indexes for contributors.
- `scripts/build-pages.mjs` renders the generated pages, pre-renders the shared shell, embeds source/doc breadcrumbs for each section, and supports `--check` for drift detection.
- `scripts/render-shell-markup.mjs` serializes `public/assets/js/ui/shell-sections.js` for generated HTML output.
- `scripts/test-shell-renderer.mjs` checks the build-time shell serialization path.

## Runtime

- `src/server/index.js` serves `public/` and exposes `/api/music/now-playing` backed by multi-scrobbler.
- `public/assets/js/main.js` hydrates the shared shell and starts the live feature modules.
- `public/assets/js/config/site.js` defines shared tweak defaults used during boot.
- `public/assets/js/config/shared-shell.js` holds shell data reused across all pages.
- `public/assets/js/config/page-shells.js` holds per-page shell copy and page-specific sidebar and footer variants.
- `public/assets/js/config/shell.js` provides the shell lookup entrypoint used by the app boot.
- `public/assets/js/ui/dom.js` and `public/assets/js/ui/html.js` hold safe DOM and link helpers for shell rendering.
- `public/assets/js/ui/shell-sections.js` renders individual header, sidebar, footer, and tweaks sections with DOM APIs.
- `public/assets/js/ui/shell.js` coordinates shell rendering.

## Client Features

- `public/assets/js/features/clock.js` updates the live local-time readout.
- `public/assets/js/features/status-rotator.js` rotates the "Last loop" messages.
- `public/assets/js/features/music-now.js` polls `/api/music/now-playing` and updates the sidebar "Now playing" track.
- `public/assets/js/features/rain.js` runs the canvas rain effect and keeps the floating button and sidebar toggle in sync using `localStorage` key `rain-disabled`.
- `public/assets/js/features/counter.js` advances the shared visitor counter.
- `public/assets/js/features/tweaks.js` owns the hidden theme controls and edit-mode bridge.
- `public/assets/js/features/year.js` syncs the footer year.

## Styling

- `public/assets/css/styles.css` is the stylesheet entrypoint and imports the focused CSS modules below.
- `public/assets/css/tokens.css` defines theme tokens for dark and light variants.
- `public/assets/css/base.css` handles resets, typography, and default element styling.
- `public/assets/css/effects.css` is an import-only entrypoint for the split effect modules under `public/assets/css/effects/`.
- `public/assets/css/layout.css` defines the page shell, columns, shared mounts, footer framing, and floating rain control.
- `public/assets/css/components.css` is an import-only entrypoint for the split component modules under `public/assets/css/components/`.
- `public/assets/css/responsive.css` adjusts the shell for tablet and mobile breakpoints.

## Supporting Files

- `Dockerfile` packages the generated site with the local Node server.
- `deploy/portainer-stack.yml` defines the Portainer stack deployment.
- `design/Anx/` holds design explorations and reference artifacts that are not part of the production runtime.

## Editing Notes

- Edit page content in the smallest relevant section partial under `src/site/pages/<page>/`, not in the generated files under `public/`.
- Keep section docs in `docs/sections/<page>/` aligned with the matching partials. The build fails if a section doc is missing.
- Update `src/site/pages/<page>/page.config.mjs` when adding, removing, or reordering sections.
- Run `node scripts/build-pages.mjs` after changing `src/site/template.html` or anything under `src/site/pages/`.
- Update shared shell copy and widget content in `public/assets/js/config/shared-shell.js` or `public/assets/js/config/page-shells.js`.
- Update shared frame markup in `src/site/template.html`.
- Update shared chrome rendering in `public/assets/js/ui/shell-sections.js`; the build serializes that same DOM renderer through `scripts/render-shell-markup.mjs`.
- Add behavior in the smallest relevant feature module under `public/assets/js/features/`.
- Add styling in the smallest relevant CSS module instead of growing one large file.
- Preserve the `data-page` value on `<body>` so the shared shell can mark the active page correctly.
- For animation or theme work, capture a fresh Performance trace and compare it with `node scripts/inspect-trace.mjs` before merging.
