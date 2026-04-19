import { DEFAULT_THEME } from "../config/site.js";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function parseTimeValue(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  if (trimmed.endsWith("ms")) {
    const parsed = Number.parseFloat(trimmed);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  if (trimmed.endsWith("s")) {
    const parsed = Number.parseFloat(trimmed);
    return Number.isFinite(parsed) ? parsed * 1000 : fallback;
  }

  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function createThemeController() {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  let currentTheme = root.dataset.theme || DEFAULT_THEME;
  let targetTheme = currentTheme;
  let activeTransition = null;
  let swapTimer = null;
  let finishTimer = null;

  function clearTimers() {
    if (swapTimer !== null) {
      window.clearTimeout(swapTimer);
      swapTimer = null;
    }

    if (finishTimer !== null) {
      window.clearTimeout(finishTimer);
      finishTimer = null;
    }
  }

  function clearSunriseState() {
    delete root.dataset.themeTransition;
  }

  function emitTransitionState(state, theme) {
    window.dispatchEvent(
      new CustomEvent(`theme-transition-${state}`, {
        detail: {
          theme,
          transition: "sunrise",
        },
      }),
    );
  }

  function setTheme(theme) {
    root.dataset.theme = theme;
    currentTheme = theme;
  }

  function readTimings() {
    const styles = window.getComputedStyle(root);
    return {
      duration: parseTimeValue(styles.getPropertyValue("--sunrise-duration"), 4600),
      swapDelay: parseTimeValue(styles.getPropertyValue("--sunrise-swap-delay"), 2500),
    };
  }

  function finish(theme) {
    const completedTransition = activeTransition;

    clearTimers();
    activeTransition = null;
    clearSunriseState();
    setTheme(theme);
    targetTheme = theme;

    if (completedTransition) {
      emitTransitionState("end", theme);
    }
  }

  function startSunrise() {
    const { duration, swapDelay } = readTimings();

    clearTimers();
    clearSunriseState();
    setTheme(DEFAULT_THEME);
    void root.offsetWidth;
    activeTransition = "sunrise";
    root.dataset.themeTransition = "sunrise";
    emitTransitionState("start", "light");

    swapTimer = window.setTimeout(() => {
      setTheme("light");
      swapTimer = null;
    }, swapDelay);

    finishTimer = window.setTimeout(() => {
      clearSunriseState();
      finishTimer = null;
    }, duration);
  }

  function applyTheme(theme, options = {}) {
    const nextTheme = theme || DEFAULT_THEME;
    const animate = options.animate !== false;

    if (nextTheme === targetTheme && (root.dataset.themeTransition || nextTheme === currentTheme)) {
      return;
    }

    targetTheme = nextTheme;

    if (nextTheme === "light" && animate && !reducedMotion.matches) {
      startSunrise();
      return;
    }

    finish(nextTheme);
  }

  const handleReducedMotionChange = (event) => {
    if (event.matches && root.dataset.themeTransition) {
      finish(targetTheme);
    }
  };

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", handleReducedMotionChange);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(handleReducedMotionChange);
  }

  return {
    applyTheme,
    getTheme() {
      return targetTheme;
    },
  };
}
