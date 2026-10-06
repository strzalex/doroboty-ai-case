export type AiPurpose = "job_draft" | "candidate_answer";

export type AiTextRequest = {
  purpose: AiPurpose;
  subjectId: string;
  source: Record<string, unknown>;
};

const quota = new Map<string, number[]>();

export function enforceAiQuota(subjectId: string, now = Date.now()) {
  const recent = (quota.get(subjectId) ?? []).filter((timestamp) => now - timestamp < 3_600_000);
  if (recent.length >= 20) throw new Error("AI_QUOTA_EXCEEDED");
  recent.push(now);
  quota.set(subjectId, recent);
}

export function deterministicText(request: AiTextRequest) {
  if (request.purpose === "candidate_answer") {
    const jobTitle = String(request.source.jobTitle ?? "tej roli");
    const headline = String(request.source.headline ?? "specjalista produktu");
    const experience = Array.isArray(request.source.experiences)
      ? (request.source.experiences[0] as Record<string, unknown> | undefined)
      : undefined;
    const evidence = experience
      ? `${String(experience.title ?? "W poprzednim projekcie")} w ${String(experience.company_name ?? "zespole")}: ${String(experience.measurable_outcome ?? experience.description ?? "doprowadziłem pracę do mierzalnego wyniku")}`
      : "Potrafię przejść od rozpoznania problemu do sprawdzonego wdrożenia i jasno opisać własną odpowiedzialność.";
    return `Jako ${headline} wnoszę do roli ${jobTitle} doświadczenie oparte na konkretnym dowodzie. ${evidence}. Chcę podczas rozmowy pokazać tok decyzji, kompromisy i sposób mierzenia rezultatu, zamiast zastępować je ogólną deklaracją motywacji.`;
  }
  const title = String(request.source.title ?? "Specjalista AI");
  const criteria = Array.isArray(request.source.decisionCriteria)
    ? request.source.decisionCriteria.map(String).join(", ")
    : "samodzielność, współpraca i mierzalny efekt";
  return `${title}\n\nSzukamy osoby, która potrafi połączyć potrzeby użytkowników, decyzje produktowe i odpowiedzialne wykorzystanie AI. Najważniejsze kryteria tej roli to: ${criteria}.\n\nW pierwszych tygodniach poznasz kontekst zespołu, wybierzesz wartościowy problem i zaproponujesz sposób sprawdzenia rozwiązania z realnymi użytkownikami. Opisz w aplikacji własną odpowiedzialność, podjęte decyzje oraz mierzalny efekt wcześniejszej pracy.`;
}
