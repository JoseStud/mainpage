# Project Shelf Preview

## Purpose

This section highlights a subset of projects on the home page and routes visitors to the full portfolio shelf.

## Source

- Source file: `src/site/pages/home/project-shelf-preview.partial.html`
- Manifest entry: `src/site/pages/home/page.config.mjs` (`id: "project-shelf-preview"`)

## Structure Contract

Current structure is a repeated card-like list:

1. `.box-heading` with title and `.rss-link`
2. `.project-stack` wrapper
3. repeated `<article class="project-block">`
4. card internals:
	- `.project-line`
	- project name link `.project-name`
	- tag chips `.tag`
	- summary paragraph `.project-summary`

## Link Contract

All project name links and the top archive link currently target:

- `portfolio.html#project-shelf`

Do not change this target without coordinated updates in portfolio docs and shared links.

## Styling Dependencies

- Project list/card classes: `public/assets/css/components/feeds.css` and `public/assets/css/components/sections.css`
- Shared heading/link styles: `public/assets/css/components/shared.css`
- Shared box framing: `public/assets/css/layout.css`

## Editing Guidance

Update this section when:

- featured project set changes
- tag values change
- summary copy changes
- preview ordering changes

Keep the preview concise. Detailed metadata belongs in `src/site/pages/portfolio/project-lineup.section.html`.

## Quick Validation

- `.project-stack` and `.project-block` wrappers remain intact.
- Link target still resolves to `portfolio.html#project-shelf`.
- Tag rows are readable and consistent.
- Build has no drift: `node scripts/build-pages.mjs --check`.
