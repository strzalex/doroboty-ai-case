import type { NextConfig } from "next";
import { isPrivilegedKey } from "./src/lib/env";

if (isPrivilegedKey(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "")) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY zawiera klucz administracyjny. Użyj publishable/anon key; nie publikuj sekretu w kodzie przeglądarki.",
  );
}
const nextConfig: NextConfig = { poweredByHeader: false };
export default nextConfig;
