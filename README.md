# mainpage

`mainpage` is a static personal site with three generated entry pages in `public/`, page-specific content fragments under `src/site/`, and a shared retro shell pre-rendered at build time. It leans into a dense old-web presentation: animated logo blocks, CRT-style overlays, a canvas rain layer, and sidebar widgets rendered from shared config.

## Documentation

- `docs/README.md`: quick project orientation for contributors
- `docs/architecture.md`: build/runtime architecture and editing rules
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
node scripts/test-shell-renderer.mjs
node scripts/test-server-http.mjs
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
