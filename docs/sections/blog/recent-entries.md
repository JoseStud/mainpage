# Recent Entries

## Purpose

This section shows the latest visible set of blog entries as compact cards.

Each card contains:

- title link
- date/status badge
- one-line summary

## Source

- Source file: `src/site/pages/blog/recent-entries.html`
- Manifest entry: `src/site/pages/blog/page.config.mjs` (`id: "recent-entries"`)

## Entry Card Contract

Expected structure per card:

1. `<article class="entry-item">`
2. `.entry-top`
3. title link `.entry-title` (currently points to `#reading-desk`)
4. status/date chip `.entry-state` + variant class
5. summary paragraph `.entry-summary`

Wrapper for full list: `.entry-list`.

## Status Variant Reference

Available `.entry-state` variants (defined in `public/assets/css/components/sections.css`):

- `is-live`
- `is-draft`
- `is-notes`
- `is-building`
- `is-open`
- `is-soon`

Currently used in this section:

- `is-live`
- `is-notes`

## Link Contract

Current card links point to `#reading-desk` in-page. If link behavior changes, update this doc and related references.

## Editing Guidance

Use this file when:

- adding/removing/reordering visible entries
- changing titles, dates, summaries
- changing status badge classes

Keep summary length compact for mobile readability.

## Quick Validation

- `.entry-list` and `.entry-item` wrappers are preserved.
- Each card keeps title, state, and summary.
- Status classes match intended meaning.
- Build has no drift: `node scripts/build-pages.mjs --check`.
