# Reading Desk Intro

## Purpose

This section opens the blog page and establishes archive context.

It includes:

- `/blog.log` heading
- total entry count chip
- short archive description
- yearly archive map

## Source

- Source file: `src/site/pages/blog/reading-desk-intro.html`
- Manifest entry: `src/site/pages/blog/page.config.mjs` (`id: "reading-desk-intro"`)

## Structure Contract

Current expected structure:

1. `<section class="box" id="reading-desk">`
2. `.box-heading` with `.box-title` and `.box-chip`
3. `.box-content` paragraph
4. `.subsection-block` with `.subsection-title` and `.subsection-list`

The archive map is represented as text spans (year + count).

## Anchor Contract

`#reading-desk` is a stable cross-page target used by:

- home logbook preview links (`blog.html#reading-desk`)
- shared star links and buttons in `public/assets/js/config/shared-shell.js`

Do not rename this ID without coordinated link updates.

## Editing Guidance

Use this file when updating:

- intro paragraph text
- total entry count chip
- yearly archive counts

Keep total count and archive-map rows consistent in the same change.

## Styling Dependencies

- Shared box and layout: `public/assets/css/layout.css`
- Subsection typography and spacing: `public/assets/css/components/sections.css`

## Quick Validation

- `#reading-desk` remains present.
- Chip count matches visible archive-map counts.
- Subsection block retains existing class structure.
- Build has no drift: `node scripts/build-pages.mjs --check`.
