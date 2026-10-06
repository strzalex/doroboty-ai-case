import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export async function authorizeAiTreatment(
  client: SupabaseClient,
  surface: "employer_job_copy" | "candidate_answer",
  operator: boolean,
) {
  if (operator) return true;
  const { data: assignment } = await client
    .from("experiment_assignments")
    .select("id")
    .eq("surface", surface)
    .eq("variant", "ai_draft")
    .order("assigned_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!assignment) return false;
  const { error } = await client.rpc("record_experiment_exposure", {
    target_assignment_id: assignment.id,
    target_application_id: null,
  });
  return !error;
}
