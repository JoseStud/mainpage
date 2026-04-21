import { runRegexTargetChecks } from "./lib/check-regex-targets.mjs";

const targets = [
  {
    file: "public/assets/css/layout.css",
    checks: [
      [/width:\s*min\(980px,\s*calc\(100%\s*-\s*0\.9rem\)\);/, "page width tightened to 980px / 0.9rem gutters"],
      [/gap:\s*8px;\s*\n\s*grid-template-columns:\s*minmax\(0,\s*1fr\)\s*minmax\(0,\s*252px\);/, "layout uses 8px gap and 252px sidebar"],
      [/\.col\s*\{[^}]*gap:\s*8px;/s, "column stack gap is 8px"],
      [/\.portal-split\s*\{[^}]*gap:\s*8px;/s, "portal split gap is 8px"],
      [/padding:\s*8px\s+12px\s+9px;/, "box padding follows E3 panel density"],
      [/border-radius:\s*8px;/, "box radius stays at E3 8px"],
    ],
  },
  {
    file: "public/assets/css/components/shared.css",
    checks: [
      [/margin-bottom:\s*0\.42rem;/, "box heading margin tightened"],
      [/font-size:\s*1\.24rem;/, "main box title scale tightened"],
      [/\.col-side\s+\.box-title\s*\{[^}]*font-size:\s*1\.04rem;/s, "sidebar box title scale tightened"],
      [/font-size:\s*9px;\s*\n\s*letter-spacing:\s*0\.08em;/, "utility labels use E3 small mono scale"],
      [/padding:\s*0\.14rem\s+0\.32rem;/, "chips use tighter E3 padding"],
    ],
  },
  {
    file: "public/assets/css/components/intro.css",
    checks: [
      [/grid-template-columns:\s*98px\s+minmax\(0,\s*1fr\);/, "intro image column tightened"],
      [/width:\s*90px;\s*\n\s*height:\s*90px;/, "avatar display tightened"],
      [/width:\s*90px;\s*\n\s*margin-top:\s*0\.28rem;/, "mood chip matches avatar width"],
    ],
  },
  {
    file: "public/assets/css/components/feeds.css",
    checks: [
      [/gap:\s*0\.34rem;/, "feed/project stack gap tightened"],
      [/padding-bottom:\s*0\.55rem;/, "project block divider spacing tightened"],
      [/font-size:\s*1\.06rem;/, "project heading scale tightened"],
    ],
  },
  {
    file: "public/assets/css/components/sidebar.css",
    checks: [
      [/font-size:\s*1\.62rem;/, "presence title scale tightened"],
      [/grid-template-columns:\s*30px\s+minmax\(0,\s*1fr\);/, "status card icon column tightened"],
      [/width:\s*30px;\s*\n\s*height:\s*30px;/, "status avatar tightened"],
      [/grid-template-columns:\s*repeat\(2,\s*82px\);/, "button grid tightened"],
      [/width:\s*82px;\s*\n\s*min-height:\s*29px;/, "button badge dimensions tightened"],
    ],
  },
  {
    file: "public/assets/css/responsive.css",
    checks: [
      [/width:\s*min\(100%,\s*calc\(100%\s*-\s*0\.55rem\)\);/, "tablet gutters tightened"],
      [/@media\s*\(max-width:\s*720px\)\s*\{[\s\S]*?body\s*\{[^}]*font-size:\s*12px;/, "mobile base type stays readable"],
      [/\.logo-letter\s*\{[^}]*font-size:\s*1\.52rem;/s, "mobile logo scale tightened"],
    ],
  },
];

await runRegexTargetChecks(targets, "E3 tightening");
