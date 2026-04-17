import { getPageShell } from "./config/shell.js";
import { startClock } from "./features/clock.js";
import { startCounter } from "./features/counter.js";
import { initRain } from "./features/rain.js";
import { startStatusRotator } from "./features/status-rotator.js";
import { initTweaks } from "./features/tweaks.js";
import { syncYear } from "./features/year.js";
import { renderShell } from "./ui/shell.js";

const pageId = document.body.dataset.page || "home";
const pageShell = getPageShell(pageId);

renderShell(pageId, pageShell);
syncYear();
initRain();
initTweaks(window.TWEAK_DEFAULTS);
startClock();
startCounter();
startStatusRotator(pageShell.now && pageShell.now.messages);
