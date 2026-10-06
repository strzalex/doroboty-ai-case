import {
  caseReleaseKeys,
  summarizeCaseRelease,
  type CaseJourney,
  type CaseReleaseKey,
} from "./generator.ts";

const funnelColumns: (keyof CaseJourney)[] = [
  "id",
  "release",
  "candidateId",
  "jobId",
  "jobFamily",
  "seniority",
  "viewedAt",
  "startedAt",
  "submittedAt",
  "reviewedAt",
  "invitedAt",
  "conversationAt",
  "employerContinued",
];

const fieldDescriptions: Record<keyof CaseJourney, string> = {
  id: "Stable synthetic journey identifier.",
  release: "The case release represented by this snapshot.",
  candidateId: "Stable synthetic candidate identifier.",
  jobId: "Stable synthetic job identifier.",
  jobFamily: "Product, engineering, or design segment.",
  seniority: "Mid, senior, or lead segment.",
  employerReadiness: "Synthetic low, medium, or high organizational-readiness segment.",
  languageBackground: "Synthetic native/non-native Polish segment; never inferred from a person.",
  variant: "Application interface actually used: long_form or one_click.",
  employerAiAssigned: "Employer-side experiment assignment, independent of exposure.",
  employerAiExposed: "Employer-side AI tool actually rendered and used.",
  candidateAiAssigned: "Candidate-side experiment assignment, independent of exposure.",
  candidateAiExposed: "Candidate-side AI tool actually rendered and used.",
  viewedAt: "Job-view timestamp.",
  startedAt: "Application-start timestamp, or null.",
  submittedAt: "Submission timestamp, or null.",
  reviewedAt: "Employer-review timestamp, or null.",
  invitedAt: "Interview-invitation timestamp, or null.",
  conversationAt: "First-conversation timestamp, or null.",
  employerContinued: "Employer decision after the first conversation; null before a conversation.",
  sourceSignalScore: "Case-only rating of concrete evidence before rewriting.",
  finalTextSignalScore: "Case-only rating of decision-useful evidence in final text.",
  fitScore: "Versioned text-similarity proxy; never a hiring recommendation.",
  textQualityScore: "Readability/quality proxy; not a business outcome.",
};

export function participantColumns(release: CaseReleaseKey): (keyof CaseJourney)[] {
  const index = caseReleaseKeys.indexOf(release);
  if (index === 0) return funnelColumns;
  if (index === 1) return [...funnelColumns, "variant"];
  if (index === 2) return [...funnelColumns, "variant", "employerReadiness", "languageBackground"];
  return Object.keys(fieldDescriptions) as (keyof CaseJourney)[];
}

export function participantSummary(release: CaseReleaseKey, rows: CaseJourney[]) {
  const summary = summarizeCaseRelease(rows);
  const funnel = {
    release,
    viewed: summary.viewed,
    started: summary.started,
    submitted: summary.submitted,
    invited: summary.invited,
    conversations: summary.conversations,
    continued: summary.continued,
  };
  if (caseReleaseKeys.indexOf(release) < caseReleaseKeys.indexOf("post_ai")) return funnel;
  return {
    ...funnel,
    averageFitScore: summary.averageFitScore,
    averageTextQuality: summary.averageTextQuality,
    averageSourceSignal: summary.averageSourceSignal,
    averageFinalSignal: summary.averageFinalSignal,
  };
}

export function participantDictionary(release: CaseReleaseKey) {
  const rows = participantColumns(release)
    .map((field) => `| \`${field}\` | ${fieldDescriptions[field]} |`)
    .join("\n");
  return `# DoRoboty.ai participant data dictionary

Release: **${release}**

The unit of analysis is one synthetic candidate journey for one job. Null timestamps mean the
journey did not reach that stage; do not convert them to zero. The primary outcome is
\`employerContinued\` after a completed first conversation. Earlier funnel events are intermediate
measures.

| Field | Meaning |
| --- | --- |
${rows}

Only fields unlocked for this release are documented here. Stable identifiers support joins with
other evidence supplied for the same stage.
`;
}

export function futureReleaseKeys(release: CaseReleaseKey) {
  return caseReleaseKeys.slice(caseReleaseKeys.indexOf(release) + 1);
}
