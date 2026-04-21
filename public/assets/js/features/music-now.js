const DEFAULT_NOW_PLAYING_ENDPOINT = "/api/music/now-playing";

function setLinkHref(linkNode, href) {
  const nextHref = typeof href === "string" && href.trim() ? href.trim() : "#";
  linkNode.setAttribute("href", nextHref);

  if (/^https?:\/\//.test(nextHref)) {
    linkNode.setAttribute("target", "_blank");
    linkNode.setAttribute("rel", "noreferrer");
    return;
  }

  linkNode.removeAttribute("target");
  linkNode.removeAttribute("rel");
}

function isPlaceholderValue(value) {
  return typeof value === "string" && value.includes("REPLACE_WITH_");
}

export function startScrobbleNowPlaying(config) {
  const titleNode = document.getElementById("music-track-title");
  const metaNode = document.getElementById("music-track-meta");
  const linkNode = document.getElementById("music-track-link");

  if (!titleNode || !metaNode || !linkNode || !config) {
    return null;
  }

  const providerLabel =
    typeof config.providerLabel === "string" && config.providerLabel.trim()
      ? config.providerLabel.trim()
      : "multi-scrobbler";
  const nowPlayingEndpoint =
    typeof config.nowPlayingEndpoint === "string" && config.nowPlayingEndpoint.trim()
      ? config.nowPlayingEndpoint.trim()
      : DEFAULT_NOW_PLAYING_ENDPOINT;
  const sourceName = typeof config.sourceName === "string" ? config.sourceName.trim() : "";
  const sourceType = typeof config.sourceType === "string" ? config.sourceType.trim() : "";
  const fallbackHref = typeof config.profileHref === "string" ? config.profileHref.trim() || "#" : "#";
  const loadingText = config.loadingText || `checking ${providerLabel}...`;
  const loadingMeta = config.loadingMeta || "waiting for latest scrobble";
  const noTrackText = config.noTrackText || "no recent track found";
  const missingConfigText = config.missingConfigText || `${providerLabel} source is not configured`;
  const playingMeta = config.playingMeta || `playing now via ${providerLabel}`;
  const errorText = config.errorText || `could not refresh ${providerLabel}`;
  const pollMs = Number.isFinite(config.pollMs) && config.pollMs > 0 ? config.pollMs : 30000;

  const updateDisplay = ({ title, meta, href }) => {
    titleNode.textContent = title;
    metaNode.textContent = meta;
    setLinkHref(linkNode, href);
  };

  function buildNowPlayingUrl() {
    const url = new URL(nowPlayingEndpoint, window.location.origin);
    if (sourceName && !isPlaceholderValue(sourceName)) {
      url.searchParams.set("source", sourceName);
    }
    if (sourceType && !isPlaceholderValue(sourceType)) {
      url.searchParams.set("type", sourceType);
    }
    return url.toString();
  }

  async function refreshTrack() {
    try {
      const response = await fetch(buildNowPlayingUrl(), { cache: "no-store" });
      if (response.status === 404) {
        const payload = await response.json().catch(() => ({}));
        updateDisplay({
          title: noTrackText,
          meta: payload.message || missingConfigText,
          href: fallbackHref,
        });
        return;
      }
      if (!response.ok) {
        throw new Error(`${providerLabel} request failed (${response.status})`);
      }

      const payload = await response.json();
      const track = payload && typeof payload === "object" ? payload : null;
      if (!track || (!track.title && !track.track)) {
        updateDisplay({
          title: noTrackText,
          meta: `${providerLabel} returned no tracks`,
          href: fallbackHref,
        });
        return;
      }

      const trackName = typeof track.track === "string" ? track.track : "";
      const artistName = typeof track.artist === "string" ? track.artist : "";
      const title =
        typeof track.title === "string" && track.title
          ? track.title
          : [trackName, artistName].filter(Boolean).join(" - ") || noTrackText;
      const trackHref = typeof track.href === "string" && track.href ? track.href : fallbackHref;
      const nowPlaying = track.nowPlaying === true;
      const playedAt = typeof track.playedAt === "string" && track.playedAt ? track.playedAt : "recently";
      const meta =
        typeof track.meta === "string" && track.meta ? track.meta : nowPlaying ? playingMeta : `last played ${playedAt}`;

      updateDisplay({ title, meta, href: trackHref });
    } catch (error) {
      const reason = error instanceof Error ? error.message : "unknown error";
      console.warn(`${providerLabel} now playing update failed:`, reason);
      updateDisplay({
        title: errorText,
        meta: reason,
        href: fallbackHref,
      });
    }
  }

  updateDisplay({
    title: loadingText,
    meta: loadingMeta,
    href: fallbackHref,
  });

  refreshTrack();
  return window.setInterval(refreshTrack, pollMs);
}
