import { notFound, redirect } from "next/navigation";
import { AuthForm, type AuthMode } from "@/features/auth/auth-form";
import { SetupNotice } from "@/components/setup-notice";
import { getSupabaseConfig } from "@/lib/env";
import { serverClient } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ mode: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { mode } = await params;
  if (!["sign-in", "sign-up", "forgot-password", "update-password"].includes(mode)) notFound();
  if (!getSupabaseConfig().configured) return <SetupNotice />;
  if (mode === "update-password") {
    const client = await serverClient();
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) redirect("/auth/forgot-password");
  }
  return (
    <AuthForm
      key={mode}
      mode={mode as AuthMode}
      linkError={(await searchParams).error === "link"}
    />
  );
}
