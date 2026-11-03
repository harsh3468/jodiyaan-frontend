"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button, Field, Input, Notice } from "@/components/ui";
import { api, ApiError } from "@/lib/api";

export function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("intent") === "onboarding";
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function requestCode(event?: React.FormEvent) {
    event?.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.requestOtp(email);
      setStep("code");
      setInfo(`We sent a 6-digit code to ${email}.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function verify(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const session = await api.verifyOtp(email, code);
      signIn(session);
      router.replace(session.user.hasProfile ? "/discover" : "/onboarding");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
      setBusy(false);
    }
  }

  if (step === "email") {
    return (
      <form onSubmit={requestCode} className="space-y-6">
        <div>
          {isOnboarding ? (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-tertiary">
                Let&apos;s Begin Your Journey
              </p>
              <h1 className="mt-1 font-heading text-2xl font-bold text-foreground">
                Create your account
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your email to receive a verification code and begin your profile.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Welcome to Jodiyaan
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign in to continue your matchmaking journey.
              </p>
            </>
          )}
        </div>

        <Field label="Email address">
          <Input
            type="email"
            required
            autoComplete="email"
            autoFocus
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        {error && <Notice tone="error">{error}</Notice>}

        <Button type="submit" busy={busy} className="w-full">
          Send verification code
        </Button>

        <p className="text-center text-xs text-muted-foreground leading-relaxed">
          No password needed. By continuing, you agree to treat all members with respect and verify your intentions for marriage.
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={verify} className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Check your email
        </h1>
        {info && (
          <p className="mt-1 text-sm text-muted-foreground">{info}</p>
        )}
      </div>

      <Field label="6-Digit Verification Code">
        <Input
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          required
          pattern="\d{6}"
          maxLength={6}
          placeholder="123456"
          className="text-center font-mono text-2xl tracking-[0.4em]"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
      </Field>

      {error && <Notice tone="error">{error}</Notice>}

      <Button type="submit" busy={busy} className="w-full">
        Sign in to account
      </Button>

      <div className="flex justify-between items-center text-sm pt-2">
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground font-semibold"
          onClick={() => {
            setStep("email");
            setCode("");
            setError(null);
          }}
        >
          Change email
        </button>
        <button
          type="button"
          className="text-primary hover:underline font-semibold"
          disabled={busy}
          onClick={() => requestCode()}
        >
          Resend code
        </button>
      </div>
    </form>
  );
}
