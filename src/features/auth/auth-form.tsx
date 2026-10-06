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
    title: "Witaj ponownie.",
    description: "Zaloguj się do swojej aplikacji.",
    action: "Zaloguj się",
  },
  "sign-up": {
    title: "Zacznij od pomysłu.",
    description: "Załóż konto, żeby przejść do aplikacji.",
    action: "Utwórz konto",
  },
  "forgot-password": {
    title: "Nowy dostęp.",
    description: "Wyślemy Ci link do ustawienia nowego hasła.",
    action: "Wyślij link",
  },
  "update-password": {
    title: "Ustaw nowe hasło.",
    description: "Wybierz hasło zawierające co najmniej 8 znaków.",
    action: "Zapisz hasło",
  },
};
export function AuthForm({ mode, linkError = false }: { mode: AuthMode; linkError?: boolean }) {
  const [message, setMessage] = useState("");
  const schema = z.object({
    email: mode === "update-password" ? z.string() : z.email("Podaj poprawny adres email."),
    password:
      mode === "forgot-password"
        ? z.string()
        : z
            .string()
            .min(
              mode === "sign-in" ? 1 : 8,
              "Podaj hasło — co najmniej 8 znaków dla nowego konta.",
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
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- Clear the auth-bound router cache after changing session cookies.
        window.location.assign("/app");
      }
      if (mode === "sign-up") {
        const { error } = await client.auth.signUp({
          ...values,
          options: { emailRedirectTo: `${callback}?next=/app` },
        });
        if (error) throw error;
        setMessage(
          "Sprawdź skrzynkę email. Jeśli rejestracja wymaga potwierdzenia, znajdziesz tam link aktywacyjny. Po potwierdzeniu możesz się zalogować.",
        );
      }
      if (mode === "forgot-password") {
        const { error } = await client.auth.resetPasswordForEmail(values.email, {
          redirectTo: `${callback}?next=/auth/update-password`,
        });
        if (error) throw error;
        setMessage(
          "Jeśli konto istnieje, wyślemy wiadomość z linkiem do zmiany hasła. Sprawdź też folder spam.",
        );
      }
      if (mode === "update-password") {
        const { error } = await client.auth.updateUser({ password: values.password });
        if (error) throw error;
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- Clear the auth-bound router cache after changing session cookies.
        window.location.assign("/app");
      }
    } catch {
      setError("root", {
        message:
          mode === "sign-in"
            ? "Nie udało się zalogować. Sprawdź email, hasło i potwierdzenie adresu."
            : "Nie udało się wykonać operacji. Sprawdź połączenie i spróbuj ponownie za chwilę.",
      });
    }
  }
  return (
    <main className="auth-layout">
      <div className="auth-aside">
        <Link href="/demo" className="brand">
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>
          superstarter.
        </Link>
        <div>
          <h2>
            Pomysł to
            <br />
            dobry początek.
          </h2>
          <p>Zrób miejsce na to, co chcesz zbudować.</p>
        </div>
        <span>Twoja przestrzeń do tworzenia.</span>
      </div>
      <div className="auth-content">
        <Link href="/demo" className="text-link">
          <ArrowLeft size={16} />
          Wróć do demo
        </Link>
        <div className="auth-form">
          <h1>{copy[mode].title}</h1>
          <p className="lede">{copy[mode].description}</p>
          {linkError && (
            <p role="alert" className="error-message mb-6">
              Link jest nieprawidłowy lub wygasł. Poproś o nowy link albo zaloguj się.
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
                    placeholder="ty@przyklad.pl"
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
                {isSubmitting ? "Chwileczkę…" : copy[mode].action}
                <ArrowRight size={16} />
              </Button>
            </form>
          )}
          <div className="auth-links">
            {mode === "sign-in" ? (
              <>
                <Link href="/auth/forgot-password">Nie pamiętam hasła</Link>
                <Link href="/auth/sign-up">Utwórz konto</Link>
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
