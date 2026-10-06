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
          <h1>Settings</h1>
          <p>Customize the appearance of your application.</p>
        </div>
      </div>
      <section className="settings-section">
        <div>
          <h2>Appearance</h2>
          <p>Your theme preference is saved in this browser.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "light", label: "Light", icon: Sun },
            { key: "dark", label: "Dark", icon: Moon },
            { key: "system", label: "System", icon: Monitor },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant="outline"
              onClick={() => {
                setTheme(key);
                setMessage(`Theme: ${label.toLowerCase()}.`);
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
          <h2>Sample data</h2>
          <p>
            {mode === "demo"
              ? "The demo uses static data. Filters and selection reset when you reload the page."
              : "This page uses static sample data. Supabase handles accounts and sign-in."}
          </p>
        </div>
      </section>
      <p role="status" className="text-sm text-muted-foreground">
        {message}
      </p>
    </>
  );
}
