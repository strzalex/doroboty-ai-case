"use client";

import { useActionState } from "react";
import {
  addExperience,
  addWorkSample,
  saveCandidateProfile,
  type CandidateActionState,
} from "@/features/candidates/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: CandidateActionState = { ok: false, message: "" };

export function CandidateProfileForm({
  profile,
}: {
  profile: Record<string, string | number | null>;
}) {
  const [state, action, pending] = useActionState(saveCandidateProfile, initialState);
  return (
    <form action={action} className="form-stack border-2 bg-card p-6">
      <h2 className="font-display text-3xl uppercase">Profil kandydata</h2>
      <Field
        label="Imię lub nazwa zawodowa"
        name="displayName"
        defaultValue={String(profile.display_name ?? "")}
        required
      />
      <Field
        label="Nagłówek"
        name="headline"
        defaultValue={String(profile.headline ?? "")}
        required
      />
      <TextField label="O Tobie" name="bio" defaultValue={String(profile.bio ?? "")} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Miasto" name="city" defaultValue={String(profile.city ?? "")} required />
        <Field
          label="Lata doświadczenia"
          name="experienceYears"
          type="number"
          min="0"
          max="60"
          defaultValue={String(profile.experience_years ?? 0)}
          required
        />
      </div>
      <Field
        label="Kontekst językowy (opcjonalnie)"
        name="languageBackground"
        defaultValue={String(profile.language_background ?? "")}
      />
      <ActionMessage state={state} />
      <Button type="submit" disabled={pending}>
        {pending ? "Zapisuję…" : "Zapisz profil"}
      </Button>
    </form>
  );
}

export function ExperienceForm() {
  const [state, action, pending] = useActionState(addExperience, initialState);
  return (
    <form action={action} className="form-stack border-2 bg-card p-6">
      <h2 className="font-display text-3xl uppercase">Dodaj doświadczenie</h2>
      <Field label="Rola" name="title" required />
      <Field label="Firma lub projekt" name="companyName" required />
      <TextField label="Co zrobiłeś / zrobiłaś" name="description" required />
      <TextField label="Mierzalny efekt (opcjonalnie)" name="measurableOutcome" />
      <ActionMessage state={state} />
      <Button type="submit" disabled={pending}>
        {pending ? "Dodaję…" : "Dodaj doświadczenie"}
      </Button>
    </form>
  );
}

export function WorkSampleForm() {
  const [state, action, pending] = useActionState(addWorkSample, initialState);
  return (
    <form action={action} className="form-stack border-2 bg-card p-6">
      <h2 className="font-display text-3xl uppercase">Dodaj próbkę pracy</h2>
      <Field label="Tytuł" name="title" required />
      <Field label="Link HTTPS (opcjonalnie)" name="url" type="url" />
      <TextField label="Kontekst" name="context" required />
      <TextField label="Wynik" name="outcome" required />
      <ActionMessage state={state} />
      <Button type="submit" disabled={pending}>
        {pending ? "Dodaję…" : "Dodaj próbkę"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  ...props
}: React.ComponentProps<typeof Input> & { label: string; name: string }) {
  return (
    <div className="field">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </div>
  );
}

function TextField({
  label,
  name,
  ...props
}: React.ComponentProps<typeof Textarea> & { label: string; name: string }) {
  return (
    <div className="field">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} rows={5} {...props} />
    </div>
  );
}

function ActionMessage({ state }: { state: CandidateActionState }) {
  if (!state.message) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={state.ok ? "success-panel" : "error-message"}
    >
      {state.message}
    </p>
  );
}
