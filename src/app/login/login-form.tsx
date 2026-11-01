"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button, Field, Input, Notice } from "@/components/ui";
import { api, ApiError } from "@/lib/api";

export function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
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
      <form onSubmit={requestCode} className="space-y-5">
        <div>
          <h1 className="font-serif text-2xl text-ink">Welcome</h1>
          <p className="mt-1 text-sm text-muted">
            Sign in or create an account with your email. No password needed.
          </p>
        </div>
        <Field label="Email">
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
        {error && <Notice>{error}</Notice>}
        <Button type="submit" busy={busy} className="w-full">
          Send code
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={verify} className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-ink">Check your email</h1>
        {info && <p className="mt-1 text-sm text-muted">{info}</p>}
      </div>
      <Field label="Sign-in code">
        <Input
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          required
          pattern="\d{6}"
          maxLength={6}
          placeholder="123456"
          className="text-center text-2xl tracking-[0.5em]"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
      </Field>
      {error && <Notice>{error}</Notice>}
      <Button type="submit" busy={busy} className="w-full">
        Continue
      </Button>
      <div className="flex justify-between text-sm">
        <button
          type="button"
          className="text-muted hover:text-ink"
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
          className="text-maroon hover:underline"
          disabled={busy}
          onClick={() => requestCode()}
        >
          Resend code
        </button>
      </div>
    </form>
  );
}
