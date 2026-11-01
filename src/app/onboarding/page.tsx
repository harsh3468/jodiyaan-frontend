import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth-guard";
import { Wordmark } from "@/components/ui";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = { title: "Create your profile" };

export default function OnboardingPage() {
  return (
    <AuthGuard requireProfile={false}>
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Wordmark />
        <h1 className="mt-8 font-serif text-3xl text-ink">
          Let’s create your profile
        </h1>
        <p className="mt-2 text-muted">
          It takes about two minutes. You can add a photo right after.
        </p>
        <div className="mt-8 rounded-3xl border border-line bg-card p-6 sm:p-8">
          <OnboardingForm />
        </div>
      </div>
    </AuthGuard>
  );
}
