// ── Year ──
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Rain ──
const canvas = document.getElementById('rain-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // 130 drops — each has its own random properties
  const drops = Array.from({ length: 130 }, () => ({
    x:       Math.random() * window.innerWidth,
    y:       Math.random() * window.innerHeight,
    speed:   4.5 + Math.random() * 5.5,
    length:  14 + Math.random() * 20,
    opacity: 0.12 + Math.random() * 0.32,
    width:   0.4 + Math.random() * 0.7,
  }));

  let animRunning = true;
  let rafId = null;

  function drawRain() {
    if (!animRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drops.forEach(d => {
      // Slightly angled drop
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - d.length * 0.14, d.y + d.length);
      ctx.strokeStyle = `rgba(130, 180, 255, ${d.opacity})`;
      ctx.lineWidth = d.width;
      ctx.stroke();

      d.y += d.speed;
      if (d.y > canvas.height + d.length) {
        d.y = -d.length;
        d.x = Math.random() * canvas.width;
      }
    });
    rafId = requestAnimationFrame(drawRain);
  }

  drawRain();

  // ── Toggle ──
  const toggleBtn = document.getElementById('rain-toggle');
  if (toggleBtn) {
    const STORAGE_KEY = 'rain-disabled';

    // Apply saved state on load
    const savedDisabled = localStorage.getItem(STORAGE_KEY) === 'true';
    if (savedDisabled) {
      canvas.classList.add('rain-hidden');
      animRunning = false;
      cancelAnimationFrame(rafId);
      rafId = null;
      toggleBtn.textContent = 'Enable rain';
      toggleBtn.setAttribute('aria-pressed', 'false');
    }

    toggleBtn.addEventListener('click', () => {
      const isHidden = canvas.classList.toggle('rain-hidden');
      if (isHidden) {
        animRunning = false;
        cancelAnimationFrame(rafId);
        rafId = null;
        toggleBtn.textContent = 'Enable rain';
        toggleBtn.setAttribute('aria-pressed', 'false');
        localStorage.setItem(STORAGE_KEY, 'true');
      } else {
        animRunning = true;
        toggleBtn.textContent = 'Disable rain';
        toggleBtn.setAttribute('aria-pressed', 'true');
        localStorage.setItem(STORAGE_KEY, 'false');
        if (rafId === null) drawRain();
      }
    });
  }
}
