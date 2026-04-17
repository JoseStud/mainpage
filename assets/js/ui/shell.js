const LOGO_LETTERS = ["a", "n", "x", "i", "d", "e", "v"];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isExternalHref(href) {
  return /^https?:\/\//.test(href);
}

function renderLinkAttrs(href) {
  const safeHref = escapeHtml(href || "#");
  return isExternalHref(href)
    ? `href="${safeHref}" target="_blank" rel="noreferrer"`
    : `href="${safeHref}"`;
}

function renderLogo() {
  const letters = LOGO_LETTERS.map((letter) => `<span class="logo-letter">${letter}</span>`).join("");
  return `
    <a class="logo-link" href="index.html" aria-label="anxidev home">
      <span class="logo" role="img" aria-label="anxidev">
        ${letters}
      </span>
    </a>
  `;
}

function renderChip(chip) {
  if (!chip) {
    return "";
  }

  if (typeof chip === "string") {
    return `<span class="box-chip">${escapeHtml(chip)}</span>`;
  }

  const className = chip.className || "box-chip";
  if (chip.href) {
    return `<a class="${escapeHtml(className)}" ${renderLinkAttrs(chip.href)}>${escapeHtml(chip.label || "")}</a>`;
  }

  return `<span class="${escapeHtml(className)}">${escapeHtml(chip.label || "")}</span>`;
}

function renderBoxHeading(title, chip) {
  return `
    <div class="box-heading">
      <h2 class="box-title">${escapeHtml(title || "")}</h2>
      ${renderChip(chip)}
    </div>
  `;
}

function renderHeader(headerConfig) {
  const target = document.querySelector('[data-shell="header"]');
  if (!target || !headerConfig) {
    return;
  }

  target.innerHTML = `
    <span class="header-led">${escapeHtml(headerConfig.lead || "")}</span>
    ${renderLogo()}
    <span class="header-sub">${escapeHtml(headerConfig.sub || "")}</span>
  `;
}

function renderStarsSection(pageId, starsConfig) {
  if (!starsConfig || !Array.isArray(starsConfig.items)) {
    return "";
  }

  const links = starsConfig.items
    .map((item) => {
      const isActive = item.id === pageId;
      const currentPage = isActive ? ' aria-current="page"' : "";
      const activeClass = isActive ? " active" : "";
      return `<a class="navlink${activeClass}"${currentPage} ${renderLinkAttrs(item.href)}>${escapeHtml(item.label)}</a>`;
    })
    .join("");

  return `
    <section class="box menu-box">
      ${renderBoxHeading(starsConfig.title || "Stars", starsConfig.chip)}
      <nav aria-label="Primary navigation">
        ${links}
      </nav>
    </section>
  `;
}

function renderOnlineSection(onlineConfig) {
  if (!onlineConfig) {
    return "";
  }

  return `
    <section class="box online-box">
      <span class="presence-kicker">${escapeHtml(onlineConfig.lead || "")}</span>
      <h2 class="presence-title">${escapeHtml(onlineConfig.title || "Online!")}</h2>
      <p class="presence-detail">${escapeHtml(onlineConfig.detail || "")}</p>
      <div class="status-callout">
        <span>local time</span>
        <strong id="local-time">--:--:--</strong>
      </div>
    </section>
  `;
}

function renderNowSection(nowConfig) {
  if (!nowConfig) {
    return "";
  }

  return `
    <section class="box now-box">
      <span class="side-kicker">${escapeHtml(nowConfig.title || "Last loop")}</span>
      <a class="now-link" ${renderLinkAttrs(nowConfig.href || "#")}>
        <span id="status-rotator">${escapeHtml(nowConfig.text || "--")}</span>
      </a>
    </section>
  `;
}

function renderCollectionSection(className, config) {
  if (!config || !Array.isArray(config.items)) {
    return "";
  }

  const items = config.items
    .map((item) => {
      const title = `<span class="shell-item-title">${escapeHtml(item.label || "")}</span>`;
      const meta = item.meta ? `<span class="shell-item-meta">${escapeHtml(item.meta)}</span>` : "";
      const content = `${title}${meta}`;

      if (item.href) {
        return `
          <li class="shell-item">
            <a class="shell-link" ${renderLinkAttrs(item.href)}>
              ${content}
            </a>
          </li>
        `;
      }

      return `
        <li class="shell-item">
          <div class="shell-copy">
            ${content}
          </div>
        </li>
      `;
    })
    .join("");

  const note = config.note ? `<p class="shell-note">${escapeHtml(config.note)}</p>` : "";

  return `
    <section class="box ${escapeHtml(className)}">
      ${renderBoxHeading(config.title || "", config.chip)}
      <ul class="shell-list">
        ${items}
      </ul>
      ${note}
    </section>
  `;
}

function renderStatusSection(statusConfig) {
  if (!statusConfig) {
    return "";
  }

  return `
    <section class="box status-box">
      <span class="status-heading">✧ ${escapeHtml(statusConfig.title || "Current status")}</span>
      <div class="status-card">
        <div class="status-avatar" aria-hidden="true">A</div>
        <div>
          <p class="status-meta">
            <strong>${escapeHtml(statusConfig.author || "anxidev")}</strong>
            <span>• ${escapeHtml(statusConfig.time || "now")}</span>
          </p>
          <p class="status-message">${escapeHtml(statusConfig.text || "")}</p>
        </div>
      </div>
    </section>
  `;
}

function renderCounterSection(counterConfig) {
  if (!counterConfig) {
    return "";
  }

  const digits = Array.isArray(counterConfig.digits)
    ? counterConfig.digits
    : String(counterConfig.digits || "").split("");
  const cells = digits.map((digit) => `<span data-counter-cell>${escapeHtml(digit)}</span>`).join("");

  return `
    <section class="box counter-box">
      ${renderBoxHeading(counterConfig.title || "Visitors", counterConfig.chip)}
      <div class="counter" id="counter" aria-label="Visitor counter">
        ${cells}
      </div>
      <p class="counter-label">${escapeHtml(counterConfig.label || "")}</p>
    </section>
  `;
}

function renderButtonsSection(buttonConfig) {
  if (!buttonConfig || !Array.isArray(buttonConfig.items)) {
    return "";
  }

  const buttons = buttonConfig.items
    .map(
      (item) => `
        <a class="button-badge button-badge-${escapeHtml(item.tone || "teal")}" ${renderLinkAttrs(item.href || "#")}>
          <span>${escapeHtml(item.top || "")}</span>
          <span>${escapeHtml(item.bottom || "")}</span>
        </a>
      `,
    )
    .join("");

  return `
    <section class="box buttons-box">
      ${renderBoxHeading(buttonConfig.title || "Buttons", buttonConfig.chip)}
      <div class="button-grid">
        ${buttons}
      </div>
    </section>
  `;
}

function renderButtonCodeSection(buttonCodeConfig) {
  if (!buttonCodeConfig) {
    return "";
  }

  const preview = buttonCodeConfig.preview || { top: "ANXI", bottom: "DEV", tone: "teal" };
  const note = buttonCodeConfig.note ? `<p class="button-note">${escapeHtml(buttonCodeConfig.note)}</p>` : "";

  return `
    <section class="box buttoncode-box" id="site-button">
      ${renderBoxHeading(buttonCodeConfig.title || "Site button", buttonCodeConfig.chip)}
      <div class="button-preview">
        <span class="button-badge button-badge-${escapeHtml(preview.tone || "teal")}">
          <span>${escapeHtml(preview.top || "")}</span>
          <span>${escapeHtml(preview.bottom || "")}</span>
        </span>
      </div>
      <textarea class="button-snippet" readonly>${escapeHtml(buttonCodeConfig.code || "")}</textarea>
      ${note}
    </section>
  `;
}

function renderControlsSection(controlsConfig) {
  if (!controlsConfig) {
    return "";
  }

  const note = controlsConfig.note ? `<p class="shell-note">${escapeHtml(controlsConfig.note)}</p>` : "";
  const secondaryNote = controlsConfig.secondaryNote
    ? `<p class="shell-note control-row-disabled">${escapeHtml(controlsConfig.secondaryNote)}</p>`
    : "";

  return `
    <section class="box controls-box">
      ${renderBoxHeading(controlsConfig.title || "Controls", controlsConfig.chip)}
      <label class="control-row" for="sidebar-rain-toggle">
        <input type="checkbox" id="sidebar-rain-toggle" checked>
        <span>${escapeHtml(controlsConfig.rainLabel || "Enable rain overlay")}</span>
      </label>
      ${note}
      ${secondaryNote}
    </section>
  `;
}

function renderSidebar(pageId, pageShell) {
  const target = document.querySelector('[data-shell="sidebar"]');
  if (!target || !pageShell) {
    return;
  }

  target.innerHTML = [
    renderStarsSection(pageId, pageShell.stars),
    renderOnlineSection(pageShell.online),
    renderNowSection(pageShell.now),
    renderStatusSection(pageShell.status),
    renderCollectionSection("findme-box", pageShell.findMe),
    renderCollectionSection("interests-box", pageShell.currentInterests),
    renderCollectionSection("extras-box", pageShell.extras),
    renderCounterSection(pageShell.counter),
    renderButtonsSection(pageShell.buttons),
    renderButtonCodeSection(pageShell.buttonCode),
    renderControlsSection(pageShell.controls),
  ]
    .filter(Boolean)
    .join("");
}

function renderFooter(footerText) {
  const footer = document.querySelector('[data-shell="footer"]');
  if (!footer) {
    return;
  }

  footer.innerHTML = `
    <p>(c) 2024-<span data-year></span> anxidev // ${escapeHtml(footerText || "all rainy rights reserved")}</p>
  `;
}

function renderTweaks() {
  const target = document.querySelector('[data-shell="tweaks"]');
  if (!target) {
    return;
  }

  target.innerHTML = `
    <button class="tweaks-btn" id="tweaksBtn" type="button">tweaks</button>
    <div class="tweaks-panel" id="tweaksPanel" role="dialog" aria-label="Tweaks">
      <div class="hd">
        <span>TWEAKS</span>
        <button class="tw-close" id="tweaksClose" type="button" aria-label="Close tweaks">x</button>
      </div>
      <div class="bd">
        <div class="tw-row">
          <label for="segTheme">theme</label>
          <div class="seg" id="segTheme" role="group" aria-label="Theme">
            <button type="button" data-val="dark">DARK</button>
            <button type="button" data-val="light">LIGHT</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderShell(pageId, pageShell) {
  renderHeader(pageShell.header);
  renderSidebar(pageId, pageShell);
  renderFooter(pageShell.footerText);
  renderTweaks();
}
