import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const DEFAULT_URL = "http://127.0.0.1:8000/?themeDebug=1";
const DEFAULT_CHROMIUM = "/usr/bin/chromium";
const DEFAULT_WAIT_MS = 3200;

function parseArgs(argv) {
  const args = {
    chromium: process.env.CHROMIUM_BIN || DEFAULT_CHROMIUM,
    outDir: "perf",
    url: process.env.TRACE_URL || DEFAULT_URL,
    waitMs: Number.parseInt(process.env.TRACE_WAIT_MS || `${DEFAULT_WAIT_MS}`, 10),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    const next = argv[index + 1];

    if (value === "--chromium" && next) {
      args.chromium = next;
      index += 1;
    } else if (value === "--out-dir" && next) {
      args.outDir = next;
      index += 1;
    } else if (value === "--url" && next) {
      args.url = next;
      index += 1;
    } else if (value === "--wait-ms" && next) {
      args.waitMs = Number.parseInt(next, 10);
      index += 1;
    }
  }

  if (!Number.isFinite(args.waitMs) || args.waitMs < 0) {
    args.waitMs = DEFAULT_WAIT_MS;
  }

  return args;
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function connectCdp(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let nextId = 1;
    const pending = new Map();
    const waiters = new Set();

    function cleanupWaiter(waiter) {
      waiters.delete(waiter);
      if (waiter.timer) {
        clearTimeout(waiter.timer);
      }
    }

    ws.addEventListener("open", () => {
      resolve({
        close() {
          ws.close();
        },
        send(method, params = {}) {
          const id = nextId++;
          ws.send(JSON.stringify({ id, method, params }));
          return new Promise((resolveCommand, rejectCommand) => {
            pending.set(id, { method, resolve: resolveCommand, reject: rejectCommand });
          });
        },
        waitEvent(method, predicate = () => true, timeoutMs = 15000) {
          return new Promise((resolveEvent, rejectEvent) => {
            const waiter = {
              method,
              predicate,
              resolve: resolveEvent,
              reject: rejectEvent,
              timer: setTimeout(() => {
                cleanupWaiter(waiter);
                rejectEvent(new Error(`Timed out waiting for ${method}`));
              }, timeoutMs),
            };
            waiters.add(waiter);
          });
        },
      });
    });

    ws.addEventListener("error", () => {
      reject(new Error(`CDP websocket error: ${wsUrl}`));
    });

    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);

      if (message.id) {
        const request = pending.get(message.id);
        if (!request) {
          return;
        }

        pending.delete(message.id);
        if (message.error) {
          request.reject(new Error(`${request.method}: ${message.error.message}`));
        } else {
          request.resolve(message.result || {});
        }
        return;
      }

      for (const waiter of [...waiters]) {
        if (waiter.method === message.method && waiter.predicate(message.params || {})) {
          cleanupWaiter(waiter);
          waiter.resolve(message.params || {});
        }
      }
    });
  });
}

function waitForDevToolsEndpoint(chromium) {
  let stderr = "";

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timed out waiting for DevTools endpoint. stderr: ${stderr.slice(-1200)}`));
    }, 15000);

    chromium.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
      }
    });

    chromium.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Chromium exited before DevTools endpoint, code ${code}. stderr: ${stderr.slice(-1200)}`));
    });
  });
}

async function readTraceStream(cdp, stream) {
  let traceText = "";
  let eof = false;

  while (!eof) {
    const chunk = await cdp.send("IO.read", { handle: stream });
    traceText += chunk.data || "";
    eof = chunk.eof === true;
  }

  await cdp.send("IO.close", { handle: stream });
  return traceText;
}

async function evaluate(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    awaitPromise: true,
    expression,
    returnByValue: true,
  });

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Runtime.evaluate failed");
  }

  return result.result ? result.result.value : undefined;
}

async function navigate(cdp, url) {
  const load = cdp.waitEvent("Page.loadEventFired", () => true, 20000).catch(() => null);
  await cdp.send("Page.navigate", { url });
  await load;
  await delay(700);
}

async function ensureDarkStart(cdp) {
  const initialTheme = await evaluate(cdp, "document.documentElement.dataset.theme");
  if (initialTheme === "dark") {
    return;
  }

  const reload = cdp.waitEvent("Page.loadEventFired", () => true, 20000).catch(() => null);
  await evaluate(cdp, "localStorage.setItem('theme', 'dark'); location.reload()");
  await reload;
  await delay(700);
}

async function main() {
  if (typeof WebSocket !== "function") {
    throw new Error("This script needs a Node runtime with global WebSocket support.");
  }

  const args = parseArgs(process.argv.slice(2));
  await mkdir(args.outDir, { recursive: true });

  const profileDir = await mkdtemp(path.join(tmpdir(), "mainpage-clean-chrome-"));
  const traceName = `Trace-clean-sunrise-${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z")}.json`;
  const tracePath = path.join(args.outDir, traceName);
  const chromium = spawn(
    args.chromium,
    [
      "--headless=new",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-component-extensions-with-background-pages",
      "--disable-background-networking",
      "--disable-sync",
      "--disable-features=AutofillServerCommunication,AutofillEnablePaymentsMandatoryReauth,AutofillAddressProfileSavePrompt",
      "--no-first-run",
      "--no-default-browser-check",
      "--no-sandbox",
      `--user-data-dir=${profileDir}`,
      "--remote-debugging-port=0",
      "about:blank",
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );

  let cdp = null;
  try {
    const browserWs = await waitForDevToolsEndpoint(chromium);
    const port = new URL(browserWs).port;
    const targetResponse = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent("about:blank")}`, {
      method: "PUT",
    });
    if (!targetResponse.ok) {
      throw new Error(`Could not create CDP target: ${targetResponse.status}`);
    }

    const target = await targetResponse.json();
    cdp = await connectCdp(target.webSocketDebuggerUrl);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await navigate(cdp, args.url);
    await ensureDarkStart(cdp);

    const readyState = await evaluate(cdp, `(() => ({
      hasToggle: Boolean(document.getElementById("theme-toggle")),
      hasTransition: Boolean(document.documentElement.dataset.themeTransition),
      theme: document.documentElement.dataset.theme
    }))()`);
    if (!readyState.hasToggle || readyState.theme !== "dark" || readyState.hasTransition) {
      throw new Error(`Page not ready for sunrise trace: ${JSON.stringify(readyState)}`);
    }

    const tracingComplete = cdp.waitEvent("Tracing.tracingComplete", () => true, 20000);
    await cdp.send("Tracing.start", {
      categories: [
        "devtools.timeline",
        "disabled-by-default-devtools.timeline",
        "disabled-by-default-devtools.timeline.frame",
        "blink.user_timing",
        "cc",
        "loading",
        "v8",
      ].join(","),
      transferMode: "ReturnAsStream",
    });

    const clickState = await evaluate(cdp, `(() => {
      performance.mark("codex-clean-sunrise-click");
      document.getElementById("theme-toggle").click();
      return {
        theme: document.documentElement.dataset.theme,
        transition: document.documentElement.dataset.themeTransition || ""
      };
    })()`);
    await delay(args.waitMs);
    await cdp.send("Tracing.end");

    const complete = await tracingComplete;
    const traceText = await readTraceStream(cdp, complete.stream);
    await writeFile(tracePath, traceText, "utf8");

    console.log(
      JSON.stringify(
        {
          chromiumFlags: ["--disable-extensions", "--disable-component-extensions-with-background-pages"],
          clickState,
          tracePath,
        },
        null,
        2,
      ),
    );
  } finally {
    if (cdp) {
      try {
        await cdp.send("Browser.close");
      } catch (_error) {
        cdp.close();
      }
    }

    chromium.kill("SIGTERM");
    await rm(profileDir, { force: true, recursive: true });
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
