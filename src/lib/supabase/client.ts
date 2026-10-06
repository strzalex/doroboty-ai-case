"use client";
import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseConfig } from "@/lib/env";
export function browserClient() {
  const { url, key } = requireSupabaseConfig();
  return createBrowserClient(url, key);
}
