import { appendChildren, createElement } from "./dom.js";

function buildPageFrame() {
  const fragment = document.createDocumentFragment();
  const mainColumn = createElement("div", { className: "col col-main", attrs: { "data-page-main": "" } });

  appendChildren(
    fragment,
    createElement("a", {
      className: "skip-link",
      attrs: { href: "#content" },
      text: "skip to content",
    }),
    createElement(
      "div",
      { className: "bg-photo", attrs: { "aria-hidden": "true" } },
      createElement(
        "div",
        { className: "bg-sunrise", attrs: { "aria-hidden": "true" } },
        createElement("span", { className: "bg-sunrise-band bg-sunrise-band--horizon" }),
        createElement("span", { className: "bg-sunrise-band bg-sunrise-band--wash" }),
        createElement("span", { className: "bg-sunrise-band bg-sunrise-band--veil" }),
        createElement("span", { className: "bg-sunrise-sun" }),
      ),
      createElement("div", { className: "bg-photo-scene" }),
    ),
    createElement("div", { className: "rain-fallback", attrs: { "aria-hidden": "true" } }),
    createElement("canvas", { id: "rain-canvas", attrs: { "aria-hidden": "true" } }),
    createElement(
      "div",
      {
        className: "utility-toggles",
        attrs: {
          role: "group",
          "aria-label": "Site controls",
        },
      },
      createElement("button", {
        className: "utility-toggle",
        id: "theme-toggle",
        attrs: {
          type: "button",
          "aria-label": "Light mode",
          "aria-pressed": "false",
          title: "Switch to light mode",
        },
        text: "LIGHT",
      }),
      createElement("button", {
        className: "utility-toggle",
        id: "rain-toggle",
        attrs: {
          type: "button",
          "aria-pressed": "true",
        },
        text: "Disable rain",
      }),
    ),
    createElement(
      "div",
      { className: "page" },
      createElement("header", { className: "site-header", attrs: { "data-shell": "header" } }),
      createElement(
        "main",
        { className: "layout", id: "content" },
        mainColumn,
        createElement("aside", {
          className: "col col-side",
          attrs: { "data-shell": "sidebar" },
        }),
      ),
      createElement("footer", { className: "site-footer", attrs: { "data-shell": "footer" } }),
    ),
    createElement("div", { attrs: { "data-shell": "tweaks" } }),
  );

  return { fragment, mainColumn };
}

function hasMountedPageFrame() {
  return Boolean(
    document.querySelector('[data-shell="header"]') &&
      document.querySelector('[data-shell="sidebar"]') &&
      document.getElementById("rain-canvas"),
  );
}

export function ensurePageFrame() {
  if (hasMountedPageFrame()) {
    return;
  }

  const pageContent = document.querySelector("[data-page-content]");
  if (!pageContent) {
    return;
  }

  const { fragment, mainColumn } = buildPageFrame();

  while (pageContent.firstChild) {
    mainColumn.appendChild(pageContent.firstChild);
  }

  mainColumn.removeAttribute("data-page-main");
  document.body.insertBefore(fragment, pageContent);
  pageContent.remove();
}
