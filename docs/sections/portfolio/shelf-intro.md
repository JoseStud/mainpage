# Shelf Intro

## Purpose

The shelf intro opens the portfolio page and establishes workbench framing:

- `/projects` heading
- active-item chip
- short philosophy paragraph
- compact workbench rules list

## Source

- Source file: `src/site/pages/portfolio/shelf-intro.section.html`
- Manifest entry: `src/site/pages/portfolio/page.config.mjs` (`id: "shelf-intro"`)

## Structure Contract

Current expected structure:

1. `<section class="box" id="project-shelf">`
2. `.box-heading` with `.box-title` and `.box-chip`
3. `.box-content` with intro paragraph
4. `.subsection-block` for "Workbench rules"
5. `.subsection-list` entries

## Anchor Governance

`#project-shelf` is a stable cross-page target used by:

- shared star links (`Projects`) in `public/assets/js/config/shared-shell.js`
- shared find-me links (`Workbench`) in `public/assets/js/config/shared-shell.js`
- shared button links (`WORK/SHELF`) in `public/assets/js/config/shared-shell.js`
- portfolio shell `now.href` in `public/assets/js/config/page-shells.js`
- home project preview links (`portfolio.html#project-shelf`)

Do not rename this anchor without coordinated updates.

## Editing Guidance

Edit this section when changing:

- heading/chip text
- intro paragraph
- workbench rules summary text

If chip count changes (for example from "6 active things"), verify project card count in `project-lineup.section.html` matches.

## Styling Dependencies

- Shared box/heading: `public/assets/css/layout.css`
- Subsection typography: `public/assets/css/components/sections.css`

## Quick Validation

- `#project-shelf` still exists.
- Intro and rules remain inside one `.box` section.
- Chip count aligns with actual project lineup.
- Build has no drift: `node scripts/build-pages.mjs --check`.
