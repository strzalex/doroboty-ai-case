"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { applicationSchema, employerStageSchema } from "@/features/applications/schema";
import { requireProfile } from "@/features/auth/session";
import { calculateTextFit } from "@/features/ai/text-fit";
import { captureAnalytics } from "@/features/analytics/server";

export type ApplicationActionState = { ok: boolean; message: string };

export async function submitApplication(
  _previous: ApplicationActionState,
  formData: FormData,
): Promise<ApplicationActionState> {
  const { client, user, profile } = await requireProfile(["candidate"]);
  const parsed = applicationSchema.safeParse({
    jobId: formData.get("jobId"),
    variant: formData.get("variant"),
    answer: formData.get("answer"),
    aiGenerationId: formData.get("aiGenerationId") || "",
    confirmed: formData.get("confirmed"),
  });
  if (!parsed.success)
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Sprawdź formularz." };

  const { data: job, error: jobError } = await client
    .from("jobs")
    .select("id, company_id, publication_status, title, summary, description")
    .eq("id", parsed.data.jobId)
    .eq("publication_status", "published")
    .single();
  if (jobError || !job) return { ok: false, message: "Ta oferta nie jest już dostępna." };

  const [organizationResult, candidateResult, experiencesResult, samplesResult] = await Promise.all(
    [
      client.from("organizations").select("id").eq("company_id", job.company_id).single(),
      client.from("candidate_profiles").select("*").eq("user_id", user.id).single(),
      client
        .from("candidate_experiences")
        .select("id, title, company_name, description, measurable_outcome")
        .eq("user_id", user.id),
      client
        .from("candidate_work_samples")
        .select("id, title, url, context, outcome")
        .eq("user_id", user.id),
    ],
  );
  if (organizationResult.error || !organizationResult.data)
    return { ok: false, message: "Oferta nie ma aktywnej organizacji." };
  if (candidateResult.error) return { ok: false, message: "Najpierw uzupełnij profil kandydata." };

  if (parsed.data.aiGenerationId) {
    const { data: generation } = await client
      .from("ai_generations")
      .select("id")
      .eq("id", parsed.data.aiGenerationId)
      .eq("requested_by", user.id)
      .eq("job_id", parsed.data.jobId)
      .eq("purpose", "candidate_answer")
      .eq("status", "succeeded")
      .maybeSingle();
    if (!generation)
      return { ok: false, message: "Szkic AI wygasł. Wygeneruj go ponownie lub usuń." };
  }

  const sourceSnapshot = {
    capturedAt: new Date().toISOString(),
    profile: { displayName: profile.display_name, ...candidateResult.data },
    experiences: experiencesResult.data ?? [],
    workSamples: samplesResult.data ?? [],
  };
  const evidenceIds = [
    ...(experiencesResult.data ?? []).map((item) => item.id),
    ...(samplesResult.data ?? []).map((item) => item.id),
  ];
  const fit = calculateTextFit(
    `${job.title} ${job.summary} ${job.description}`,
    parsed.data.answer,
  );
  const { error } = await client.rpc("submit_application_with_evidence", {
    target_job_id: parsed.data.jobId,
    target_variant: parsed.data.variant,
    final_answer: parsed.data.answer,
    target_generation_id: parsed.data.aiGenerationId || null,
    source_snapshot: sourceSnapshot,
    source_evidence_ids: evidenceIds,
    fit_version: fit.version,
    fit_components: fit.components,
    fit_score: fit.score,
  });
  if (error?.code === "23505") return { ok: false, message: "Masz już aplikację na tę ofertę." };
  if (error) return { ok: false, message: "Nie udało się wysłać aplikacji. Spróbuj ponownie." };
  await captureAnalytics(user.id, {
    event: "application_submitted",
    properties: {
      jobId: parsed.data.jobId,
      variant: parsed.data.variant,
      usedAi: Boolean(parsed.data.aiGenerationId),
    },
  });
  redirect("/app/aplikacje?submitted=1");
}

export async function recordEmployerStage(formData: FormData) {
  const { client } = await requireProfile(["employer", "operator"]);
  const parsed = employerStageSchema.safeParse({
    applicationId: formData.get("applicationId"),
    stage: formData.get("stage"),
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) throw new Error("Nieprawidłowa zmiana etapu.");

  const { data: application, error: readError } = await client
    .from("applications")
    .select("id, organization_id, job_id")
    .eq("id", parsed.data.applicationId)
    .single();
  if (readError || !application) throw new Error("Brak dostępu do aplikacji.");

  const { error } = await client.rpc("record_application_stage", {
    target_application_id: application.id,
    next_stage: parsed.data.stage,
    event_note: parsed.data.note || null,
  });
  if (error) throw new Error("Nie udało się zapisać etapu aplikacji.");
  await captureAnalytics(application.organization_id, {
    event: "employer_reviewed",
    properties: { jobId: application.job_id, stage: parsed.data.stage },
  });
  revalidatePath("/app/kandydaci");
}
