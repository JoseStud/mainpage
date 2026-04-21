# Portfolio Sections

This directory documents the source sections that generate `portfolio.html`.

Primary source of truth for order and docs mapping: `src/site/pages/portfolio/page.config.mjs`.

## Page Intent

The portfolio page presents active projects and the workbench philosophy behind them. It is intentionally practical: short project cards, explicit status labels, and clear links.

## Section Map

| Order | Section id | Source file | Doc file | Role |
| --- | --- | --- | --- | --- |
| 1 | `shelf-intro` | `shelf-intro.section.html` | `shelf-intro.md` | Intro copy and workbench rules summary |
| 2 | `project-ticker` | `project-ticker.section.html` | `project-ticker.md` | Tone-setting marquee |
| 3 | `project-lineup` | `project-lineup.section.html` | `project-lineup.md` | Main project cards and links |
| 4 | `portal-split` | `portal-split.section.html` | `portal-split.md` | By-language list and workbench notes |

## Anchor Contract

`#project-shelf` is a stable public anchor used by shared navigation and buttons:

- `public/assets/js/config/shared-shell.js` (`Projects`, `Workbench`, `WORK/SHELF`)
- `public/assets/js/config/page-shells.js` (`pageShells.portfolio.now.href`)
- Home page preview links (`portfolio.html#project-shelf`)

Do not rename or remove this anchor without coordinated link updates.

## Project Card Contract

Portfolio cards in `project-lineup.section.html` should preserve this structure:

- `.project-block`
- `.project-top`
- `.project-line`
- `.project-status` + status variant class
- `.tag-row` with 2-3 tags
- `.project-summary`
- optional `.project-links`

Current status variants used: `is-live`, `is-building`, `is-draft`, `is-notes`.

## Source Ownership

- Main-column portfolio content: `src/site/pages/portfolio/`
- Shared navigation/buttons: `public/assets/js/config/shared-shell.js`
- Portfolio shell copy: `public/assets/js/config/page-shells.js` (`pageShells.portfolio`)
- Layout/classes: `public/assets/css/layout.css` and `public/assets/css/components/sections.css`

Avoid direct edits to generated `public/portfolio.html`.

## Common Edit Workflows

### Add or update a project card

1. Edit `src/site/pages/portfolio/project-lineup.section.html`.
2. Keep card class structure stable.
3. Reconcile language inventory in `portal-split.section.html` if needed.
4. Rebuild and validate.

### Update workbench rules or language grouping

Edit `src/site/pages/portfolio/portal-split.section.html` while preserving `portal-split` wrapper and both child boxes.

### Update intro count/rules summary

Edit `src/site/pages/portfolio/shelf-intro.section.html` and keep `id="project-shelf"` stable.

## Validation Checklist

- `#project-shelf` still exists.
- Project cards preserve `.project-*` structure.
- Language list still reflects current cards.
- `node scripts/build-pages.mjs --check` reports no drift.
