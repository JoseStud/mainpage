# dimden.dev-Style Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the static personal site to match dimden.dev's aesthetic — animated rain background, per-letter animated logo, profile picture, and a three-column content layout.

**Architecture:** Pure static HTML/CSS/JS — no build step, no framework. CSS is rewritten from scratch with new design tokens. Rain runs as a `requestAnimationFrame` canvas loop in `main.js`. The logo is HTML `<span>` elements with staggered CSS `@keyframes`. All three pages share the same `styles.css` and `main.js`.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, keyframes), Vanilla JS (Canvas API, localStorage)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `assets/css/styles.css` | Rewrite | All visual design: tokens, layout, logo, boxes, rain toggle |
| `index.html` | Rewrite | Home page: header, 3-column layout, rain canvas, toggle button |
| `assets/js/main.js` | Rewrite | Rain canvas animation loop + toggle state + year |
| `blog.html` | Modify header only | Update to new header/nav structure |
| `portfolio.html` | Modify header only | Update to new header/nav structure |

---

## Task 1: Rewrite `assets/css/styles.css`

**Files:**
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Verify current file**

  Open `assets/css/styles.css` and confirm it contains the old design tokens (`:root { --bg: #05070b; ... }`). This is what we're replacing.

- [ ] **Step 2: Write the new stylesheet**

  Replace the entire contents of `assets/css/styles.css` with:

  ```css
  /* ── Design tokens ── */
  :root {
    --bg: #04060c;
    --panel: #0b1020;
    --panel-2: #111827;
    --text: #c8daff;
    --muted: #6a82aa;
    --link: #7ab4f5;
    --link-hover: #b0d4ff;
    --line: #1e2d48;
    --ok: #52d94e;
    --border-radius: 3px;
  }

  /* ── Reset ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    height: 100%;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: Tahoma, Verdana, Arial, sans-serif;
    font-size: 13px;
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
  }

  a { color: var(--link); }
  a:hover { color: var(--link-hover); }

  /* ── Rain canvas ── */
  #rain-canvas {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
    transition: opacity 0.6s ease;
  }

  #rain-canvas.rain-hidden {
    opacity: 0;
  }

  /* ── Rain toggle button ── */
  #rain-toggle {
    position: fixed;
    bottom: 10px; right: 10px;
    background: var(--panel-2);
    border: 1px solid var(--line);
    color: var(--muted);
    font-family: Tahoma, Verdana, Arial, sans-serif;
    font-size: 11px;
    padding: 3px 8px;
    cursor: pointer;
    border-radius: var(--border-radius);
    z-index: 100;
    transition: color 0.2s, border-color 0.2s;
  }

  #rain-toggle:hover {
    color: var(--text);
    border-color: #3a5080;
  }

  /* ── Page wrapper ── */
  .page {
    position: relative;
    z-index: 1;
    width: min(920px, 96%);
    margin: 0 auto;
    padding: 1.4rem 0 2rem;
  }

  /* ── Header ── */
  .site-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  /* Profile picture */
  .pfp-wrapper {
    flex-shrink: 0;
  }

  .pfp {
    width: 70px;
    height: 70px;
    border: 2px solid #2e4a78;
    border-radius: var(--border-radius);
    object-fit: cover;
    display: block;
    box-shadow: 0 0 10px rgba(70, 120, 220, 0.18);
  }

  .pfp-fallback {
    width: 70px;
    height: 70px;
    border: 2px solid #2e4a78;
    border-radius: var(--border-radius);
    background: linear-gradient(160deg, #0e1e38, #0a1428);
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    box-shadow: 0 0 10px rgba(70, 120, 220, 0.18);
  }

  /* ── Logo ── */
  .logo {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    user-select: none;
    flex-wrap: wrap;
  }

  .logo-letter {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(170deg, #162440, #0c1828);
    border: 1px solid #2a4070;
    border-radius: 2px;
    padding: 3px 7px;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    font-size: 1.55rem;
    color: #90c0ff;
    text-shadow: 0 0 7px rgba(110, 175, 255, 0.55);
    animation: letterPulse 2.8s ease-in-out infinite;
    line-height: 1;
  }

  .logo-letter:nth-child(1) { animation-delay: 0.00s; }
  .logo-letter:nth-child(2) { animation-delay: 0.12s; }
  .logo-letter:nth-child(3) { animation-delay: 0.24s; }
  .logo-letter:nth-child(4) { animation-delay: 0.36s; }
  .logo-letter:nth-child(5) { animation-delay: 0.48s; }
  .logo-letter:nth-child(6) { animation-delay: 0.60s; }
  .logo-letter:nth-child(7) { animation-delay: 0.72s; }

  @keyframes letterPulse {
    0%, 100% {
      color: #90c0ff;
      text-shadow: 0 0 7px rgba(110, 175, 255, 0.55);
      border-color: #2a4070;
    }
    45% {
      color: #ddf0ff;
      text-shadow: 0 0 16px rgba(180, 220, 255, 1), 0 0 3px #fff;
      border-color: #5085c8;
    }
  }

  .header-meta {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .header-sub {
    color: var(--muted);
    font-size: 0.8rem;
  }

  /* ── Three-column layout ── */
  .layout {
    display: grid;
    grid-template-columns: 175px 1fr 155px;
    gap: 0.6rem;
    align-items: start;
  }

  /* ── Column stacks ── */
  .col {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  /* ── Box ── */
  .box {
    background: linear-gradient(180deg, var(--panel-2), var(--panel));
    border: 1px solid var(--line);
    padding: 0.65rem 0.8rem;
  }

  .box-title {
    font-size: 0.76rem;
    font-weight: bold;
    color: #5a8fd8;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    border-bottom: 1px solid var(--line);
    padding-bottom: 0.3rem;
    margin-bottom: 0.45rem;
  }

  /* ── Nav ── */
  .nav-link {
    display: block;
    color: var(--link);
    text-decoration: none;
    padding: 0.1rem 0;
    font-size: 0.82rem;
  }

  .nav-link::before { content: "✦ "; font-size: 0.65rem; opacity: 0.7; }

  .nav-link.active { color: #fff; font-weight: bold; }
  .nav-link.active::before { opacity: 1; }

  .nav-link:hover { color: var(--link-hover); }

  /* ── Status ── */
  .status-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: var(--muted);
    margin: 0.18rem 0;
  }

  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--ok);
    box-shadow: 0 0 5px var(--ok);
    flex-shrink: 0;
  }

  /* ── Posts ── */
  .post-item {
    padding: 0.4rem 0;
    border-bottom: 1px solid var(--line);
    font-size: 0.82rem;
  }

  .post-item:last-child { border-bottom: none; padding-bottom: 0; }

  .post-item a { text-decoration: none; }
  .post-item a:hover { text-decoration: underline; }

  .post-date {
    color: var(--muted);
    font-size: 0.75rem;
    margin-top: 1px;
  }

  /* ── Projects ── */
  .project-item {
    padding: 0.4rem 0;
    border-bottom: 1px solid var(--line);
    font-size: 0.82rem;
  }

  .project-item:last-child { border-bottom: none; padding-bottom: 0; }

  .project-name { text-decoration: none; }
  .project-name:hover { text-decoration: underline; }

  .project-desc {
    color: var(--muted);
    font-size: 0.75rem;
    margin-top: 2px;
  }

  .tag {
    display: inline-block;
    background: #0c1c34;
    border: 1px solid #22385e;
    color: #5a90cc;
    font-size: 0.68rem;
    padding: 1px 5px;
    border-radius: 2px;
    margin-left: 3px;
    vertical-align: middle;
  }

  /* ── Stars / social ── */
  .star-link {
    display: block;
    color: var(--muted);
    text-decoration: none;
    font-size: 0.8rem;
    padding: 0.1rem 0;
  }

  .star-link::before { content: "✩ "; }
  .star-link:hover { color: var(--link); }

  /* ── Info box text ── */
  .info-text {
    color: var(--muted);
    font-size: 0.78rem;
    line-height: 1.8;
  }

  /* ── Footer ── */
  .site-footer {
    margin-top: 0.8rem;
    color: var(--muted);
    font-size: 0.78rem;
  }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }
  ```

- [ ] **Step 3: Verify no syntax errors**

  Open `index.html` in a browser (e.g. `open index.html` on Mac or right-click → Open in browser). The page will look broken layout-wise because `index.html` hasn't been rewritten yet, but confirm the browser dev tools show no CSS parse errors.

- [ ] **Step 4: Commit**

  ```bash
  cd /home/anxiuser/mainpage
  git init  # only if not already a git repo
  git add assets/css/styles.css
  git commit -m "feat: rewrite CSS with dimden.dev-style design tokens and components"
  ```

---

## Task 2: Rewrite `index.html`

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Write the new index.html**

  Replace the entire contents of `index.html` with:

  ```html
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>anxidev // home</title>
      <meta name="description" content="anxidev — personal site, projects, and blog." />
      <link rel="stylesheet" href="assets/css/styles.css" />
    </head>
    <body>

      <!-- Rain canvas (behind everything) -->
      <canvas id="rain-canvas"></canvas>

      <!-- Rain toggle -->
      <button id="rain-toggle">Disable rain</button>

      <div class="page">

        <!-- Header: profile pic + animated logo -->
        <header class="site-header">
          <div class="pfp-wrapper">
            <img
              src="assets/images/pfp.jpg"
              alt="Profile picture"
              class="pfp"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
            />
            <div class="pfp-fallback">👤</div>
          </div>
          <div class="header-meta">
            <div class="logo" aria-label="anxidev">
              <span class="logo-letter">a</span>
              <span class="logo-letter">n</span>
              <span class="logo-letter">x</span>
              <span class="logo-letter">i</span>
              <span class="logo-letter">d</span>
              <span class="logo-letter">e</span>
              <span class="logo-letter">v</span>
            </div>
            <span class="header-sub">personal site · projects · blog</span>
          </div>
        </header>

        <!-- Three-column layout -->
        <main class="layout">

          <!-- LEFT: navigation + status -->
          <div class="col">
            <div class="box">
              <div class="box-title">Navigation</div>
              <nav aria-label="Main navigation">
                <a class="nav-link active" href="index.html">Home</a>
                <a class="nav-link" href="blog.html">Blog</a>
                <a class="nav-link" href="portfolio.html">Projects</a>
                <a class="nav-link" href="#">About</a>
              </nav>
            </div>
            <div class="box">
              <div class="box-title">Status</div>
              <div class="status-row"><span class="status-dot"></span>Online</div>
              <div class="status-row"><span class="status-dot"></span>Systems OK</div>
              <div class="status-row"><span class="status-dot"></span>Coffee: ready</div>
            </div>
          </div>

          <!-- CENTER: latest posts + projects -->
          <div class="col">
            <div class="box">
              <div class="box-title">Latest posts</div>
              <div class="post-item">
                <div><a class="post-link" href="blog.html">How I structure frontend projects</a></div>
                <div class="post-date">Apr 10, 2026</div>
              </div>
              <div class="post-item">
                <div><a class="post-link" href="blog.html">Lessons from shipping my side project</a></div>
                <div class="post-date">Mar 22, 2026</div>
              </div>
              <div class="post-item">
                <div><a class="post-link" href="blog.html">Clean APIs for solo developers</a></div>
                <div class="post-date">Feb 14, 2026</div>
              </div>
            </div>
            <div class="box">
              <div class="box-title">Projects</div>
              <div class="project-item">
                <a class="project-name" href="portfolio.html">mainpage</a>
                <span class="tag">html</span><span class="tag">css</span>
                <div class="project-desc">this personal website</div>
              </div>
              <div class="project-item">
                <a class="project-name" href="#">some-tool</a>
                <span class="tag">js</span>
                <div class="project-desc">a utility script</div>
              </div>
              <div class="project-item">
                <a class="project-name" href="#">another-thing</a>
                <span class="tag">ts</span><span class="tag">node</span>
                <div class="project-desc">work in progress</div>
              </div>
            </div>
          </div>

          <!-- RIGHT: social links + info -->
          <div class="col">
            <div class="box">
              <div class="box-title">Stars</div>
              <a class="star-link" href="#">GitHub</a>
              <a class="star-link" href="#">Twitter / X</a>
              <a class="star-link" href="#">RSS</a>
            </div>
            <div class="box">
              <div class="box-title">Info</div>
              <div class="info-text">
                dev<br>
                somewhere, earth<br>
                UTC+0<br>
                <br>
                js · ts · node
              </div>
            </div>
          </div>

        </main>

        <footer class="site-footer">
          <p>&copy; <span id="year"></span> anxidev</p>
        </footer>
      </div>

      <script src="assets/js/main.js"></script>
    </body>
  </html>
  ```

- [ ] **Step 2: Open in browser and verify structure**

  Open `index.html` in a browser. Confirm:
  - Profile pic area shows the 👤 fallback (since no `pfp.jpg` exists yet)
  - Logo letters "a n x i d e v" each in their own styled block, pulsing with a blue glow
  - Three columns visible on desktop, stacked on narrow viewports
  - Rain canvas and toggle button are present (rain won't work until Task 3)

- [ ] **Step 3: Commit**

  ```bash
  git add index.html
  git commit -m "feat: rewrite index.html with dimden.dev-style three-column layout and animated logo"
  ```

---

## Task 3: Rewrite `assets/js/main.js` (rain + toggle + year)

**Files:**
- Modify: `assets/js/main.js`

- [ ] **Step 1: Write the new main.js**

  Replace the entire contents of `assets/js/main.js` with:

  ```js
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
      requestAnimationFrame(drawRain);
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
        toggleBtn.textContent = 'Enable rain';
      }

      toggleBtn.addEventListener('click', () => {
        const isHidden = canvas.classList.toggle('rain-hidden');
        if (isHidden) {
          animRunning = false;
          toggleBtn.textContent = 'Enable rain';
          localStorage.setItem(STORAGE_KEY, 'true');
        } else {
          animRunning = true;
          toggleBtn.textContent = 'Disable rain';
          localStorage.setItem(STORAGE_KEY, 'false');
          drawRain(); // restart loop
        }
      });
    }
  }
  ```

- [ ] **Step 2: Open index.html and verify rain**

  Open (or hard-refresh) `index.html` in a browser. Confirm:
  - Blue-white rain falls diagonally across the full page background
  - The "Disable rain" button is visible in the bottom-right corner
  - Clicking it stops the rain (canvas fades out via CSS transition) and button reads "Enable rain"
  - Clicking again restarts rain and reads "Disable rain"
  - Hard-refresh with rain disabled: the page still loads with rain hidden (localStorage persistence)

- [ ] **Step 3: Commit**

  ```bash
  git add assets/js/main.js
  git commit -m "feat: add canvas rain animation with localStorage toggle"
  ```

---

## Task 4: Update `blog.html` header and nav

**Files:**
- Modify: `blog.html`

- [ ] **Step 1: Replace the `<header>` and `<body>` opening in blog.html**

  Replace the entire contents of `blog.html` with:

  ```html
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>anxidev // blog</title>
      <meta name="description" content="Blog posts and notes." />
      <link rel="stylesheet" href="assets/css/styles.css" />
    </head>
    <body>

      <canvas id="rain-canvas"></canvas>
      <button id="rain-toggle">Disable rain</button>

      <div class="page">

        <header class="site-header">
          <div class="pfp-wrapper">
            <img
              src="assets/images/pfp.jpg"
              alt="Profile picture"
              class="pfp"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
            />
            <div class="pfp-fallback">👤</div>
          </div>
          <div class="header-meta">
            <div class="logo" aria-label="anxidev">
              <span class="logo-letter">a</span>
              <span class="logo-letter">n</span>
              <span class="logo-letter">x</span>
              <span class="logo-letter">i</span>
              <span class="logo-letter">d</span>
              <span class="logo-letter">e</span>
              <span class="logo-letter">v</span>
            </div>
            <span class="header-sub">personal site · projects · blog</span>
          </div>
        </header>

        <main class="layout">

          <div class="col">
            <div class="box">
              <div class="box-title">Navigation</div>
              <nav aria-label="Main navigation">
                <a class="nav-link" href="index.html">Home</a>
                <a class="nav-link active" href="blog.html">Blog</a>
                <a class="nav-link" href="portfolio.html">Projects</a>
                <a class="nav-link" href="#">About</a>
              </nav>
            </div>
          </div>

          <div class="col">
            <div class="box">
              <div class="box-title">/blog</div>
              <div class="post-item">
                <div><a href="#">How I structure frontend projects</a></div>
                <div class="post-date">Apr 10, 2026</div>
                <div style="color:var(--muted);font-size:0.78rem;margin-top:3px;">
                  A practical approach to folder layout, naming conventions, and maintainable UI architecture.
                </div>
              </div>
              <div class="post-item">
                <div><a href="#">Lessons from shipping my side project</a></div>
                <div class="post-date">Mar 22, 2026</div>
                <div style="color:var(--muted);font-size:0.78rem;margin-top:3px;">
                  Key takeaways from building, launching, and improving a personal product end to end.
                </div>
              </div>
              <div class="post-item">
                <div><a href="#">Clean APIs for solo developers</a></div>
                <div class="post-date">Feb 14, 2026</div>
                <div style="color:var(--muted);font-size:0.78rem;margin-top:3px;">
                  Simple patterns to design APIs that are easy to extend and debug over time.
                </div>
              </div>
            </div>
          </div>

          <div class="col">
            <div class="box">
              <div class="box-title">Stars</div>
              <a class="star-link" href="#">GitHub</a>
              <a class="star-link" href="#">Twitter / X</a>
              <a class="star-link" href="#">RSS</a>
            </div>
          </div>

        </main>

        <footer class="site-footer">
          <p>&copy; <span id="year"></span> anxidev</p>
        </footer>
      </div>

      <script src="assets/js/main.js"></script>
    </body>
  </html>
  ```

- [ ] **Step 2: Verify blog.html in browser**

  Open `blog.html`. Confirm:
  - Same header (pfp + animated logo) as `index.html`
  - "Blog" nav link is highlighted white (active state)
  - Rain falls in the background
  - Toggle button persists the same `rain-disabled` state from `localStorage`

- [ ] **Step 3: Commit**

  ```bash
  git add blog.html
  git commit -m "feat: update blog.html with new header, rain, and nav"
  ```

---

## Task 5: Update `portfolio.html` header and nav

**Files:**
- Modify: `portfolio.html`

- [ ] **Step 1: Replace contents of portfolio.html**

  Replace the entire contents of `portfolio.html` with:

  ```html
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>anxidev // projects</title>
      <meta name="description" content="Portfolio projects and case studies." />
      <link rel="stylesheet" href="assets/css/styles.css" />
    </head>
    <body>

      <canvas id="rain-canvas"></canvas>
      <button id="rain-toggle">Disable rain</button>

      <div class="page">

        <header class="site-header">
          <div class="pfp-wrapper">
            <img
              src="assets/images/pfp.jpg"
              alt="Profile picture"
              class="pfp"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
            />
            <div class="pfp-fallback">👤</div>
          </div>
          <div class="header-meta">
            <div class="logo" aria-label="anxidev">
              <span class="logo-letter">a</span>
              <span class="logo-letter">n</span>
              <span class="logo-letter">x</span>
              <span class="logo-letter">i</span>
              <span class="logo-letter">d</span>
              <span class="logo-letter">e</span>
              <span class="logo-letter">v</span>
            </div>
            <span class="header-sub">personal site · projects · blog</span>
          </div>
        </header>

        <main class="layout">

          <div class="col">
            <div class="box">
              <div class="box-title">Navigation</div>
              <nav aria-label="Main navigation">
                <a class="nav-link" href="index.html">Home</a>
                <a class="nav-link" href="blog.html">Blog</a>
                <a class="nav-link active" href="portfolio.html">Projects</a>
                <a class="nav-link" href="#">About</a>
              </nav>
            </div>
          </div>

          <div class="col">
            <div class="box">
              <div class="box-title">/projects</div>
              <div class="project-item">
                <a class="project-name" href="#">Project One</a>
                <span class="tag">react</span><span class="tag">node</span><span class="tag">postgres</span>
                <div class="project-desc">Dashboard and workflow tooling for a SaaS product.</div>
              </div>
              <div class="project-item">
                <a class="project-name" href="#">Project Two</a>
                <span class="tag">vue</span><span class="tag">firebase</span>
                <div class="project-desc">Marketing and CMS platform rebuild with a component system.</div>
              </div>
              <div class="project-item">
                <a class="project-name" href="#">Project Three</a>
                <span class="tag">next.js</span><span class="tag">ts</span><span class="tag">supabase</span>
                <div class="project-desc">Internal data app for analytics and reporting.</div>
              </div>
            </div>
          </div>

          <div class="col">
            <div class="box">
              <div class="box-title">Stars</div>
              <a class="star-link" href="#">GitHub</a>
              <a class="star-link" href="#">Twitter / X</a>
              <a class="star-link" href="#">RSS</a>
            </div>
          </div>

        </main>

        <footer class="site-footer">
          <p>&copy; <span id="year"></span> anxidev</p>
        </footer>
      </div>

      <script src="assets/js/main.js"></script>
    </body>
  </html>
  ```

- [ ] **Step 2: Verify portfolio.html in browser**

  Open `portfolio.html`. Confirm:
  - Same header/rain as other pages
  - "Projects" nav link is highlighted white (active)
  - Project items with tags display correctly

- [ ] **Step 3: Final cross-page check**

  Navigate between all three pages using the nav links. Confirm:
  - Rain toggle state persists when navigating (localStorage)
  - Active nav link is correct on each page
  - Logo animation runs identically on all pages
  - Year in footer is correct on all pages

- [ ] **Step 4: Commit**

  ```bash
  git add portfolio.html
  git commit -m "feat: update portfolio.html with new header, rain, and nav"
  ```
