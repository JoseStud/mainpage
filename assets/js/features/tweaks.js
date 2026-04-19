import {
  DEFAULT_THEME,
  LIGHT_THEME,
  LIGHT_THEME_MEDIA_QUERY,
  THEME_SOURCE_STORAGE,
  persistThemePreference,
  syncThemeColorMeta,
} from "../config/site.js";

export function initTweaks(defaults, themeController) {
  if (!defaults) {
    return;
  }

  const root = document.documentElement;
  const state = Object.assign({}, defaults);
  const prefersLightTheme =
    typeof window.matchMedia === "function" ? window.matchMedia(LIGHT_THEME_MEDIA_QUERY) : null;

  function syncSegment(id, value) {
    const segment = document.getElementById(id);
    if (!segment) {
      return;
    }

    segment.querySelectorAll("button").forEach((button) => {
      const isActive = button.dataset.val === value;
      button.classList.toggle("on", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function syncThemeToggle(value) {
    const button = document.getElementById("theme-toggle");
    if (!button) {
      return;
    }

    const isLight = value === LIGHT_THEME;
    button.classList.toggle("on", isLight);
    button.setAttribute("aria-pressed", isLight ? "true" : "false");
    button.setAttribute("title", isLight ? "Switch to dark mode" : "Switch to light mode");
  }

  function applyTweaks(nextState, options = {}) {
    const animateTheme = options.animateTheme === true;

    if (themeController) {
      themeController.applyTheme(nextState.theme, { animate: animateTheme });
    } else {
      root.dataset.theme = nextState.theme;
    }

    syncThemeColorMeta(nextState.theme, nextState.themeSource);
    syncSegment("segTheme", nextState.theme);
    syncThemeToggle(nextState.theme);
  }

  function notifyParentTheme() {
    if (!window.parent || window.parent === window) {
      return;
    }

    window.parent.postMessage(
      {
        type: "__edit_mode_set_keys",
        edits: { theme: state.theme },
      },
      "*",
    );
  }

  function setTheme(nextTheme, options = {}) {
    state.theme = nextTheme;
    state.themeSource = options.themeSource || THEME_SOURCE_STORAGE;

    if (options.persist !== false) {
      persistThemePreference(nextTheme);
    }

    applyTweaks(state, { animateTheme: options.animateTheme === true });

    if (options.notifyParent !== false) {
      notifyParentTheme();
    }
  }

  applyTweaks(state, { animateTheme: false });

  window.addEventListener("message", (event) => {
    const data = event.data || {};
    const button = document.getElementById("tweaksBtn");
    const panel = document.getElementById("tweaksPanel");
    if (!button || !panel) {
      return;
    }

    if (data.type === "__activate_edit_mode") {
      button.classList.add("visible");
      panel.classList.add("open");
    } else if (data.type === "__deactivate_edit_mode") {
      button.classList.remove("visible");
      panel.classList.remove("open");
    }
  });

  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
  }

  const button = document.getElementById("tweaksBtn");
  const closeButton = document.getElementById("tweaksClose");
  const panel = document.getElementById("tweaksPanel");
  const searchParams = new URLSearchParams(window.location.search);
  const previewTweaks = searchParams.get("tweaks") === "1" || window.location.hash === "#tweaks";

  if (previewTweaks && button && panel) {
    button.classList.add("visible");
    panel.classList.add("open");
  }

  if (button && panel) {
    button.addEventListener("click", () => {
      panel.classList.toggle("open");
    });
  }

  if (closeButton && panel) {
    closeButton.addEventListener("click", () => {
      panel.classList.remove("open");
    });
  }

  const themeSegment = document.getElementById("segTheme");
  if (themeSegment) {
    themeSegment.addEventListener("click", (event) => {
      const buttonTarget = event.target.closest("button");
      if (!buttonTarget) {
        return;
      }

      setTheme(buttonTarget.dataset.val, { animateTheme: true });
    });
  }

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = state.theme === LIGHT_THEME ? DEFAULT_THEME : LIGHT_THEME;
      setTheme(nextTheme, { animateTheme: nextTheme === LIGHT_THEME });
    });
  }

  const handleSchemeChange = (event) => {
    if (state.themeSource === THEME_SOURCE_STORAGE) {
      return;
    }

    setTheme(event.matches ? LIGHT_THEME : DEFAULT_THEME, {
      animateTheme: false,
      notifyParent: false,
      persist: false,
      themeSource: state.themeSource,
    });
  };

  if (prefersLightTheme) {
    if (typeof prefersLightTheme.addEventListener === "function") {
      prefersLightTheme.addEventListener("change", handleSchemeChange);
    } else if (typeof prefersLightTheme.addListener === "function") {
      prefersLightTheme.addListener(handleSchemeChange);
    }
  }
}
