# Blog Sections

This directory documents the source sections that generate `blog.html`.

Primary source of truth for order and docs mapping: `src/site/pages/blog/page.config.mjs`.

## Page Intent

The blog page is a living archive, not a growth funnel. It combines:

- archive identity (`/blog.log`)
- recent highlighted entries
- in-progress thinking (`draft-board`)
- reading/habits context (`life-tracker`)

## Section Map

| Order | Section id | Source file | Doc file | Role |
| --- | --- | --- | --- | --- |
| 1 | `reading-desk-intro` | `reading-desk-intro.html` | `reading-desk-intro.md` | Archive intro and yearly map |
| 2 | `blog-ticker` | `blog-ticker.html` | `blog-ticker.md` | Tone-setting marquee |
| 3 | `recent-entries` | `recent-entries.html` | `recent-entries.md` | Latest entry cards |
| 4 | `draft-board-life-tracker` | `draft-board-life-tracker.html` | `draft-board-life-tracker.md` | Draft ideas and life tracker split |

## Anchor Contracts

Stable anchors used by shared navigation/buttons:

- `#reading-desk`
- `#draft-board`
- `#life-tracker`

`#reading-desk` and `#life-tracker` are linked from shared shell config (`public/assets/js/config/shared-shell.js`).

## Status Badge Contract

`recent-entries` uses `.entry-state` classes styled in `public/assets/css/components/sections.css`.

Available variants:

- `is-live`
- `is-draft`
- `is-notes`
- `is-building`
- `is-open`
- `is-soon`

Only `is-live` and `is-notes` are used currently, but other variants are intentionally available.

## Source Ownership

- Main-column blog content: `src/site/pages/blog/`
- Shared links/buttons/nav labels: `public/assets/js/config/shared-shell.js`
- Blog sidebar/footer/header copy: `public/assets/js/config/page-shells.js` (`pageShells.blog`)
- Layout/classes: `public/assets/css/layout.css` and `public/assets/css/components/*.css`

Avoid direct edits to generated `public/blog.html`.

## Common Edit Workflows

### Add a recent entry

1. Edit `src/site/pages/blog/recent-entries.html`.
2. Add entry card near top and keep list style consistent.
3. Keep card links anchored to `#reading-desk` unless routing model changes.
4. Rebuild and verify layout.

### Update archive totals

1. Edit `src/site/pages/blog/reading-desk-intro.html`.
2. Update total chip and per-year counts together.
3. Rebuild and verify.

### Update drafts or life tracker

Edit `src/site/pages/blog/draft-board-life-tracker.html` while preserving both IDs and the shared `portal-split` wrapper.

## Validation Checklist

- `#reading-desk`, `#draft-board`, `#life-tracker` anchors still exist.
- Recent entry cards keep `.entry-*` class structure.
- `portal-split` remains intact.
- `node scripts/build-pages.mjs --check` reports no drift.
