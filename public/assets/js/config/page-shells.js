import {
  sharedButtonCode,
  sharedButtons,
  sharedControls,
  sharedCounterDigits,
  sharedFindMe,
  sharedMusicFeed,
  sharedStarLinks,
} from "./shared-shell.js";

export const pageShells = {
  home: {
    header: {
      lead: "anxidev // attic relay",
      sub: "/index.html · plain html / css / js · rain on glass",
    },
    stars: {
      title: "Stars",
      chip: "navigation",
      items: sharedStarLinks,
    },
    online: {
      lead: "Jose is",
      title: "Online!",
      detail: "rain on / docs open / somewhere in Colombia",
    },
    findMe: {
      title: "Find me",
      chip: "outbound",
      items: sharedFindMe,
      note: "GitHub is the only live external stop for now.",
    },
    currentInterests: {
      title: "Current interests",
      chip: "in focus",
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
    music: sharedMusicFeed,
    status: {
      title: "Current mood",
      author: "Jose",
      time: "right now",
      text: "Music on, tabs open, trying to build a healthier and more generous life one quiet workflow at a time.",
    },
    extras: {
      title: "Extras",
      chip: "someday shelf",
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
    counter: {
      title: "Visitors",
      chip: "since 2021",
      digits: sharedCounterDigits,
      label: "counter still clicking upward",
    },
    buttons: {
      title: "Buttons",
      chip: "88x31 wall",
      items: sharedButtons,
    },
    buttonCode: sharedButtonCode,
    controls: sharedControls,
    footerText: "jose online / anxidev humming",
  },
  blog: {
    header: {
      lead: "anxidev // archive board",
      sub: "/blog.html · archive mode · notes over growth loops",
    },
    stars: {
      title: "Stars",
      chip: "navigation",
      items: sharedStarLinks,
    },
    online: {
      lead: "Jose is",
      title: "Online!",
      detail: "draft shelves open / notes over polish",
    },
    findMe: {
      title: "Find me",
      chip: "paths out",
      items: sharedFindMe,
      note: "Most roads still lead back to GitHub or this site.",
    },
    currentInterests: {
      title: "Writing threads",
      chip: "current pile",
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
    music: sharedMusicFeed,
    status: {
      title: "Current mood",
      author: "Jose",
      time: "today",
      text: "The blog is where I keep track of what I am reading, how I am living, and what I am trying to understand about the world around me.",
    },
    extras: {
      title: "Extras",
      chip: "room tone",
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
    counter: {
      title: "Visitors",
      chip: "shared counter",
      digits: sharedCounterDigits,
      label: "archive readers still arriving",
    },
    buttons: {
      title: "Buttons",
      chip: "shared wall",
      items: sharedButtons,
    },
    buttonCode: sharedButtonCode,
    controls: sharedControls,
    footerText: "draft shelf still glowing",
  },
  portfolio: {
    header: {
      lead: "anxidev // workbench",
      sub: "/portfolio.html · project shelf · hand-made software",
    },
    stars: {
      title: "Stars",
      chip: "navigation",
      items: sharedStarLinks,
    },
    online: {
      lead: "Jose is",
      title: "Online!",
      detail: "repo shelf open / workbench awake",
    },
    findMe: {
      title: "Find me",
      chip: "real repos",
      items: sharedFindMe,
      note: "The project shelf stays grounded in actual experiments.",
    },
    currentInterests: {
      title: "Workbench focus",
      chip: "active tracks",
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
    music: sharedMusicFeed,
    status: {
      title: "Current mood",
      author: "Jose",
      time: "active",
      text: "I like projects that teach me something practical: better workflows, healthier systems, or a clearer way to share what I know.",
    },
    extras: {
      title: "Extras",
      chip: "bench notes",
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
    counter: {
      title: "Visitors",
      chip: "shared counter",
      digits: sharedCounterDigits,
      label: "project shelf traffic",
    },
    buttons: {
      title: "Buttons",
      chip: "shared wall",
      items: sharedButtons,
    },
    buttonCode: sharedButtonCode,
    controls: sharedControls,
    footerText: "repos stacked / notes attached",
  },
  "sunrise-test": {},
  "sunrise-test-icons": {},
  "sunrise-test-stars": {},
  "sunrise-test-clouds": {},
  "sunrise-test-rain": {},
};
