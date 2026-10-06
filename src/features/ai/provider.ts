import "server-only";

import {
  AI_POLICY,
  aiAuditEntry,
  deterministicText,
  enforceAiCostLimit,
  enforceAiQuota,
  estimateAiCostUsd,
  safeAiErrorCode,
  type AiTextRequest,
  validateAiOutput,
} from "@/features/ai/provider-core";

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
  const timeout = setTimeout(() => controller.abort(), AI_POLICY.timeoutMs);
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
    const text = validateAiOutput(body.choices?.[0]?.message?.content);
    const inputTokens = body.usage?.prompt_tokens;
    const outputTokens = body.usage?.completion_tokens;
    const estimatedCostUsd = estimateAiCostUsd(
      inputTokens,
      outputTokens,
      Number(process.env.AI_INPUT_USD_PER_MILLION ?? 0),
      Number(process.env.AI_OUTPUT_USD_PER_MILLION ?? 0),
    );
    enforceAiCostLimit(estimatedCostUsd, Number(process.env.AI_MAX_COST_USD_PER_REQUEST ?? 0.05));
    return {
      provider: "openai-compatible",
      model,
      promptVersion: "evidence-first-v1",
      text,
      latencyMs: Math.round(performance.now() - started),
      inputTokens,
      outputTokens,
      estimatedCostUsd,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateAiText(request: AiTextRequest): Promise<AiTextResult> {
  enforceAiQuota(request.subjectId);
  const provider =
    process.env.AI_PROVIDER === "openai-compatible" ? "openai-compatible" : "deterministic";
  const model =
    provider === "openai-compatible" ? (process.env.AI_MODEL ?? "gpt-5-mini") : "course-fixture-v1";
  const started = performance.now();
  try {
    const result =
      provider === "openai-compatible"
        ? await openAiCompatible(request)
        : {
            provider,
            model,
            promptVersion: "evidence-first-v1",
            text: validateAiOutput(deterministicText(request)),
            latencyMs: Math.round(performance.now() - started),
          };
    console.info(
      aiAuditEntry({
        purpose: request.purpose,
        provider: result.provider,
        model: result.model,
        outcome: "succeeded",
        latencyMs: result.latencyMs,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        estimatedCostUsd: result.estimatedCostUsd,
      }),
    );
    return result;
  } catch (error) {
    const errorCode = safeAiErrorCode(error);
    console.warn(
      aiAuditEntry({
        purpose: request.purpose,
        provider,
        model,
        outcome: "failed",
        latencyMs: Math.round(performance.now() - started),
        errorCode,
      }),
    );
    throw new Error(errorCode);
  }
}
