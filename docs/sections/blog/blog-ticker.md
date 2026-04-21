# Blog Ticker

## Purpose

The blog ticker is a short marquee strip that frames the blog tone between intro and recent entries.

It should read like a principle line, not navigation or status data.

## Source

- Source file: `src/site/pages/blog/blog-ticker.html`
- Manifest entry: `src/site/pages/blog/page.config.mjs` (`id: "blog-ticker"`)

## Structure Contract

- `<section class="box marquee-box" aria-label="Blog ticker">`
- `<marquee scrollamount="4" onmouseover="this.stop();" onmouseout="this.start();">`

Hover pause/resume behavior is currently part of the expected interaction.

## Styling Dependencies

- Marquee styling: `public/assets/css/components/intro.css`
- Shared `.box` framing: `public/assets/css/layout.css`

## Editing Guidance

Edit this section when changing:

- ticker sentence/copy
- scroll speed
- accessibility label

Keep copy concise and split phrases using `·` for readability.

## Quick Validation

- `aria-label="Blog ticker"` remains present.
- Marquee pauses on hover and resumes on mouseout.
- Section keeps `box marquee-box` class pattern.
- Build has no drift: `node scripts/build-pages.mjs --check`.
