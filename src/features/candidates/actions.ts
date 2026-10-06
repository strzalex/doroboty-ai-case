"use server";

import { revalidatePath } from "next/cache";
import {
  candidateProfileSchema,
  experienceSchema,
  workSampleSchema,
} from "@/features/candidates/schema";
import { requireProfile } from "@/features/auth/session";

export type CandidateActionState = { ok: boolean; message: string };

export async function saveCandidateProfile(
  _previous: CandidateActionState,
  formData: FormData,
): Promise<CandidateActionState> {
  const { client, user } = await requireProfile(["candidate"]);
  const parsed = candidateProfileSchema.safeParse({
    displayName: formData.get("displayName"),
    headline: formData.get("headline"),
    bio: formData.get("bio"),
    city: formData.get("city"),
    experienceYears: formData.get("experienceYears"),
    languageBackground: formData.get("languageBackground") || undefined,
  });
  if (!parsed.success)
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Sprawdź formularz." };

  const profileResult = await client
    .from("profiles")
    .update({ display_name: parsed.data.displayName })
    .eq("id", user.id);
  if (profileResult.error) return { ok: false, message: "Nie udało się zapisać nazwy profilu." };
  const { error } = await client.from("candidate_profiles").upsert({
    user_id: user.id,
    headline: parsed.data.headline,
    bio: parsed.data.bio,
    city: parsed.data.city,
    experience_years: parsed.data.experienceYears,
    language_background: parsed.data.languageBackground || null,
    updated_at: new Date().toISOString(),
  });
  if (error) return { ok: false, message: "Nie udało się zapisać profilu." };
  revalidatePath("/app/profil");
  return { ok: true, message: "Profil zapisany." };
}

export async function addExperience(
  _previous: CandidateActionState,
  formData: FormData,
): Promise<CandidateActionState> {
  const { client, user } = await requireProfile(["candidate"]);
  const parsed = experienceSchema.safeParse({
    title: formData.get("title"),
    companyName: formData.get("companyName"),
    description: formData.get("description"),
    measurableOutcome: formData.get("measurableOutcome") || undefined,
  });
  if (!parsed.success)
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Sprawdź doświadczenie." };
  const { error } = await client.from("candidate_experiences").insert({
    user_id: user.id,
    title: parsed.data.title,
    company_name: parsed.data.companyName,
    description: parsed.data.description,
    measurable_outcome: parsed.data.measurableOutcome || null,
  });
  if (error) return { ok: false, message: "Nie udało się dodać doświadczenia." };
  revalidatePath("/app/profil");
  return { ok: true, message: "Doświadczenie dodane." };
}

export async function addWorkSample(
  _previous: CandidateActionState,
  formData: FormData,
): Promise<CandidateActionState> {
  const { client, user } = await requireProfile(["candidate"]);
  const parsed = workSampleSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    context: formData.get("context"),
    outcome: formData.get("outcome"),
  });
  if (!parsed.success)
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Sprawdź próbkę pracy." };
  const { error } = await client.from("candidate_work_samples").insert({
    user_id: user.id,
    title: parsed.data.title,
    url: parsed.data.url || null,
    context: parsed.data.context,
    outcome: parsed.data.outcome,
  });
  if (error) return { ok: false, message: "Nie udało się dodać próbki pracy." };
  revalidatePath("/app/profil");
  return { ok: true, message: "Próbka pracy dodana." };
}
