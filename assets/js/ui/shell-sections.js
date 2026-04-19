import { createElement, createLink, replaceNodeChildren } from "./dom.js";

const LOGO_LETTERS = ["a", "n", "x", "i", "d", "e", "v"];
const SAFE_CLASS_PATTERN = /[^a-z0-9_-]+/gi;

function sanitizeClassToken(value, fallback) {
  const normalized = String(value || "")
    .trim()
    .replace(SAFE_CLASS_PATTERN, "");
  return normalized || fallback;
}

function sanitizeClassName(value, fallback) {
  const tokens = String(value || "")
    .split(/\s+/)
    .map((token) => sanitizeClassToken(token, ""))
    .filter(Boolean);
  return tokens.join(" ") || fallback;
}

function createParagraph(className, text) {
  return createElement("p", { className, text });
}

function createShellNote(text, className = "shell-note") {
  if (!text) {
    return null;
  }

  return createParagraph(className, text);
}

function renderLogo() {
  return createLink(
    {
      className: "logo-link",
      href: "index.html",
      attrs: { "aria-label": "anxidev home" },
    },
    createElement(
      "span",
      {
        className: "logo",
        attrs: {
          role: "img",
          "aria-label": "anxidev",
        },
      },
      LOGO_LETTERS.map((letter) => createElement("span", { className: "logo-letter", text: letter })),
    ),
  );
}

function renderChip(chip) {
  if (!chip) {
    return null;
  }

  if (typeof chip === "string") {
    return createElement("span", { className: "box-chip", text: chip });
  }

  const className = sanitizeClassName(chip.className, "box-chip");
  if (chip.href) {
    return createLink({ className, href: chip.href, text: chip.label || "" });
  }

  return createElement("span", { className, text: chip.label || "" });
}

function renderBoxHeading(title, chip) {
  return createElement(
    "div",
    { className: "box-heading" },
    createElement("h2", { className: "box-title", text: title || "" }),
    renderChip(chip),
  );
}

function renderCollectionItem(item) {
  const content = [
    createElement("span", { className: "shell-item-title", text: item.label || "" }),
    item.meta ? createElement("span", { className: "shell-item-meta", text: item.meta }) : null,
  ];

  if (item.href) {
    return createElement(
      "li",
      { className: "shell-item" },
      createLink({ className: "shell-link", href: item.href }, content),
    );
  }

  return createElement(
    "li",
    { className: "shell-item" },
    createElement("div", { className: "shell-copy" }, content),
  );
}

function renderButtonBadge(item, { linked = true } = {}) {
  const className = `button-badge button-badge-${sanitizeClassToken(item.tone, "teal")}`;
  const children = [
    createElement("span", { text: item.top || "" }),
    createElement("span", { text: item.bottom || "" }),
  ];

  if (linked) {
    return createLink({ className, href: item.href || "#" }, children);
  }

  return createElement("span", { className }, children);
}

function renderHeaderSection(headerConfig) {
  if (!headerConfig) {
    return [];
  }

  return [
    createElement("span", { className: "header-led", text: headerConfig.lead || "" }),
    renderLogo(),
    createElement("span", { className: "header-sub", text: headerConfig.sub || "" }),
  ];
}

function renderStarsSection(pageId, starsConfig) {
  if (!starsConfig || !Array.isArray(starsConfig.items)) {
    return null;
  }

  return createElement(
    "section",
    { className: "box menu-box" },
    renderBoxHeading(starsConfig.title || "Stars", starsConfig.chip),
    createElement(
      "nav",
      { attrs: { "aria-label": "Primary navigation" } },
      starsConfig.items.map((item) =>
        createLink(
          {
            className: item.id === pageId ? "navlink active" : "navlink",
            href: item.href,
            attrs: { "aria-current": item.id === pageId ? "page" : null },
            text: item.label || "",
          },
        ),
      ),
    ),
  );
}

function renderOnlineSection(onlineConfig) {
  if (!onlineConfig) {
    return null;
  }

  return createElement(
    "section",
    { className: "box online-box" },
    createElement("span", { className: "presence-kicker", text: onlineConfig.lead || "" }),
    createElement("h2", { className: "presence-title", text: onlineConfig.title || "Online!" }),
    createParagraph("presence-detail", onlineConfig.detail || ""),
    createElement(
      "div",
      { className: "status-callout" },
      createElement("span", { text: "local time" }),
      createElement("strong", { id: "local-time", text: "--:--:--" }),
    ),
  );
}

function renderNowSection(nowConfig) {
  if (!nowConfig) {
    return null;
  }

  return createElement(
    "section",
    { className: "box now-box" },
    createElement("span", { className: "side-kicker", text: nowConfig.title || "Last loop" }),
    createLink(
      { className: "now-link", href: nowConfig.href || "#" },
      createElement("span", { id: "status-rotator", text: nowConfig.text || "--" }),
    ),
  );
}

function renderMusicSection(musicConfig) {
  if (!musicConfig) {
    return null;
  }

  return createElement(
    "section",
    { className: "box music-box" },
    renderBoxHeading(musicConfig.title || "Now playing", musicConfig.chip || "multi-scrobbler"),
    createElement(
      "ul",
      { className: "shell-list" },
      createElement(
        "li",
        { className: "shell-item" },
        createLink(
          {
            className: "shell-link",
            id: "music-track-link",
            href: musicConfig.profileHref || "#",
          },
          createElement("span", {
            className: "shell-item-title",
            id: "music-track-title",
            text: musicConfig.loadingText || "checking multi-scrobbler...",
          }),
          createElement("span", {
            className: "shell-item-meta",
            id: "music-track-meta",
            text: musicConfig.loadingMeta || "waiting for current song",
          }),
        ),
      ),
    ),
    createShellNote(musicConfig.note),
  );
}

function renderCollectionSection(className, config) {
  if (!config || !Array.isArray(config.items)) {
    return null;
  }

  return createElement(
    "section",
    { className: `box ${sanitizeClassName(className, "")}`.trim() },
    renderBoxHeading(config.title || "", config.chip),
    createElement("ul", { className: "shell-list" }, config.items.map((item) => renderCollectionItem(item))),
    createShellNote(config.note),
  );
}

function renderStatusSection(statusConfig) {
  if (!statusConfig) {
    return null;
  }

  return createElement(
    "section",
    { className: "box status-box" },
    createElement("span", { className: "status-heading", text: `✧ ${statusConfig.title || "Current status"}` }),
    createElement(
      "div",
      { className: "status-card" },
      createElement("div", { className: "status-avatar", attrs: { "aria-hidden": "true" }, text: "A" }),
      createElement(
        "div",
        {},
        createElement(
          "p",
          { className: "status-meta" },
          createElement("strong", { text: statusConfig.author || "anxidev" }),
          createElement("span", { text: `• ${statusConfig.time || "now"}` }),
        ),
        createParagraph("status-message", statusConfig.text || ""),
      ),
    ),
  );
}

function renderCounterSection(counterConfig) {
  if (!counterConfig) {
    return null;
  }

  const digits = Array.isArray(counterConfig.digits)
    ? counterConfig.digits
    : String(counterConfig.digits || "").split("");

  return createElement(
    "section",
    { className: "box counter-box" },
    renderBoxHeading(counterConfig.title || "Visitors", counterConfig.chip),
    createElement(
      "div",
      {
        className: "counter",
        id: "counter",
        attrs: { "aria-label": "Visitor counter" },
      },
      digits.map((digit) => createElement("span", { attrs: { "data-counter-cell": "" }, text: digit })),
    ),
    createParagraph("counter-label", counterConfig.label || ""),
  );
}

function renderButtonsSection(buttonConfig) {
  if (!buttonConfig || !Array.isArray(buttonConfig.items)) {
    return null;
  }

  return createElement(
    "section",
    { className: "box buttons-box" },
    renderBoxHeading(buttonConfig.title || "Buttons", buttonConfig.chip),
    createElement("div", { className: "button-grid" }, buttonConfig.items.map((item) => renderButtonBadge(item))),
  );
}

function renderButtonCodeSection(buttonCodeConfig) {
  if (!buttonCodeConfig) {
    return null;
  }

  const preview = buttonCodeConfig.preview || { top: "ANXI", bottom: "DEV", tone: "teal" };

  return createElement(
    "section",
    { className: "box buttoncode-box", id: "site-button" },
    renderBoxHeading(buttonCodeConfig.title || "Site button", buttonCodeConfig.chip),
    createElement("div", { className: "button-preview" }, renderButtonBadge(preview, { linked: false })),
    createElement("textarea", {
      className: "button-snippet",
      attrs: { readonly: "" },
      text: buttonCodeConfig.code || "",
    }),
    createShellNote(buttonCodeConfig.note, "button-note"),
  );
}

function renderControlsSection(controlsConfig) {
  if (!controlsConfig) {
    return null;
  }

  return createElement(
    "section",
    { className: "box controls-box" },
    renderBoxHeading(controlsConfig.title || "Controls", controlsConfig.chip),
    createElement(
      "label",
      { className: "control-row", attrs: { for: "sidebar-rain-toggle" } },
      createElement("input", {
        attrs: {
          type: "checkbox",
          id: "sidebar-rain-toggle",
          checked: true,
        },
      }),
      createElement("span", { text: controlsConfig.rainLabel || "Enable rain overlay" }),
    ),
    createShellNote(controlsConfig.note),
    createShellNote(controlsConfig.secondaryNote, "shell-note control-row-disabled"),
  );
}

const SIDEBAR_RENDERERS = [
  (pageId, pageShell) => renderStarsSection(pageId, pageShell.stars),
  (_, pageShell) => renderOnlineSection(pageShell.online),
  (_, pageShell) => renderNowSection(pageShell.now),
  (_, pageShell) => renderMusicSection(pageShell.music),
  (_, pageShell) => renderStatusSection(pageShell.status),
  (_, pageShell) => renderCollectionSection("findme-box", pageShell.findMe),
  (_, pageShell) => renderCollectionSection("interests-box", pageShell.currentInterests),
  (_, pageShell) => renderCollectionSection("extras-box", pageShell.extras),
  (_, pageShell) => renderCounterSection(pageShell.counter),
  (_, pageShell) => renderButtonsSection(pageShell.buttons),
  (_, pageShell) => renderButtonCodeSection(pageShell.buttonCode),
  (_, pageShell) => renderControlsSection(pageShell.controls),
];

export function renderHeader(headerConfig) {
  const target = document.querySelector('[data-shell="header"]');
  if (!target || !headerConfig) {
    return;
  }

  replaceNodeChildren(target, renderHeaderSection(headerConfig));
}

export function renderSidebar(pageId, pageShell) {
  const target = document.querySelector('[data-shell="sidebar"]');
  if (!target || !pageShell) {
    return;
  }

  replaceNodeChildren(
    target,
    SIDEBAR_RENDERERS.map((renderSection) => renderSection(pageId, pageShell)).filter(Boolean),
  );
}

export function renderFooter(footerText) {
  const footer = document.querySelector('[data-shell="footer"]');
  if (!footer) {
    return;
  }

  replaceNodeChildren(
    footer,
    createElement(
      "p",
      {},
      "(c) 2024-",
      createElement("span", { attrs: { "data-year": "" } }),
      ` anxidev // ${footerText || "all rainy rights reserved"}`,
    ),
  );
}

export function renderTweaks() {
  const target = document.querySelector('[data-shell="tweaks"]');
  if (!target) {
    return;
  }

  replaceNodeChildren(
    target,
    createElement("button", { className: "tweaks-btn", id: "tweaksBtn", attrs: { type: "button" }, text: "tweaks" }),
    createElement(
      "div",
      {
        className: "tweaks-panel",
        id: "tweaksPanel",
        attrs: {
          role: "dialog",
          "aria-label": "Tweaks",
        },
      },
      createElement(
        "div",
        { className: "hd" },
        createElement("span", { text: "TWEAKS" }),
        createElement("button", {
          className: "tw-close",
          id: "tweaksClose",
          attrs: {
            type: "button",
            "aria-label": "Close tweaks",
          },
          text: "x",
        }),
      ),
      createElement(
        "div",
        { className: "bd" },
        createElement(
          "div",
          { className: "tw-row" },
          createElement("span", { attrs: { id: "segThemeLabel" }, text: "theme" }),
          createElement(
            "div",
            {
              className: "seg",
              id: "segTheme",
              attrs: {
                role: "group",
                "aria-labelledby": "segThemeLabel",
              },
            },
            createElement("button", {
              attrs: { type: "button", "data-val": "dark", "aria-pressed": "false" },
              text: "DARK",
            }),
            createElement("button", {
              attrs: { type: "button", "data-val": "light", "aria-pressed": "false" },
              text: "LIGHT",
            }),
          ),
        ),
      ),
    ),
  );
}
