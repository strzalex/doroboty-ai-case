const stopWords = new Set([
  "oraz",
  "jest",
  "dla",
  "się",
  "nie",
  "lub",
  "the",
  "and",
  "with",
  "that",
  "this",
]);

export function tokens(text: string) {
  return new Set(
    text
      .normalize("NFKD")
      .toLocaleLowerCase("pl")
      .replace(/[^a-ząćęłńóśźż0-9 ]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2 && !stopWords.has(token)),
  );
}

export function calculateTextFit(jobText: string, answer: string) {
  const job = tokens(jobText);
  const candidate = tokens(answer);
  const overlap = [...candidate].filter((token) => job.has(token));
  const denominator = new Set([...job, ...candidate]).size;
  const score = denominator ? overlap.length / denominator : 0;
  return {
    version: "token-jaccard-v1",
    score: Math.round(score * 10_000) / 10_000,
    components: { overlap: overlap.length, jobTokens: job.size, answerTokens: candidate.size },
  };
}
