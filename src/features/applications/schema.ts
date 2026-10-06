import { z } from "zod";

export const applicationSchema = z.object({
  jobId: z.uuid(),
  variant: z.enum(["long_form", "one_click"]),
  answer: z.string().trim().min(40, "Napisz przynajmniej 40 znaków.").max(5000),
  aiGenerationId: z.union([z.literal(""), z.uuid()]).optional(),
  confirmed: z.literal("yes", { error: "Potwierdź, że chcesz wysłać aplikację." }),
});

export const employerStageSchema = z.object({
  applicationId: z.uuid(),
  stage: z.enum([
    "reviewed",
    "interview_invited",
    "first_conversation_held",
    "continued",
    "rejected",
    "hired",
  ]),
  note: z.string().trim().max(2000).optional(),
});
