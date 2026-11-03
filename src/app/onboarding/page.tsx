import type { Metadata } from "next";
import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";
import { Wordmark } from "@/components/ui";
import { ONBOARDING_STEPS } from "@/lib/constants";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = { title: "Create your profile · Jodiyaan" };

export default function OnboardingPage() {
  return (
    <AuthGuard requireProfile={false}>
      <div className="min-h-screen w-full bg-background flex flex-col relative selection:bg-primary/20">
        <header className="px-6 py-4 lg:px-12 bg-card border-b border-border flex justify-between items-center sticky top-0 z-40 backdrop-blur-md bg-card/95">
          <Link href="/" aria-label="Jodiyaan home">
            <Wordmark size="md" />
          </Link>
          <Link
            href="/discover"
            className="text-sm text-primary font-semibold hover:underline"
          >
            Save & exit
          </Link>
        </header>

        <main className="flex-1 p-6 lg:p-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-tertiary">
                Step 1 of 5 · Profile Details
              </p>
              <h1 className="mt-3 text-3xl sm:text-4xl font-heading font-bold text-foreground">
                Create your profile
              </h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
                Tell us the essentials so we can introduce you thoughtfully to genuine matches.
              </p>
            </div>

            {/* 5-Step Progress Stepper Header */}
            <div className="hidden sm:grid sm:grid-cols-5 gap-3 mt-8">
              {ONBOARDING_STEPS.map((step) => {
                const isCurrent = step.id === 1;
                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center text-center p-2.5 rounded-xl border transition-all ${
                      isCurrent
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`size-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${
                        isCurrent
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {step.id}
                    </div>
                    <span className="text-xs font-bold leading-tight truncate w-full">
                      {step.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground hidden md:inline">
                      {step.sublabel}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile progress indicator */}
            <div className="sm:hidden mt-6">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1.5">
                <span className="text-primary font-bold">1. Basic Info</span>
                <span>Step 1 of 5</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full w-1/5 bg-primary rounded-full transition-all" />
              </div>
            </div>

            <div className="mt-8 bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-sm">
              <OnboardingForm />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
