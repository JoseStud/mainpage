import { pageShells } from "./page-shells.js";

export function getPageShell(pageId) {
  return pageShells[pageId] || pageShells.home;
}
