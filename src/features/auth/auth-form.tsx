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
    title: "Welcome back.",
    description: "Sign in to your application.",
    action: "Sign in",
  },
  "sign-up": {
    title: "Start with an idea.",
    description: "Create an account to access the application.",
    action: "Create account",
  },
  "forgot-password": {
    title: "Recover access.",
    description: "We will send you a link to set a new password.",
    action: "Send link",
  },
  "update-password": {
    title: "Set a new password.",
    description: "Choose a password with at least 8 characters.",
    action: "Save password",
  },
};
export function AuthForm({ mode, linkError = false }: { mode: AuthMode; linkError?: boolean }) {
  const [message, setMessage] = useState("");
  const schema = z.object({
    email: mode === "update-password" ? z.string() : z.email("Enter a valid email address."),
    password:
      mode === "forgot-password"
        ? z.string()
        : z
            .string()
            .min(
              mode === "sign-in" ? 1 : 8,
              "Enter a password — at least 8 characters for a new account.",
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
          "Check your inbox. If sign-up requires confirmation, you will find an activation link there. You can sign in after confirming your email.",
        );
      }
      if (mode === "forgot-password") {
        const { error } = await client.auth.resetPasswordForEmail(values.email, {
          redirectTo: `${callback}?next=/auth/update-password`,
        });
        if (error) throw error;
        setMessage(
          "If the account exists, we will send an email with a password reset link. Check your spam folder too.",
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
            ? "Unable to sign in. Check your email, password, and email confirmation."
            : "Unable to complete this action. Check your connection and try again shortly.",
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
          DoRoboty.ai
        </Link>
        <div>
          <h2>
            An idea is
            <br />a good start.
          </h2>
          <p>Make room for what you want to build.</p>
        </div>
        <span>Your space to create.</span>
      </div>
      <div className="auth-content">
        <Link href="/demo" className="text-link">
          <ArrowLeft size={16} />
          Back to demo
        </Link>
        <div className="auth-form">
          <h1>{copy[mode].title}</h1>
          <p className="lede">{copy[mode].description}</p>
          {linkError && (
            <p role="alert" className="error-message mb-6">
              This link is invalid or has expired. Request a new link or sign in.
            </p>
          )}
          {message ? (
            <div role="status" className="success-panel">
              <p>{message}</p>
              <Link className="text-link mt-5" href="/auth/sign-in">
                Go to sign-in <ArrowRight size={16} />
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
                  <Label htmlFor="password">Password</Label>
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
                {isSubmitting ? "Please wait…" : copy[mode].action}
                <ArrowRight size={16} />
              </Button>
            </form>
          )}
          <div className="auth-links">
            {mode === "sign-in" ? (
              <>
                <Link href="/auth/forgot-password">Forgot password</Link>
                <Link href="/auth/sign-up">Create account</Link>
              </>
            ) : (
              <Link href="/auth/sign-in">I already have an account</Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
