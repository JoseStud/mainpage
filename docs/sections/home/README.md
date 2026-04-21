# Home Page Sections

This directory documents the section partials that form `index.html`.

Primary source of truth for order and docs mapping: `src/site/pages/home/page.config.mjs`.

## Page Intent

The home page is a front-door overview: identity first, activity previews second, and aesthetic context last. It should quickly answer:

- who is this space for?
- what is active right now?
- where should a visitor go next?

## Section Map

| Order | Section id | Source file | Doc file | Role |
| --- | --- | --- | --- | --- |
| 1 | `welcome` | `welcome-intro.partial.html` | `welcome-intro.md` | Identity hero and quick facts |
| 2 | `site-ticker` | `site-ticker.partial.html` | `site-ticker.md` | Tone-setting marquee strip |
| 3 | `logbook-preview` | `logbook-preview.partial.html` | `logbook-preview.md` | Recent writing preview |
| 4 | `project-shelf-preview` | `project-shelf-preview.partial.html` | `project-shelf-preview.md` | Featured project preview |
| 5 | `systems-guestbook-split` | `systems-guestbook-split.partial.html` | `systems-guestbook-split.md` | Site status and guestbook split |
| 6 | `album` | `photo-room.partial.html` | `photo-room.md` | Closing image and room context |

## Anchor Contracts

These anchors are treated as stable public targets across the site:

- `#welcome`
- `#site-signals`
- `#guestbook`
- `#album`
- `#current-obsessions`

Cross-page/shared shell links depend on these IDs via `public/assets/js/config/shared-shell.js` and `public/assets/js/config/page-shells.js`.

## Source Ownership

- Main-column content in this folder (`src/site/pages/home/`)
- Shared shell copy/navigation in `public/assets/js/config/page-shells.js`
- Shared links/buttons/counter in `public/assets/js/config/shared-shell.js`
- Shared layout and section classes in `public/assets/css/layout.css` and `public/assets/css/components/*.css`

Avoid editing generated `public/index.html` directly.

## Common Edit Workflows

### Update copy in one section

1. Edit relevant partial in `src/site/pages/home/`.
2. Update matching doc in this directory if meaning or structure changed.
3. Run `node scripts/build-pages.mjs`.

### Update home navigation/sidebar text

1. Edit `public/assets/js/config/page-shells.js` (`pageShells.home`).
2. If shared links changed, also update `public/assets/js/config/shared-shell.js`.
3. Rebuild pages.

### Update preview links to other pages

Keep these targets stable unless destination anchors intentionally move:

- logbook preview -> `blog.html#reading-desk`
- project preview -> `portfolio.html#project-shelf`

## Validation Checklist

- Anchors still exist in source partials.
- Wrapper classes (`intro-grid`, `portal-split`, `tile-layout`, `compact-feed`, `project-stack`) remain intact.
- Cross-page links still resolve.
- `node scripts/build-pages.mjs --check` reports no drift.
