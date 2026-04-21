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
| Rain overlay | diagonal rain on top of page | `public/assets/js/features/rain.js`, `public/assets/css/effects.css` | JS canvas + CSS opacity |
| Background sprinkles | floating clouds, stars, and decorative icons in the background | `public/assets/js/features/background-sprinkles.js`, `public/assets/css/base.css`, `public/assets/css/effects.css` | JS placement + CSS keyframes |
| Sunrise theme transition | animated dark-to-light switch with sky, sun, and soft fade effects | `public/assets/js/features/theme-transition.js`, `public/assets/css/effects.css` | JS state + CSS transitions/keyframes |
| Header logo pulse/flicker | subtle logo glow flicker and letter pulse | `public/assets/css/components/header.css`, `public/assets/css/effects.css` | CSS keyframes |
| Ticker motion | scrolling text strips in home/blog/portfolio | section HTML files under `src/site/pages/...`, `public/assets/css/components/intro.css` | HTML marquee behavior |
| Status rotator | text message changes every few seconds in sidebar "Last loop" | `public/assets/js/features/status-rotator.js` | JS timer |

## `effects.css` Block-By-Block (Beginner Map)

This is the main animation stylesheet:

- `public/assets/css/effects.css`

You can read it top-to-bottom using these section comments.

### 1) Animation tokens (`@property ...`)

What it does:

- Declares animatable CSS custom properties like `--scene-stop-*`, `--panel`, and `--logo-glow`.
- Lets sunrise transitions interpolate color/length values smoothly.

Why this exists:

- Without `@property`, some browsers cannot animate custom property values reliably.

Safe beginner tweak:

- Change one initial token value at a time (example: `--scene-stop-4`) and reload.

### 2) Global overlays and rain layers

Main selectors:

- `body::before`, `body::after`
- `#rain-canvas`, `.rain-fallback`

What it does:

- Adds scanline/noise-like top overlay.
- Adds global vignette glow.
- Controls visible rain layer and CSS fallback rain layer.

Safe beginner tweak:

- Lower `#rain-canvas` opacity if rain feels too strong.

### 3) Light-mode scene overrides

Main selectors:

- `:root[data-theme="light"] ...`

What it does:

- Adjusts opacity/blend mode for scene layers in light mode.
- Fades out dark-only layers (stars/clouds/icons/vignette noise).

Safe beginner tweak:

- Keep layer removals (`opacity: 0`) unless you intentionally want stars visible in daytime.

### 4) Sunrise transition prep

Main selectors:

- `:root[data-theme-transition="sunrise"] ...`

What it does:

- Uses `will-change` on heavy layers.
- Pauses unrelated animation loops.
- Temporarily disables normal transition properties to avoid competing animations.

Why this matters:

- Prevents jank while the sunrise transition runs.

### 5) Sunrise token blend engine

Main selector:

- `:root[data-theme-transition="sunrise"] { transition: ... }`

What it does:

- Animates many custom properties over `--sunrise-duration`.
- This is the core dark-to-light blend.

Safe beginner tweak:

- Change `--sunrise-duration` in JS/theme config, not by editing all transition entries.

### 6) Light-theme resolved token values

Main selectors:

- `:root[data-theme="light"], :root[data-theme-resolved="light"]`

What it does:

- Defines final daytime palette/shadows after transition completes.

Safe beginner tweak:

- Adjust one token family at a time (panel colors first, then text colors).

### 7) Day sky layer + sunrise attachments

Main selectors:

- `.bg-sky-day`
- `:root[data-theme-transition="sunrise"] .bg-sunrise-*`
- `:root[data-theme-transition="sunrise"] .bg-photo*`, `.bg-scene-layer*`, `#rain-canvas`

What it does:

- Adds static daytime gradient layer.
- Hooks each visual layer to the keyframe that should run during sunrise.

Safe beginner tweak:

- Tweak one layer timing at a time. Start with `.bg-sunrise-sun` if you want a clearer sunrise arc.

### 8) Keyframes section

Main keyframe groups:

- Sunrise accents: `sunrise-horizon`, `sunrise-wash`, `sunrise-veil`, `sunrise-sun`
- Ambient loops: `bg-sprinkle-float`, `bg-cloud-drift`, `bg-star-twinkle`, `rain-fallback-slide`
- Sunrise softening: `sunrise-window-soften`, `sunrise-photo-soften`, `sunrise-*fade/soften`
- Header motion: `logo-flicker`, `letter-pulse` (used by `components/header.css`)

What changed in this refactor:

- Removed unused legacy keyframes (`sunrise-horizon-rise`, `sunrise-wash-lift`, `sunrise-veil-settle`, `sunrise-sun-arc`) so the file is easier to learn.

### 9) Reduced motion safety

Main block:

- `@media (prefers-reduced-motion: reduce)`

What it does:

- Disables loops/transitions for users who request less motion.

Rule for contributors:

- Any new animation should include a reduced-motion fallback in this block.

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

- `public/assets/css/effects.css`

Change:

- lower `#rain-canvas` opacity from `0.26` to a smaller value like `0.18`

## Animation Controls Already Built In

- Theme toggle button (`LIGHT`) triggers the sunrise transition to light mode.
- Rain toggle button enables/disables rain and stores preference in local storage (`rain-disabled`).

## Accessibility And Performance Behavior

The site already includes reduced-motion handling:

- Rain auto-disables when `prefers-reduced-motion: reduce` is active.
- Background sprinkles use a motion budget (minimal/balanced/full) based on device capability and reduced-motion/save-data signals.
- CSS disables several animations under reduced-motion media query in `public/assets/css/effects.css`.

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
