import Link from "next/link";
import { ArrowLeft, Database } from "lucide-react";
import { getSupabaseConfig } from "@/lib/env";
export function SetupNotice() {
  const config = getSupabaseConfig();
  return (
    <main id="main" className="standalone">
      <Link className="text-link" href="/demo">
        <ArrowLeft size={16} />
        Back to demo
      </Link>
      <Database className="mt-12 mb-6 text-primary" size={32} />
      <h1>Connect your database.</h1>
      <p className="lede">
        {!config.configured && config.reason === "invalid"
          ? "Supabase configuration is incomplete or invalid."
          : "The demo is ready. User accounts require Supabase configuration."}
      </p>
      <ol className="setup-steps">
        <li>Create a Supabase project.</li>
        <li>
          Copy <code>.env.example</code> to <code>.env.local</code> and enter the project URL and
          public key.
        </li>
        <li>
          Configure sign-in using <code>docs/supabase.md</code>.
        </li>
        <li>Restart the application server.</li>
      </ol>
      <p className="text-sm text-muted-foreground">
        Never use a service_role key. The instructions also cover email confirmation and password
        recovery.
      </p>
    </main>
  );
}
