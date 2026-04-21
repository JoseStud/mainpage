import { runRegexTargetChecks } from "./lib/check-regex-targets.mjs";

const targets = [
  {
    file: "public/assets/css/tokens.css",
    checks: [
      [/--sunrise-duration:\s*3200ms;/, "sunrise duration is long enough to settle smoothly"],
      [/--sunrise-ease-out:\s*cubic-bezier\(0\.22,\s*1,\s*0\.36,\s*1\);/, "sunrise ease-out uses the E3-style slow settle"],
      [/--sunrise-ease-in-out:\s*cubic-bezier\(0\.33,\s*0,\s*0\.2,\s*1\);/, "sunrise in-out easing avoids abrupt midpoint changes"],
      [/--ambient-ease:\s*cubic-bezier\(0\.45,\s*0,\s*0\.25,\s*1\);/, "ambient loops use a shared soft easing token"],
    ],
  },
  {
    file: "public/assets/css/effects.css",
    checks: [
      [/animation:\s*rain-fallback-slide\s+18s\s+var\(--ambient-ease,\s*ease-in-out\)\s+infinite\s+alternate;/, "rain fallback drift is slower and alternates smoothly"],
      [/0%,\s*\n\s*100%\s*\{[\s\S]*?opacity:\s*1;[\s\S]*?50%\s*\{[\s\S]*?-\s*0\.6px\)\);[\s\S]*?opacity:\s*0\.94;/, "logo pulse is gentler than the previous 1px/0.88 pulse"],
    ],
  },
  {
    file: "public/assets/css/components/header.css",
    checks: [
      [/animation:\s*logo-flicker\s+9s\s+steps\(1,\s*end\)\s+infinite;/, "logo flicker cadence is slower"],
      [/animation:\s*letter-pulse\s+1\.9s\s+var\(--ambient-ease,\s*ease-in-out\)\s+infinite;/, "letter pulse uses soft shared easing"],
    ],
  },
  {
    file: "public/assets/js/features/rain.js",
    checks: [
      [/let\s+lastFrameAt\s*=\s*0;/, "rain stores the previous frame time"],
      [/const\s+deltaRatio\s*=\s*Math\.min\(2,\s*deltaMs\s*\/\s*\(1000\s*\/\s*60\)\);/, "rain movement is normalized to 60fps"],
      [/drop\.y\s*\+=\s*drop\.speed\s*\*\s*deltaRatio;/, "rain vertical speed is time based"],
      [/drop\.x\s*-=\s*drop\.drift\s*\*\s*0\.22\s*\*\s*deltaRatio;/, "rain drift is time based"],
    ],
  },
  {
    file: "public/assets/js/features/background-sprinkles.js",
    checks: [
      [/floatDuration:\s*randomBetween\(30,\s*52\),/, "icon float duration is slower"],
      [/twinkleDuration:\s*randomBetween\(7\.5,\s*13\.5\),/, "star twinkle duration is slower"],
      [/floatDuration:\s*randomBetween\(42,\s*68\),/, "cloud drift duration is slower"],
    ],
  },
  {
    file: "public/assets/js/features/theme-transition.js",
    checks: [
      [/},\s*duration\s*\+\s*120\);/, "theme transition waits for the final CSS frame before swapping state"],
    ],
  },
];

await runRegexTargetChecks(targets, "Animation smoothing");
