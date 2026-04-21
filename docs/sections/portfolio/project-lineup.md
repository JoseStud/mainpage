# Project Lineup

## Purpose

This section is the main project shelf: a list of cards describing current projects, statuses, tags, summaries, and links.

## Source

- Source file: `src/site/pages/portfolio/project-lineup.section.html`
- Manifest entry: `src/site/pages/portfolio/page.config.mjs` (`id: "project-lineup"`)

## Card Schema Contract

Expected card wrapper:

- `<article class="project-block">`

Expected card internals:

1. `.project-top`
2. `.project-line` with project name
3. `.project-status` with variant class
4. `.tag-row` (2-3 tags)
5. `.project-summary`
6. optional `.project-links`

Parent wrapper for all cards: `.project-stack`.

## Status Variant Reference

Status visual variants are shared with entry-state styles in `public/assets/css/components/sections.css`.

Currently used in this section:

- `is-live`
- `is-building`
- `is-draft`
- `is-notes`

Available but not currently used here:

- `is-open`
- `is-soon`

## Editing Guidance

Update this section when:

- adding/removing/reordering projects
- changing project names/status/tag values
- changing summaries
- adding/removing links per card

For cards without a destination URL, use non-link project names (`<span class="project-name">`).

When changing project inventory, reconcile related fields:

- shelf intro chip count in `shelf-intro.section.html`
- language list in `portal-split.section.html`

## Styling Dependencies

- Project card and status styles: `public/assets/css/components/sections.css`
- Shared box/heading framing: `public/assets/css/layout.css`

## Quick Validation

- `.project-stack` and `.project-block` wrappers remain intact.
- Each card keeps status + tags + summary.
- Status classes match intended meaning.
- Counts/language lists are reconciled in related sections.
- Build has no drift: `node scripts/build-pages.mjs --check`.
