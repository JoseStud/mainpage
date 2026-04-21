export const DEFAULT_THEME = "dark";
export const LIGHT_THEME = "light";
export const THEME_STORAGE_KEY = "theme";
export const THEME_SOURCE_SYSTEM = "system";
export const THEME_SOURCE_STORAGE = "storage";
export const LIGHT_THEME_MEDIA_QUERY = "(prefers-color-scheme: light)";
export const THEME_COLOR_MEDIA = Object.freeze({
  dark: "(prefers-color-scheme: dark)",
  light: LIGHT_THEME_MEDIA_QUERY,
});

export const DEFAULT_TWEAKS = Object.freeze({
  theme: DEFAULT_THEME,
  themeSource: THEME_SOURCE_SYSTEM,
});

function normalizeTheme(value) {
  if (value === LIGHT_THEME || value === DEFAULT_THEME) {
    return value;
  }

  return null;
}

export function getStoredThemePreference() {
  try {
    return normalizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch (_error) {
    return null;
  }
}

export function getSystemThemePreference() {
  if (typeof window.matchMedia === "function" && window.matchMedia(LIGHT_THEME_MEDIA_QUERY).matches) {
    return LIGHT_THEME;
  }

  return DEFAULT_THEME;
}

export function resolveThemePreference() {
  const storedTheme = getStoredThemePreference();

  return {
    theme: storedTheme || getSystemThemePreference(),
    themeSource: storedTheme ? THEME_SOURCE_STORAGE : THEME_SOURCE_SYSTEM,
  };
}

export function persistThemePreference(theme) {
  const nextTheme = normalizeTheme(theme);
  if (!nextTheme) {
    return;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch (_error) {
    // Ignore storage write failures in private or restricted contexts.
  }
}

export function syncThemeColorMeta(theme, themeSource = THEME_SOURCE_STORAGE) {
  const nextTheme = normalizeTheme(theme) || DEFAULT_THEME;
  const followSystem = themeSource !== THEME_SOURCE_STORAGE;

  document.querySelectorAll('meta[name="theme-color"][data-theme-color]').forEach((meta) => {
    const metaTheme = meta.getAttribute("data-theme-color");
    if (!metaTheme) {
      return;
    }

    meta.setAttribute(
      "media",
      followSystem ? THEME_COLOR_MEDIA[metaTheme] || "not all" : metaTheme === nextTheme ? "all" : "not all",
    );
  });
}

export function getInitialTweaks() {
  const injectedTweaks =
    window.TWEAK_DEFAULTS && typeof window.TWEAK_DEFAULTS === "object" ? window.TWEAK_DEFAULTS : {};
  const resolvedTweaks = resolveThemePreference();

  return {
    ...DEFAULT_TWEAKS,
    ...resolvedTweaks,
    ...injectedTweaks,
  };
}
