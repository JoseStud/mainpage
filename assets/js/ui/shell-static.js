import { isExternalHref, sanitizeHref } from "./html.js";

const LOGO_LETTERS = ["a", "n", "x", "i", "d", "e", "v"];
const SAFE_CLASS_PATTERN = /[^a-z0-9_-]+/gi;

function escapeText(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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

function renderLinkAttrs(href) {
  const safeHref = sanitizeHref(href);
  const attrs = [`href="${escapeText(safeHref)}"`];

  if (isExternalHref(safeHref)) {
    attrs.push('target="_blank"', 'rel="noreferrer"');
  }

  return attrs.join(" ");
}

function renderLogoMarkup() {
  const letters = LOGO_LETTERS.map((letter) => `<span class="logo-letter">${letter}</span>`).join("");
  return `
    <a class="logo-link" href="index.html" aria-label="anxidev home">
      <span class="logo" role="img" aria-label="anxidev">${letters}</span>
    </a>
  `;
}

function renderChipMarkup(chip) {
  if (!chip) {
    return "";
  }

  if (typeof chip === "string") {
    return `<span class="box-chip">${escapeText(chip)}</span>`;
  }

  const className = sanitizeClassName(chip.className, "box-chip");
  if (chip.href) {
    return `<a class="${escapeText(className)}" ${renderLinkAttrs(chip.href)}>${escapeText(chip.label || "")}</a>`;
  }

  return `<span class="${escapeText(className)}">${escapeText(chip.label || "")}</span>`;
}

function renderBoxHeadingMarkup(title, chip) {
  return `
    <div class="box-heading">
      <h2 class="box-title">${escapeText(title || "")}</h2>
      ${renderChipMarkup(chip)}
    </div>
  `;
}

function renderHeaderMarkup(headerConfig) {
  if (!headerConfig) {
    return "";
  }

  return `
    <span class="header-led">${escapeText(headerConfig.lead || "")}</span>
    ${renderLogoMarkup()}
    <span class="header-sub">${escapeText(headerConfig.sub || "")}</span>
  `;
}

function renderStarsMarkup(pageId, starsConfig) {
  if (!starsConfig || !Array.isArray(starsConfig.items)) {
    return "";
  }

  const links = starsConfig.items
    .map((item) => {
      const active = item.id === pageId;
      return `<a class="navlink${active ? " active" : ""}"${active ? ' aria-current="page"' : ""} ${renderLinkAttrs(item.href)}>${escapeText(item.label || "")}</a>`;
    })
    .join("");

  return `
    <section class="box menu-box">
      ${renderBoxHeadingMarkup(starsConfig.title || "Stars", starsConfig.chip)}
      <nav aria-label="Primary navigation">${links}</nav>
    </section>
  `;
}

function renderOnlineMarkup(onlineConfig) {
  if (!onlineConfig) {
    return "";
  }

  return `
    <section class="box online-box">
      <span class="presence-kicker">${escapeText(onlineConfig.lead || "")}</span>
      <h2 class="presence-title">${escapeText(onlineConfig.title || "Online!")}</h2>
      <p class="presence-detail">${escapeText(onlineConfig.detail || "")}</p>
      <div class="status-callout">
        <span>local time</span>
        <strong id="local-time">--:--:--</strong>
      </div>
    </section>
  `;
}

function renderNowMarkup(nowConfig) {
  if (!nowConfig) {
    return "";
  }

  return `
    <section class="box now-box">
      <span class="side-kicker">${escapeText(nowConfig.title || "Last loop")}</span>
      <a class="now-link" ${renderLinkAttrs(nowConfig.href || "#")}>
        <span id="status-rotator">${escapeText(nowConfig.text || "--")}</span>
      </a>
    </section>
  `;
}

function renderMusicMarkup(musicConfig) {
  if (!musicConfig) {
    return "";
  }

  return `
    <section class="box music-box">
      ${renderBoxHeadingMarkup(musicConfig.title || "Now playing", musicConfig.chip || "multi-scrobbler")}
      <ul class="shell-list">
        <li class="shell-item">
          <a class="shell-link" id="music-track-link" ${renderLinkAttrs(musicConfig.profileHref || "#")}>
            <span class="shell-item-title" id="music-track-title">${escapeText(musicConfig.loadingText || "checking multi-scrobbler...")}</span>
            <span class="shell-item-meta" id="music-track-meta">${escapeText(musicConfig.loadingMeta || "waiting for current song")}</span>
          </a>
        </li>
      </ul>
      ${musicConfig.note ? `<p class="shell-note">${escapeText(musicConfig.note)}</p>` : ""}
    </section>
  `;
}

function renderCollectionMarkup(className, config) {
  if (!config || !Array.isArray(config.items)) {
    return "";
  }

  const items = config.items
    .map((item) => {
      const title = `<span class="shell-item-title">${escapeText(item.label || "")}</span>`;
      const meta = item.meta ? `<span class="shell-item-meta">${escapeText(item.meta)}</span>` : "";

      if (item.href) {
        return `
          <li class="shell-item">
            <a class="shell-link" ${renderLinkAttrs(item.href)}>
              ${title}${meta}
            </a>
          </li>
        `;
      }

      return `
        <li class="shell-item">
          <div class="shell-copy">
            ${title}${meta}
          </div>
        </li>
      `;
    })
    .join("");

  const sectionClass = sanitizeClassName(className, "");
  return `
    <section class="box ${escapeText(sectionClass)}">
      ${renderBoxHeadingMarkup(config.title || "", config.chip)}
      <ul class="shell-list">${items}</ul>
      ${config.note ? `<p class="shell-note">${escapeText(config.note)}</p>` : ""}
    </section>
  `;
}

function renderStatusMarkup(statusConfig) {
  if (!statusConfig) {
    return "";
  }

  return `
    <section class="box status-box">
      <span class="status-heading">✧ ${escapeText(statusConfig.title || "Current status")}</span>
      <div class="status-card">
        <div class="status-avatar" aria-hidden="true">A</div>
        <div>
          <p class="status-meta">
            <strong>${escapeText(statusConfig.author || "anxidev")}</strong>
            <span>• ${escapeText(statusConfig.time || "now")}</span>
          </p>
          <p class="status-message">${escapeText(statusConfig.text || "")}</p>
        </div>
      </div>
    </section>
  `;
}

function renderCounterMarkup(counterConfig) {
  if (!counterConfig) {
    return "";
  }

  const digits = Array.isArray(counterConfig.digits)
    ? counterConfig.digits
    : String(counterConfig.digits || "").split("");

  return `
    <section class="box counter-box">
      ${renderBoxHeadingMarkup(counterConfig.title || "Visitors", counterConfig.chip)}
      <div class="counter" id="counter" aria-label="Visitor counter">
        ${digits.map((digit) => `<span data-counter-cell>${escapeText(digit)}</span>`).join("")}
      </div>
      <p class="counter-label">${escapeText(counterConfig.label || "")}</p>
    </section>
  `;
}

function renderButtonBadgeMarkup(item) {
  const tone = sanitizeClassToken(item.tone, "teal");
  return `
    <a class="button-badge button-badge-${tone}" ${renderLinkAttrs(item.href || "#")}>
      <span>${escapeText(item.top || "")}</span>
      <span>${escapeText(item.bottom || "")}</span>
    </a>
  `;
}

function renderButtonsMarkup(buttonConfig) {
  if (!buttonConfig || !Array.isArray(buttonConfig.items)) {
    return "";
  }

  return `
    <section class="box buttons-box">
      ${renderBoxHeadingMarkup(buttonConfig.title || "Buttons", buttonConfig.chip)}
      <div class="button-grid">
        ${buttonConfig.items.map((item) => renderButtonBadgeMarkup(item)).join("")}
      </div>
    </section>
  `;
}

function renderButtonCodeMarkup(buttonCodeConfig) {
  if (!buttonCodeConfig) {
    return "";
  }

  const preview = buttonCodeConfig.preview || { top: "ANXI", bottom: "DEV", tone: "teal" };
  const tone = sanitizeClassToken(preview.tone, "teal");

  return `
    <section class="box buttoncode-box" id="site-button">
      ${renderBoxHeadingMarkup(buttonCodeConfig.title || "Site button", buttonCodeConfig.chip)}
      <div class="button-preview">
        <span class="button-badge button-badge-${tone}">
          <span>${escapeText(preview.top || "")}</span>
          <span>${escapeText(preview.bottom || "")}</span>
        </span>
      </div>
      <textarea class="button-snippet" readonly>${escapeText(buttonCodeConfig.code || "")}</textarea>
      ${buttonCodeConfig.note ? `<p class="button-note">${escapeText(buttonCodeConfig.note)}</p>` : ""}
    </section>
  `;
}

function renderControlsMarkup(controlsConfig) {
  if (!controlsConfig) {
    return "";
  }

  return `
    <section class="box controls-box">
      ${renderBoxHeadingMarkup(controlsConfig.title || "Controls", controlsConfig.chip)}
      <label class="control-row" for="sidebar-rain-toggle">
        <input type="checkbox" id="sidebar-rain-toggle" checked>
        <span>${escapeText(controlsConfig.rainLabel || "Enable rain overlay")}</span>
      </label>
      ${controlsConfig.note ? `<p class="shell-note">${escapeText(controlsConfig.note)}</p>` : ""}
      ${controlsConfig.secondaryNote ? `<p class="shell-note control-row-disabled">${escapeText(controlsConfig.secondaryNote)}</p>` : ""}
    </section>
  `;
}

function renderFooterMarkup(footerText) {
  return `<p>(c) 2024-<span data-year></span> anxidev // ${escapeText(footerText || "all rainy rights reserved")}</p>`;
}

function renderTweaksMarkup() {
  return `
    <button class="tweaks-btn" id="tweaksBtn" type="button">tweaks</button>
    <div class="tweaks-panel" id="tweaksPanel" role="dialog" aria-label="Tweaks">
      <div class="hd">
        <span>TWEAKS</span>
        <button class="tw-close" id="tweaksClose" type="button" aria-label="Close tweaks">x</button>
      </div>
      <div class="bd">
        <div class="tw-row">
          <span id="segThemeLabel">theme</span>
          <div class="seg" id="segTheme" role="group" aria-labelledby="segThemeLabel">
            <button type="button" data-val="dark" aria-pressed="false">DARK</button>
            <button type="button" data-val="light" aria-pressed="false">LIGHT</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderShellMarkup(pageId, pageShell) {
  return {
    header: renderHeaderMarkup(pageShell.header),
    sidebar: [
      renderStarsMarkup(pageId, pageShell.stars),
      renderOnlineMarkup(pageShell.online),
      renderNowMarkup(pageShell.now),
      renderMusicMarkup(pageShell.music),
      renderStatusMarkup(pageShell.status),
      renderCollectionMarkup("findme-box", pageShell.findMe),
      renderCollectionMarkup("interests-box", pageShell.currentInterests),
      renderCollectionMarkup("extras-box", pageShell.extras),
      renderCounterMarkup(pageShell.counter),
      renderButtonsMarkup(pageShell.buttons),
      renderButtonCodeMarkup(pageShell.buttonCode),
      renderControlsMarkup(pageShell.controls),
    ]
      .filter(Boolean)
      .join(""),
    footer: renderFooterMarkup(pageShell.footerText),
    tweaks: renderTweaksMarkup(),
  };
}
