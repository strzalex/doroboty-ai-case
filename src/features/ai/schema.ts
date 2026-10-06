import { z } from "zod";

export const aiJobIdSchema = z.uuid();
export const jobDraftSchema = z.object({ jobId: z.uuid() });
export const jobDraftApprovalSchema = z.object({
  jobId: z.uuid(),
  generationId: z.uuid(),
  title: z.string().trim().min(2).max(160),
  summary: z.string().trim().min(20).max(300),
  description: z.string().trim().min(50).max(30000),
});
