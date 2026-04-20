import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

function parseArgs(argv) {
  const args = {
    comparePrev: true,
    json: false,
    target: null,
  };

  for (const value of argv) {
    if (value === "--json") {
      args.json = true;
      continue;
    }

    if (value === "--no-compare") {
      args.comparePrev = false;
      continue;
    }

    if (!args.target) {
      args.target = value;
    }
  }

  return args;
}

async function listTraceFiles(perfDir) {
  const entries = await readdir(perfDir);
  const files = await Promise.all(
    entries
      .filter((name) => name.endsWith(".json"))
      .map(async (name) => {
        const filePath = path.join(perfDir, name);
        return {
          filePath,
          name,
          stat: await stat(filePath),
        };
      }),
  );

  return files.sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);
}

function getThreadNames(events) {
  const threadNames = new Map();

  for (const event of events) {
    if (event.ph === "M" && event.name === "thread_name" && event.args?.name) {
      threadNames.set(`${event.pid}:${event.tid}`, event.args.name);
    }
  }

  return threadNames;
}

function createNameStats() {
  return {
    count: 0,
    totalMs: 0,
    maxMs: 0,
  };
}

function round(value) {
  return Number(value.toFixed(3));
}

function summarizeTrace(trace, fileInfo) {
  const events = Array.isArray(trace.traceEvents) ? trace.traceEvents : [];
  const threadNames = getThreadNames(events);
  const names = new Map();
  const rendererRunTasks = [];
  const rendererEvents = [];

  for (const event of events) {
    if (event.ph !== "X" || typeof event.dur !== "number") {
      continue;
    }

    const durationMs = event.dur / 1000;
    const stats = names.get(event.name) || createNameStats();
    stats.count += 1;
    stats.totalMs += durationMs;
    stats.maxMs = Math.max(stats.maxMs, durationMs);
    names.set(event.name, stats);

    const threadName = threadNames.get(`${event.pid}:${event.tid}`) || "";
    if (threadName !== "CrRendererMain") {
      continue;
    }

    const rendererEvent = {
      name: event.name,
      cat: event.cat,
      ts: event.ts,
      end: event.ts + event.dur,
      durationMs,
      ph: event.ph,
    };

    rendererEvents.push(rendererEvent);

    if (event.name === "RunTask") {
      rendererRunTasks.push(rendererEvent);
    }
  }

  rendererRunTasks.sort((a, b) => b.durationMs - a.durationMs);

  const topRunTasks = rendererRunTasks.slice(0, 4).map((task) => {
    const nestedStats = new Map();

    for (const event of rendererEvents) {
      if (
        event === task ||
        event.ph !== "X" ||
        event.ts < task.ts ||
        event.end > task.end
      ) {
        continue;
      }

      const stats = nestedStats.get(event.name) || createNameStats();
      stats.count += 1;
      stats.totalMs += event.durationMs;
      stats.maxMs = Math.max(stats.maxMs, event.durationMs);
      nestedStats.set(event.name, stats);
    }

    return {
      tsMs: round(task.ts / 1000),
      durationMs: round(task.durationMs),
      nested: [...nestedStats.entries()]
        .map(([name, stats]) => ({
          name,
          count: stats.count,
          totalMs: round(stats.totalMs),
          maxMs: round(stats.maxMs),
        }))
        .sort((a, b) => b.totalMs - a.totalMs)
        .slice(0, 6),
    };
  });

  const get = (name) => names.get(name) || createNameStats();

  return {
    file: fileInfo.name,
    modified: fileInfo.stat.mtime.toISOString(),
    sizeMb: round(fileInfo.stat.size / (1024 * 1024)),
    windowMs: round((trace.metadata?.modifications?.initialBreadcrumb?.window?.range || 0) / 1000),
    totalEvents: events.length,
    rendererRunTasks: {
      count: rendererRunTasks.length,
      maxMs: round(rendererRunTasks[0]?.durationMs || 0),
      over8ms: rendererRunTasks.filter((task) => task.durationMs >= 8).length,
      over16ms: rendererRunTasks.filter((task) => task.durationMs >= 16).length,
      over33ms: rendererRunTasks.filter((task) => task.durationMs >= 33).length,
      top: topRunTasks,
    },
    workloadMs: {
      serviceScriptedAnimations: round(get("PageAnimator::serviceScriptedAnimations").totalMs),
      fireAnimationFrame: round(get("FireAnimationFrame").totalMs),
      functionCall: round(get("FunctionCall").totalMs),
      updateLayoutTree: round(get("UpdateLayoutTree").totalMs),
      layout: round(get("Layout").totalMs),
      prePaint: round(get("PrePaint").totalMs),
      paint: round(get("Paint").totalMs),
      rasterTask: round(get("RasterTask").totalMs),
      eventDispatch: round(get("EventDispatch").totalMs),
      hitTest: round(get("HitTest").totalMs),
    },
  };
}

function formatDelta(current, previous) {
  const diff = current - previous;
  const sign = diff > 0 ? "+" : "";
  return `${sign}${round(diff)}`;
}

function printSummary(summary, previousSummary) {
  console.log(`Trace: ${summary.file}`);
  console.log(`Modified: ${summary.modified}`);
  console.log(`Window: ${summary.windowMs} ms`);
  console.log(`Size: ${summary.sizeMb} MiB`);
  console.log(`Events: ${summary.totalEvents}`);
  console.log("");

  console.log("Renderer main RunTask:");
  console.log(
    `  max ${summary.rendererRunTasks.maxMs} ms | ${summary.rendererRunTasks.over8ms} >= 8ms | ${summary.rendererRunTasks.over16ms} >= 16ms | ${summary.rendererRunTasks.over33ms} >= 33ms`,
  );
  console.log("");

  console.log("Workload totals:");
  for (const [key, value] of Object.entries(summary.workloadMs)) {
    const label = key.replace(/[A-Z]/g, (match) => ` ${match.toLowerCase()}`);
    const delta = previousSummary ? ` (${formatDelta(value, previousSummary.workloadMs[key])} vs prev)` : "";
    console.log(`  ${label}: ${value} ms${delta}`);
  }
  console.log("");

  console.log("Top renderer RunTask windows:");
  for (const task of summary.rendererRunTasks.top) {
    console.log(`  ${task.durationMs} ms at ${task.tsMs} ms`);
    for (const nested of task.nested) {
      console.log(`    ${nested.name}: ${nested.totalMs} ms`);
    }
  }

  if (previousSummary) {
    console.log("");
    console.log(`Compared to: ${previousSummary.file}`);
    console.log(
      `  RunTask max: ${summary.rendererRunTasks.maxMs} ms (${formatDelta(summary.rendererRunTasks.maxMs, previousSummary.rendererRunTasks.maxMs)})`,
    );
    console.log(
      `  RunTasks >= 8ms: ${summary.rendererRunTasks.over8ms} (${summary.rendererRunTasks.over8ms - previousSummary.rendererRunTasks.over8ms >= 0 ? "+" : ""}${summary.rendererRunTasks.over8ms - previousSummary.rendererRunTasks.over8ms})`,
    );
    console.log(
      `  RunTasks >= 16ms: ${summary.rendererRunTasks.over16ms} (${summary.rendererRunTasks.over16ms - previousSummary.rendererRunTasks.over16ms >= 0 ? "+" : ""}${summary.rendererRunTasks.over16ms - previousSummary.rendererRunTasks.over16ms})`,
    );
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const perfDir = path.join(process.cwd(), "perf");
  const files = await listTraceFiles(perfDir);

  if (files.length === 0) {
    throw new Error(`No .json traces found in ${perfDir}`);
  }

  const targetFile = args.target
    ? path.isAbsolute(args.target)
      ? args.target
      : path.join(process.cwd(), args.target)
    : files[0].filePath;

  const targetInfo = files.find((file) => file.filePath === targetFile || file.name === path.basename(targetFile));
  if (!targetInfo) {
    throw new Error(`Trace not found: ${args.target}`);
  }

  const targetTrace = JSON.parse(await readFile(targetInfo.filePath, "utf8"));
  const summary = summarizeTrace(targetTrace, targetInfo);

  let previousSummary = null;
  if (args.comparePrev) {
    const previousInfo = files.find((file) => file.filePath !== targetInfo.filePath);
    if (previousInfo) {
      const previousTrace = JSON.parse(await readFile(previousInfo.filePath, "utf8"));
      previousSummary = summarizeTrace(previousTrace, previousInfo);
    }
  }

  if (args.json) {
    console.log(JSON.stringify({ summary, previousSummary }, null, 2));
    return;
  }

  printSummary(summary, previousSummary);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
