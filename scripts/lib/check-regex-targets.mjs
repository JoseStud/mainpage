import { readFile } from "node:fs/promises";

export async function runRegexTargetChecks(targets, label) {
  const contents = await Promise.all(targets.map((target) => readFile(target.file, "utf8")));

  let failures = 0;
  for (const [index, target] of targets.entries()) {
    const text = contents[index];
    for (const [pattern, message] of target.checks) {
      if (!pattern.test(text)) {
        failures += 1;
        console.error(`FAIL ${target.file}: ${message}`);
      }
    }
  }

  if (failures > 0) {
    console.error(`${label} check failed with ${failures} issue${failures === 1 ? "" : "s"}.`);
    process.exit(1);
  }

  console.log(`${label} check passed.`);
}
