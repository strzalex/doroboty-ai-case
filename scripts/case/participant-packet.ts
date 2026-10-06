import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  caseReleaseKeys,
  generateCaseRelease,
  type CaseReleaseKey,
} from "../../src/features/case-data/generator.ts";
import {
  participantColumns,
  participantDictionary,
  participantSummary,
} from "../../src/features/case-data/packet.ts";

const requested = process.argv[2] as CaseReleaseKey | undefined;
if (!requested || !caseReleaseKeys.includes(requested)) {
  throw new Error(`Usage: npm run case:packet -- ${caseReleaseKeys.join(" | ")}`);
}

const output = join(process.cwd(), "artifacts", `participant-${requested}`);
await mkdir(output, { recursive: true });
const rows = generateCaseRelease(requested);
const headers = participantColumns(requested);
const csv = [
  headers.join(","),
  ...rows.map((row) => headers.map((key) => JSON.stringify(row[key] ?? "")).join(",")),
].join("\n");
const written: string[] = [];
async function write(name: string, content: string) {
  await writeFile(join(output, name), content);
  written.push(name);
}
await write("journeys.csv", csv);
await write("summary.json", `${JSON.stringify(participantSummary(requested, rows), null, 2)}\n`);
await write(
  "README.md",
  `# DoRoboty.ai participant packet\n\nRelease: **${requested}**\n\nThis archive contains only the selected deterministic snapshot. It does not contain instructor credentials, application source, git history, or later release datasets. Join records using the stable IDs documented in the supplied data dictionary.${caseReleaseKeys.indexOf(requested) >= caseReleaseKeys.indexOf("post_ai") ? " Do not treat fit score as a hiring outcome." : ""}\n`,
);
await write("DATA_DICTIONARY.md", participantDictionary(requested));
if (["discovery", "post_ai", "pilot", "demo_day"].includes(requested)) {
  await write(
    "DISCOVERY_PACKET.md",
    await readFile(join(process.cwd(), "docs/case/DISCOVERY_PACKET.md"), "utf8"),
  );
}
const manifest = {
  release: requested,
  files: await Promise.all(
    written.sort().map(async (name) => ({
      path: name,
      sha256: createHash("sha256")
        .update(await readFile(join(output, name)))
        .digest("hex"),
    })),
  ),
};
await writeFile(join(output, "MANIFEST.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Participant-safe packet written to ${output}`);
