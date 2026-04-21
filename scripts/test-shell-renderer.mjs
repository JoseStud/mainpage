import assert from "node:assert/strict";
import { getPageShell } from "../public/assets/js/config/shell.js";
import { renderShellMarkup } from "./render-shell-markup.mjs";

function assertIncludes(haystack, needle) {
  assert.ok(haystack.includes(needle), `Expected markup to include: ${needle}`);
}

const markup = renderShellMarkup("home", {
  ...getPageShell("home"),
  stars: {
    title: "Stars <unsafe>",
    chip: {
      label: "docs & notes",
      href: "https://example.com/path?x=1&y=2",
      className: "box-chip external-chip",
    },
    items: [
      { id: "home", label: "Home & now", href: "index.html" },
      { id: "bad", label: "Unsafe", href: "javascript:alert(1)" },
    ],
  },
});

assert.equal(Object.keys(markup).sort().join(","), "footer,header,sidebar,tweaks");
assertIncludes(markup.header, 'class="logo-link"');
assertIncludes(markup.header, 'href="index.html"');
assertIncludes(markup.sidebar, "Stars &lt;unsafe&gt;");
assertIncludes(markup.sidebar, "docs &amp; notes");
assertIncludes(markup.sidebar, 'href="https://example.com/path?x=1&amp;y=2"');
assertIncludes(markup.sidebar, 'target="_blank"');
assertIncludes(markup.sidebar, 'rel="noreferrer"');
assertIncludes(markup.sidebar, 'class="navlink active"');
assertIncludes(markup.sidebar, 'aria-current="page"');
assertIncludes(markup.sidebar, 'href="#"');
assert.ok(!markup.sidebar.includes("javascript:alert"), "Unsafe hrefs must be stripped");
assertIncludes(markup.footer, "<span data-year");
assertIncludes(markup.tweaks, 'id="tweaksBtn"');
