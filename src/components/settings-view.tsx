"use client";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
export function SettingsView({ mode }: { mode: "demo" | "live" }) {
  const { setTheme } = useTheme();
  const [message, setMessage] = useState("");
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Ustawienia</h1>
          <p>Dostosuj wygląd aplikacji.</p>
        </div>
      </div>
      <section className="settings-section">
        <div>
          <h2>Wygląd</h2>
          <p>Wybór motywu zostanie zapisany w tej przeglądarce.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "light", label: "Jasny", icon: Sun },
            { key: "dark", label: "Ciemny", icon: Moon },
            { key: "system", label: "Systemowy", icon: Monitor },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant="outline"
              onClick={() => {
                setTheme(key);
                setMessage(`Motyw: ${label.toLowerCase()}.`);
              }}
            >
              <Icon />
              {label}
            </Button>
          ))}
        </div>
      </section>
      <section className="settings-section">
        <div>
          <h2>Przykładowe dane</h2>
          <p>
            {mode === "demo"
              ? "Demo pokazuje statyczne dane. Filtry i zaznaczenie znikają po odświeżeniu strony."
              : "Ten widok pokazuje statyczne dane przykładowe. Supabase obsługuje konta i logowanie."}
          </p>
        </div>
      </section>
      <p role="status" className="text-sm text-muted-foreground">
        {message}
      </p>
    </>
  );
}
