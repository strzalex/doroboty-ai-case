import { z } from "zod";

export const candidateProfileSchema = z.object({
  displayName: z.string().trim().min(2, "Podaj imię lub nazwę zawodową.").max(120),
  headline: z.string().trim().min(5, "Opisz krótko swoją rolę.").max(160),
  bio: z.string().trim().min(20, "Napisz przynajmniej kilka zdań.").max(3000),
  city: z.string().trim().min(2).max(120),
  experienceYears: z.coerce.number().int().min(0).max(60),
  languageBackground: z.string().trim().max(120).optional(),
});

export const experienceSchema = z.object({
  title: z.string().trim().min(2).max(160),
  companyName: z.string().trim().min(2).max(160),
  description: z.string().trim().min(20).max(5000),
  measurableOutcome: z.string().trim().max(1000).optional(),
});

export const workSampleSchema = z.object({
  title: z.string().trim().min(2).max(160),
  url: z.union([z.literal(""), z.url().startsWith("https://")]),
  context: z.string().trim().min(20).max(3000),
  outcome: z.string().trim().min(10).max(2000),
});
