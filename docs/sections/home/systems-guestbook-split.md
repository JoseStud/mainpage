# Systems + Guestbook Split

## Purpose

This block renders the home page dual-column status area:

- left side: systems/relay status board
- right side: guestbook preview entries

Both sides live in one source file so they can share the same `portal-split` layout contract.

## Source

- Source file: `src/site/pages/home/systems-guestbook-split.partial.html`
- Manifest entry: `src/site/pages/home/page.config.mjs` (`id: "systems-guestbook-split"`)

## Structure Contract

Current expected wrapper and children:

1. `<div class="portal-split portal-split-signals">`
2. `<section class="box terminal-box" id="site-signals">`
3. `<section class="box guestbook-box" id="guestbook">`

Left column details:

- `.terminal-header`
- `.terminal-grid`
- repeated `.terminal-row`
- status tokens: `.terminal-ok` and `.terminal-warn`

Right column details:

- `.entry-list`
- repeated `.entry-item`
- `.entry-top`
- `.entry-state` (currently `is-open`)

## Anchor Contracts

- `#site-signals` is linked from shared navigation.
- `#guestbook` is a stable internal target for guestbook references.

Do not rename these IDs without coordinated link updates.

## Data And Content Notes

- Current systems rows are static copy.
- Current guestbook entries are static preview samples.
- This section is presentation-only in current state; no live guestbook API wiring is done here.

## Styling Dependencies

- Grid and box composition: `public/assets/css/layout.css`
- Terminal and entry styling: `public/assets/css/components/sections.css`
- Responsive one-column collapse: `public/assets/css/responsive.css`

## Editing Guidance

Use this file when changing:

- status rows/labels
- guestbook sample entries
- left/right split content order

Keep both child sections inside the shared wrapper unless intentionally redesigning the layout system.

## Quick Validation

- Wrapper still includes `portal-split portal-split-signals`.
- `#site-signals` and `#guestbook` remain present.
- Terminal rows and guestbook entries preserve class structure.
- Build has no drift: `node scripts/build-pages.mjs --check`.
