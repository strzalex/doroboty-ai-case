"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireProfile } from "@/features/auth/session";

const organizationSchema = z.object({
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

export type OrganizationActionState = { ok: boolean; message: string };

export async function createOrganization(
  _previous: OrganizationActionState,
  formData: FormData,
): Promise<OrganizationActionState> {
  const { client } = await requireProfile(["employer"]);
  const parsed = organizationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Sprawdź dane firmy." };
  const { error } = await client.rpc("create_employer_organization", {
    organization_name: parsed.data.name,
    organization_slug: parsed.data.slug,
    organization_summary: parsed.data.summary,
    organization_description: parsed.data.description,
    organization_website: parsed.data.website,
    organization_location: parsed.data.location,
    organization_size: parsed.data.size,
  });
  if (error?.code === "23505") return { ok: false, message: "Ten slug jest już zajęty." };
  if (error) return { ok: false, message: "Nie udało się utworzyć organizacji." };
  revalidatePath("/app/organizacja");
  return { ok: true, message: "Organizacja jest gotowa." };
}
