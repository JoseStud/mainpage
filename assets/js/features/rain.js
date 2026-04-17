const STORAGE_KEY = "rain-disabled";
const MOBILE_BREAKPOINT = 700;
const MOBILE_DROP_COUNT = 72;
const DESKTOP_DROP_COUNT = 180;

function getDropCount() {
  const baseCount = window.innerWidth < MOBILE_BREAKPOINT ? MOBILE_DROP_COUNT : DESKTOP_DROP_COUNT;
  const hardwareThreads = navigator.hardwareConcurrency || 0;

  if (hardwareThreads > 0 && hardwareThreads <= 4) {
    return Math.max(48, Math.round(baseCount * 0.72));
  }

  return baseCount;
}

function createDrop(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    speed: 3.8 + Math.random() * 4.6,
    length: 14 + Math.random() * 22,
    opacity: 0.24 + Math.random() * 0.34,
    drift: 0.9 + Math.random() * 1.4,
    width: 0.85 + Math.random() * 1.15,
  };
}

function createDrops(width, height) {
  return Array.from({ length: getDropCount() }, () => createDrop(width, height));
}

export function initRain() {
  const canvas = document.getElementById("rain-canvas");
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const toggleButton = document.getElementById("rain-toggle");
  const sidebarToggle = document.getElementById("sidebar-rain-toggle");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const saveDataEnabled = Boolean(navigator.connection && navigator.connection.saveData);
  let drops = [];
  let animationFrame = null;
  let rainEnabled = true;

  ctx.lineCap = "round";

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drops = createDrops(canvas.width, canvas.height);
  }

  function drawRain() {
    if (!rainEnabled) {
      animationFrame = null;
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drops.forEach((drop) => {
      ctx.shadowBlur = 6;
      ctx.shadowColor = `rgba(215, 235, 255, ${Math.min(drop.opacity, 0.3)})`;

      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - drop.length * 0.18, drop.y + drop.length);
      ctx.strokeStyle = `rgba(150, 190, 240, ${drop.opacity * 0.45})`;
      ctx.lineWidth = drop.width + 0.9;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - drop.length * 0.18, drop.y + drop.length);
      ctx.strokeStyle = `rgba(236, 245, 255, ${drop.opacity})`;
      ctx.lineWidth = drop.width;
      ctx.stroke();

      drop.x -= drop.drift * 0.22;
      drop.y += drop.speed;

      if (drop.y > canvas.height + drop.length || drop.x < -drop.length) {
        drop.x = Math.random() * (canvas.width + 80);
        drop.y = -drop.length;
      }
    });

    animationFrame = window.requestAnimationFrame(drawRain);
  }

  function stopRain() {
    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function startRain() {
    if (animationFrame === null) {
      drawRain();
    }
  }

  function syncControls() {
    if (toggleButton) {
      toggleButton.textContent = rainEnabled ? "Disable rain" : "Enable rain";
      toggleButton.setAttribute("aria-pressed", rainEnabled ? "true" : "false");
    }

    if (sidebarToggle) {
      sidebarToggle.checked = rainEnabled;
    }
  }

  function setRainState(enabled, persist = true) {
    rainEnabled = enabled;
    canvas.classList.toggle("rain-hidden", !enabled);
    syncControls();

    if (persist) {
      window.localStorage.setItem(STORAGE_KEY, enabled ? "false" : "true");
    }

    if (enabled) {
      startRain();
      return;
    }

    stopRain();
  }

  resizeCanvas();
  document.body.classList.add("rain-ready");

  window.addEventListener("resize", resizeCanvas, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopRain();
      return;
    }

    if (rainEnabled) {
      startRain();
    }
  });

  const savedDisabled = window.localStorage.getItem(STORAGE_KEY) === "true";
  const autoStartEnabled = !prefersReducedMotion.matches && !saveDataEnabled;
  setRainState(!savedDisabled && autoStartEnabled, false);

  const handleReducedMotionChange = (event) => {
    if (event.matches) {
      setRainState(false, false);
    }
  };

  if (typeof prefersReducedMotion.addEventListener === "function") {
    prefersReducedMotion.addEventListener("change", handleReducedMotionChange);
  } else if (typeof prefersReducedMotion.addListener === "function") {
    prefersReducedMotion.addListener(handleReducedMotionChange);
  }

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      setRainState(!rainEnabled);
    });
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener("change", () => {
      setRainState(sidebarToggle.checked);
    });
  }
}
