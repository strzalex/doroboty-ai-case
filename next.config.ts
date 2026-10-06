import type { NextConfig } from "next";
import { isPrivilegedKey } from "./src/lib/env";

if (isPrivilegedKey(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "")) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY contains an admin key. Use a publishable/anon key; never expose secrets in browser code.",
  );
}
const nextConfig: NextConfig = { poweredByHeader: false };
export default nextConfig;
