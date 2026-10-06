"use server";

import { z } from "zod";
import { requireProfile } from "@/features/auth/session";

const uuidSchema = z.uuid();

export async function recordExperimentExposure(assignmentId: string) {
  const parsed = uuidSchema.safeParse(assignmentId);
  if (!parsed.success) return;
  const { client } = await requireProfile(["candidate", "employer", "operator"]);
  await client.rpc("record_experiment_exposure", {
    target_assignment_id: parsed.data,
    target_application_id: null,
  });
}
