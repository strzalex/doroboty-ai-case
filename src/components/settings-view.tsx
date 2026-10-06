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
          <h1>{mode === "demo" ? "Settings" : "Ustawienia"}</h1>
          <p>
            {mode === "demo"
              ? "Customize the appearance of your application."
              : "Dostosuj wygląd swojej strefy."}
          </p>
        </div>
      </div>
      <section className="settings-section">
        <div>
          <h2>{mode === "demo" ? "Appearance" : "Wygląd"}</h2>
          <p>
            {mode === "demo"
              ? "Your theme preference is saved in this browser."
              : "Wybór motywu zapisuje się w tej przeglądarce."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "light", label: mode === "demo" ? "Light" : "Jasny", icon: Sun },
            { key: "dark", label: mode === "demo" ? "Dark" : "Ciemny", icon: Moon },
            { key: "system", label: mode === "demo" ? "System" : "Systemowy", icon: Monitor },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant="outline"
              onClick={() => {
                setTheme(key);
                setMessage(
                  mode === "demo"
                    ? `Theme: ${label.toLowerCase()}.`
                    : `Motyw: ${label.toLowerCase()}.`,
                );
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
          <h2>{mode === "demo" ? "Sample data" : "Dane i prywatność"}</h2>
          <p>
            {mode === "demo"
              ? "The demo uses static data. Filters and selection reset when you reload the page."
              : "Supabase przechowuje dane operacyjne. Analityka nie otrzymuje treści profilu, aplikacji ani notatek."}
          </p>
        </div>
      </section>
      <p role="status" className="text-sm text-muted-foreground">
        {message}
      </p>
    </>
  );
}
