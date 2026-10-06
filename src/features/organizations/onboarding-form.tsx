"use client";

import { useActionState } from "react";
import { createOrganization, type OrganizationActionState } from "@/features/organizations/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: OrganizationActionState = { ok: false, message: "" };

export function OrganizationOnboardingForm() {
  const [state, action, pending] = useActionState(createOrganization, initialState);
  return (
    <form action={action} className="form-stack max-w-2xl border-2 bg-card p-6">
      <h2 className="font-display text-3xl uppercase">Dodaj organizację</h2>
      <p>Te dane pozostaną prywatne, dopóki firma nie opublikuje oferty.</p>
      <Field name="name" label="Nazwa firmy" />
      <Field name="slug" label="Slug (małe litery i myślniki)" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
      <Field name="summary" label="Krótkie podsumowanie" />
      <div className="field">
        <Label htmlFor="description">Opis</Label>
        <Textarea id="description" name="description" minLength={20} maxLength={5000} required />
      </div>
      <Field name="website" label="Strona HTTPS" type="url" />
      <Field name="location" label="Lokalizacja" />
      <Field name="size" label="Wielkość, np. 11–50 osób" />
      {state.message && (
        <p
          role={state.ok ? "status" : "alert"}
          className={state.ok ? "success-panel" : "error-message"}
        >
          {state.message}
        </p>
      )}
      <Button disabled={pending} type="submit">
        {pending ? "Tworzę…" : "Utwórz organizację"}
      </Button>
    </form>
  );
}

function Field({
  name,
  label,
  ...props
}: React.ComponentProps<typeof Input> & { name: string; label: string }) {
  return (
    <div className="field">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} required {...props} />
    </div>
  );
}
