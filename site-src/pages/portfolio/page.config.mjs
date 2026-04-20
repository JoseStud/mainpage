export const portfolioPage = {
  outputFile: "portfolio.html",
  title: "anxidev // projects",
  description: "anxidev projects - small software, warm tools, and experiments.",
  page: "portfolio",
  sourceDir: "site-src/pages/portfolio",
  docsDir: "docs/sections/portfolio",
  sections: [
    {
      id: "shelf-intro",
      title: "Shelf intro",
      file: "shelf-intro.section.html",
      doc: "shelf-intro.md",
    },
    {
      id: "project-ticker",
      title: "Project ticker",
      file: "project-ticker.section.html",
      doc: "project-ticker.md",
    },
    {
      id: "project-lineup",
      title: "Project lineup",
      file: "project-lineup.section.html",
      doc: "project-lineup.md",
    },
    {
      id: "portal-split",
      title: "By language + workbench notes",
      file: "portal-split.section.html",
      doc: "portal-split.md",
    },
  ],
};

export default portfolioPage;
