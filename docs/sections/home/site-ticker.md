# Site Ticker

## Purpose

The site ticker is a narrow marquee strip below the welcome hero. It sets atmosphere and voice without adding layout complexity.

This block is intentionally short and decorative.

## If You Are New To Static Pages

This section is a safe first edit.

Why: it is plain text inside one small HTML block.

Edit here:

- `src/site/pages/home/site-ticker.partial.html`

Then rebuild pages with:

```bash
cd /home/anxiuser/mainpage
node scripts/build-pages.mjs
```

## Source

- Source file: `src/site/pages/home/site-ticker.partial.html`
- Manifest entry: `src/site/pages/home/page.config.mjs` (`id: "site-ticker"`)

## Structure Contract

Current expected structure:

- `<section class="box marquee-box" aria-label="Site ticker">`
- `<marquee ...>` with inline hover handlers:
	- `onmouseover="this.stop();"`
	- `onmouseout="this.start();"`

The hover stop/start behavior is part of the current interaction model.

`<marquee>` is an older HTML element used here intentionally for retro style.

## Styling Dependencies

- `public/assets/css/components/intro.css`
	- `.marquee-box`
	- `.marquee-box marquee`
- `public/assets/css/layout.css`
	- `.box`

## Editing Guidance

Edit this section when:

- ticker copy changes
- accessibility label needs to change
- marquee speed (`scrollamount`) needs adjustment

If this is your first change, only update the ticker text and keep everything else as-is.

Avoid converting this into a different layout component unless redesigning all page tickers together.

## Content Guidelines

- Keep copy short and rhythmic.
- Prefer phrase separators like `·`.
- Avoid adding links or extra nested containers.

## Quick Validation

- `aria-label` remains present.
- Marquee still pauses on hover and resumes on mouseout.
- Ticker keeps `.box marquee-box` class combination.
- Build has no drift: `node scripts/build-pages.mjs --check`.

## Common Beginner Mistakes

- Editing `public/index.html` instead of the source file
- Deleting marquee event handlers by accident
- Removing `aria-label` while changing text

If one of these happens, restore the missing attributes/classes and rebuild.
