"use client";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ExampleForm } from "@/features/component-examples/example-form";
export default function Page() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <AppShell mode="demo">
      <div className="page-heading">
        <div>
          <h1>Komponenty</h1>
          <p>Wspólny język wizualny Twojej aplikacji.</p>
        </div>
      </div>
      <section className="component-section">
        <h2>Przyciski</h2>
        <p>Jedna główna akcja, spokojne akcje pomocnicze.</p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setOpen(true)}>Otwórz formularz</Button>
          <Button variant="outline" onClick={() => setMessage("Przycisk pomocniczy działa.")}>
            Pomocniczy
          </Button>
          <Button disabled>Niedostępny</Button>
        </div>
      </section>
      <section className="component-section">
        <h2>Pola i walidacja</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="field">
            <Label htmlFor="sample-name">Imię</Label>
            <Input id="sample-name" placeholder="np. Anna" />
          </div>
          <div className="field">
            <Label htmlFor="sample-error">Pole z błędem</Label>
            <Input
              id="sample-error"
              defaultValue="A"
              aria-invalid="true"
              aria-describedby="sample-error-help"
            />
            <p className="error-message" id="sample-error-help">
              Podaj co najmniej 2 znaki.
            </p>
          </div>
        </div>
      </section>
      <section className="component-section">
        <h2>Statusy</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="secondary">Szkic</Badge>
          <Badge variant="outline">W trakcie</Badge>
          <Badge>Gotowe</Badge>
        </div>
      </section>
      <section className="component-section">
        <h2>Ładowanie</h2>
        <Skeleton className="h-5 w-2/5 mb-3" />
        <Skeleton className="h-16 w-full" />
      </section>
      <p role="status">{message}</p>
      {open && (
        <ExampleForm
          onClose={() => setOpen(false)}
          onValid={() => {
            setMessage("Formularz jest poprawny. Dane nie zostały zapisane.");
          }}
        />
      )}
    </AppShell>
  );
}
