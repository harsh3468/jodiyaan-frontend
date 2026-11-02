import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { RedirectIfSignedIn } from "@/components/redirect-if-signed-in";
import { Wordmark } from "@/components/ui";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in & Create Account" };

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative">
      <RedirectIfSignedIn />

      <header className="px-6 py-4 lg:px-12 flex justify-between items-center border-b border-border bg-card">
        <Link href="/" aria-label="Jodiyaan home">
          <Wordmark />
        </Link>
        <Link
          href="/"
          className="text-sm font-semibold text-primary flex items-center gap-1.5 hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
      </header>

      <main className="flex-1 grid lg:grid-cols-2">
        {/* Left branding panel */}
        <section className="hidden lg:flex bg-primary text-primary-foreground p-16 flex-col justify-between">
          <div>
            <div className="mb-8">
              <Image
                src="/app-icon.jpg"
                alt="Jodiyaan Emblem"
                width={72}
                height={72}
                priority
                className="size-18 rounded-2xl shadow-lg border border-white/20 object-cover"
              />
            </div>
            <p className="text-primary-foreground/90 font-bold uppercase tracking-[0.25em] text-xs">
              A meaningful beginning
            </p>
            <h1 className="mt-4 text-5xl font-heading font-bold text-balance leading-tight text-primary-foreground">
              Find someone who feels like home.
            </h1>
            <p className="mt-5 text-primary-foreground/90 text-lg max-w-md leading-relaxed">
              Join a thoughtful community of people seeking a life partner with shared values and family blessings.
            </p>
          </div>

          <div className="rounded-xl bg-accent text-accent-foreground p-6 border border-accent/20 flex items-start gap-4">
            <ShieldCheck className="size-8 text-tertiary shrink-0" />
            <div>
              <p className="font-heading font-bold text-base text-foreground">
                Your privacy is our promise.
              </p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                We never show your contact details without mutual interest. Chat opens only when both members accept.
              </p>
            </div>
          </div>
        </section>

        {/* Right form panel */}
        <section className="p-6 lg:p-16 flex items-center justify-center">
          <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-md">
            <LoginForm />
          </div>
        </section>
      </main>
    </div>
  );
}
