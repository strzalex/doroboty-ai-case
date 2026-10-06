import "server-only";

export type AiPurpose = "job_draft" | "candidate_answer";

export type AiTextRequest = {
  purpose: AiPurpose;
  subjectId: string;
  source: Record<string, unknown>;
};

export type AiTextResult = {
  provider: string;
  model: string;
  promptVersion: string;
  text: string;
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
  estimatedCostUsd?: number;
};

const quota = new Map<string, number[]>();

function enforceQuota(subjectId: string) {
  const now = Date.now();
  const recent = (quota.get(subjectId) ?? []).filter((timestamp) => now - timestamp < 3_600_000);
  if (recent.length >= 20) throw new Error("AI_QUOTA_EXCEEDED");
  recent.push(now);
  quota.set(subjectId, recent);
}

function deterministicText(request: AiTextRequest) {
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

async function openAiCompatible(request: AiTextRequest): Promise<AiTextResult> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) throw new Error("AI_PROVIDER_NOT_CONFIGURED");
  const model = process.env.AI_MODEL ?? "gpt-5-mini";
  const baseUrl = process.env.AI_BASE_URL ?? "https://api.openai.com/v1";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  const started = performance.now();
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "Write concise Polish recruitment copy. Use only supplied evidence. Never invent achievements, requirements, credentials, or metrics.",
          },
          {
            role: "user",
            content: JSON.stringify({ purpose: request.purpose, source: request.source }),
          },
        ],
      }),
    });
    if (!response.ok) throw new Error(`AI_PROVIDER_HTTP_${response.status}`);
    const body = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    const text = body.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("AI_PROVIDER_EMPTY_OUTPUT");
    return {
      provider: "openai-compatible",
      model,
      promptVersion: "evidence-first-v1",
      text,
      latencyMs: Math.round(performance.now() - started),
      inputTokens: body.usage?.prompt_tokens,
      outputTokens: body.usage?.completion_tokens,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateAiText(request: AiTextRequest): Promise<AiTextResult> {
  enforceQuota(request.subjectId);
  if (process.env.AI_PROVIDER === "openai-compatible") return openAiCompatible(request);
  const started = performance.now();
  const text = deterministicText(request);
  return {
    provider: "deterministic",
    model: "course-fixture-v1",
    promptVersion: "evidence-first-v1",
    text,
    latencyMs: Math.round(performance.now() - started),
  };
}
