import "server-only";

import { deterministicText, enforceAiQuota, type AiTextRequest } from "@/features/ai/provider-core";

export type { AiPurpose, AiTextRequest } from "@/features/ai/provider-core";

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
  enforceAiQuota(request.subjectId);
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
