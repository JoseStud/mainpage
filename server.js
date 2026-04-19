const { createServer } = require("node:http");
const { createReadStream } = require("node:fs");
const { stat } = require("node:fs/promises");
const path = require("node:path");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number.parseInt(process.env.PORT || "8000", 10);

const MULTI_SCROBBLER_BASE_URL = (process.env.MULTI_SCROBBLER_BASE_URL || "http://127.0.0.1:9078").replace(
  /\/+$/,
  "",
);
const DEFAULT_MULTI_SCROBBLER_SOURCE_NAME = (process.env.MULTI_SCROBBLER_SOURCE_NAME || "").trim();
const DEFAULT_MULTI_SCROBBLER_SOURCE_TYPE = (process.env.MULTI_SCROBBLER_SOURCE_TYPE || "").trim();

const ROOT_DIR = __dirname;
const INDEX_FILE = "/index.html";

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

function getContentType(filePath) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function toEpoch(value) {
  if (typeof value !== "string" || !value) {
    return 0;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildPlayCandidate(source, player) {
  if (!player || typeof player !== "object" || !player.play || typeof player.play !== "object") {
    return null;
  }

  const play = player.play;
  const data = play.data && typeof play.data === "object" ? play.data : {};
  const meta = play.meta && typeof play.meta === "object" ? play.meta : {};

  const track = typeof data.track === "string" ? data.track.trim() : "";
  const artists = Array.isArray(data.artists) ? data.artists.filter((x) => typeof x === "string" && x.trim()) : [];
  const artist = artists.length > 0 ? artists.join(", ") : "";
  const album = typeof data.album === "string" ? data.album.trim() : "";
  const href =
    meta.url && typeof meta.url === "object"
      ? typeof meta.url.origin === "string" && meta.url.origin
        ? meta.url.origin
        : typeof meta.url.web === "string" && meta.url.web
          ? meta.url.web
          : null
      : null;
  const playedAt = typeof data.playDate === "string" && data.playDate ? data.playDate : null;
  const nowPlaying = meta.nowPlaying === true || player.nowPlayingMode === true;
  const title = track && artist ? `${track} - ${artist}` : track || artist || "";

  return {
    sourceName: source.name,
    sourceType: source.type,
    sourceDisplay: source.display || source.name || source.type || "source",
    track,
    artist,
    album,
    title,
    href,
    nowPlaying,
    playedAt,
    score: Math.max(toEpoch(player.playerLastUpdatedAt), toEpoch(playedAt)),
  };
}

function pickCandidateFromSource(source) {
  if (!source || typeof source !== "object" || !source.players || typeof source.players !== "object") {
    return null;
  }

  const playerEntries = Object.values(source.players);
  const candidates = playerEntries
    .map((player) => buildPlayCandidate(source, player))
    .filter((candidate) => candidate && candidate.title);

  if (candidates.length === 0) {
    return null;
  }

  const nowPlayingCandidate = candidates.find((candidate) => candidate.nowPlaying);
  if (nowPlayingCandidate) {
    return nowPlayingCandidate;
  }

  return candidates.sort((a, b) => b.score - a.score)[0];
}

function chooseSource(sources, sourceName, sourceType) {
  if (!Array.isArray(sources) || sources.length === 0) {
    return null;
  }

  if (sourceName) {
    const exact = sources.find(
      (source) => source.name === sourceName && (!sourceType || source.type === sourceType),
    );
    if (exact) {
      return exact;
    }
  }

  if (sourceType) {
    const byType = sources.find((source) => source.type === sourceType);
    if (byType) {
      return byType;
    }
  }

  const withPlayers = sources.find((source) => source.players && Object.keys(source.players).length > 0);
  if (withPlayers) {
    return withPlayers;
  }

  return sources[0];
}

async function fetchRecentForSource(source) {
  if (!source || !source.name) {
    return null;
  }

  const url = new URL("/api/recent", `${MULTI_SCROBBLER_BASE_URL}/`);
  url.searchParams.set("name", source.name);
  if (source.type) {
    url.searchParams.set("type", source.type);
  }

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  if (!Array.isArray(payload) || payload.length === 0 || !payload[0]) {
    return null;
  }

  return buildPlayCandidate(source, { play: payload[0], playerLastUpdatedAt: payload[0]?.data?.playDate });
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(body));
}

async function handleNowPlaying(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const sourceName = (requestUrl.searchParams.get("source") || DEFAULT_MULTI_SCROBBLER_SOURCE_NAME).trim();
  const sourceType = (requestUrl.searchParams.get("type") || DEFAULT_MULTI_SCROBBLER_SOURCE_TYPE).trim();

  let statusResponse;
  try {
    statusResponse = await fetch(`${MULTI_SCROBBLER_BASE_URL}/api/status`, { cache: "no-store" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    sendJson(res, 502, { message: `Could not reach multi-scrobbler: ${message}` });
    return;
  }

  if (!statusResponse.ok) {
    sendJson(res, 502, { message: `multi-scrobbler status request failed (${statusResponse.status})` });
    return;
  }

  const statusPayload = await statusResponse.json();
  const source = chooseSource(statusPayload?.sources, sourceName, sourceType);

  if (!source) {
    sendJson(res, 404, { message: "No multi-scrobbler sources available yet." });
    return;
  }

  let candidate = pickCandidateFromSource(source);
  if (!candidate) {
    candidate = await fetchRecentForSource(source);
  }

  if (!candidate) {
    sendJson(res, 404, {
      message: `No track found for source '${source.name}' (${source.type}).`,
      source: { name: source.name, type: source.type },
    });
    return;
  }

  const meta = candidate.nowPlaying
    ? `playing now via ${candidate.sourceDisplay}`
    : candidate.playedAt
      ? `last played ${candidate.playedAt}`
      : `latest track from ${candidate.sourceDisplay}`;

  sendJson(res, 200, {
    provider: "multi-scrobbler",
    source: {
      name: candidate.sourceName,
      type: candidate.sourceType,
      display: candidate.sourceDisplay,
    },
    title: candidate.title,
    track: candidate.track,
    artist: candidate.artist,
    album: candidate.album,
    href: candidate.href,
    nowPlaying: candidate.nowPlaying,
    playedAt: candidate.playedAt,
    meta,
  });
}

function safeFilePathFromRequest(urlPathname) {
  let pathname;
  try {
    pathname = urlPathname === "/" ? INDEX_FILE : decodeURIComponent(urlPathname);
  } catch {
    return null;
  }
  const cleaned = pathname.replace(/^\/+/, "");
  const resolved = path.resolve(ROOT_DIR, cleaned);
  const rootBoundary = ROOT_DIR.endsWith(path.sep) ? ROOT_DIR : `${ROOT_DIR}${path.sep}`;

  if (resolved !== ROOT_DIR && !resolved.startsWith(rootBoundary)) {
    return null;
  }

  return resolved;
}

async function handleStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const filePath = safeFilePathFromRequest(url.pathname);

  if (!filePath) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Bad request");
    return;
  }

  let fileStats;
  try {
    fileStats = await stat(filePath);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  if (!fileStats.isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  res.writeHead(200, { "Content-Type": getContentType(filePath) });
  createReadStream(filePath).pipe(res);
}

const server = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Bad request");
    return;
  }

  if (req.method === "GET" && req.url.startsWith("/api/music/now-playing")) {
    await handleNowPlaying(req, res);
    return;
  }

  if (req.method === "GET" && req.url.startsWith("/health")) {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method not allowed");
    return;
  }

  await handleStatic(req, res);
});

server.listen(PORT, HOST, () => {
  console.log(`mainpage server listening on http://${HOST}:${PORT}`);
  console.log(`multi-scrobbler base url: ${MULTI_SCROBBLER_BASE_URL}`);
});
