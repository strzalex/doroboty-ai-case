import Link from "next/link";
import { ArrowLeft, Database } from "lucide-react";
import { getSupabaseConfig } from "@/lib/env";
export function SetupNotice() {
  const config = getSupabaseConfig();
  return (
    <main id="main" className="standalone">
      <Link className="text-link" href="/demo">
        <ArrowLeft size={16} />
        Wróć do demo
      </Link>
      <Database className="mt-12 mb-6 text-primary" size={32} />
      <h1>Podłącz bazę danych.</h1>
      <p className="lede">
        {!config.configured && config.reason === "invalid"
          ? "Konfiguracja Supabase jest niepełna albo nieprawidłowa."
          : "Rynek ofert działa na danych demonstracyjnych. Konta wymagają Supabase."}
      </p>
      <ol className="setup-steps">
        <li>Utwórz izolowany projekt Supabase.</li>
        <li>
          Skopiuj <code>.env.example</code> do <code>.env.local</code> i wpisz URL projektu oraz
          klucz publiczny.
        </li>
        <li>
          Skonfiguruj logowanie według <code>docs/supabase.md</code>.
        </li>
        <li>Uruchom aplikację ponownie.</li>
      </ol>
      <p className="text-sm text-muted-foreground">
        Nigdy nie używaj klucza service_role. Instrukcja obejmuje też potwierdzanie adresu i
        odzyskiwanie hasła.
      </p>
    </main>
  );
}
