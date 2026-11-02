import type { Metadata } from "next";
import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";
import { Wordmark } from "@/components/ui";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = { title: "Create your profile" };

export default function OnboardingPage() {
  return (
    <AuthGuard requireProfile={false}>
      <div className="min-h-screen w-full bg-background flex flex-col relative">
        <header className="px-6 py-4 lg:px-12 bg-card border-b border-border flex justify-between items-center">
          <Link href="/" aria-label="Jodiyaan home">
            <Wordmark />
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
              <p className="text-tertiary text-xs uppercase tracking-widest font-bold">
                Step 1 of 2 · Profile Details
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-heading font-bold text-foreground">
                Create your profile
              </h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Tell us the essentials so we can introduce you thoughtfully to genuine matches.
              </p>
            </div>

            {/* Step Progress Indicators */}
            <div className="mt-8 grid grid-cols-4 gap-2">
              <div className="h-2 rounded-lg bg-primary" />
              <div className="h-2 rounded-lg bg-primary/30" />
              <div className="h-2 rounded-lg bg-border" />
              <div className="h-2 rounded-lg bg-border" />
            </div>

            <div className="mt-8 bg-card border border-border rounded-xl p-6 lg:p-8 shadow-sm">
              <OnboardingForm />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
