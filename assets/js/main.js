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
import { ensurePageFrame } from "./ui/page-frame.js";
import { renderShell } from "./ui/shell.js";

const pageId = document.body.dataset.page || "home";
const tweaks = getInitialTweaks();

ensurePageFrame();

const pageShell = getPageShell(pageId);
const themeController = createThemeController();

themeController.applyTheme(tweaks.theme, { animate: false });

renderShell(pageId, pageShell);
syncYear();
initBackgroundSprinkles();
initRain();
initTweaks(tweaks, themeController);
startClock();
startCounter();
startStatusRotator(pageShell.now && pageShell.now.messages);
startScrobbleNowPlaying(pageShell.music);
