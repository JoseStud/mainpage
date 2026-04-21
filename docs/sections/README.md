# Section Documentation Contract

This directory documents every source section used to generate `public/index.html`, `public/blog.html`, and `public/portfolio.html`.

If you are new to static websites, read `docs/static-web-basics.md` first.

## What A "Section" Means Here

A section is one block of page content, like a card, intro box, feed, or split panel.

Think of each page as a stack of section files. The build script combines those files into final output HTML.

## Why This Exists

Each section must have:

- a source file in `src/site/pages/<page>/`
- a matching section doc in `docs/sections/<page>/`

`scripts/build-pages.mjs` validates this relationship and fails if any section doc is missing.

## Required File Relationship

For each page:

1. `src/site/pages/<page>/page.config.mjs` declares section `id`, `title`, `file`, and `doc`.
2. `file` must exist under `src/site/pages/<page>/`.
3. `doc` must exist under `docs/sections/<page>/`.

## Naming Patterns In This Repo

- Home source files use `.partial.html`
- Blog source files use `.html`
- Portfolio source files use `.section.html`

The extension differs by page, but the manifest contract is identical.

## What Each Section Doc Should Cover

Each section markdown file should include:

- purpose and role in page flow
- critical anchors and cross-links
- class/layout contracts that should remain stable
- where related shell/config/style logic lives
- when and how to edit
- quick validation checklist

## Beginner-Friendly Section Update Flow

1. Pick one existing section source file.
2. Make a small change.
3. Check the matching section doc and update it if meaning or structure changed.
4. Build and run drift check:

```bash
cd /home/anxiuser/mainpage
node scripts/build-pages.mjs
node scripts/build-pages.mjs --check
```

## Add A New Section

1. Add section source file in `src/site/pages/<page>/`.
2. Register it in `src/site/pages/<page>/page.config.mjs`.
3. Create matching docs file in `docs/sections/<page>/`.
4. Update page README in `docs/sections/<page>/README.md`.
5. Build and validate.

## Remove A Section

1. Remove it from `page.config.mjs`.
2. Remove source file.
3. Remove section doc.
4. Verify no inbound links still target removed anchor IDs.
5. Build and validate generated pages.

## Page-Level Indexes

- `docs/sections/home/README.md`
- `docs/sections/blog/README.md`
- `docs/sections/portfolio/README.md`
