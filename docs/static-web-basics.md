# Static Web Basics (Beginner Guide)

This guide is for contributors who are not used to static websites yet.

If you have only worked with CMS tools, React apps, or backend frameworks, this will help you build a correct mental model for this repository.

## What Is A Static Website?

A static website is made of files that the server sends directly to the browser.

- HTML = page structure and text
- CSS = styles and layout
- JavaScript = browser behavior

There is no page templating happening on each request. The files are prepared ahead of time.

## How This Repo Is Organized

The short version:

- Edit source files in `src/site/`
- Build generated files into `public/`
- Serve files from `public/`

Important folders:

- `src/site/pages/` = where page content is authored
- `src/site/template.html` = shared page wrapper
- `public/` = generated HTML output files
- `public/assets/` = shared CSS, JS, fonts, images
- `scripts/build-pages.mjs` = script that assembles pages

## Golden Rule

Edit source files, not generated output.

- Good: `src/site/pages/home/site-ticker.partial.html`
- Avoid editing directly: `public/index.html`

If you edit generated files, your changes can be overwritten by the next build.

## What The Build Script Does

When you run:

```bash
cd /home/anxiuser/mainpage
node scripts/build-pages.mjs
```

The script:

1. Reads each page manifest (`page.config.mjs`)
2. Loads each section source file for that page
3. Verifies matching section docs exist
4. Wraps content with `src/site/template.html`
5. Writes final output to `public/index.html`, `public/blog.html`, and `public/portfolio.html`

## Your First Safe Edit

Example: update the home page ticker text.

1. Open `src/site/pages/home/site-ticker.partial.html`
2. Change only the text inside `<marquee>...</marquee>`
3. Build pages:

```bash
cd /home/anxiuser/mainpage
node scripts/build-pages.mjs
```

4. Confirm generated files are up to date:

```bash
cd /home/anxiuser/mainpage
node scripts/build-pages.mjs --check
```

5. Run local server and view page:

```bash
cd /home/anxiuser/mainpage
node src/server/index.js
```

Open `http://localhost:8000/`.

## Common Terms In This Repo

- Section: a reusable content block that becomes part of a page
- Manifest: `page.config.mjs`, a file listing each section and matching doc
- Anchor: an HTML id used in links like `#reading-desk`
- Generated output: built files in `public/`
- Drift check: `--check` mode that confirms generated output is current

## Animation Guide For Beginners

If you want to understand the motion effects (rain, background movement, theme sunrise transition, logo pulse, and ticker behavior), read:

- `docs/animations-beginner-guide.md`

That file focuses on animation concepts, files to edit, and beginner-safe first changes.

## Common Mistakes (And Fixes)

### Mistake: Editing `public/*.html`

Fix: move the same change to the matching source file in `src/site/pages/...` and rebuild.

### Mistake: Build fails with missing section documentation

Fix: create or restore the matching markdown file in `docs/sections/<page>/` listed in `page.config.mjs`.

### Mistake: A link to `#something` stops working

Fix: confirm the anchor id still exists in source HTML and update inbound links if it changed.

### Mistake: Styling does not change

Fix: verify you edited the right CSS module in `public/assets/css/` and then hard-refresh the browser.

## Where To Go Next

- Main project docs: `docs/README.md`
- Animation beginner guide: `docs/animations-beginner-guide.md`
- Section contract: `docs/sections/README.md`
- Page-specific docs:
  - `docs/sections/home/README.md`
  - `docs/sections/blog/README.md`
  - `docs/sections/portfolio/README.md`
