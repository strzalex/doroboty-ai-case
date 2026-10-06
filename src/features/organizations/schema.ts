import { z } from "zod";

export const organizationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().trim().min(10).max(240),
  description: z.string().trim().min(20).max(5000),
  website: z.url().startsWith("https://"),
  location: z.string().trim().min(2).max(120),
  size: z.string().trim().min(2).max(80),
});
