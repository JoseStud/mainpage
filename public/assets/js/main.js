import { getInitialTweaks } from "./config/site.js";
import { getPageShell } from "./config/shell.js";
import { initBackgroundSprinkles } from "./features/background-sprinkles.js";
import { startClock } from "./features/clock.js";
import { startCounter } from "./features/counter.js";
import { startScrobbleNowPlaying } from "./features/music-now.js";
import { initRain } from "./features/rain.js";
import { startStatusRotator } from "./features/status-rotator.js";
import { createThemeController } from "./features/theme-transition.js";
import { initTweaks } from "./features/tweaks.js";
import { syncYear } from "./features/year.js";
import { renderShell } from "./ui/shell.js";

const pageId = document.body.dataset.page || "home";
const pageRuntime = window.PAGE_RUNTIME && typeof window.PAGE_RUNTIME === "object" ? window.PAGE_RUNTIME : {};
const showPageChrome = pageRuntime.showPageChrome !== false;
const tweaks = getInitialTweaks();

const pageShell = getPageShell(pageId);
const themeController = createThemeController();

themeController.applyTheme(tweaks.theme, { animate: false });

if (showPageChrome) {
  renderShell(pageId, pageShell);
  syncYear();
}

if (pageRuntime.enableBackgroundSprinkles !== false) {
  initBackgroundSprinkles({
    types: pageRuntime.backgroundSprinkleTypes,
  });
}

if (pageRuntime.enableRain !== false) {
  initRain();
}

if (showPageChrome) {
  initTweaks(tweaks, themeController);
  startClock();
  startCounter();
  startStatusRotator(pageShell.now && pageShell.now.messages);
  startScrobbleNowPlaying(pageShell.music);
}

if (pageRuntime.autoSunrise === true && tweaks.theme !== "light") {
  const autoSunriseDelayMs = Number.isFinite(pageRuntime.autoSunriseDelayMs)
    ? pageRuntime.autoSunriseDelayMs
    : 160;

  window.requestAnimationFrame(() => {
    window.setTimeout(() => {
      themeController.applyTheme("light", { animate: true });
    }, autoSunriseDelayMs);
  });
}
