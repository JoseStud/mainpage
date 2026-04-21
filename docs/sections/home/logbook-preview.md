# Logbook Preview

## Purpose

This section gives a compact "latest writing" preview on the home page and sends visitors to the full blog archive.

## Source

- Source file: `src/site/pages/home/logbook-preview.partial.html`
- Manifest entry: `src/site/pages/home/page.config.mjs` (`id: "logbook-preview"`)

## Structure Contract

Current expected structure:

1. `.box-heading` with title and `.rss-link`
2. `.compact-feed` wrapper
3. repeated `.compact-line` rows
4. each row includes:
	- `.compact-bullet`
	- link to archive anchor
	- `.compact-date`

This is intentionally a lightweight list, not full entry cards.

## Link Contract

Primary outbound target: `blog.html#reading-desk`

If this target changes, update both:

- this source file
- related docs and shared links that reference `#reading-desk`

## Styling Dependencies

- Feed/list styling: `public/assets/css/components/feeds.css`
- Shared heading/link styling: `public/assets/css/components/shared.css`
- Shared box framing: `public/assets/css/layout.css`

## Editing Guidance

Use this section for:

- updating visible post titles
- updating dates
- changing display order
- adjusting archive link label text

Keep entry lines short so the compact feed remains readable on narrow viewports.

## Quick Validation

- All preview links still point to `blog.html#reading-desk`.
- `.compact-feed` and `.compact-line` classes remain in place.
- Dates and title order are intentional.
- Build has no drift: `node scripts/build-pages.mjs --check`.
