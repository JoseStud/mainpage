# mainpage

`mainpage` is a static personal site with three generated top-level HTML pages, page-specific content fragments, and a shared retro shell pre-rendered at build time. It leans into a dense old-web presentation: animated logo blocks, CRT-style overlays, a canvas rain layer, and sidebar widgets rendered from shared config.

## Documentation

- `docs/README.md`: quick project orientation for contributors
- `docs/performance.md`: local profiling workflow, current trace baseline, and regression guardrails
- `docs/superpowers/specs/2026-04-14-dimden-style-redesign.md`: redesign spec and architecture notes
- `docs/superpowers/plans/2026-04-14-dimden-style-redesign.md`: implementation plan history

## Run locally

```bash
cd /home/anxiuser/mainpage
node scripts/build-pages.mjs
node server.js
```

Open:

- `http://localhost:8000/index.html`
- `http://localhost:8000/blog.html`
- `http://localhost:8000/portfolio.html`

Now-playing is read from multi-scrobbler on the same node via:

- `MULTI_SCROBBLER_BASE_URL` (default `http://127.0.0.1:9078`)
- `MULTI_SCROBBLER_SOURCE_NAME` (optional, pin to a specific source)
- `MULTI_SCROBBLER_SOURCE_TYPE` (optional, pair with source name)

## Regenerate pages

The source of truth for the shared HTML wrapper now lives in `site-src/template.html`, and the page bodies live in `site-src/pages/*.content.html`.

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
for f in index.html blog.html portfolio.html; do
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

This repo now includes:

- `Dockerfile` to package the site with a Node server that also proxies now-playing from multi-scrobbler
- `.github/workflows/deploy-portainer.yml` to build/push image updates to GHCR on every push to `main`
- `deploy/portainer-stack.yml` for Portainer stack deployment

### One-time setup

1. Push this repository to GitHub and ensure the default branch is `main`.
2. In GitHub repo settings, allow `GITHUB_TOKEN` to read/write repository contents.
3. Trigger `Build and Deploy (Portainer GitOps)` once (or push to `main`) so the workflow replaces the placeholder image in `deploy/portainer-stack.yml`.
4. In Portainer, create a new **Stack** from this repo and select `deploy/portainer-stack.yml`.
5. Enable **Repository polling** in Portainer for that stack.

### Runtime behavior

- Each push to `main` builds and publishes:
  - `ghcr.io/<owner>/<repo>:<commit-sha>`
  - `ghcr.io/<owner>/<repo>:main`
- The workflow then updates `deploy/portainer-stack.yml` to the exact `<commit-sha>` image and commits it.
- Portainer polling detects that repo change and redeploys with the new immutable image tag.

## Architecture

- `site-src/template.html` defines the shared document boilerplate for every entry page.
- `site-src/pages/index.content.html`, `site-src/pages/blog.content.html`, and `site-src/pages/portfolio.content.html` hold the page-specific HTML fragments.
- `scripts/build-pages.mjs` renders the generated `index.html`, `blog.html`, and `portfolio.html` files, pre-renders the shared shell, and supports `--check` for drift detection.
- `assets/css/styles.css` is the single stylesheet entrypoint and imports the focused CSS modules below.
- `assets/css/tokens.css` defines theme tokens for dark/light variants.
- `assets/css/base.css` handles resets, document-wide typography, and default element styling.
- `assets/css/effects.css` contains the CRT overlays, drifting background particles, rain canvas styling, and animation keyframes.
- `assets/css/layout.css` defines the page shell, columns, shared mounts, footer framing, and floating rain control.
- `assets/css/components.css` is an import-only entrypoint for the split component modules under `assets/css/components/`.
- `assets/css/responsive.css` adjusts the shell for tablet and mobile breakpoints.
- `server.js` serves static pages and exposes `/api/music/now-playing` backed by multi-scrobbler.
- `assets/js/main.js` hydrates the shared shell and starts the live feature modules.
- `assets/js/config/site.js` defines shared tweak defaults used during boot.
- `assets/js/config/shared-shell.js` holds shell data reused across all pages.
- `assets/js/config/page-shells.js` holds per-page shell copy and page-specific sidebar/footer variants.
- `assets/js/config/shell.js` provides the shell lookup entrypoint used by the app boot.
- `assets/js/ui/page-frame.js` provides the runtime fallback that wraps legacy `[data-page-content]` markup if a generated page shell is missing.
- `assets/js/ui/dom.js` and `assets/js/ui/html.js` hold safe DOM/link helpers for shell rendering.
- `assets/js/ui/shell-sections.js` renders individual header/sidebar/footer/tweaks sections with DOM APIs.
- `assets/js/ui/shell-static.js` pre-renders the shared shell for generated HTML output.
- `assets/js/ui/shell.js` coordinates shell rendering.
- `assets/js/features/clock.js` updates the live local-time readout.
- `assets/js/features/status-rotator.js` rotates the "Last loop" messages.
- `assets/js/features/music-now.js` polls `/api/music/now-playing` and updates the sidebar "Now playing" track.
- `assets/js/features/rain.js` runs the canvas rain effect and keeps the floating button and sidebar toggle in sync using `localStorage` key `rain-disabled`.
- `assets/js/features/counter.js` advances the shared visitor counter.
- `assets/js/features/tweaks.js` owns the hidden theme controls/edit-mode bridge.
- `assets/js/features/year.js` syncs the footer year.
- `assets/images/avatar-200.webp`, `assets/images/avatar-400.webp`, `assets/images/rainy-window-bg-960.webp`, and `assets/images/rainy-window-bg-1600.webp` are the optimized image variants used in production.

## Editing notes

- Edit page-specific writing and content boxes in `site-src/pages/*.content.html`, not in the generated top-level HTML files.
- Run `node scripts/build-pages.mjs` after changing `site-src/template.html` or any file under `site-src/pages/`.
- Update shared shell copy and widget content in `assets/js/config/shared-shell.js` or `assets/js/config/page-shells.js`.
- Update shared frame markup in `site-src/template.html`, and keep `assets/js/ui/page-frame.js` aligned as the runtime fallback.
- Update shared chrome rendering in `assets/js/ui/shell-sections.js`, and keep `assets/js/ui/shell-static.js` aligned for build-time output.
- Add behavior in the smallest relevant feature module under `assets/js/features/`.
- Add styling in the smallest relevant CSS module instead of growing one large file.
- Preserve the `data-page` value on `<body>` so the shared shell can mark the active page correctly.
- For animation or theme work, capture a fresh Performance trace and compare it with `node scripts/inspect-trace.mjs` before merging.
