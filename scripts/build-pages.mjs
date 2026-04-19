import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { getPageShell } from "../assets/js/config/shell.js";
import { renderShellMarkup } from "../assets/js/ui/shell-static.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatePath = path.join(rootDir, "site-src", "template.html");
const shouldCheckOnly = process.argv.includes("--check");

const pages = [
  {
    outputPath: path.join(rootDir, "index.html"),
    contentPath: path.join(rootDir, "site-src", "pages", "index.content.html"),
    title: "anxidev // home",
    description:
      "anxidev - warm, rainy personal site with notes, projects, and guestbook entries.",
    page: "home",
  },
  {
    outputPath: path.join(rootDir, "blog.html"),
    contentPath: path.join(rootDir, "site-src", "pages", "blog.content.html"),
    title: "anxidev // blog",
    description: "anxidev blog archive - small essays, field notes, and slow posts.",
    page: "blog",
  },
  {
    outputPath: path.join(rootDir, "portfolio.html"),
    contentPath: path.join(rootDir, "site-src", "pages", "portfolio.content.html"),
    title: "anxidev // projects",
    description: "anxidev projects - small software, warm tools, and experiments.",
    page: "portfolio",
  },
];

function renderPage(template, page, content) {
  const shellMarkup = renderShellMarkup(page.page, getPageShell(page.page));
  const clean = (html) => String(html ?? "").trim();

  return (
    template
    .replace("{{title}}", page.title)
    .replace("{{description}}", page.description)
    .replace("{{page}}", page.page)
    .replace("{{header}}", clean(shellMarkup.header))
    .replace("{{content}}", clean(content))
    .replace("{{sidebar}}", clean(shellMarkup.sidebar))
    .replace("{{footer}}", clean(shellMarkup.footer))
    .replace("{{tweaks}}", clean(shellMarkup.tweaks))
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

async function main() {
  const template = await readFile(templatePath, "utf8");
  let hasDrift = false;

  for (const page of pages) {
    const [content, existingOutput] = await Promise.all([
      readFile(page.contentPath, "utf8"),
      readOptionalFile(page.outputPath),
    ]);

    const rendered = renderPage(template, page, content);

    if (shouldCheckOnly) {
      if (existingOutput !== rendered) {
        hasDrift = true;
        const relativePath = path.relative(rootDir, page.outputPath);
        console.error(`Generated output is stale: ${relativePath}`);
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
