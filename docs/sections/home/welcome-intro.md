# Welcome Intro

## Purpose

The welcome intro is the home page hero block. It introduces identity, tone, and quick context in one compact section.

- anchor target for "About" style links (`#welcome`)
- avatar and mood chip visual identity
- two short intro paragraphs
- quick facts list with contact entry

## Source

- Source file: `src/site/pages/home/welcome-intro.partial.html`
- Page manifest entry: `src/site/pages/home/page.config.mjs` (`id: "welcome"`)

## Structure Contract

Current expected markup structure:

1. `<section class="box" id="welcome">`
2. `.box-heading` with `.box-title` and `.box-chip`
3. `.intro-grid`
4. left column `.avatar-stack`
5. right column `.intro-copy`
6. `.facts-block` with `.facts-list`

The `intro-grid` composition is shared styling behavior, not one-off markup.

## Anchor And Link Contracts

- `id="welcome"` is a stable anchor referenced by shared navigation.
- `.mood-chip` links to `#current-obsessions` in the photo-room section.

If either ID changes, update related links in:

- `public/assets/js/config/shared-shell.js`
- `src/site/pages/home/photo-room.partial.html`

## Style And Responsive Dependencies

- Intro layout styles: `public/assets/css/components/intro.css`
- Shared box and heading styles: `public/assets/css/layout.css`
- Responsive stacking for `.intro-grid`: `public/assets/css/responsive.css`

At small widths, `.intro-grid` collapses to a single column and avatar stack centers.

## Editing Guidance

Update this section when changing:

- heading/chip text
- intro body copy
- avatar image source or alt text
- quick facts list
- mood-chip text

Avoid changing class names unless CSS is updated in the same change.

## Quick Validation

- `#welcome` exists after edits.
- Mood chip still links to `#current-obsessions`.
- Intro still renders as two columns on desktop and one column on mobile.
- Build has no drift: `node scripts/build-pages.mjs --check`.
