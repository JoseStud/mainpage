# Performance Tracking

This project has enough animation, paint, and layout work that visual changes can regress performance without changing any obvious logic. Treat performance tracing as part of normal UI verification, not as a one-off cleanup step.

## Use this workflow when

- changing `public/assets/css/`
- changing `public/assets/js/features/`
- changing theme-transition behavior
- changing background layers, rain, or decorative motion
- changing shared shell markup that affects layout across pages

## Local profiling setup

Use the project server instead of an ad-hoc static server so the trace matches the actual app behavior:

```bash
cd /home/anxiuser/mainpage
node scripts/build-pages.mjs
node src/server/index.js
```

Open:

- `http://localhost:8000/index.html`

Before recording a trace in DevTools:

1. Open DevTools.
2. In the Network panel, enable `Disable cache`.
3. Hard refresh the page.

## Capture flow

Use the same interaction flow each time so trace totals stay comparable:

1. Record a Performance trace on `index.html`.
2. Let the page settle after load.
3. Scroll the page roughly one viewport down and back up.
4. Toggle theme from dark to light, then back if needed.
5. Toggle rain once.
6. Let the page idle for a few seconds so recurring animation work is captured.
7. Stop recording and save the trace JSON into `perf/`.

Suggested filename format:

- `perf/Trace-YYYYMMDDTHHMMSS.json`

Do not treat `304 Not Modified` as a profiling failure. It is normal cache behavior. The important part is recording with cache disabled so the trace reflects a fresh load.

## Inspect the latest trace

Use the trace summary script added for this repo:

```bash
cd /home/anxiuser/mainpage
node scripts/inspect-trace.mjs
```

Useful variants:

```bash
node scripts/inspect-trace.mjs perf/Trace-20260419T185728.json
node scripts/inspect-trace.mjs --json
node scripts/inspect-trace.mjs --no-compare
```

The script reports:

- latest trace metadata
- top `CrRendererMain` `RunTask` windows
- aggregate totals for `UpdateLayoutTree`, `Layout`, `Paint`, `RasterTask`, and animation work
- automatic comparison against the previous trace in `perf/`

## Current baseline

Use `perf/Trace-20260419T185728.json` as the current reference trace for the home page flow above.

Reference values from that trace:

- `Renderer main RunTask max`: `21.614 ms`
- `RunTask >= 16 ms`: `2`
- `PageAnimator::serviceScriptedAnimations`: `172.792 ms`
- `UpdateLayoutTree`: `173.627 ms`
- `Layout`: `49.626 ms`
- `Paint`: `78.889 ms`
- `RasterTask`: `303.07 ms`

These are guardrails, not universal budgets. The trace window and interaction sequence affect totals, so keep the capture flow consistent. If the capture flow changes, compare `RunTask max` first and treat raw totals more carefully.

## Regression rules

Investigate before merging if a new trace shows any of the following under the same capture flow:

- `Renderer main RunTask max` rises above `25 ms`
- `RunTask >= 16 ms` increases materially without a clear reason
- `UpdateLayoutTree` rises above `190 ms`
- `Paint` rises above `90 ms`
- `RasterTask` rises above `330 ms`
- the top renderer tasks shift from short animation work into repeated layout or paint bursts

If a change is intentional and exceeds these guardrails, document why in the PR or change notes.

## What recent traces showed

The current site is most sensitive to:

- broad style invalidation during theme changes
- paint-heavy decorative background layers
- raster cost from animated visual effects

Recent fixes reduced the animation budget in `public/assets/js/features/background-sprinkles.js` and narrowed transition disabling in `public/assets/css/effects.css` to avoid full-document invalidation during theme transitions. Be careful with selectors that target `:root[data-theme-*] *`, because they can trigger wide `UpdateLayoutTree` work.

## PR checklist for UI changes

For any visual or interaction-heavy change:

1. Run `node scripts/build-pages.mjs --check`.
2. Validate the generated HTML if the template or page fragments changed.
3. Capture a fresh trace with the flow above.
4. Run `node scripts/inspect-trace.mjs`.
5. Compare the output against the current baseline and call out any regression explicitly.

Large trace JSON files are local working artifacts by default. Keep them in `perf/` while iterating, but only keep them in version control if they are intentionally part of the investigation history.
