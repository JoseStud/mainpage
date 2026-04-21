const sharedSection = {
  id: "background-only",
  title: "Background-only sunrise stage",
  file: "background-only.partial.html",
  doc: "background-only.md",
};

const baseRuntime = {
  initialTheme: "dark",
  ignoreStoredTheme: true,
  autoSunrise: true,
  autoSunriseDelayMs: 160,
  showPageChrome: false,
};

const variants = [
  { slug: "sunrise-test", label: "sunrise test", description: "Sunrise-only background animation test page.", backdrop: false, sprinkleTypes: [], rain: false },
  { slug: "sunrise-test-icons", label: "sunrise test icons", description: "Sunrise test with backdrop motifs and floating icon elements.", backdrop: true, sprinkleTypes: ["icon"], rain: false },
  { slug: "sunrise-test-stars", label: "sunrise test stars", description: "Sunrise test with icons and star elements.", backdrop: true, sprinkleTypes: ["icon", "star"], rain: false },
  { slug: "sunrise-test-clouds", label: "sunrise test clouds", description: "Sunrise test with icons, stars, and cloud elements.", backdrop: true, sprinkleTypes: ["icon", "star", "cloud"], rain: false },
  { slug: "sunrise-test-rain", label: "sunrise test rain", description: "Fuller sunrise background test with icons, stars, clouds, and rain.", backdrop: true, sprinkleTypes: ["icon", "star", "cloud"], rain: true },
];

export const sunriseTestPages = variants.map((variant) => ({
  outputFile: `${variant.slug}.html`,
  title: `anxidev // ${variant.label}`,
  description: variant.description,
  page: variant.slug,
  sourceDir: "src/site/pages/sunrise-test",
  docsDir: "docs/sections/sunrise-test",
  runtime: {
    ...baseRuntime,
    showBackdrop: variant.backdrop,
    enableBackgroundSprinkles: variant.sprinkleTypes.length > 0,
    backgroundSprinkleTypes: variant.sprinkleTypes,
    enableRain: variant.rain,
  },
  sections: [sharedSection],
}));

export const sunriseTestPage = sunriseTestPages[0];

export default sunriseTestPage;
