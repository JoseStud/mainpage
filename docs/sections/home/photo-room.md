# Photo Room

## Purpose

The photo room closes the home page with environmental context: image + atmosphere copy + short detail list.

It also defines the hidden anchor used by the welcome-section mood chip.

## Source

- Source file: `src/site/pages/home/photo-room.partial.html`
- Manifest entry: `src/site/pages/home/page.config.mjs` (`id: "album"`)

## Structure Contract

Current structure:

1. `<section class="box" id="album">`
2. hidden span anchor: `<span id="current-obsessions" aria-hidden="true"></span>`
3. `.box-heading` with title/chip
4. `.tile-layout` wrapper
5. image `.room-image`
6. copy container `.room-copy`
7. list `.room-list`

## Anchor Contracts

- `#album` is the section anchor.
- `#current-obsessions` is the mood-chip target used in welcome intro and shared shell links.

Both IDs should remain stable unless all inbound links are updated.

## Asset Notes

Current image source:

- `assets/images/rainy-window-bg-960.webp`

When swapping image assets:

- keep alt text meaningful
- keep file size reasonable for a hero-adjacent panel
- verify responsive behavior (`.room-image` becomes full-width on mobile)

## Styling Dependencies

- Tile/image/list styling: `public/assets/css/components/sections.css`
- Shared box framing: `public/assets/css/layout.css`
- Mobile behavior: `public/assets/css/responsive.css`

## Editing Guidance

Use this section for updates to:

- photo-room narrative copy
- featured image and alt text
- list detail bullets
- box chip label

Avoid removing the hidden anchor or converting this section into a different wrapper without coordinated link updates.

## Quick Validation

- Both `#album` and `#current-obsessions` remain present.
- `.tile-layout` still wraps image + copy.
- Image renders at fixed panel size on desktop and fluid width on mobile.
- Build has no drift: `node scripts/build-pages.mjs --check`.
