# Animation Beginner Guide

This guide explains the animations used on this website in plain language.

If you are new to static websites, read `docs/static-web-basics.md` first, then come back here.

## How Animation Works In This Repo

Animations are implemented in three ways:

1. CSS keyframes and transitions
2. JavaScript loops (`requestAnimationFrame`) or timers (`setInterval`)
3. Hybrid behavior where JavaScript toggles CSS state classes or data attributes

On page load, `public/assets/js/main.js` starts the animation features in this order:

- `initBackgroundSprinkles()`
- `initRain()`
- `createThemeController()` + `initTweaks(...)`
- `startStatusRotator(...)`

## Animation Inventory (What Users See)

| Animation | What visitors see | Main files | Type |
| --- | --- | --- | --- |
| Rain overlay | diagonal rain on top of page | `public/assets/js/features/rain.js`, `public/assets/css/effects/rain.css` | JS canvas + CSS opacity |
| Background sprinkles | floating clouds, stars, and decorative icons in the background | `public/assets/js/features/background-sprinkles.js`, `public/assets/css/base.css`, `public/assets/css/effects/sprinkles.css` | JS placement + CSS keyframes |
| Sunrise theme transition | animated dark-to-light switch with sky, sun, and soft fade effects | `public/assets/js/features/theme-transition.js`, `public/assets/css/effects/sunrise.css` | JS state + CSS transitions/keyframes |
| Header logo pulse/flicker | subtle logo glow flicker and letter pulse | `public/assets/css/components/header.css`, `public/assets/css/effects/crt.css` | CSS keyframes |
| Ticker motion | scrolling text strips in home/blog/portfolio | section HTML files under `src/site/pages/...`, `public/assets/css/components/intro.css` | HTML marquee behavior |
| Status rotator | text message changes every few seconds in sidebar "Last loop" | `public/assets/js/features/status-rotator.js` | JS timer |

## Effect Stylesheets (Beginner Map)

`public/assets/css/effects.css` is an import-only entrypoint. The actual effect rules live in focused files:

- `public/assets/css/effects/crt.css`: global scanline/vignette overlays, logo flicker keyframes, and reduced-motion safety for CRT-style motion.
- `public/assets/css/effects/rain.css`: rain canvas styling, fallback rain layer, light-mode rain overrides, `rain-fallback-slide`, and reduced-motion safety.
- `public/assets/css/effects/sprinkles.css`: light-mode sprinkle overrides plus `bg-sprinkle-float`, `bg-cloud-drift`, and `bg-star-twinkle`.
- `public/assets/css/effects/sunrise.css`: sunrise `@property` registrations, final light scene state, transition prep, day sky layer, and sunrise softening keyframes.

Safe beginner tweaks:

- Lower `#rain-canvas` opacity in `effects/rain.css` if rain feels too strong.
- Tweak one sunrise layer timing at a time in `effects/sunrise.css`. Start with `.bg-sunrise-sun` if you want a clearer sunrise arc.
- Any new animation should include a reduced-motion fallback in the same effect file.

## Where The Animation Layers Come From

Background animation containers are part of the page shell in:

- `src/site/template.html`

Important elements:

- `.bg-photo-scene` (sprinkles mount point)
- `#rain-canvas` (rain rendering surface)
- `.bg-sunrise*` elements (sunrise transition layers)

## Beginner-Safe First Changes

These are low-risk starter edits.

### 1) Slow the logo pulse

Edit:

- `public/assets/css/components/header.css`

Change:

- `.logo-letter { animation: letter-pulse 1.35s ... }`

Example:

- change `1.35s` to `1.8s` for slower movement

### 2) Slow status message rotation

Edit:

- `public/assets/js/features/status-rotator.js`

Change:

- interval from `3200` to `4500` (milliseconds)

### 3) Make rain lighter

Edit:

- `public/assets/css/effects/rain.css`

Change:

- lower `#rain-canvas` opacity from `0.26` to a smaller value like `0.18`

## Animation Controls Already Built In

- Theme toggle button (`LIGHT`) triggers the sunrise transition to light mode.
- Rain toggle button enables/disables rain and stores preference in local storage (`rain-disabled`).

## Accessibility And Performance Behavior

The site already includes reduced-motion handling:

- Rain auto-disables when `prefers-reduced-motion: reduce` is active.
- Background sprinkles use a motion budget (minimal/balanced/full) based on device capability and reduced-motion/save-data signals.
- CSS disables animations under reduced-motion media queries in the relevant `public/assets/css/effects/*.css` files.

If you add or increase animation work, run the profiling flow in `docs/performance.md`.

## Important Rules Before Editing Animation Code

1. Keep source-of-truth edits in source files, not generated HTML.
1. Change one animation system at a time.
1. Build and drift-check after each change:

```bash
cd /home/anxiuser/mainpage
node scripts/build-pages.mjs
node scripts/build-pages.mjs --check
```

1. If visual behavior changes across pages, verify `index.html`, `blog.html`, and `portfolio.html`.

## Troubleshooting

### "I changed animation code but nothing changed"

- Confirm you edited the right file in `public/assets/css/` or `public/assets/js/features/`.
- Hard refresh browser cache.

### "Theme transition looks stuck"

- Check `public/assets/js/features/theme-transition.js` for active transition state.
- Verify `data-theme-transition="sunrise"` is being added/removed as expected.

### "Rain toggle does not match what I see"

- Check `rain-disabled` in browser local storage.
- Confirm `#rain-canvas` does not have unexpected classes beyond `rain-hidden`.

## Related Docs

- `docs/static-web-basics.md`
- `docs/README.md`
- `docs/performance.md`
