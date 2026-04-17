# anxidev - dimden.dev-Style Redesign Spec

**Date:** 2026-04-14  
**Status:** Implemented

---

## Overview

Redesign the static personal site at `/home/anxiuser/mainpage/` around a denser, old-web-inspired presentation. The shipped version keeps the no-build, pure HTML/CSS/JS approach while shifting the site toward a busier retro shell with shared sidebar widgets, animated branding, and a lightweight rain effect.

---

## Shipped Visual System

### Atmosphere
- Fixed `<canvas id="rain-canvas">` behind all pages for a subtle animated rain layer
- CRT-style scanlines and drifting background particles via CSS pseudo-elements on `body`
- Dark translucent panels, muted chrome, and green/aqua glow accents

### Branding
- "ANXIDEV" rendered as individual `.logo-letter` blocks instead of a single text mark
- Letters use staggered pulse timing and an overall logo flicker animation
- Header copy is page-specific, but the logo treatment is shared across `index.html`, `blog.html`, and `portfolio.html`

### Typography
- `Silkscreen` is used for labels, headers, and the logo
- `VT323` is used for body copy and the terminal-like interface rhythm

---

## Layout

Current implementation uses a centered shell with:

```text
[ Main content ] [ Sidebar ]
```

- Desktop layout: two columns with a wide content rail and a fixed-width sidebar
- Mobile layout: collapses to a single column at `900px`
- Shared shell structure on each page:
  - `canvas#rain-canvas`
  - `.page`
  - `.site-header`
  - `main.layout`
  - `.site-footer`

---

## Shared Sidebar Shell

The sidebar is rendered from shared config and includes:

- `nav`: main site links with active-page highlighting
- `online`: presence block with live local time
- `now`: rotating "Last loop" message
- `status`: small status card
- `buttons`: 88x31-style badge grid
- `buttoncode`: embeddable site button snippet
- local controls block in HTML, including the rain toggle

Shared content for those widgets lives in `assets/js/config/shell.js`.

---

## Page Content Structure

### Home
- Welcome/introduction panel
- Scrolling marquee
- Compact blog list
- Project stack
- System-status terminal block
- Small decorative portal/tile panel

### Blog
- Archive intro
- Scrolling marquee
- Recent-post list
- Writing-board draft list

### Portfolio
- Workbench intro
- Scrolling marquee
- Project shelf
- Workbench notes

---

## Implementation Architecture

### HTML
- `index.html`, `blog.html`, and `portfolio.html` contain page-specific content only
- Shared shell regions are left as `data-shell` placeholders and filled at runtime

### CSS
- `assets/css/styles.css` is now an entrypoint that imports focused modules instead of holding all rules directly
- CSS modules:
  - `tokens.css`
  - `base.css`
  - `effects.css`
  - `layout.css`
  - `components.css`
  - `responsive.css`

### JavaScript
- `assets/js/main.js` bootstraps the page
- `assets/js/ui/shell.js` renders shared shell regions
- `assets/js/features/clock.js` updates the local time
- `assets/js/features/status-rotator.js` cycles "Last loop" messages
- `assets/js/features/rain.js` drives the rain effect and stores the toggle in `localStorage` with key `rain-disabled`

---

## Files Touched By The Redesign

| File | Role |
|------|------|
| `index.html` | Home-page content and shell markup |
| `blog.html` | Blog-page content and shell markup |
| `portfolio.html` | Portfolio-page content and shell markup |
| `assets/css/styles.css` | CSS entrypoint |
| `assets/css/tokens.css` | Theme tokens |
| `assets/css/base.css` | Base element styles |
| `assets/css/effects.css` | Atmosphere and animation rules |
| `assets/css/layout.css` | Page shell and panel layout |
| `assets/css/components.css` | Reusable component styles |
| `assets/css/responsive.css` | Breakpoint rules |
| `assets/js/main.js` | Shared bootstrap |
| `assets/js/config/shell.js` | Shared sidebar/footer content |
| `assets/js/ui/shell.js` | Shared shell renderer |
| `assets/js/features/clock.js` | Clock feature |
| `assets/js/features/status-rotator.js` | Rotating status text |
| `assets/js/features/rain.js` | Rain engine and toggle persistence |

---

## Out of Scope

- Backend features or a build step
- Full blog-post routing or individual article pages
- External widgets such as chat, music embeds, or webring-style integrations
- Replacing shared config rendering with a framework
