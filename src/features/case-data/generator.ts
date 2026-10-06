export const caseReleaseKeys = [
  "baseline",
  "post_one_click",
  "discovery",
  "post_ai",
  "pilot",
  "demo_day",
] as const;

export type CaseReleaseKey = (typeof caseReleaseKeys)[number];

export type CaseJourney = {
  id: string;
  release: CaseReleaseKey;
  candidateId: string;
  jobId: string;
  jobFamily: "product" | "engineering" | "design";
  seniority: "mid" | "senior" | "lead";
  employerReadiness: "low" | "medium" | "high";
  languageBackground: "native_pl" | "non_native_pl";
  variant: "long_form" | "one_click";
  employerAiAssigned: boolean;
  employerAiExposed: boolean;
  candidateAiAssigned: boolean;
  candidateAiExposed: boolean;
  viewedAt: string;
  startedAt: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  invitedAt: string | null;
  conversationAt: string | null;
  employerContinued: boolean | null;
  sourceSignalScore: number;
  finalTextSignalScore: number;
  fitScore: number | null;
  textQualityScore: number | null;
};

const releaseConfig: Record<
  CaseReleaseKey,
  {
    starts: number;
    submits: number;
    reviews: number;
    invites: number;
    conversations: number;
    continued: number;
    oneClick: boolean;
    ai: boolean;
  }
> = {
  baseline: {
    starts: 72,
    submits: 36,
    reviews: 31,
    invites: 18,
    conversations: 12,
    continued: 6,
    oneClick: false,
    ai: false,
  },
  post_one_click: {
    starts: 96,
    submits: 72,
    reviews: 55,
    invites: 23,
    conversations: 14,
    continued: 6,
    oneClick: true,
    ai: false,
  },
  discovery: {
    starts: 96,
    submits: 72,
    reviews: 55,
    invites: 23,
    conversations: 14,
    continued: 6,
    oneClick: true,
    ai: false,
  },
  post_ai: {
    starts: 100,
    submits: 84,
    reviews: 67,
    invites: 26,
    conversations: 16,
    continued: 6,
    oneClick: true,
    ai: true,
  },
  pilot: {
    starts: 104,
    submits: 88,
    reviews: 72,
    invites: 31,
    conversations: 20,
    continued: 9,
    oneClick: true,
    ai: true,
  },
  demo_day: {
    starts: 104,
    submits: 88,
    reviews: 72,
    invites: 31,
    conversations: 20,
    continued: 9,
    oneClick: true,
    ai: true,
  },
};

const releaseDates: Record<CaseReleaseKey, string> = {
  baseline: "2026-01-05T09:00:00.000Z",
  post_one_click: "2026-02-02T09:00:00.000Z",
  discovery: "2026-02-16T09:00:00.000Z",
  post_ai: "2026-03-09T09:00:00.000Z",
  pilot: "2026-04-06T09:00:00.000Z",
  demo_day: "2026-05-04T09:00:00.000Z",
};

function timestamp(base: string, index: number, hours: number) {
  return new Date(new Date(base).getTime() + index * 86_400_000 + hours * 3_600_000).toISOString();
}

function fixed(value: number) {
  return Math.round(Math.max(0, Math.min(1, value)) * 100) / 100;
}

export function generateCaseRelease(release: CaseReleaseKey): CaseJourney[] {
  const config = releaseConfig[release];
  return Array.from({ length: 120 }, (_, position) => {
    const index = position + 1;
    const submitted = index <= config.submits;
    const candidateAiAssigned = config.ai && index % 2 === 0;
    const employerAiAssigned = config.ai && index % 4 >= 2;
    const candidateAiExposed = candidateAiAssigned && submitted && index % 10 !== 0;
    const employerAiExposed = employerAiAssigned && index % 9 !== 0;
    const sourceSignalScore = fixed(0.83 - index / 260 + (index % 7) / 50);
    const polishLift = (index - 1) % 5 === 0 && candidateAiExposed ? 0.24 : 0;
    const polishCompression = candidateAiExposed || employerAiExposed ? 0.16 : 0;
    const finalTextSignalScore = fixed(sourceSignalScore - polishCompression + polishLift);
    const fitScore = submitted
      ? fixed(
          0.5 + (candidateAiExposed ? 0.2 : 0) + (employerAiExposed ? 0.14 : 0) + (index % 6) / 100,
        )
      : null;
    const textQualityScore = submitted
      ? fixed(
          0.59 +
            (candidateAiExposed ? 0.18 : 0) +
            (employerAiExposed ? 0.12 : 0) +
            (index % 5) / 100,
        )
      : null;

    return {
      id: `journey-${release}-${String(index).padStart(3, "0")}`,
      release,
      candidateId: `candidate-${String(index).padStart(3, "0")}`,
      jobId: `job-${String(((index - 1) % 6) + 1).padStart(2, "0")}`,
      jobFamily: (["product", "engineering", "design"] as const)[(index - 1) % 3],
      seniority: (["mid", "senior", "lead"] as const)[(index - 1) % 3],
      employerReadiness: (["low", "medium", "high"] as const)[(index * 2) % 3],
      languageBackground: (index - 1) % 5 === 0 ? "non_native_pl" : "native_pl",
      variant: config.oneClick && index % 4 !== 0 ? "one_click" : "long_form",
      employerAiAssigned,
      employerAiExposed,
      candidateAiAssigned,
      candidateAiExposed,
      viewedAt: timestamp(releaseDates[release], index, 0),
      startedAt: index <= config.starts ? timestamp(releaseDates[release], index, 1) : null,
      submittedAt: submitted ? timestamp(releaseDates[release], index, 2) : null,
      reviewedAt: index <= config.reviews ? timestamp(releaseDates[release], index, 28) : null,
      invitedAt: index <= config.invites ? timestamp(releaseDates[release], index, 52) : null,
      conversationAt:
        index <= config.conversations ? timestamp(releaseDates[release], index, 100) : null,
      employerContinued: index <= config.conversations ? index <= config.continued : null,
      sourceSignalScore,
      finalTextSignalScore,
      fitScore,
      textQualityScore,
    };
  });
}

export function summarizeCaseRelease(rows: CaseJourney[]) {
  const count = (predicate: (row: CaseJourney) => boolean) => rows.filter(predicate).length;
  const average = (selector: (row: CaseJourney) => number | null) => {
    const values = rows.map(selector).filter((value): value is number => value !== null);
    return values.length
      ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100) / 100
      : null;
  };
  return {
    viewed: rows.length,
    started: count((row) => row.startedAt !== null),
    submitted: count((row) => row.submittedAt !== null),
    invited: count((row) => row.invitedAt !== null),
    conversations: count((row) => row.conversationAt !== null),
    continued: count((row) => row.employerContinued === true),
    averageFitScore: average((row) => row.fitScore),
    averageTextQuality: average((row) => row.textQualityScore),
    averageSourceSignal: average((row) => row.sourceSignalScore),
    averageFinalSignal: average((row) => row.finalTextSignalScore),
  };
}

export function validateCaseRelease(rows: CaseJourney[]) {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const row of rows) {
    if (ids.has(row.id)) errors.push(`duplicate id: ${row.id}`);
    ids.add(row.id);
    if (row.submittedAt && !row.startedAt) errors.push(`submitted without start: ${row.id}`);
    if (row.reviewedAt && !row.submittedAt) errors.push(`reviewed without submission: ${row.id}`);
    if (row.invitedAt && !row.reviewedAt) errors.push(`invited without review: ${row.id}`);
    if (row.conversationAt && !row.invitedAt)
      errors.push(`conversation without invitation: ${row.id}`);
    if (row.employerContinued !== null && !row.conversationAt)
      errors.push(`decision without conversation: ${row.id}`);
    if (row.candidateAiExposed && !row.candidateAiAssigned)
      errors.push(`candidate exposure without assignment: ${row.id}`);
    if (row.employerAiExposed && !row.employerAiAssigned)
      errors.push(`employer exposure without assignment: ${row.id}`);
  }
  return errors;
}

export type CaseSegment = Partial<
  Pick<CaseJourney, "jobFamily" | "seniority" | "employerReadiness" | "languageBackground">
>;

export function filterCaseRelease(rows: CaseJourney[], segment: CaseSegment) {
  return rows.filter((row) =>
    (Object.entries(segment) as [keyof CaseSegment, string][]).every(
      ([key, value]) => !value || row[key] === value,
    ),
  );
}

export type CaseCohortSummary = {
  label: string;
  size: number;
  submissionRate: number;
  conversationRate: number;
  continuationRate: number | null;
  averageFitScore: number | null;
  averageTextQuality: number | null;
};

export function summarizeCohort(label: string, rows: CaseJourney[]): CaseCohortSummary {
  const summary = summarizeCaseRelease(rows);
  const rate = (numerator: number, denominator: number) =>
    denominator ? Math.round((numerator / denominator) * 1000) / 10 : 0;
  return {
    label,
    size: rows.length,
    submissionRate: rate(summary.submitted, summary.viewed),
    conversationRate: rate(summary.conversations, summary.submitted),
    continuationRate: summary.conversations ? rate(summary.continued, summary.conversations) : null,
    averageFitScore: summary.averageFitScore,
    averageTextQuality: summary.averageTextQuality,
  };
}

export function compareCaseCohorts(rows: CaseJourney[]) {
  return [
    summarizeCohort(
      "Bez ekspozycji AI",
      rows.filter((row) => !row.candidateAiExposed && !row.employerAiExposed),
    ),
    summarizeCohort(
      "AI kandydata",
      rows.filter((row) => row.candidateAiExposed && !row.employerAiExposed),
    ),
    summarizeCohort(
      "AI pracodawcy",
      rows.filter((row) => !row.candidateAiExposed && row.employerAiExposed),
    ),
    summarizeCohort(
      "Obie interwencje",
      rows.filter((row) => row.candidateAiExposed && row.employerAiExposed),
    ),
  ];
}
