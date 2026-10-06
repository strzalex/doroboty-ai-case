"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { browserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export type AuthMode = "sign-in" | "sign-up" | "forgot-password" | "update-password";
const copy = {
  "sign-in": {
    title: "Wracamy do roboty.",
    description: "Zaloguj się do swojej strefy.",
    action: "Zaloguj się",
  },
  "sign-up": {
    title: "Zacznij od konkretu.",
    description: "Załóż konto kandydata w DoRoboty.ai.",
    action: "Załóż konto",
  },
  "forgot-password": {
    title: "Odzyskaj dostęp.",
    description: "Wyślemy link do ustawienia nowego hasła.",
    action: "Wyślij link",
  },
  "update-password": {
    title: "Ustaw nowe hasło.",
    description: "Wybierz hasło z co najmniej 8 znakami.",
    action: "Zapisz hasło",
  },
};
export function AuthForm({
  mode,
  linkError = false,
  nextPath = "/app",
}: {
  mode: AuthMode;
  linkError?: boolean;
  nextPath?: string;
}) {
  const [message, setMessage] = useState("");
  const schema = z.object({
    email: mode === "update-password" ? z.string() : z.email("Podaj prawidłowy adres e-mail."),
    password:
      mode === "forgot-password"
        ? z.string()
        : z
            .string()
            .min(
              mode === "sign-in" ? 1 : 8,
              "Podaj hasło — dla nowego konta co najmniej 8 znaków.",
            ),
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });
  async function submit(values: { email: string; password: string }) {
    setMessage("");
    try {
      const client = browserClient();
      const callback = `${window.location.origin}/auth/callback`;
      if (mode === "sign-in") {
        const { error } = await client.auth.signInWithPassword(values);
        if (error) throw error;
        window.location.assign(nextPath);
      }
      if (mode === "sign-up") {
        const { error } = await client.auth.signUp({
          ...values,
          options: { emailRedirectTo: `${callback}?next=${encodeURIComponent(nextPath)}` },
        });
        if (error) throw error;
        setMessage(
          "Sprawdź skrzynkę. Jeśli konto wymaga potwierdzenia, znajdziesz tam link aktywacyjny.",
        );
      }
      if (mode === "forgot-password") {
        const { error } = await client.auth.resetPasswordForEmail(values.email, {
          redirectTo: `${callback}?next=/auth/update-password`,
        });
        if (error) throw error;
        setMessage(
          "Jeśli konto istnieje, wyślemy wiadomość z linkiem do zmiany hasła. Sprawdź też spam.",
        );
      }
      if (mode === "update-password") {
        const { error } = await client.auth.updateUser({ password: values.password });
        if (error) throw error;
        window.location.assign(nextPath);
      }
    } catch {
      setError("root", {
        message:
          mode === "sign-in"
            ? "Nie udało się zalogować. Sprawdź e-mail, hasło i potwierdzenie konta."
            : "Nie udało się wykonać tej operacji. Spróbuj ponownie za chwilę.",
      });
    }
  }
  return (
    <main className="auth-layout">
      <div className="auth-aside">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>
          DoRoboty.ai
        </Link>
        <div>
          <h2>
            Pokaż,
            <br />
            co dowozisz.
          </h2>
          <p>Liczy się doświadczenie, decyzja i wynik.</p>
        </div>
        <span>DoRoboty.ai</span>
      </div>
      <div className="auth-content">
        <Link href="/" className="text-link">
          <ArrowLeft size={16} />
          Wróć do ofert
        </Link>
        <div className="auth-form">
          <h1>{copy[mode].title}</h1>
          <p className="lede">{copy[mode].description}</p>
          {linkError && (
            <p role="alert" className="error-message mb-6">
              Ten link jest nieprawidłowy albo wygasł. Poproś o nowy lub zaloguj się.
            </p>
          )}
          {message ? (
            <div role="status" className="success-panel">
              <p>{message}</p>
              <Link className="text-link mt-5" href="/auth/sign-in">
                Przejdź do logowania <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form className="form-stack" noValidate onSubmit={handleSubmit(submit)}>
              {mode !== "update-password" && (
                <div className="field">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p id="email-error" className="error-message">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              )}
              {mode !== "forgot-password" && (
                <div className="field">
                  <Label htmlFor="password">Hasło</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    {...register("password")}
                  />
                  {errors.password && (
                    <p id="password-error" className="error-message">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              )}
              {errors.root && (
                <p role="alert" className="error-message">
                  {errors.root.message}
                </p>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Chwila…" : copy[mode].action}
                <ArrowRight size={16} />
              </Button>
            </form>
          )}
          <div className="auth-links">
            {mode === "sign-in" ? (
              <>
                <Link href="/auth/forgot-password">Nie pamiętam hasła</Link>
                <Link href="/auth/sign-up">Załóż konto</Link>
              </>
            ) : (
              <Link href="/auth/sign-in">Mam już konto</Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
