import { renderFooter, renderHeader, renderSidebar, renderTweaks } from "./shell-sections.js";

export function renderShell(pageId, pageShell) {
  renderHeader(pageShell.header);
  renderSidebar(pageId, pageShell);
  renderFooter(pageShell.footerText);
  renderTweaks();
}
