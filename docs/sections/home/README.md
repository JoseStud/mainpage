# Home Page Sections

The home page source is now split into stable section partials under `site-src/pages/home/`. `site-src/pages/home/page.config.mjs` is the source of truth for page metadata and section order.

## Section order

1. `welcome-intro.partial.html`
2. `site-ticker.partial.html`
3. `logbook-preview.partial.html`
4. `project-shelf-preview.partial.html`
5. `systems-guestbook-split.partial.html`
6. `photo-room.partial.html`

## Editing rules

- Preserve anchors that are linked elsewhere, especially `welcome`, `site-signals`, `guestbook`, `album`, and `current-obsessions`.
- Keep layout wrapper classes intact when they drive composition, especially `intro-grid` and `portal-split portal-split-signals`.
- Edit the smallest relevant partial and update its matching section doc if the structure, anchors, or role of that block changes.
