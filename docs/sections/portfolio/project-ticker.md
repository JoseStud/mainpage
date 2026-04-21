# Project Ticker

## Purpose

The project ticker is a narrow marquee strip between intro and lineup. It reinforces workbench values in one short line.

## Source

- Source file: `src/site/pages/portfolio/project-ticker.section.html`
- Manifest entry: `src/site/pages/portfolio/page.config.mjs` (`id: "project-ticker"`)

## Structure Contract

Expected structure:

- `<section class="box marquee-box" aria-label="Project ticker">`
- `<marquee scrollamount="4" onmouseover="this.stop();" onmouseout="this.start();">`

Hover pause/resume behavior is intentionally aligned with other page tickers.

## Styling Dependencies

- Marquee styling: `public/assets/css/components/intro.css`
- Shared `.box` framing: `public/assets/css/layout.css`

## Editing Guidance

Use this section for:

- ticker copy updates
- minor marquee behavior tuning
- accessibility label updates

Keep ticker content short and phrase-separated with `·`.

## Quick Validation

- `aria-label="Project ticker"` remains present.
- Marquee still pauses/resumes on hover.
- Section preserves `.box marquee-box` classes.
- Build has no drift: `node scripts/build-pages.mjs --check`.
