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

- `index.html`, `blog.html`, `portfolio.html` hold page-specific content and page metadata.
- The HTML pages load the focused CSS modules directly so the browser can fetch them in parallel.
- `assets/css/tokens.css` defines the color palette, glow, and panel variables.
- `assets/css/base.css` handles resets, document-wide typography, and default element styling.
- `assets/css/effects.css` contains the CRT overlays, drifting background particles, rain canvas styling, and animation keyframes.
- `assets/css/layout.css` defines the page shell, boxes, columns, and footer framing.
- `assets/css/components.css` styles the header, logo, feeds, project blocks, widgets, buttons, terminal rows, and other reusable UI pieces.
- `assets/css/responsive.css` adjusts the shell for tablet and mobile breakpoints.
- `assets/js/main.js` boots the shared shell and feature modules.
- `assets/js/config/shell.js` is the source of truth for shared nav links, sidebar copy, badge buttons, rotating messages, and footer text.
- `assets/js/ui/shell.js` renders the shared sidebar/footer into `data-shell` placeholders.
- `assets/js/features/clock.js` updates the live local-time readout.
- `assets/js/features/status-rotator.js` rotates the "Last loop" messages.
- `assets/js/features/rain.js` runs the canvas rain effect and persists its toggle in `localStorage` under `rain-disabled`.
- `assets/images/avatar-200.webp`, `assets/images/avatar-400.webp`, `assets/images/rainy-window-bg-960.webp`, and `assets/images/rainy-window-bg-1600.webp` are the optimized image variants used in production.

## Editing notes

- Keep page-specific writing and content boxes in the top-level HTML files.
- Update shared sidebar/footer data in `assets/js/config/shell.js`.
- Add styling in the smallest relevant CSS module instead of growing one large file.
- Preserve the `data-page` value on `<body>` so the shared shell can mark the active page correctly.
- The visual theme still pulls `Silkscreen` from Google Fonts in the page `<head>`, so typography changes should account for that dependency.
