import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { SetupNotice } from "@/components/setup-notice";
import { getSupabaseConfig } from "@/lib/env";
import { serverClient } from "@/lib/supabase/server";
import type { ProfileRole } from "@/features/auth/session";
import { Providers } from "@/components/providers";
export const dynamic = "force-dynamic";
export default async function Layout({ children }: { children: React.ReactNode }) {
  if (!getSupabaseConfig().configured) return <SetupNotice />;
  const client = await serverClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) redirect("/auth/sign-in");
  const { data: profile, error } = await client
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (error || !profile) throw new Error("Nie udało się ustalić roli użytkownika.");
  return (
    <Providers>
      <AppShell mode="live" email={user.email} role={profile.role as ProfileRole}>
        {children}
      </AppShell>
    </Providers>
  );
}
