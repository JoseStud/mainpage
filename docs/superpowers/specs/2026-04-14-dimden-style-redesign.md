# anxidev — dimden.dev-Style Redesign Spec

**Date:** 2026-04-14  
**Status:** Approved

---

## Overview

Full visual redesign of the personal site at `/home/anxiuser/mainpage/` to match the aesthetic of dimden.dev. The existing content is restructured to match dimden.dev's layout conventions. No backend — pure static HTML/CSS/JS.

---

## Visual Elements

### Rain Background
- Full-page `<canvas>` element fixed behind all content (`z-index: 0`)
- JS particle system: ~120 angled raindrop lines, varying speed, length, opacity
- Color: soft blue-white (`rgba(140, 185, 255, opacity)`)
- Slight diagonal angle (mimicking wind-blown rain)
- Toggle button: "Disable rain" / "Enable rain" — persists to `localStorage`

### Logo
- Displays "anxidev" as individual styled letter blocks, mimicking dimden.dev's per-letter PNG image approach
- Each letter is a `<span>` with a dark background, blue border, monospace font, and blue glow text shadow
- CSS keyframe animation: each letter pulses its glow independently with a staggered delay — creates an animated "GIF-like" shimmer wave across the word
- Sits in the page header alongside the profile picture

### Profile Picture
- Placeholder `<img>` tag pointing to `assets/images/pfp.jpg` (user drops their image here later)
- Fallback: styled `<div>` with emoji if the image is missing
- Styled with a blue border, slight glow box-shadow, 4px border-radius

---

## Layout

Three-column grid, inspired by dimden.dev:

```
[ Left sidebar 180px ] [ Main content 1fr ] [ Right sidebar 160px ]
```

- **Left:** Navigation links (Home, Blog, Projects, About) + Status panel
- **Center:** Latest posts list + Projects list  
- **Right:** Social/external links ("Stars") + Info panel (location, stack, timezone)
- Collapses to single column on narrow viewports (≤860px)

Header (above the three columns): profile pic + logo + tagline

---

## Content Structure

### Navigation (Left)
- Home, Blog, Projects, About — with `✦` prefix, active state highlighted white

### Status (Left)
- Live green dot indicators for "Online", "Systems OK", "Coffee: ready"

### Latest Posts (Center)
- List of blog post links with dates (placeholder entries for now)

### Projects (Center)
- Project name (linked) + language tags + one-line description

### Stars / Social (Right)
- GitHub, Twitter/X, RSS — with `✩` prefix

### Info (Right)
- Location, timezone, tech stack — small muted text

---

## Files Changed

| File | Change |
|------|--------|
| `index.html` | Full rewrite — new three-column layout, header, rain canvas |
| `assets/css/styles.css` | Full rewrite — new design tokens, box styles, logo animation, rain toggle button |
| `assets/js/main.js` | Rewrite — rain canvas animation + toggle logic |
| `assets/images/pfp.jpg` | New — placeholder image (user replaces with real photo) |
| `blog.html` | Update nav/header to match new design |
| `portfolio.html` | Update nav/header to match new design |

---

## Technical Notes

- Rain runs via `requestAnimationFrame` loop on a `<canvas>` — no libraries
- Logo animation is pure CSS `@keyframes` with `animation-delay` per letter
- All assets are local — no CDN dependencies
- `localStorage` key `rain-disabled` stores the rain toggle state
- Placeholder pfp: if `assets/images/pfp.jpg` 404s, CSS shows a styled fallback div

---

## Out of Scope

- Chat feature, Last.fm integration, multiplayer cursors, webring badges (dimden.dev extras)
- Actual animated GIF file — the CSS animation produces the same visual effect without a binary asset
- Blog/portfolio page content (only nav/header updated on those pages)
