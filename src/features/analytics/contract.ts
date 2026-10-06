import { z } from "zod";

const jobId = z.uuid();
const category = z.enum(["build", "apply", "lead"]);
const variant = z.enum(["long_form", "one_click"]);
const purpose = z.enum(["job_draft", "candidate_answer"]);

export const analyticsEventSchema = z.discriminatedUnion("event", [
  z.object({ event: z.literal("job_viewed"), properties: z.object({ jobId, category }).strict() }),
  z.object({
    event: z.literal("application_started"),
    properties: z.object({ jobId, variant }).strict(),
  }),
  z.object({
    event: z.literal("application_submitted"),
    properties: z.object({ jobId, variant, usedAi: z.boolean() }).strict(),
  }),
  z.object({ event: z.literal("one_click_used"), properties: z.object({ jobId }).strict() }),
  z.object({
    event: z.literal("ai_generation_started"),
    properties: z.object({ jobId, purpose }).strict(),
  }),
  z.object({
    event: z.literal("ai_generation_completed"),
    properties: z.object({ jobId, purpose, outcome: z.enum(["succeeded", "failed"]) }).strict(),
  }),
  z.object({
    event: z.literal("ai_generation_approved"),
    properties: z.object({ jobId, purpose }).strict(),
  }),
  z.object({
    event: z.literal("employer_reviewed"),
    properties: z
      .object({
        jobId,
        stage: z.enum([
          "reviewed",
          "interview_invited",
          "first_conversation_held",
          "continued",
          "rejected",
          "hired",
        ]),
      })
      .strict(),
  }),
]);

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;

const forbiddenKey = /(email|name|phone|answer|text|prompt|url|query|note|content)/i;
const emailValue = /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/;
const phoneValue = /(?:\+?\d[\s().-]*){8,}/;
const urlWithQuery = /https?:\/\/\S+\?\S+/i;
const uuidValue = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function containsPii(value: unknown, key = ""): boolean {
  if (forbiddenKey.test(key)) return true;
  if (typeof value === "string") {
    if (uuidValue.test(value)) return false;
    return emailValue.test(value) || phoneValue.test(value) || urlWithQuery.test(value);
  }
  if (Array.isArray(value)) return value.some((item) => containsPii(item));
  if (value && typeof value === "object") {
    return Object.entries(value).some(([childKey, child]) => containsPii(child, childKey));
  }
  return false;
}

export function parseAnalyticsEvent(value: unknown): AnalyticsEvent | null {
  const parsed = analyticsEventSchema.safeParse(value);
  if (!parsed.success || containsPii(parsed.data.properties)) return null;
  return parsed.data;
}
