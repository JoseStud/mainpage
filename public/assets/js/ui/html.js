const FALLBACK_HREF = "#";
const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);
const EXTERNAL_PROTOCOLS = new Set(["http:", "https:"]);
const SCHEME_PATTERN = /^[a-zA-Z][a-zA-Z\d+.-]*:/;

function getBaseHref() {
  if (typeof document !== "undefined" && typeof document.baseURI === "string" && document.baseURI) {
    return document.baseURI;
  }

  if (typeof window !== "undefined" && window.location && typeof window.location.href === "string") {
    return window.location.href;
  }

  return "https://example.invalid/";
}

function hasScheme(value) {
  return SCHEME_PATTERN.test(value);
}

export function sanitizeHref(href) {
  const nextHref = typeof href === "string" ? href.trim() : "";
  if (!nextHref || nextHref.startsWith("//")) {
    return FALLBACK_HREF;
  }

  if (
    nextHref.startsWith("#") ||
    nextHref.startsWith("?") ||
    nextHref.startsWith("/") ||
    nextHref.startsWith("./") ||
    nextHref.startsWith("../")
  ) {
    return nextHref;
  }

  try {
    const parsed = new URL(nextHref, getBaseHref());
    if (!hasScheme(nextHref)) {
      return nextHref;
    }

    return SAFE_PROTOCOLS.has(parsed.protocol) ? nextHref : FALLBACK_HREF;
  } catch {
    return FALLBACK_HREF;
  }
}

export function isExternalHref(href) {
  const safeHref = sanitizeHref(href);
  if (!safeHref || safeHref === FALLBACK_HREF || !hasScheme(safeHref)) {
    return false;
  }

  try {
    const parsed = new URL(safeHref, getBaseHref());
    return EXTERNAL_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
}

export function applyLinkHref(anchor, href) {
  const safeHref = sanitizeHref(href);
  anchor.setAttribute("href", safeHref);

  if (isExternalHref(safeHref)) {
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noreferrer");
    return anchor;
  }

  anchor.removeAttribute("target");
  anchor.removeAttribute("rel");
  return anchor;
}
