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
      <h1>Podłącz swoją bazę.</h1>
      <p className="lede">
        {!config.configured && config.reason === "invalid"
          ? "Konfiguracja Supabase jest niepełna lub nieprawidłowa."
          : "Demo działa już teraz. Konta użytkowników wymagają konfiguracji Supabase."}
      </p>
      <ol className="setup-steps">
        <li>Utwórz projekt w Supabase.</li>
        <li>
          Skopiuj <code>.env.example</code> do <code>.env.local</code> i wpisz URL oraz klucz
          publiczny projektu.
        </li>
        <li>
          Skonfiguruj logowanie zgodnie z <code>docs/supabase.md</code>.
        </li>
        <li>Uruchom ponownie serwer aplikacji.</li>
      </ol>
      <p className="text-sm text-muted-foreground">
        Nie używaj klucza service_role. Instrukcja obejmuje również potwierdzanie emaila i reset
        hasła.
      </p>
    </main>
  );
}
