"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireProfile } from "@/features/auth/session";

const releaseSchema = z.enum([
  "baseline",
  "post_one_click",
  "discovery",
  "post_ai",
  "pilot",
  "demo_day",
]);

export async function releaseCaseAction(formData: FormData) {
  const { client } = await requireProfile(["operator"]);
  const release = releaseSchema.parse(formData.get("release"));
  const { error } = await client.rpc("release_case", { target_release: release });
  if (error) throw new Error("Nie udało się zmienić aktywnego etapu case.");
  revalidatePath("/app/case");
}
