export const sharedStarLinks = [
  { id: "home", label: "Home", href: "index.html" },
  { id: "blog", label: "Logbook", href: "blog.html#reading-desk" },
  { id: "portfolio", label: "Projects", href: "portfolio.html#project-shelf" },
  { id: "about", label: "About Jose", href: "index.html#welcome" },
  { id: "systems", label: "Site signals", href: "index.html#site-signals" },
  { id: "button", label: "Site button", href: "index.html#site-button" },
];

export const sharedFindMe = [
  {
    label: "GitHub",
    meta: "@JoseStud",
    href: "https://github.com/JoseStud",
  },
  {
    label: "Home room",
    meta: "rain, notes, and the main intro",
    href: "index.html#welcome",
  },
  {
    label: "Logbook",
    meta: "books, trackers, and social thought",
    href: "blog.html#reading-desk",
  },
  {
    label: "Workbench",
    meta: "repos, experiments, and project notes",
    href: "portfolio.html#project-shelf",
  },
];

export const sharedButtons = [
  { top: "JOSE", bottom: "STUD", href: "https://github.com/JoseStud", tone: "teal" },
  { top: "ANXI", bottom: "DEV", href: "index.html", tone: "gold" },
  { top: "READ", bottom: "LOG", href: "blog.html#reading-desk", tone: "lime" },
  { top: "WORK", bottom: "SHELF", href: "portfolio.html#project-shelf", tone: "pink" },
  { top: "MAPS", bottom: "RAIN", href: "index.html#current-obsessions", tone: "violet" },
  { top: "BODY", bottom: "OK", href: "blog.html#life-tracker", tone: "orange" },
];

export const sharedButtonCode = {
  title: "Site button",
  chip: "88x31 ready",
  preview: { top: "ANXI", bottom: "JOSE", tone: "teal" },
  code: '<a href="https://anxidev.dev/"><img src="https://anxidev.dev/assets/images/button-anxidev.svg" alt="anxidev"></a>',
  note: "Swap the URL once the live domain settles.",
};

export const sharedCounterDigits = ["0", "0", "4", "7", "2", "8", "1"];

export const sharedControls = {
  title: "Controls",
  chip: "local only",
  rainLabel: "Enable rain overlay",
  note: "Rain preference is stored in this browser only.",
  secondaryNote: "Theme follows your system until you toggle LIGHT, then that choice sticks in this browser.",
};

export const sharedMusicFeed = {
  title: "Now playing",
  chip: "multi-scrobbler",
  providerLabel: "multi-scrobbler",
  nowPlayingEndpoint: "/api/music/now-playing",
  sourceName: "",
  sourceType: "",
  profileHref: "#",
  loadingText: "checking multi-scrobbler...",
  loadingMeta: "waiting for local now-playing data",
  playingMeta: "playing now via multi-scrobbler",
  noTrackText: "no recent track found",
  missingConfigText: "multi-scrobbler source is not configured",
  errorText: "could not refresh multi-scrobbler",
  note: "Reads now-playing from multi-scrobbler on this server node.",
  pollMs: 30000,
};
