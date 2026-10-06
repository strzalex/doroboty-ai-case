import { NextResponse, type NextRequest } from "next/server";
import { serverClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/env";
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const next = params.get("next") === "/auth/update-password" ? "/auth/update-password" : "/app";
  if (getSupabaseConfig().configured) {
    const client = await serverClient();
    const code = params.get("code");
    const hash = params.get("token_hash");
    const type = params.get("type");
    let success = false;
    if (code) success = !(await client.auth.exchangeCodeForSession(code)).error;
    else if (hash && (type === "signup" || type === "recovery" || type === "email"))
      success = !(await client.auth.verifyOtp({ token_hash: hash, type })).error;
    if (success)
      return new NextResponse(null, {
        status: 303,
        headers: { Location: next, "Cache-Control": "private, no-store" },
      });
  }
  return new NextResponse(null, {
    status: 303,
    headers: { Location: "/auth/sign-in?error=link", "Cache-Control": "private, no-store" },
  });
}
