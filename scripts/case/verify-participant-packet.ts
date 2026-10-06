import { createHash } from "node:crypto";
import { lstat, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { caseReleaseKeys, type CaseReleaseKey } from "../../src/features/case-data/generator.ts";
import { futureReleaseKeys, participantColumns } from "../../src/features/case-data/packet.ts";

const requested = process.argv[2] as CaseReleaseKey | undefined;
if (!requested || !caseReleaseKeys.includes(requested)) {
  throw new Error(`Usage: npm run case:verify-packet -- ${caseReleaseKeys.join(" | ")}`);
}

const directory = join(process.cwd(), "artifacts", `participant-${requested}`);
const names = (await readdir(directory)).sort();
const expected = [
  "DATA_DICTIONARY.md",
  ...(caseReleaseKeys.indexOf(requested) >= caseReleaseKeys.indexOf("discovery")
    ? ["DISCOVERY_PACKET.md"]
    : []),
  "MANIFEST.json",
  "README.md",
  "journeys.csv",
  "summary.json",
].sort();
if (JSON.stringify(names) !== JSON.stringify(expected)) {
  throw new Error(`Unexpected packet files: ${names.join(", ")}`);
}
for (const name of names) {
  if ((await lstat(join(directory, name))).isSymbolicLink())
    throw new Error(`Packet contains a symlink: ${name}`);
}

const manifest = JSON.parse(await readFile(join(directory, "MANIFEST.json"), "utf8")) as {
  release: string;
  files: { path: string; sha256: string }[];
};
if (manifest.release !== requested) throw new Error("Manifest release does not match the packet.");
for (const entry of manifest.files) {
  const digest = createHash("sha256")
    .update(await readFile(join(directory, entry.path)))
    .digest("hex");
  if (digest !== entry.sha256) throw new Error(`Checksum mismatch: ${entry.path}`);
}

const csv = await readFile(join(directory, "journeys.csv"), "utf8");
const actualColumns = csv.slice(0, csv.indexOf("\n")).split(",");
const expectedColumns = participantColumns(requested);
if (JSON.stringify(actualColumns) !== JSON.stringify(expectedColumns)) {
  throw new Error("CSV columns do not match the release policy.");
}

const combined = (
  await Promise.all(
    names
      .filter((name) => name !== "MANIFEST.json")
      .map((name) => readFile(join(directory, name), "utf8")),
  )
).join("\n");
const secretPatterns = [
  /sb_secret_[A-Za-z0-9_-]{20,}/,
  /sk-[A-Za-z0-9]{32,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /service_role/i,
];
if (secretPatterns.some((pattern) => pattern.test(combined))) {
  throw new Error("Packet contains a credential-like value or privileged-key reference.");
}
for (const future of futureReleaseKeys(requested)) {
  if (combined.includes(future)) throw new Error(`Future release leaked into packet: ${future}`);
}
if (caseReleaseKeys.indexOf(requested) < caseReleaseKeys.indexOf("post_ai")) {
  for (const term of [
    "candidateAiAssigned",
    "candidateAiExposed",
    "employerAiAssigned",
    "employerAiExposed",
    "fitScore",
    "textQualityScore",
    "sourceSignalScore",
    "finalTextSignalScore",
  ]) {
    if (combined.includes(term)) throw new Error(`Later-stage field leaked into packet: ${term}`);
  }
}
console.log(
  `Participant packet verified: ${requested}; ${names.length} files; no future-stage fields.`,
);
