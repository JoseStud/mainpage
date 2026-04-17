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

function renderStars(pageId, starsConfig) {
  const target = document.querySelector('[data-shell="nav"]');
  if (!target || !starsConfig || !Array.isArray(starsConfig.items)) {
    return;
  }

  const links = starsConfig.items
    .map((item) => {
      const isActive = item.id === pageId;
      const activeClass = isActive ? " active" : "";
      const currentPage = isActive ? ' aria-current="page"' : "";

      return `<a class="navlink${activeClass}"${currentPage} href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`;
    })
    .join("");

  target.innerHTML = `<h2 class="box-title">${escapeHtml(starsConfig.title)}</h2>${links}`;
}

function renderOnline(onlineConfig) {
  const target = document.querySelector('[data-shell="online"]');
  if (!target || !onlineConfig) {
    return;
  }

  target.innerHTML = `
    <span class="presence-kicker">${escapeHtml(onlineConfig.lead || "")}</span>
    <h2 class="presence-title">${escapeHtml(onlineConfig.title || "Online!")}</h2>
    <p class="presence-detail">${escapeHtml(onlineConfig.detail || "")}</p>
    <div class="status-callout">
      <span>local time</span>
      <strong id="local-time">--:--:--</strong>
    </div>
  `;
}

function renderNow(nowConfig) {
  const target = document.querySelector('[data-shell="now"]');
  if (!target || !nowConfig) {
    return;
  }

  target.innerHTML = `
    <span class="side-kicker">${escapeHtml(nowConfig.title || "Last loop")}</span>
    <a class="now-link" href="${escapeHtml(nowConfig.href || "#")}">
      <span id="status-rotator">${escapeHtml(nowConfig.text || "--")}</span>
    </a>
  `;
}

function renderCollection(shellName, config) {
  const target = document.querySelector(`[data-shell="${shellName}"]`);
  if (!target || !config || !Array.isArray(config.items)) {
    return;
  }

  const note = config.note ? `<p class="shell-note">${escapeHtml(config.note)}</p>` : "";
  const items = config.items
    .map((item) => {
      const title = `<span class="shell-item-title">${escapeHtml(item.label || "")}</span>`;
      const meta = item.meta ? `<span class="shell-item-meta">${escapeHtml(item.meta)}</span>` : "";
      const body = `${title}${meta}`;

      if (item.href) {
        const externalAttrs = isExternalHref(item.href) ? ' target="_blank" rel="noreferrer"' : "";
        return `
          <li class="shell-item">
            <a class="shell-link"${externalAttrs} href="${escapeHtml(item.href)}">
              ${body}
            </a>
          </li>
        `;
      }

      return `
        <li class="shell-item">
          <div class="shell-copy">
            ${body}
          </div>
        </li>
      `;
    })
    .join("");

  target.innerHTML = `
    <h2 class="box-title">${escapeHtml(config.title || "")}</h2>
    <ul class="shell-list">${items}</ul>
    ${note}
  `;
}

function renderStatus(statusConfig) {
  const target = document.querySelector('[data-shell="status"]');
  if (!target || !statusConfig) {
    return;
  }

  target.innerHTML = `
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
  `;
}

function renderButtons(buttonConfig) {
  const target = document.querySelector('[data-shell="buttons"]');
  if (!target || !buttonConfig || !Array.isArray(buttonConfig.items)) {
    return;
  }

  const buttons = buttonConfig.items
    .map(
      (item) => `
        <a class="button-badge button-badge-${escapeHtml(item.tone || "teal")}" href="${escapeHtml(item.href)}">
          <span>${escapeHtml(item.top)}</span>
          <span>${escapeHtml(item.bottom)}</span>
        </a>
      `,
    )
    .join("");

  target.innerHTML = `
    <h2 class="box-title">${escapeHtml(buttonConfig.title || "Buttons")}</h2>
    <div class="button-grid">${buttons}</div>
  `;
}

function renderButtonCode(buttonCodeConfig) {
  const target = document.querySelector('[data-shell="buttoncode"]');
  if (!target || !buttonCodeConfig) {
    return;
  }

  const preview = buttonCodeConfig.preview || { top: "ANXI", bottom: "DEV", tone: "teal" };

  target.innerHTML = `
    <h2 class="box-title">${escapeHtml(buttonCodeConfig.title || "My button")}</h2>
    <div class="button-preview">
      <span class="button-badge button-badge-${escapeHtml(preview.tone || "teal")}">
        <span>${escapeHtml(preview.top)}</span>
        <span>${escapeHtml(preview.bottom)}</span>
      </span>
    </div>
    <textarea class="button-snippet" readonly>${escapeHtml(buttonCodeConfig.code || "")}</textarea>
    <p class="button-note">${escapeHtml(buttonCodeConfig.note || "")}</p>
  `;
}

function renderFooter(footerText) {
  const footer = document.querySelector('[data-shell="footer"]');
  if (!footer) {
    return;
  }

  footer.innerHTML = `<p>(c) 2024-${new Date().getFullYear()} anxidev // ${escapeHtml(footerText || "all rainy rights reserved")}</p>`;
}

export function renderShell(pageId, pageShell) {
  renderStars(pageId, pageShell.stars);
  renderOnline(pageShell.online);
  renderCollection("findme", pageShell.findMe);
  renderCollection("interests", pageShell.currentInterests);
  renderNow(pageShell.now);
  renderStatus(pageShell.status);
  renderCollection("extras", pageShell.extras);
  renderButtons(pageShell.buttons);
  renderButtonCode(pageShell.buttonCode);
  renderFooter(pageShell.footerText);
}
