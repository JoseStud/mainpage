export const homePage = {
  outputFile: "index.html",
  title: "anxidev // home",
  description:
    "anxidev - warm, rainy personal site with notes, projects, and guestbook entries.",
  page: "home",
  sourceDir: "site-src/pages/home",
  docsDir: "docs/sections/home",
  sections: [
    {
      id: "welcome",
      title: "Welcome intro",
      file: "welcome-intro.partial.html",
      doc: "welcome-intro.md",
    },
    {
      id: "site-ticker",
      title: "Site ticker",
      file: "site-ticker.partial.html",
      doc: "site-ticker.md",
    },
    {
      id: "logbook-preview",
      title: "Logbook preview",
      file: "logbook-preview.partial.html",
      doc: "logbook-preview.md",
    },
    {
      id: "project-shelf-preview",
      title: "Project shelf preview",
      file: "project-shelf-preview.partial.html",
      doc: "project-shelf-preview.md",
    },
    {
      id: "systems-guestbook-split",
      title: "Systems + guestbook split",
      file: "systems-guestbook-split.partial.html",
      doc: "systems-guestbook-split.md",
    },
    {
      id: "album",
      title: "Photo room",
      file: "photo-room.partial.html",
      doc: "photo-room.md",
    },
  ],
};

export default homePage;
