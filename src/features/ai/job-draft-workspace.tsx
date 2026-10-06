"use client";

import { useActionState } from "react";
import { approveJobDraft, generateJobDraft, type JobDraftState } from "@/features/ai/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: JobDraftState = { ok: false, message: "" };

type ApprovedDraftState = Required<
  Pick<JobDraftState, "generationId" | "jobId" | "title" | "summary" | "description">
> &
  JobDraftState;

function isApprovedDraft(state: JobDraftState): state is ApprovedDraftState {
  return Boolean(
    state.ok &&
    state.generationId &&
    state.jobId &&
    state.title &&
    state.summary &&
    state.description,
  );
}

export function JobDraftWorkspace({
  jobs,
  allowAi,
}: {
  jobs: { id: string; title: string }[];
  allowAi: boolean;
}) {
  const [state, action, pending] = useActionState(generateJobDraft, initialState);
  return (
    <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
      {!allowAi ? (
        <div className="empty-state lg:col-span-2">
          <h2>Wariant ręczny</h2>
          <p>
            W tej kohorcie tekst oferty powstaje bez asysty AI. Źródłowy brief i publikacja
            pozostają rozdzielone.
          </p>
        </div>
      ) : (
        <>
          <form action={action} className="form-stack h-fit border-2 bg-card p-6">
            <h2 className="font-display text-3xl uppercase">Szkic z briefu</h2>
            <p>
              Model widzi prywatny brief i kryteria decyzji. Wygenerowany tekst nie publikuje się
              automatycznie.
            </p>
            <div className="field">
              <Label htmlFor="jobId">Oferta</Label>
              <select
                id="jobId"
                name="jobId"
                required
                className="h-10 w-full border-2 bg-background px-2 font-ui"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" disabled={pending || !jobs.length}>
              {pending ? "Generuję…" : "Wygeneruj szkic"}
            </Button>
            {state.message && (
              <p
                role={state.ok ? "status" : "alert"}
                className={state.ok ? "success-panel" : "error-message"}
              >
                {state.message}
              </p>
            )}
          </form>
          {isApprovedDraft(state) ? (
            <ApprovalForm key={state.generationId} state={state} />
          ) : (
            <div className="empty-state">
              <h2>Szkic pojawi się tutaj</h2>
              <p>
                Przed zatwierdzeniem porównaj go z briefem i przywróć kryteria, których model nie
                zachował.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ApprovalForm({ state }: { state: ApprovedDraftState }) {
  const [approval, action, pending] = useActionState(approveJobDraft, initialState);
  return (
    <form action={action} className="form-stack border-2 bg-secondary p-6">
      <input type="hidden" name="jobId" value={state.jobId} />
      <input type="hidden" name="generationId" value={state.generationId} />
      <h2 className="font-display text-3xl uppercase">Sprawdź i zatwierdź</h2>
      <div className="field">
        <Label htmlFor="draft-title">Tytuł</Label>
        <Input id="draft-title" name="title" defaultValue={state.title} required />
      </div>
      <div className="field">
        <Label htmlFor="draft-summary">Podsumowanie</Label>
        <Textarea
          id="draft-summary"
          name="summary"
          defaultValue={state.summary}
          rows={3}
          required
        />
      </div>
      <div className="field">
        <Label htmlFor="draft-description">Opis</Label>
        <Textarea
          id="draft-description"
          name="description"
          defaultValue={state.description}
          rows={12}
          required
        />
      </div>
      <p className="text-sm">
        Zatwierdzenie zapisze nową, prywatną wersję i zaktualizuje roboczy tekst oferty. Publikacja
        pozostaje osobną decyzją.
      </p>
      <Button type="submit" disabled={pending}>
        {pending ? "Zatwierdzam…" : "Zatwierdź wersję"}
      </Button>
      {approval.message && (
        <p
          role={approval.ok ? "status" : "alert"}
          className={approval.ok ? "success-panel" : "error-message"}
        >
          {approval.message}
        </p>
      )}
    </form>
  );
}
