import "server-only";
import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";

export type ProfileRole = "candidate" | "employer" | "operator";

export async function requireSession() {
  const client = await serverClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) redirect("/auth/sign-in");
  return { client, user };
}

export async function requireProfile(allowed?: ProfileRole[]) {
  const { client, user } = await requireSession();
  const { data, error } = await client
    .from("profiles")
    .select("id, role, display_name")
    .eq("id", user.id)
    .single();
  if (error || !data) throw new Error("Nie udało się wczytać profilu użytkownika.");
  const profile = data as { id: string; role: ProfileRole; display_name: string | null };
  if (allowed && !allowed.includes(profile.role)) redirect("/app");
  return { client, user, profile };
}
