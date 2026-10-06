import { expect, it } from "vitest";
import { parseSupabaseConfig } from "./env";
it("distinguishes missing configuration from invalid configuration", () => {
  expect(parseSupabaseConfig()).toEqual({ configured: false, reason: "missing" });
  expect(parseSupabaseConfig("not-a-url", "short")).toEqual({
    configured: false,
    reason: "invalid",
  });
  expect(parseSupabaseConfig("https://example.supabase.co")).toEqual({
    configured: false,
    reason: "invalid",
  });
  expect(parseSupabaseConfig("http://127.0.0.1:54321", "a".repeat(30)).configured).toBe(true);
});

it("rejects privileged keys in public configuration", () => {
  const admin = `header.${btoa(JSON.stringify({ role: "service_role" }))}.signature`;
  const anon = `header.${btoa(JSON.stringify({ role: "anon" }))}.signature`;
  expect(parseSupabaseConfig("https://example.supabase.co", admin).configured).toBe(false);
  expect(
    parseSupabaseConfig("https://example.supabase.co", "sb_secret_" + "a".repeat(30)).configured,
  ).toBe(false);
  expect(parseSupabaseConfig("https://example.supabase.co", anon).configured).toBe(true);
});
