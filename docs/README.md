# Project Documentation

This directory is the maintainer guide for `mainpage`, a static three-page site assembled from section partials.

## New To Static Websites?

Start here first:

- `docs/static-web-basics.md`

Then for motion/visual behavior:

- `docs/animations-beginner-guide.md`

That guide explains source vs generated files, what the build script does, and how to make your first safe edit.

## Project In One Minute

`mainpage` generates three entry pages:

- `public/index.html`
- `public/blog.html`
- `public/portfolio.html`

Authoring content and structure live in `src/site/`. Build output is written to `public/`.

## Source Vs Generated Files

If you are not used to static sites, this is the most important rule:

- Edit source files in `src/site/...`
- Rebuild
- Let the build script update `public/...`

Do not treat `public/*.html` as hand-edited source.

## Architecture At A Glance

See `docs/architecture.md` for the full file map and editing rules.

- Page manifests: `src/site/pages/<page>/page.config.mjs`
- Section source files: `src/site/pages/<page>/`
- Section docs (required by build): `docs/sections/<page>/`
- Shared wrapper template: `src/site/template.html`
- Build pipeline: `scripts/build-pages.mjs`
- Shared shell config: `public/assets/js/config/shared-shell.js` and `public/assets/js/config/page-shells.js`
- Shared shell runtime rendering: `public/assets/js/ui/shell-sections.js` and `public/assets/js/ui/shell.js`
- Shared shell build serialization: `scripts/render-shell-markup.mjs`
- Shared shell renderer test: `scripts/test-shell-renderer.mjs`
- Client features: `public/assets/js/features/`
- CSS modules: `public/assets/css/`

`scripts/build-pages.mjs` validates section metadata and refuses to render sections that are missing their matching documentation file.

## Build, Run, And Validate

### Build generated pages

```bash
cd /home/anxiuser/mainpage
node scripts/build-pages.mjs
```

### Run local server

```bash
cd /home/anxiuser/mainpage
node scripts/build-pages.mjs
node src/server/index.js
```

### Check generated drift without writing files

```bash
cd /home/anxiuser/mainpage
node scripts/test-shell-renderer.mjs
node scripts/build-pages.mjs --check
```

### Validate HTML output

```bash
cd /home/anxiuser/mainpage
for f in public/index.html public/blog.html public/portfolio.html; do
  xmllint --html --noout "$f"
done
```

## Beginner First Contribution Flow

Use this if this is your first static-site change in this repo:

1. Pick one source section file in `src/site/pages/<page>/`.
2. Make a small content-only edit.
3. Run `node scripts/build-pages.mjs`.
4. Run `node scripts/build-pages.mjs --check`.
5. Open the page locally and confirm result.

If your edit changed section structure or behavior, update the matching section doc in `docs/sections/<page>/`.

## Editing Workflows

### Workflow A: Update Section Content

1. Edit the smallest relevant source file under `src/site/pages/<page>/`.
2. Update matching section docs under `docs/sections/<page>/` if structure, anchors, semantics, or responsibilities changed.
3. Run `node scripts/build-pages.mjs`.
4. Run `node scripts/build-pages.mjs --check` to verify no drift remains.
5. Validate generated output with `xmllint`.

### Workflow B: Update Shared Shell Content

Use config files when changing sidebar/footer/header copy or shared navigation links.

- Shared links/buttons/counter/controls: `public/assets/js/config/shared-shell.js`
- Page-specific shell copy: `public/assets/js/config/page-shells.js`

Avoid editing generated shell output directly.

### Workflow C: Update Behavior Or UI Effects

- Feature modules: `public/assets/js/features/`
- Shell rendering behavior: `public/assets/js/ui/`
- Styles: smallest relevant file in `public/assets/css/`

If behavior touches performance-sensitive code (rain, transitions, layout), run the checks in `docs/performance.md`.

### Workflow D: Add Or Remove A Section

1. Update `src/site/pages/<page>/page.config.mjs`.
2. Add/remove section source file in `src/site/pages/<page>/`.
3. Add/remove matching section doc in `docs/sections/<page>/`.
4. Build and validate.

If the doc file is missing, build will fail with a missing section documentation error.

## Documentation Map

- Beginner static-site guide: `docs/static-web-basics.md`
- Beginner animation guide: `docs/animations-beginner-guide.md`
- Architecture and editing rules: `docs/architecture.md`
- Section-doc contract: `docs/sections/README.md`
- Home page docs: `docs/sections/home/README.md`
- Blog page docs: `docs/sections/blog/README.md`
- Portfolio page docs: `docs/sections/portfolio/README.md`
- Performance workflow: `docs/performance.md`
- Design references and plans: `docs/superpowers/`

## Contributor Checklist

- Confirm anchors used by cross-page links are still valid.
- Keep existing layout classes unless intentionally redesigning.
- Regenerate pages after source edits.
- Ensure generated output has no drift.
- Validate all generated HTML files.
- Update section docs for any structural or semantic change.
