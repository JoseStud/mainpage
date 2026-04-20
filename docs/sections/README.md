# Section Docs

This directory tracks the source-of-truth sections that make up each generated page.

Each page owns:

- a `site-src/pages/<page>/page.config.mjs` manifest
- section partials under `site-src/pages/<page>/`
- section docs under `docs/sections/<page>/`

The build now refuses to render a section unless its matching doc file exists, so content structure and contributor guidance stay in sync.

Page indexes:

- `docs/sections/home/README.md`
- `docs/sections/blog/README.md`
- `docs/sections/portfolio/README.md`
