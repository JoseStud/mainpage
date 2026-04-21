import assert from "node:assert/strict";
import { gunzipSync } from "node:zlib";
import { spawn } from "node:child_process";
import { createServer, request } from "node:http";
import { once } from "node:events";

const HOST = "127.0.0.1";

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, HOST, () => {
      server.off("error", reject);
      resolve(server.address().port);
    });
  });
}

function httpRequest({ port, method = "GET", path = "/", headers = {} }) {
  return new Promise((resolve, reject) => {
    const req = request({ host: HOST, port, method, path, headers }, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks),
        });
      });
    });

    req.setTimeout(2000, () => {
      req.destroy(new Error(`${method} ${path} timed out`));
    });
    req.on("error", reject);
    req.end();
  });
}

async function startMainServer(multiScrobblerBaseUrl) {
  const probe = createServer();
  const port = await listen(probe);
  await new Promise((resolve) => probe.close(resolve));

  const child = spawn(process.execPath, ["src/server/index.js"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      HOST,
      PORT: String(port),
      MULTI_SCROBBLER_BASE_URL: multiScrobblerBaseUrl,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  const output = [];
  child.stdout.on("data", (chunk) => output.push(chunk.toString("utf8")));
  child.stderr.on("data", (chunk) => output.push(chunk.toString("utf8")));

  await Promise.race([
    new Promise((resolve) => {
      child.stdout.on("data", (chunk) => {
        if (chunk.toString("utf8").includes("mainpage server listening")) {
          resolve();
        }
      });
    }),
    once(child, "exit").then(([code]) => {
      throw new Error(`server exited early with ${code}:\n${output.join("")}`);
    }),
    new Promise((_, reject) => setTimeout(() => reject(new Error("server did not start")), 2000)),
  ]);

  return {
    port,
    stop: async () => {
      if (child.exitCode === null) {
        child.kill("SIGTERM");
        await Promise.race([once(child, "exit"), new Promise((resolve) => setTimeout(resolve, 1000))]);
      }
    },
  };
}

async function withServers(upstreamHandler, testFn) {
  const upstream = createServer(upstreamHandler);
  const upstreamPort = await listen(upstream);
  const main = await startMainServer(`http://${HOST}:${upstreamPort}`);

  try {
    await testFn(main.port);
  } finally {
    await main.stop();
    await new Promise((resolve) => upstream.close(resolve));
  }
}

await withServers(
  (req, res) => {
    if (req.url === "/api/status") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ sources: [] }));
      return;
    }

    res.writeHead(404);
    res.end();
  },
  async (port) => {
    const html = await httpRequest({ port, path: "/" });
    assert.equal(html.statusCode, 200);
    assert.equal(html.headers["cache-control"], "public, max-age=60");
    assert.ok(html.headers.etag, "HTML should include an ETag");
    assert.ok(html.headers["last-modified"], "HTML should include Last-Modified");

    const css = await httpRequest({ port, path: "/assets/css/styles.css" });
    assert.equal(css.statusCode, 200);
    assert.equal(css.headers["cache-control"], "public, max-age=31536000, immutable");
    assert.ok(css.headers.etag, "static assets should include an ETag");
    assert.ok(css.headers["last-modified"], "static assets should include Last-Modified");

    const etagFresh = await httpRequest({
      port,
      path: "/assets/css/styles.css",
      headers: { "If-None-Match": css.headers.etag },
    });
    assert.equal(etagFresh.statusCode, 304);
    assert.equal(etagFresh.body.length, 0);

    const modifiedFresh = await httpRequest({
      port,
      path: "/assets/css/styles.css",
      headers: { "If-Modified-Since": css.headers["last-modified"] },
    });
    assert.equal(modifiedFresh.statusCode, 304);
    assert.equal(modifiedFresh.body.length, 0);

    const gzip = await httpRequest({
      port,
      path: "/assets/js/main.js",
      headers: { "Accept-Encoding": "gzip" },
    });
    assert.equal(gzip.statusCode, 200);
    assert.equal(gzip.headers["content-encoding"], "gzip");
    assert.match(gunzipSync(gzip.body).toString("utf8"), /import/);

    const head = await httpRequest({ port, method: "HEAD", path: "/assets/css/styles.css" });
    assert.equal(head.statusCode, 200);
    assert.equal(head.headers["content-length"], css.headers["content-length"]);
    assert.equal(head.body.length, 0);
  },
);

await withServers(
  (req, res) => {
    if (req.url === "/api/status" || req.url.startsWith("/api/recent")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("{");
      return;
    }

    res.writeHead(404);
    res.end();
  },
  async (port) => {
    const malformedStatus = await httpRequest({ port, path: "/api/music/now-playing" });
    assert.equal(malformedStatus.statusCode, 502);
    assert.match(malformedStatus.body.toString("utf8"), /invalid JSON/i);
  },
);

await withServers(
  (req, res) => {
    if (req.url === "/api/status") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          sources: [
            {
              name: "local",
              type: "test",
              display: "Local",
              players: {},
            },
          ],
        }),
      );
      return;
    }

    if (req.url.startsWith("/api/recent")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("{");
      return;
    }

    res.writeHead(404);
    res.end();
  },
  async (port) => {
    const malformedRecent = await httpRequest({ port, path: "/api/music/now-playing" });
    assert.equal(malformedRecent.statusCode, 502);
    assert.match(malformedRecent.body.toString("utf8"), /invalid JSON/i);
  },
);

console.log("server HTTP tests passed");
