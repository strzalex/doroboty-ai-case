"use client";

import { useActionState, useRef, useState } from "react";
import { submitApplication, type ApplicationActionState } from "@/features/applications/actions";
import { generateCandidateDraft } from "@/features/ai/actions";
import { captureBrowserAnalytics } from "@/features/analytics/client-event";
import { ExperimentExposure } from "@/features/experiments/exposure";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: ApplicationActionState = { ok: false, message: "" };

export function ApplicationForm({
  jobId,
  profileReady,
  variant,
  allowAi,
  assignmentIds,
  initialAnswer,
}: {
  jobId: string;
  profileReady: boolean;
  variant: "long_form" | "one_click";
  allowAi: boolean;
  assignmentIds: string[];
  initialAnswer: string;
}) {
  const [state, action, pending] = useActionState(submitApplication, initialState);
  const [answer, setAnswer] = useState(initialAnswer);
  const [generationId, setGenerationId] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const started = useRef(false);

  function trackStart() {
    if (started.current) return;
    started.current = true;
    void captureBrowserAnalytics({
      event: "application_started",
      properties: { jobId, variant },
    });
  }

  async function draftWithAi() {
    setAiBusy(true);
    const result = await generateCandidateDraft(jobId);
    setAiMessage(result.message);
    if (result.ok && result.text && result.generationId) {
      setAnswer(result.text);
      setGenerationId(result.generationId);
    }
    setAiBusy(false);
  }
  return (
    <form
      action={action}
      onFocusCapture={trackStart}
      className="form-stack border-2 bg-card p-6 shadow-[5px_5px_0_var(--foreground)]"
    >
      {assignmentIds.map((assignmentId) => (
        <ExperimentExposure key={assignmentId} assignmentId={assignmentId} />
      ))}
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="variant" value={variant} />
      <input type="hidden" name="aiGenerationId" value={generationId} />
      <div className="border-2 bg-secondary p-4" onPointerDown={trackStart}>
        <strong className="font-ui">
          {variant === "one_click" ? "Wariant: zapisany profil" : "Wariant: pełna odpowiedź"}
        </strong>
        <p className="mt-1">
          {variant === "one_click"
            ? "Profil jest gotowy; sprawdź odpowiedź i potwierdź jednym krokiem."
            : "Napisz odpowiedź specjalnie dla tej roli."}
        </p>
      </div>
      <div className="field">
        <Label htmlFor="answer">Dlaczego pasujesz do tej roli?</Label>
        <Textarea
          id="answer"
          name="answer"
          rows={9}
          minLength={40}
          maxLength={5000}
          required
          value={answer}
          onFocus={trackStart}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Odwołaj się do konkretnego doświadczenia, decyzji i wyniku…"
        />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {allowAi && (
            <Button
              type="button"
              variant="outline"
              onClick={draftWithAi}
              disabled={aiBusy || !profileReady}
            >
              {aiBusy ? "Przygotowuję…" : "Przygotuj szkic z AI"}
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            {allowAi
              ? "AI korzysta z Twojego profilu. Ty sprawdzasz, edytujesz i zatwierdzasz tekst."
              : "Ten wariant wymaga samodzielnej odpowiedzi."}
          </span>
        </div>
        {aiMessage && (
          <p role="status" className="mt-2 text-sm">
            {aiMessage}
          </p>
        )}
      </div>
      <label className="flex gap-3 font-ui text-sm">
        <input type="checkbox" name="confirmed" value="yes" required /> Potwierdzam wysłanie tej
        aplikacji i zapisanego snapshotu profilu.
      </label>
      {state.message && (
        <p role="alert" className="error-message">
          {state.message}
        </p>
      )}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Wysyłam…" : "Wyślij aplikację"}
      </Button>
    </form>
  );
}
