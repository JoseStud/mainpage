import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { getPageShell } from "../public/assets/js/config/shell.js";
import { renderShellMarkup } from "../public/assets/js/ui/shell-static.js";
import { homePage } from "../src/site/pages/home/page.config.mjs";
import { blogPage } from "../src/site/pages/blog/page.config.mjs";
import { portfolioPage } from "../src/site/pages/portfolio/page.config.mjs";
import { sunriseTestPages } from "../src/site/pages/sunrise-test/page.config.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteDir = path.join(rootDir, "src", "site");
const publicDir = path.join(rootDir, "public");
const templatePath = path.join(siteDir, "template.html");
const shouldCheckOnly = process.argv.includes("--check");

const pages = [homePage, blogPage, portfolioPage, ...sunriseTestPages];

function toProjectPath(filePath) {
  return path.relative(rootDir, filePath).split(path.sep).join("/");
}

function cleanHtml(html) {
  return String(html ?? "").trim();
}

const EMPTY_SHELL_MARKUP = Object.freeze({ header: "", sidebar: "", footer: "", tweaks: "" });

function serializeInlineScriptData(value) {
  return JSON.stringify(value ?? {}).replace(/</g, "\\u003c");
}

function resolvePage(page) {
  const resolvedSections = page.sections.map((section) => ({
    ...section,
    sourcePath: path.join(rootDir, page.sourceDir, section.file),
    docPath: path.join(rootDir, page.docsDir, section.doc),
  }));

  return {
    ...page,
    outputPath: path.join(publicDir, page.outputFile),
    sections: resolvedSections,
  };
}

function validatePage(page) {
  const requiredPageFields = [
    "outputFile",
    "title",
    "description",
    "page",
    "sourceDir",
    "docsDir",
  ];

  for (const field of requiredPageFields) {
    if (!page[field]) {
      throw new Error(`Page config is missing "${field}" for ${page.page ?? "unknown page"}`);
    }
  }

  if (!Array.isArray(page.sections) || page.sections.length === 0) {
    throw new Error(`Page config must declare at least one section for ${page.page}`);
  }

  const seenSectionIds = new Set();

  for (const section of page.sections) {
    for (const field of ["id", "title", "file", "doc"]) {
      if (!section[field]) {
        throw new Error(`Section in ${page.page} is missing "${field}"`);
      }
    }

    if (seenSectionIds.has(section.id)) {
      throw new Error(`Duplicate section id "${section.id}" in ${page.page}`);
    }

    seenSectionIds.add(section.id);
  }
}

function renderSectionComment(page, section) {
  return [
    `section: ${page.page}/${section.id}`,
    `title: ${section.title}`,
    `source: ${toProjectPath(section.sourcePath)}`,
    `docs: ${toProjectPath(section.docPath)}`,
  ].join(" | ");
}

function renderPage(template, page, content) {
  const shellMarkup =
    page.runtime && page.runtime.showPageChrome === false
      ? EMPTY_SHELL_MARKUP
      : renderShellMarkup(page.page, getPageShell(page.page));

  return (
    template
      .replace("{{title}}", page.title)
      .replace("{{description}}", page.description)
      .replace("{{page}}", page.page)
      .replace("{{pageRuntime}}", serializeInlineScriptData(page.runtime))
      .replace("{{header}}", cleanHtml(shellMarkup.header))
      .replace("{{content}}", cleanHtml(content))
      .replace("{{sidebar}}", cleanHtml(shellMarkup.sidebar))
      .replace("{{footer}}", cleanHtml(shellMarkup.footer))
      .replace("{{tweaks}}", cleanHtml(shellMarkup.tweaks))
      .replace(/[ \t]+$/gm, "")
      .replace(/\n{3,}/g, "\n\n")
  );
}

async function readOptionalFile(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function readRequiredFile(filePath, description) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error && error.code === "ENOENT") {
      throw new Error(`Missing ${description}: ${toProjectPath(filePath)}`);
    }
    throw error;
  }
}

async function renderPageContent(page) {
  const renderedSections = await Promise.all(
    page.sections.map(async (section) => {
      const [html, sectionDoc] = await Promise.all([
        readRequiredFile(section.sourcePath, `${page.page} section source`),
        readOptionalFile(section.docPath),
      ]);

      if (sectionDoc === null) {
        throw new Error(
          `Missing ${page.page} section documentation: ${toProjectPath(section.docPath)}`,
        );
      }

      return `<!-- ${renderSectionComment(page, section)} -->\n${cleanHtml(html)}`;
    }),
  );

  return renderedSections.join("\n\n");
}

async function main() {
  const template = await readFile(templatePath, "utf8");
  let hasDrift = false;

  for (const rawPage of pages) {
    validatePage(rawPage);
    const page = resolvePage(rawPage);

    const [content, existingOutput] = await Promise.all([
      renderPageContent(page),
      readOptionalFile(page.outputPath),
    ]);

    const rendered = renderPage(template, page, content);

    if (shouldCheckOnly) {
      if (existingOutput !== rendered) {
        hasDrift = true;
        console.error(`Generated output is stale: ${toProjectPath(page.outputPath)}`);
      }
      continue;
    }

    if (existingOutput !== rendered) {
      await writeFile(page.outputPath, rendered);
    }
  }

  if (shouldCheckOnly && hasDrift) {
    process.exitCode = 1;
  }
}

await main();
