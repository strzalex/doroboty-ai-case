import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  caseReleaseKeys,
  generateCaseRelease,
  summarizeCaseRelease,
  type CaseReleaseKey,
} from "../../src/features/case-data/generator.ts";

const requested = process.argv[2] as CaseReleaseKey | undefined;
if (!requested || !caseReleaseKeys.includes(requested)) {
  throw new Error(`Usage: npm run case:packet -- ${caseReleaseKeys.join(" | ")}`);
}

const output = join(process.cwd(), "artifacts", `participant-${requested}`);
await mkdir(output, { recursive: true });
const rows = generateCaseRelease(requested);
const headers = Object.keys(rows[0]);
const csv = [
  headers.join(","),
  ...rows.map((row) =>
    headers.map((key) => JSON.stringify(row[key as keyof typeof row] ?? "")).join(","),
  ),
].join("\n");
await writeFile(join(output, "journeys.csv"), csv);
await writeFile(
  join(output, "summary.json"),
  `${JSON.stringify(summarizeCaseRelease(rows), null, 2)}\n`,
);
await writeFile(
  join(output, "README.md"),
  `# DoRoboty.ai participant packet\n\nRelease: **${requested}**\n\nThis archive contains only the selected deterministic snapshot. It does not contain instructor credentials, application source, git history, or later release datasets. Join records using the stable IDs documented in the supplied data dictionary. Do not treat fit score as a hiring outcome.\n`,
);
await writeFile(
  join(output, "DATA_DICTIONARY.md"),
  await readFile(join(process.cwd(), "docs/case/DATA_DICTIONARY.md"), "utf8"),
);
if (["discovery", "post_ai", "pilot", "demo_day"].includes(requested)) {
  await writeFile(
    join(output, "DISCOVERY_PACKET.md"),
    await readFile(join(process.cwd(), "docs/case/DISCOVERY_PACKET.md"), "utf8"),
  );
}
console.log(`Participant-safe packet written to ${output}`);
