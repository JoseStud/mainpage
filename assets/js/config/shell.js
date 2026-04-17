const sharedStarLinks = [
  { id: "home", label: "Home", href: "index.html" },
  { id: "blog", label: "Logbook", href: "blog.html#reading-desk" },
  { id: "portfolio", label: "Projects", href: "portfolio.html#project-shelf" },
  { id: "about", label: "About Jose", href: "index.html#welcome" },
  { id: "systems", label: "Site signals", href: "index.html#site-signals" },
  { id: "button", label: "Site button", href: "index.html#site-button" },
];

const sharedFindMe = [
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

const sharedButtons = [
  { top: "JOSE", bottom: "STUD", href: "https://github.com/JoseStud", tone: "teal" },
  { top: "ANXI", bottom: "DEV", href: "index.html", tone: "gold" },
  { top: "READ", bottom: "LOG", href: "blog.html#reading-desk", tone: "lime" },
  { top: "WORK", bottom: "SHELF", href: "portfolio.html#project-shelf", tone: "pink" },
  { top: "MAPS", bottom: "RAIN", href: "index.html#current-obsessions", tone: "violet" },
  { top: "BODY", bottom: "OK", href: "blog.html#life-tracker", tone: "orange" },
];

const sharedButtonCode = {
  title: "Site button",
  preview: { top: "ANXI", bottom: "JOSE", tone: "teal" },
  code: '<a href="https://anxidev.dev/">ANXIDEV // JOSE</a>',
  note: "Temporary text button until I draw the real 88x31.",
};

const pageShells = {
  home: {
    stars: {
      title: "Stars",
      items: sharedStarLinks,
    },
    online: {
      lead: "Jose is",
      title: "Online!",
      detail: "rain on / docs open / somewhere in Colombia",
    },
    findMe: {
      title: "Find me",
      items: sharedFindMe,
      note: "GitHub is the only live external stop for now.",
    },
    currentInterests: {
      title: "Current interests",
      items: [
        {
          label: "Documentation",
          meta: "reading references until the weird part finally clicks",
        },
        {
          label: "Music",
          meta: "the soundtrack under every late-night browser session",
        },
        {
          label: "Geography + history",
          meta: "maps, borders, timelines, and context for everything",
        },
        {
          label: "Cooking + exercise",
          meta: "building a healthier life on purpose",
        },
      ],
    },
    now: {
      title: "Last loop",
      href: "index.html#current-obsessions",
      text: "trying to make this place feel like a real room instead of a polished summary",
      messages: [
        "trying to make this place feel like a real room instead of a polished summary",
        "reading docs, rearranging ideas, and keeping the rain subtle",
        "thinking about better systems for me and the people I care about",
      ],
    },
    status: {
      title: "Current mood",
      author: "Jose",
      time: "right now",
      text: "Music on, tabs open, trying to build a healthier and more generous life one quiet workflow at a time.",
    },
    extras: {
      title: "Extras",
      items: [
        {
          label: "Guestbook",
          meta: "opening soon once the room settles down",
        },
        {
          label: "Location signal",
          meta: "living somewhere in Colombia for now",
        },
        {
          label: "Button shrine",
          meta: "temporary text badge for the old-web ritual",
          href: "index.html#site-button",
        },
      ],
      note: "Static-first extras for this version. No backend magic yet.",
    },
    buttons: {
      title: "Buttons",
      items: sharedButtons,
    },
    buttonCode: sharedButtonCode,
    footerText: "jose online / anxidev humming",
  },
  blog: {
    stars: {
      title: "Stars",
      items: sharedStarLinks,
    },
    online: {
      lead: "Jose is",
      title: "Online!",
      detail: "draft shelves open / notes over polish",
    },
    findMe: {
      title: "Find me",
      items: sharedFindMe,
      note: "Most roads still lead back to GitHub or this site.",
    },
    currentInterests: {
      title: "Writing threads",
      items: [
        {
          label: "Books I am reading",
          meta: "annotations, reactions, and the books changing the weather in my head",
        },
        {
          label: "Life tracker",
          meta: "habits, body maintenance, and tiny systems that keep me honest",
        },
        {
          label: "Social thought",
          meta: "quiet notes about politics, people, and the shape of shared life",
        },
        {
          label: "Documentation notes",
          meta: "because references deserve a little affection too",
        },
      ],
    },
    now: {
      title: "Last loop",
      href: "blog.html#draft-board",
      text: "keeping the writing shelf honest: drafts first, polish later",
      messages: [
        "keeping the writing shelf honest: drafts first, polish later",
        "filing thoughts about books, routines, and social life before they disappear",
        "treating this blog like a logbook instead of a magazine",
      ],
    },
    status: {
      title: "Current mood",
      author: "Jose",
      time: "today",
      text: "The blog is where I keep track of what I am reading, how I am living, and what I am trying to understand about the world around me.",
    },
    extras: {
      title: "Extras",
      items: [
        {
          label: "Shelf state",
          meta: "drafts, notes, and loose threads welcome",
        },
        {
          label: "Location signal",
          meta: "still somewhere in Colombia",
        },
        {
          label: "Guestbook",
          meta: "reserved space, not wired yet",
        },
      ],
      note: "This room stays closer to notebooks than publication pipelines.",
    },
    buttons: {
      title: "Buttons",
      items: sharedButtons,
    },
    buttonCode: sharedButtonCode,
    footerText: "draft shelf still glowing",
  },
  portfolio: {
    stars: {
      title: "Stars",
      items: sharedStarLinks,
    },
    online: {
      lead: "Jose is",
      title: "Online!",
      detail: "repo shelf open / workbench awake",
    },
    findMe: {
      title: "Find me",
      items: sharedFindMe,
      note: "The project shelf is grounded in real repos, even when the notes stay rough.",
    },
    currentInterests: {
      title: "Workbench focus",
      items: [
        {
          label: "Workflows",
          meta: "declaring the steps so future me can breathe easier",
        },
        {
          label: "Infrastructure",
          meta: "homelab systems, orchestration, and useful automation",
        },
        {
          label: "Full-stack experiments",
          meta: "shipping messy ideas far enough to learn from them",
        },
        {
          label: "Personal web",
          meta: "keeping the site weird, warm, and obviously hand-made",
        },
      ],
    },
    now: {
      title: "Last loop",
      href: "portfolio.html#project-shelf",
      text: "documenting the real repos and leaving room for honest in-progress work",
      messages: [
        "documenting the real repos and leaving room for honest in-progress work",
        "trying to make the shelf useful without pretending everything is finished",
        "keeping the project list grounded in actual experiments",
      ],
    },
    status: {
      title: "Current mood",
      author: "Jose",
      time: "active",
      text: "I like projects that teach me something practical: better workflows, healthier systems, or a clearer way to share what I know.",
    },
    extras: {
      title: "Extras",
      items: [
        {
          label: "Source of truth",
          meta: "GitHub first, rough notes only when I have earned them",
        },
        {
          label: "Incubator",
          meta: "new ideas stay rough until they prove they want to live",
        },
        {
          label: "Guestbook",
          meta: "still on the someday shelf",
        },
      ],
      note: "No fake product polish. Just a real workbench.",
    },
    buttons: {
      title: "Buttons",
      items: sharedButtons,
    },
    buttonCode: sharedButtonCode,
    footerText: "repos stacked / notes attached",
  },
};

export function getPageShell(pageId) {
  return pageShells[pageId] || pageShells.home;
}
