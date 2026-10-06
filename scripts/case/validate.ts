import {
  caseReleaseKeys,
  generateCaseRelease,
  summarizeCaseRelease,
  validateCaseRelease,
} from "../../src/features/case-data/generator.ts";

let failed = false;
for (const release of caseReleaseKeys) {
  const rows = generateCaseRelease(release);
  const errors = validateCaseRelease(rows);
  if (errors.length) {
    failed = true;
    console.error(`${release}: ${errors.join(", ")}`);
  } else {
    console.log(`${release}:`, summarizeCaseRelease(rows));
  }
}
if (failed) process.exit(1);
