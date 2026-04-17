const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const canvas = document.getElementById("rain-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const toggleBtn = document.getElementById("rain-toggle");
  const sidebarToggle = document.getElementById("sidebar-rain-toggle");
  const STORAGE_KEY = "rain-disabled";
  const state = {
    enabled: localStorage.getItem(STORAGE_KEY) !== "true",
  };
  let rafId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function cssVar(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return raw || fallback;
  }

  function makeDrop(randomY) {
    return {
      x: Math.random() * (canvas.width + 80) - 40,
      y: randomY ? Math.random() * canvas.height : -Math.random() * 180,
      speed: 4 + Math.random() * 4.5,
      length: 14 + Math.random() * 20,
      opacity: 0.14 + Math.random() * 0.26,
      width: 0.7 + Math.random() * 0.9,
      drift: 0.45 + Math.random() * 0.55,
    };
  }

  const drops = Array.from({ length: 110 }, () => makeDrop(true));

  function resetDrop(drop, randomY = false) {
    Object.assign(drop, makeDrop(randomY));
  }

  function setRainEnabled(enabled, persist = true) {
    state.enabled = enabled;
    canvas.classList.toggle("rain-hidden", !enabled);

    if (toggleBtn) {
      toggleBtn.textContent = enabled ? "disable rain" : "enable rain";
      toggleBtn.setAttribute("aria-pressed", enabled ? "true" : "false");
    }

    if (sidebarToggle) {
      sidebarToggle.checked = enabled;
    }

    if (!enabled) {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (rafId === null) {
      drawRain();
    }

    if (persist) {
      localStorage.setItem(STORAGE_KEY, enabled ? "false" : "true");
    }
  }

  function drawRain() {
    if (!state.enabled) {
      rafId = null;
      return;
    }

    const rainRgb = cssVar("--rain-rgb", "112, 189, 255");
    const highlightRgb = cssVar("--rain-highlight-rgb", "228, 247, 255");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const drop of drops) {
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - drop.length * 0.22, drop.y + drop.length);
      ctx.strokeStyle =
        Math.random() > 0.92
          ? `rgba(${highlightRgb}, ${Math.min(drop.opacity + 0.12, 0.6)})`
          : `rgba(${rainRgb}, ${drop.opacity})`;
      ctx.lineWidth = drop.width;
      ctx.stroke();

      drop.x += drop.drift;
      drop.y += drop.speed;

      if (drop.y > canvas.height + drop.length || drop.x > canvas.width + 80) {
        resetDrop(drop);
      }
    }

    rafId = requestAnimationFrame(drawRain);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      setRainEnabled(!state.enabled);
    });
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener("change", (event) => {
      setRainEnabled(event.currentTarget.checked);
    });
  }

  setRainEnabled(state.enabled, false);
}

(function initTweaks() {
  const defaults = window.TWEAK_DEFAULTS;
  if (!defaults) return;

  const root = document.documentElement;
  const state = Object.assign({}, defaults);

  function syncSeg(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    for (const button of el.querySelectorAll("button")) {
      button.classList.toggle("on", button.dataset.val === value);
    }
  }

  function applyTweaks(next) {
    root.dataset.theme = next.theme;
    syncSeg("segTheme", next.theme);
  }

  applyTweaks(state);

  window.addEventListener("message", (event) => {
    const data = event.data || {};
    const btn = document.getElementById("tweaksBtn");
    const panel = document.getElementById("tweaksPanel");
    if (!btn || !panel) return;

    if (data.type === "__activate_edit_mode") {
      btn.classList.add("visible");
      panel.classList.add("open");
    } else if (data.type === "__deactivate_edit_mode") {
      btn.classList.remove("visible");
      panel.classList.remove("open");
    }
  });

  if (window.parent) {
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
  }

  const btn = document.getElementById("tweaksBtn");
  const closeBtn = document.getElementById("tweaksClose");
  const panel = document.getElementById("tweaksPanel");

  if (btn && panel) {
    btn.addEventListener("click", () => panel.classList.toggle("open"));
  }

  if (closeBtn && panel) {
    closeBtn.addEventListener("click", () => panel.classList.remove("open"));
  }

  const segTheme = document.getElementById("segTheme");
  if (segTheme) {
    segTheme.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      state.theme = button.dataset.val;
      applyTweaks(state);
      if (window.parent) {
        window.parent.postMessage(
          {
            type: "__edit_mode_set_keys",
            edits: { theme: state.theme },
          },
          "*",
        );
      }
    });
  }
})();

(function initCounter() {
  const counter = document.getElementById("counter");
  if (!counter) return;

  setInterval(() => {
    const cells = counter.querySelectorAll("span");
    let carry = 1;
    for (let i = cells.length - 1; i >= 0 && carry; i -= 1) {
      let next = Number.parseInt(cells[i].textContent || "0", 10) + carry;
      if (next >= 10) {
        next = 0;
        carry = 1;
      } else {
        carry = 0;
      }
      cells[i].textContent = String(next);
    }
  }, 12000);
})();
