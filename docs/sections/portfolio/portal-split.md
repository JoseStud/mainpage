# Portal Split

## Purpose

This section renders the lower two-column composite block on the portfolio page:

- left box: "By language" inventory
- right box: "Workbench notes"

Both lists are intentionally paired in one wrapper to keep taxonomy and philosophy adjacent.

## Source

- Source file: `src/site/pages/portfolio/portal-split.section.html`
- Manifest entry: `src/site/pages/portfolio/page.config.mjs` (`id: "portal-split"`)

## Structure Contract

Expected structure:

1. `<div class="portal-split">`
2. first child `<section class="box">` with language `note-list`
3. second child `<section class="box">` with workbench `note-list`

This section currently does not define anchor IDs. It is a structured informational pair.

## Data Synchronization Rules

### By language list

Keep language mapping in sync with project cards in `project-lineup.section.html`.

When project language inventory changes, update this list in the same change.

### Workbench notes

Keep note phrasing aligned with rules summarized in `shelf-intro.section.html`.

## Styling Dependencies

- Split grid behavior: `public/assets/css/layout.css` (`.portal-split`)
- List styling: `public/assets/css/components/sections.css` (`.note-list`)
- Mobile collapse to one column: `public/assets/css/responsive.css`

## Editing Guidance

Use this file when changing:

- language inventory entries
- workbench note content
- lower two-column composition

Preserve shared `portal-split` wrapper unless intentionally redesigning lower-page layout.

## Quick Validation

- `portal-split` wrapper remains present.
- Both child boxes remain in expected order.
- Language list matches active project lineup.
- Build has no drift: `node scripts/build-pages.mjs --check`.
