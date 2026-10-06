import { z } from "zod";

export function isPrivilegedKey(key: string) {
  if (key.startsWith("sb_secret_")) return true;
  try {
    const payload = JSON.parse(atob(key.split(".")[1].replaceAll("-", "+").replaceAll("_", "/")));
    return payload.role === "service_role";
  } catch {
    return false;
  }
}
const schema = z.object({
  url: z.url().refine((url) => /^https?:\/\//.test(url)),
  key: z
    .string()
    .min(20)
    .refine((key) => !isPrivilegedKey(key)),
});
export function parseSupabaseConfig(url?: string, key?: string) {
  if (!url && !key) return { configured: false as const, reason: "missing" as const };
  const result = schema.safeParse({ url, key });
  if (!result.success) return { configured: false as const, reason: "invalid" as const };
  return { configured: true as const, ...result.data };
}
export function getSupabaseConfig() {
  return parseSupabaseConfig(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
export function requireSupabaseConfig() {
  const config = getSupabaseConfig();
  if (!config.configured)
    throw new Error("Skonfiguruj poprawnie Supabase w .env.local. Demo pozostaje dostępne.");
  return config;
}
