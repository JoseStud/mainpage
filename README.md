# mainpage

`mainpage` is a static personal site with three generated entry pages in `public/`, page-specific content fragments under `src/site/`, and a shared retro shell pre-rendered at build time. It leans into a dense old-web presentation: animated logo blocks, CRT-style overlays, a canvas rain layer, and sidebar widgets rendered from shared config.

## Documentation

- `docs/README.md`: quick project orientation for contributors
- `docs/performance.md`: local profiling workflow, current trace baseline, and regression guardrails
- `docs/superpowers/specs/2026-04-14-dimden-style-redesign.md`: redesign spec and architecture notes
- `docs/superpowers/plans/2026-04-14-dimden-style-redesign.md`: implementation plan history

## Run locally

```bash
cd /home/anxiuser/mainpage
node scripts/build-pages.mjs
node src/server/index.js
```

Open:

- `http://localhost:8000/`
- `http://localhost:8000/blog.html`
- `http://localhost:8000/portfolio.html`

Now-playing is read from multi-scrobbler on the same node via:

- `MULTI_SCROBBLER_BASE_URL` (default `http://127.0.0.1:9078`)
- `MULTI_SCROBBLER_SOURCE_NAME` (optional, pin to a specific source)
- `MULTI_SCROBBLER_SOURCE_TYPE` (optional, pair with source name)

## Regenerate pages

The source of truth for the shared HTML wrapper lives in `src/site/template.html`, and each page body is assembled from section partials declared in `src/site/pages/<page>/page.config.mjs`.

Rebuild the generated entry pages with:

```bash
cd /home/anxiuser/mainpage
node scripts/build-pages.mjs
```

Check for drift without rewriting files:

```bash
cd /home/anxiuser/mainpage
node scripts/build-pages.mjs --check
```

## Validate

```bash
cd /home/anxiuser/mainpage
node scripts/build-pages.mjs --check
for f in public/index.html public/blog.html public/portfolio.html; do
  xmllint --html --noout "$f"
done
```

After that, smoke-test the shared shell in a browser: active nav state, local clock, rotating "Last loop" text, and the rain toggle.

For any UI or animation-heavy change, also run the local trace workflow in `docs/performance.md` and compare the latest trace with:

```bash
cd /home/anxiuser/mainpage
node scripts/inspect-trace.mjs
```

## CI/CD to Portainer (Git polling)

This repo includes:

- `Dockerfile` to package the site with the local Node server that also proxies now-playing from multi-scrobbler
- `.github/workflows/deploy-portainer.yml` to build and push GHCR images on every push to `main`
- `deploy/portainer-stack.yml` for Portainer stack deployment

### One-time setup

1. Push this repository to GitHub and ensure the default branch is `main`.
2. In GitHub repo settings, allow `GITHUB_TOKEN` to read and write repository contents.
3. Trigger `Build and Deploy (Portainer GitOps)` once, or push to `main`, so the workflow replaces the placeholder image in `deploy/portainer-stack.yml`.
4. In Portainer, create a new stack from this repo and select `deploy/portainer-stack.yml`.
5. Enable repository polling in Portainer for that stack.

### Runtime behavior

- Each push to `main` builds and publishes:
  - `ghcr.io/<owner>/<repo>:<commit-sha>`
  - `ghcr.io/<owner>/<repo>:main`
- The workflow then updates `deploy/portainer-stack.yml` to the exact `<commit-sha>` image and commits it.
- Portainer polling detects that repo change and redeploys with the new immutable image tag.

## Architecture

- `src/site/template.html` defines the shared document boilerplate for every generated page.
- `src/site/pages/home/`, `src/site/pages/blog/`, and `src/site/pages/portfolio/` hold page manifests plus the ordered section partials for each page.
- `public/index.html`, `public/blog.html`, and `public/portfolio.html` are generated artifacts and should not be edited by hand.
- `docs/sections/` documents every section partial and provides page-level section indexes for contributors.
- `scripts/build-pages.mjs` renders the generated pages, pre-renders the shared shell, embeds source/doc breadcrumbs for each section, and supports `--check` for drift detection.
- `src/server/index.js` serves `public/` and exposes `/api/music/now-playing` backed by multi-scrobbler.
- `public/assets/css/styles.css` is the stylesheet entrypoint and imports the focused CSS modules below.
- `public/assets/css/tokens.css` defines theme tokens for dark and light variants.
- `public/assets/css/base.css` handles resets, typography, and default element styling.
- `public/assets/css/effects.css` contains the CRT overlays, drifting background particles, rain canvas styling, and animation keyframes.
- `public/assets/css/layout.css` defines the page shell, columns, shared mounts, footer framing, and floating rain control.
- `public/assets/css/components.css` is an import-only entrypoint for the split component modules under `public/assets/css/components/`.
- `public/assets/css/responsive.css` adjusts the shell for tablet and mobile breakpoints.
- `public/assets/js/main.js` hydrates the shared shell and starts the live feature modules.
- `public/assets/js/config/site.js` defines shared tweak defaults used during boot.
- `public/assets/js/config/shared-shell.js` holds shell data reused across all pages.
- `public/assets/js/config/page-shells.js` holds per-page shell copy and page-specific sidebar and footer variants.
- `public/assets/js/config/shell.js` provides the shell lookup entrypoint used by the app boot.
- `public/assets/js/ui/page-frame.js` provides the runtime fallback that wraps legacy `[data-page-content]` markup if a generated page shell is missing.
- `public/assets/js/ui/dom.js` and `public/assets/js/ui/html.js` hold safe DOM and link helpers for shell rendering.
- `public/assets/js/ui/shell-sections.js` renders individual header, sidebar, footer, and tweaks sections with DOM APIs.
- `public/assets/js/ui/shell-static.js` pre-renders the shared shell for generated HTML output.
- `public/assets/js/ui/shell.js` coordinates shell rendering.
- `public/assets/js/features/clock.js` updates the live local-time readout.
- `public/assets/js/features/status-rotator.js` rotates the "Last loop" messages.
- `public/assets/js/features/music-now.js` polls `/api/music/now-playing` and updates the sidebar "Now playing" track.
- `public/assets/js/features/rain.js` runs the canvas rain effect and keeps the floating button and sidebar toggle in sync using `localStorage` key `rain-disabled`.
- `public/assets/js/features/counter.js` advances the shared visitor counter.
- `public/assets/js/features/tweaks.js` owns the hidden theme controls and edit-mode bridge.
- `public/assets/js/features/year.js` syncs the footer year.
- `design/Anx/` holds design explorations and reference artifacts that are not part of the production runtime.

## Editing notes

- Edit page content in the smallest relevant section partial under `src/site/pages/<page>/`, not in the generated files under `public/`.
- Keep section docs in `docs/sections/<page>/` aligned with the matching partials. The build fails if a section doc is missing.
- Update `src/site/pages/<page>/page.config.mjs` when adding, removing, or reordering sections.
- Run `node scripts/build-pages.mjs` after changing `src/site/template.html` or anything under `src/site/pages/`.
- Update shared shell copy and widget content in `public/assets/js/config/shared-shell.js` or `public/assets/js/config/page-shells.js`.
- Update shared frame markup in `src/site/template.html`, and keep `public/assets/js/ui/page-frame.js` aligned as the runtime fallback.
- Update shared chrome rendering in `public/assets/js/ui/shell-sections.js`, and keep `public/assets/js/ui/shell-static.js` aligned for build-time output.
- Add behavior in the smallest relevant feature module under `public/assets/js/features/`.
- Add styling in the smallest relevant CSS module instead of growing one large file.
- Preserve the `data-page` value on `<body>` so the shared shell can mark the active page correctly.
- For animation or theme work, capture a fresh Performance trace and compare it with `node scripts/inspect-trace.mjs` before merging.
