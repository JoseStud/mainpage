import { DEFAULT_THEME } from "../config/site.js";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const TRANSITION_DEBUG_STORAGE_KEY = "theme-transition-debug";
const TRANSITION_DEBUG_QUERY_KEYS = ["themeDebug", "theme-debug", "sunriseDebug"];
const LIGHT_DEBUG_BODY_CHANNELS = "184, 216, 240";
const DARK_DEBUG_BODY_CHANNELS = "26, 4, 56";
const LIGHT_DEBUG_PANEL_CHANNELS = "240, 248, 255";
const DARK_DEBUG_PANEL_CHANNELS = "14, 4, 22";
const LIGHT_THEME_SNAPSHOT = {
  "--bg": "#a8d0ee",
  "--bg-2": "#f0f8ff",
  "--starfield-base": "#a8d0ee",
  "--starfield-base-rgb": "168 208 238",
  "--starfield-deep": "#c4e0f4",
  "--starfield-deep-rgb": "196 224 244",
  "--starfield-glow": "#f8fcff",
  "--starfield-glow-rgb": "248 252 255",
  "--starfield-star": "#ffffff",
  "--starfield-star-rgb": "255 255 255",
  "--scene-halo": "rgb(255 249 241 / 0.54)",
  "--scene-stop-0": "#a8d0ee",
  "--scene-stop-1": "#b8d8f0",
  "--scene-stop-2": "#c4e0f4",
  "--scene-stop-3": "#d4ecff",
  "--scene-stop-4": "#e2f4ff",
  "--scene-stop-5": "#f0f8ff",
  "--scene-stop-6": "#f8fcff",
  "--scene-stop-7": "#ffffff",
  "--panel": "rgb(240 248 255 / 0.82)",
  "--panel-strong": "rgb(248 252 255 / 0.9)",
  "--panel-edge": "#8ab0d0",
  "--panel-edge-rgb": "138 176 208",
  "--text": "#2a1a10",
  "--text-strong": "#1a0e08",
  "--text-strong-rgb": "26 14 8",
  "--muted": "#7a6050",
  "--muted-rgb": "122 96 80",
  "--line": "rgb(130 170 210 / 0.5)",
  "--accent": "#b05820",
  "--accent-rgb": "176 88 32",
  "--accent-highlight": "#d88040",
  "--accent-highlight-rgb": "216 128 64",
  "--accent-contrast": "#8a4219",
  "--accent-contrast-rgb": "138 66 25",
  "--accent-soft": "var(--accent-highlight)",
  "--accent-dim": "#e2f4ff",
  "--moon": "#c04828",
  "--moon-rgb": "192 72 40",
  "--ok": "#228844",
  "--ok-rgb": "34 136 68",
  "--warn": "#8d3122",
  "--logo-ink": "#8a4219",
  "--logo-glow-rgb": "176 88 32",
  "--logo-sheen-rgb": "240 248 255",
  "--logo-glow": "rgba(176, 88, 32, 0.52)",
  "--logo-sheen": "rgba(240, 248, 255, 0.88)",
  "--shadow": "0 2px 16px rgba(100, 160, 220, 0.18)",
  "--panel-blur": "12px",
  "--panel-shadow-glow": "rgba(100, 160, 220, 0.18)",
  "--panel-shadow-depth": "rgba(84, 126, 166, 0.16)",
  "--panel-shadow-glow-blur": "0px",
  "--panel-shadow-depth-y": "2px",
  "--panel-shadow-depth-blur": "16px",
  "--panel-sheen": "rgba(255, 255, 255, 0.62)",
  "--panel-wash": "rgba(216, 128, 64, 0.08)",
  "--screen-shadow": "none",
  "--green-shadow": "0 10px 24px rgba(34, 136, 68, 0.1)",
};
const LIGHT_THEME_SNAPSHOT_KEYS = Object.keys(LIGHT_THEME_SNAPSHOT);

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

function formatDebugValue(value) {
  if (typeof value !== "string") {
    return value ?? null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed.replace(/\s+/g, " ") : null;
}

function resolveColorValue(value) {
  const formatted = formatDebugValue(value);
  if (!formatted || !document.body) {
    return formatted;
  }

  if (typeof CSS !== "undefined" && typeof CSS.supports === "function" && !CSS.supports("color", formatted)) {
    return formatted;
  }

  const probe = document.createElement("span");
  probe.style.display = "none";
  probe.style.color = formatted;

  if (!probe.style.color) {
    return formatted;
  }

  document.body.append(probe);
  const resolved = formatDebugValue(window.getComputedStyle(probe).color);
  probe.remove();
  return resolved || formatted;
}

function colorValuesMatch(expected, actual) {
  const resolvedExpected = resolveColorValue(expected);
  const resolvedActual = resolveColorValue(actual);

  return Boolean(resolvedExpected && resolvedActual && resolvedExpected === resolvedActual);
}

function shortenDebugValue(value, maxLength = 220) {
  if (typeof value !== "string" || value.length <= maxLength) {
    return value ?? null;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}

function hasColorChannels(value, channels) {
  return typeof value === "string" && value.includes(channels);
}

function readActiveStylesheets() {
  return Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map((node) => node.getAttribute("href") || node.href)
    .filter(Boolean)
    .map((href) => formatDebugValue(href));
}

function detectTransitionDebugIssue(snapshot) {
  const issues = [];
  const themeIsLight = snapshot.theme === "light";
  const transitionComplete = !snapshot.transition;
  const bodyLooksLight = hasColorChannels(snapshot.bodyBgColor, LIGHT_DEBUG_BODY_CHANNELS);
  const bodyLooksDark = hasColorChannels(snapshot.bodyBgColor, DARK_DEBUG_BODY_CHANNELS);
  const panelLooksLight = hasColorChannels(snapshot.boxBgColor, LIGHT_DEBUG_PANEL_CHANNELS);
  const panelLooksDark = hasColorChannels(snapshot.boxBgColor, DARK_DEBUG_PANEL_CHANNELS);
  const sceneVarLooksLight =
    hasColorChannels(snapshot.sceneStop1, LIGHT_DEBUG_BODY_CHANNELS) ||
    (typeof snapshot.sceneStop1 === "string" && snapshot.sceneStop1.includes("#b8d8f0"));
  const panelVarLooksLight =
    typeof snapshot.panelVar === "string" &&
    snapshot.panelVar.includes("240 248 255") &&
    snapshot.panelVar.includes("0.82");
  const stylesheetSwapActive =
    snapshot.stylesheets.length > 1 &&
    snapshot.stylesheets.some((href) => typeof href === "string" && href.includes("theme_refresh="));

  if (themeIsLight && sceneVarLooksLight && !bodyLooksLight) {
    issues.push(bodyLooksDark ? "body-paint-stuck-dark" : "body-paint-out-of-sync");
  }

  if (themeIsLight && panelVarLooksLight && !panelLooksLight) {
    issues.push(panelLooksDark ? "panel-paint-stuck-dark" : "panel-paint-out-of-sync");
  }

  if (themeIsLight && snapshot.skyOpacity === "1" && !bodyLooksLight) {
    issues.push("sky-finished-before-body");
  }

  if (transitionComplete && stylesheetSwapActive) {
    issues.push("stylesheet-refresh-active");
  }

  return issues.length ? issues.join(",") : null;
}

function isTransitionDebugEnabled() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (TRANSITION_DEBUG_QUERY_KEYS.some((key) => params.has(key))) {
      return true;
    }

    return window.localStorage.getItem(TRANSITION_DEBUG_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function createTransitionDebugger(root) {
  const enabled = isTransitionDebugEnabled();
  const debugLog = Array.isArray(window.__themeTransitionDebugLog) ? window.__themeTransitionDebugLog : [];
  window.__themeTransitionDebugLog = debugLog;
  window.__themeTransitionDebugEnabled = enabled;

  let activeRun = null;
  let animationFrame = null;
  let sequence = debugLog.length;
  let postFinishTimers = [];

  function clearSampleLoop() {
    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }

  function clearPostFinishTimers() {
    postFinishTimers.forEach((timer) => window.clearTimeout(timer));
    postFinishTimers = [];
  }

  function capture(phase, extra = {}) {
    if (!enabled) {
      return null;
    }

    const body = document.body;
    const box = document.querySelector(".box") || document.querySelector(".utility-toggle");
    const sky = document.querySelector(".bg-sky-day");
    const photo = document.querySelector(".bg-photo");
    const photoBackdrop = document.querySelector(".bg-photo-backdrop");
    const rootStyles = window.getComputedStyle(root);
    const bodyStyles = body ? window.getComputedStyle(body) : null;
    const boxStyles = box ? window.getComputedStyle(box) : null;

    const snapshot = {
      seq: ++sequence,
      phase,
      t: activeRun ? Math.round(performance.now() - activeRun.startedAt) : null,
      theme: root.dataset.theme || null,
      transition: root.dataset.themeTransition || null,
      resolved: root.dataset.themeResolved || null,
      sceneStop1: formatDebugValue(rootStyles.getPropertyValue("--scene-stop-1")),
      panelVar: formatDebugValue(rootStyles.getPropertyValue("--panel")),
      bodyBgColor: bodyStyles ? formatDebugValue(bodyStyles.backgroundColor) : null,
      bodyBgImage: bodyStyles
        ? shortenDebugValue(formatDebugValue(bodyStyles.backgroundImage))
        : null,
      bodyBeforeOpacity: body ? formatDebugValue(window.getComputedStyle(body, "::before").opacity) : null,
      bodyAfterOpacity: body ? formatDebugValue(window.getComputedStyle(body, "::after").opacity) : null,
      boxBgColor: boxStyles ? formatDebugValue(boxStyles.backgroundColor) : null,
      boxBgImage: boxStyles
        ? shortenDebugValue(formatDebugValue(boxStyles.backgroundImage))
        : null,
      boxBackdropFilter: boxStyles ? formatDebugValue(boxStyles.backdropFilter) : null,
      skyOpacity: sky ? formatDebugValue(window.getComputedStyle(sky).opacity) : null,
      photoBeforeOpacity: photo ? formatDebugValue(window.getComputedStyle(photo, "::before").opacity) : null,
      photoBackdropOpacity: photoBackdrop ? formatDebugValue(window.getComputedStyle(photoBackdrop).opacity) : null,
      photoScrimOpacity: photo ? formatDebugValue(window.getComputedStyle(photo, "::after").opacity) : null,
      stylesheets: readActiveStylesheets(),
    };

    Object.assign(snapshot, extra);
    snapshot.issue = detectTransitionDebugIssue(snapshot);
    debugLog.push(snapshot);
    console.info("[theme-transition]", snapshot);
    window.dispatchEvent(
      new CustomEvent("theme-transition-debug-snapshot", {
        detail: snapshot,
      }),
    );
    return snapshot;
  }

  function step() {
    if (!enabled || !activeRun) {
      return;
    }

    const now = performance.now();
    if (now - activeRun.lastSampleAt >= 48) {
      activeRun.lastSampleAt = now;
      capture("raf");
    }

    animationFrame = window.requestAnimationFrame(step);
  }

  function start(theme, duration) {
    if (!enabled) {
      return;
    }

    clearSampleLoop();
    clearPostFinishTimers();

    activeRun = {
      theme,
      duration,
      startedAt: performance.now(),
      lastSampleAt: Number.NEGATIVE_INFINITY,
    };

    capture("start", { duration });
    animationFrame = window.requestAnimationFrame(step);
  }

  function mark(phase, extra = {}) {
    capture(phase, extra);
  }

  function finish(reason) {
    if (!enabled) {
      return;
    }

    clearSampleLoop();
    clearPostFinishTimers();
    capture("stop", { reason });
    activeRun = null;
  }

  function schedulePostFinish(reason) {
    if (!enabled || !activeRun) {
      return;
    }

    clearSampleLoop();
    clearPostFinishTimers();

    const delays = [0, 48, 120, 240, 480, 960];
    delays.forEach((delay, index) => {
      const timer = window.setTimeout(() => {
        capture(`post-finish@${delay}ms`, { reason });
        if (index === delays.length - 1) {
          finish("post-finish-complete");
        }
      }, delay);
      postFinishTimers.push(timer);
    });
  }

  return {
    enabled,
    finish,
    mark,
    schedulePostFinish,
    start,
  };
}

export function createThemeController() {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  const transitionDebugger = createTransitionDebugger(root);
  let currentTheme = root.dataset.theme || DEFAULT_THEME;
  let targetTheme = currentTheme;
  let activeTransition = null;
  let finishTimer = null;
  let stylesheetRefreshToken = 0;
  let stylesheetRefreshInFlight = false;
  let stylesheetRefreshHandle = null;

  function clearScheduledStylesheetRefresh() {
    if (!stylesheetRefreshHandle) {
      return;
    }

    if (stylesheetRefreshHandle.type === "idle" && typeof window.cancelIdleCallback === "function") {
      window.cancelIdleCallback(stylesheetRefreshHandle.id);
    } else {
      window.clearTimeout(stylesheetRefreshHandle.id);
    }

    stylesheetRefreshHandle = null;
  }

  function clearTimers() {
    if (finishTimer !== null) {
      window.clearTimeout(finishTimer);
      finishTimer = null;
    }

    clearScheduledStylesheetRefresh();
  }

  function clearSunriseState() {
    delete root.dataset.themeTransition;
    transitionDebugger.mark("sunrise-state-cleared");
  }

  function syncResolvedTheme(theme) {
    if (theme === "light") {
      root.dataset.themeResolved = "light";
      return;
    }

    delete root.dataset.themeResolved;
  }

  function syncResolvedThemeSnapshot(theme) {
    if (theme === "light") {
      Object.entries(LIGHT_THEME_SNAPSHOT).forEach(([name, value]) => {
        root.style.setProperty(name, value);
      });
      return;
    }

    LIGHT_THEME_SNAPSHOT_KEYS.forEach((name) => {
      root.style.removeProperty(name);
    });
  }

  function needsStylesheetRefresh(theme) {
    if (theme !== "light") {
      return false;
    }

    const body = document.body;
    const box = document.querySelector(".box") || document.querySelector(".utility-toggle");
    if (!body) {
      return false;
    }

    const rootStyles = window.getComputedStyle(root);
    const bodyStyles = window.getComputedStyle(body);
    const boxStyles = box ? window.getComputedStyle(box) : null;
    const expectedBodyColor = formatDebugValue(rootStyles.getPropertyValue("--scene-stop-1"));
    const expectedPanelToken = box && box.classList.contains("utility-toggle") ? "--panel-strong" : "--panel";
    const expectedPanelColor = formatDebugValue(rootStyles.getPropertyValue(expectedPanelToken));
    const bodyColor = formatDebugValue(bodyStyles.backgroundColor);
    const boxColor = boxStyles ? formatDebugValue(boxStyles.backgroundColor) : null;
    const resolvedExpectedBodyColor = resolveColorValue(expectedBodyColor);
    const resolvedExpectedPanelColor = resolveColorValue(expectedPanelColor);
    const resolvedBodyColor = resolveColorValue(bodyColor);
    const resolvedBoxColor = resolveColorValue(boxColor);
    const bodyNeedsRefresh = !colorValuesMatch(expectedBodyColor, bodyColor);
    const boxNeedsRefresh = Boolean(boxStyles) && !colorValuesMatch(expectedPanelColor, boxColor);

    transitionDebugger.mark("stylesheet-refresh:check", {
      bodyNeedsRefresh,
      boxNeedsRefresh,
      expectedBodyColor,
      expectedPanelColor,
      resolvedExpectedBodyColor,
      resolvedExpectedPanelColor,
      resolvedBodyColor,
      resolvedBoxColor,
    });

    return bodyNeedsRefresh || boxNeedsRefresh;
  }

  function refreshThemeStylesheet(theme) {
    if (theme !== "light" || stylesheetRefreshInFlight) {
      return;
    }

    if (!needsStylesheetRefresh(theme)) {
      transitionDebugger.mark("stylesheet-refresh:skipped");
      return;
    }

    const stylesheet = document.querySelector('link[rel="stylesheet"][href*="assets/css/styles.css"]');
    if (!(stylesheet instanceof HTMLLinkElement) || !stylesheet.href) {
      return;
    }

    stylesheetRefreshInFlight = true;
    transitionDebugger.mark("stylesheet-refresh:start", {
      stylesheetHref: formatDebugValue(stylesheet.getAttribute("href") || stylesheet.href),
    });

    const refreshed = stylesheet.cloneNode();
    const nextUrl = new URL(stylesheet.href, window.location.href);
    nextUrl.searchParams.set("theme_refresh", String(++stylesheetRefreshToken));
    refreshed.href = nextUrl.toString();

    const settle = () => {
      stylesheetRefreshInFlight = false;
    };

    refreshed.addEventListener(
      "load",
      () => {
        stylesheet.remove();
        settle();
        transitionDebugger.mark("stylesheet-refresh:load", {
          stylesheetHref: formatDebugValue(refreshed.getAttribute("href") || refreshed.href),
        });
      },
      { once: true },
    );

    refreshed.addEventListener(
      "error",
      () => {
        refreshed.remove();
        settle();
        transitionDebugger.mark("stylesheet-refresh:error", {
          stylesheetHref: formatDebugValue(refreshed.getAttribute("href") || refreshed.href),
        });
      },
      { once: true },
    );

    stylesheet.after(refreshed);
  }

  function scheduleThemeStylesheetRefresh(theme) {
    if (theme !== "light") {
      return;
    }

    clearScheduledStylesheetRefresh();

    const runRefresh = () => {
      stylesheetRefreshHandle = null;
      refreshThemeStylesheet(theme);
    };

    if (typeof window.requestIdleCallback === "function") {
      stylesheetRefreshHandle = {
        type: "idle",
        id: window.requestIdleCallback(runRefresh, { timeout: 500 }),
      };
    } else {
      stylesheetRefreshHandle = {
        type: "timeout",
        id: window.setTimeout(runRefresh, 180),
      };
    }

    transitionDebugger.mark("stylesheet-refresh:scheduled", { theme });
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

  function readDuration() {
    const styles = window.getComputedStyle(root);
    return parseTimeValue(styles.getPropertyValue("--sunrise-duration"), 3200);
  }

  function finish(theme) {
    const completedTransition = activeTransition;
    const skipResolvedSnapshot = completedTransition === "sunrise" && theme === "light";

    clearTimers();
    transitionDebugger.mark("finish:start", {
      completedTransition,
      targetTheme: theme,
    });
    activeTransition = null;
    setTheme(theme);
    clearSunriseState();
    syncResolvedTheme(theme);

    if (skipResolvedSnapshot) {
      transitionDebugger.mark("finish:snapshot-skipped", { theme });
    } else {
      syncResolvedThemeSnapshot(theme);
      transitionDebugger.mark("finish:after-snapshot");
      scheduleThemeStylesheetRefresh(theme);
      transitionDebugger.mark("finish:after-refresh-schedule");
    }

    targetTheme = theme;

    if (completedTransition) {
      emitTransitionState("end", theme);
      transitionDebugger.mark("finish:event-emitted");
      transitionDebugger.schedulePostFinish("transition-ended");
    }
  }

  function startSunrise() {
    const duration = readDuration();

    clearTimers();
    clearSunriseState();
    syncResolvedTheme("dark");
    syncResolvedThemeSnapshot("dark");
    activeTransition = "sunrise";
    root.dataset.themeTransition = "sunrise";
    transitionDebugger.start("light", duration);
    transitionDebugger.mark("sunrise:armed");
    emitTransitionState("start", "light");

    if (duration <= 0) {
      finish("light");
      return;
    }

    // Keep the broad theme cascade dark while the sunrise runs. Only fixed
    // background layers animate; the light theme is applied once in finish().
    transitionDebugger.mark("sunrise:background-only");

    // Small buffer past the CSS animation end so the background layers are on
    // their final frame before the one-time light theme swap.
    finishTimer = window.setTimeout(() => {
      finishTimer = null;
      finish("light");
    }, duration + 120);
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

  syncResolvedTheme(currentTheme);
  syncResolvedThemeSnapshot(currentTheme);

  return {
    applyTheme,
    getTheme() {
      return targetTheme;
    },
  };
}
