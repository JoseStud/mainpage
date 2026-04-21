# Draft Board + Life Tracker

## Purpose

This section groups two related content zones in one shared layout wrapper:

- `#draft-board`: in-progress writing ideas
- `#life-tracker`: current reading, habits, and desk context

They are intentionally paired to keep exploratory writing and personal context adjacent.

## Source

- Source file: `src/site/pages/blog/draft-board-life-tracker.html`
- Manifest entry: `src/site/pages/blog/page.config.mjs` (`id: "draft-board-life-tracker"`)

## Structure Contract

Current expected structure:

1. `<div class="portal-split">`
2. `<section class="box" id="draft-board">` with `.note-list`
3. `<section class="box" id="life-tracker">`
4. life tracker uses repeated `.subsection-block` and `.subsection-list`

## Anchor Contracts

- `#draft-board` is used by blog shell "last loop" href in `public/assets/js/config/page-shells.js`.
- `#life-tracker` is linked by shared button config (`BODY/OK`) in `public/assets/js/config/shared-shell.js`.

Do not rename these IDs without coordinated updates.

## Styling Dependencies

- Two-column layout: `public/assets/css/layout.css` (`.portal-split`)
- Note/subsection styling: `public/assets/css/components/sections.css`
- Mobile collapse to one column: `public/assets/css/responsive.css`

## Editing Guidance

Update this file when changing:

- draft list items
- reading/habits/desk entries
- chips and subsection labels

Keep both child sections inside one `portal-split` wrapper unless redesigning the lower blog layout.

## Quick Validation

- `#draft-board` and `#life-tracker` still exist.
- `.portal-split` wrapper remains intact.
- Lists and subsection blocks preserve class structure.
- Build has no drift: `node scripts/build-pages.mjs --check`.
