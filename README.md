# mainpage

`mainpage` is a static personal site built from three top-level HTML pages and a shared retro shell. It leans into a dense old-web presentation: animated logo blocks, CRT-style overlays, a canvas rain layer, and sidebar widgets rendered from shared config.

## Run locally

```bash
cd /home/anxiuser/mainpage
python3 -m http.server 8000
```

Open:

- `http://localhost:8000/index.html`
- `http://localhost:8000/blog.html`
- `http://localhost:8000/portfolio.html`

## Validate

```bash
cd /home/anxiuser/mainpage
for f in index.html blog.html portfolio.html; do
  xmllint --html --noout "$f"
done
```

After that, smoke-test the shared shell in a browser: active nav state, local clock, rotating "Last loop" text, and the rain toggle.

## CI/CD to Portainer (Git polling)

This repo now includes:

- `Dockerfile` to package the static site with `nginx`
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

- `index.html`, `blog.html`, `portfolio.html` now hold page-specific content only, plus a few shared shell mount points.
- `assets/css/styles.css` is the single stylesheet entrypoint and imports the focused CSS modules below.
- `assets/css/tokens.css` defines theme tokens for dark/light variants.
- `assets/css/base.css` handles resets, document-wide typography, and default element styling.
- `assets/css/effects.css` contains the CRT overlays, drifting background particles, rain canvas styling, and animation keyframes.
- `assets/css/layout.css` defines the page shell, columns, shared mounts, footer framing, and floating rain control.
- `assets/css/components.css` styles the header, feeds, project blocks, sidebar widgets, counters, buttons, tweaks panel, and other reusable UI pieces.
- `assets/css/responsive.css` adjusts the shell for tablet and mobile breakpoints.
- `assets/js/main.js` boots the shared shell and feature modules.
- `assets/js/config/shell.js` is the source of truth for shared header copy, nav links, sidebar content, controls, counter labels, and footer text.
- `assets/js/ui/shell.js` renders the shared header, sidebar, footer, and tweaks UI into the page mounts.
- `assets/js/features/clock.js` updates the live local-time readout.
- `assets/js/features/status-rotator.js` rotates the "Last loop" messages.
- `assets/js/features/rain.js` runs the canvas rain effect and keeps the floating button and sidebar toggle in sync using `localStorage` key `rain-disabled`.
- `assets/js/features/counter.js` advances the shared visitor counter.
- `assets/js/features/tweaks.js` owns the hidden theme controls/edit-mode bridge.
- `assets/js/features/year.js` syncs the footer year.
- `assets/images/avatar-200.webp`, `assets/images/avatar-400.webp`, `assets/images/rainy-window-bg-960.webp`, and `assets/images/rainy-window-bg-1600.webp` are the optimized image variants used in production.

## Editing notes

- Keep page-specific writing and content boxes in the top-level HTML files.
- Update shared shell copy and widget content in `assets/js/config/shell.js`.
- Update shared chrome markup in `assets/js/ui/shell.js` instead of duplicating HTML across pages.
- Add behavior in the smallest relevant feature module under `assets/js/features/`.
- Add styling in the smallest relevant CSS module instead of growing one large file.
- Preserve the `data-page` value on `<body>` so the shared shell can mark the active page correctly.
