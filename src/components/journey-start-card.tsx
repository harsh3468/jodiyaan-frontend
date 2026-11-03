"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import {
  JOURNEY_HERO_CONTENT,
  PROFILE_FOR_OPTIONS,
  QUICK_SEARCH_AGE_OPTIONS,
  RELIGIONS_LIST,
} from "@/lib/constants";
import type { JourneyStartPreferences, ManagedBy } from "@/lib/types";

export function JourneyStartCard() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<JourneyStartPreferences>({
    lookingFor: "bride",
    profileFor: "self",
    ageRange: "21-25",
    religion: "",
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          "jodiyaan_journey_preferences",
          JSON.stringify(preferences),
        );
      } catch {
        // Ignore storage errors if private browsing restrictions apply
      }
    }

    const params = new URLSearchParams({
      intent: "onboarding",
      lookingFor: preferences.lookingFor,
      managedBy: preferences.profileFor,
      ageRange: preferences.ageRange,
    });
    if (preferences.religion) {
      params.set("religion", preferences.religion);
    }

    router.push(`/login?${params.toString()}`);
  }

  const exploreHref = `/discover?lookingFor=${preferences.lookingFor}${
    preferences.religion ? `&religion=${encodeURIComponent(preferences.religion)}` : ""
  }`;

  return (
    <div className="bg-card rounded-2xl shadow-xl border border-border/80 p-6 sm:p-8 max-w-2xl backdrop-blur-sm">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-tertiary">
          {JOURNEY_HERO_CONTENT.eyebrow}
        </p>
        <h2 className="mt-1.5 text-2xl sm:text-3xl font-heading font-bold text-foreground">
          {JOURNEY_HERO_CONTENT.title}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          {JOURNEY_HERO_CONTENT.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Looking For & Profile For */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-foreground/80 mb-1.5">
              I am looking for a
            </label>
            <div className="flex rounded-xl bg-secondary/70 p-1 border border-border/50 h-11">
              <button
                type="button"
                onClick={() =>
                  setPreferences((prev) => ({ ...prev, lookingFor: "bride" }))
                }
                className={`flex-1 flex items-center justify-center rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  preferences.lookingFor === "bride"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-foreground hover:text-primary"
                }`}
              >
                Bride
              </button>
              <button
                type="button"
                onClick={() =>
                  setPreferences((prev) => ({ ...prev, lookingFor: "groom" }))
                }
                className={`flex-1 flex items-center justify-center rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  preferences.lookingFor === "groom"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-foreground hover:text-primary"
                }`}
              >
                Groom
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="profileFor"
              className="block text-xs font-bold text-foreground/80 mb-1.5"
            >
              This profile is for
            </label>
            <select
              id="profileFor"
              value={preferences.profileFor}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  profileFor: e.target.value as ManagedBy,
                }))
              }
              className="w-full h-11 bg-background border border-input rounded-xl px-3.5 text-sm font-medium text-foreground outline-none focus:border-primary transition-colors cursor-pointer"
            >
              {PROFILE_FOR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Age Range & Community */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="ageRange"
              className="block text-xs font-bold text-foreground/80 mb-1.5"
            >
              Preferred Age
            </label>
            <select
              id="ageRange"
              value={preferences.ageRange}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  ageRange: e.target.value,
                }))
              }
              className="w-full h-11 bg-background border border-input rounded-xl px-3.5 text-sm font-medium text-foreground outline-none focus:border-primary transition-colors cursor-pointer"
            >
              {QUICK_SEARCH_AGE_OPTIONS.map((opt) => (
                <option key={opt.label} value={`${opt.min}-${opt.max}`}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="religion"
              className="block text-xs font-bold text-foreground/80 mb-1.5"
            >
              Community / Religion
            </label>
            <select
              id="religion"
              value={preferences.religion}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  religion: e.target.value,
                }))
              }
              className="w-full h-11 bg-background border border-input rounded-xl px-3.5 text-sm font-medium text-foreground outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="">Any Community</option>
              {RELIGIONS_LIST.map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="submit"
          className="w-full min-h-12 bg-primary hover:bg-[#581a23] text-primary-foreground font-semibold text-base rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
        >
          <span>{JOURNEY_HERO_CONTENT.submitButtonText}</span>
          <ArrowRight className="size-4.5" />
        </button>

        {/* Secondary explore matches link */}
        <div className="text-center pt-1">
          <Link
            href={exploreHref}
            className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
          >
            <span>{JOURNEY_HERO_CONTENT.exploreButtonText}</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Security Reassurance */}
        <div className="pt-3.5 border-t border-border/50 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5 text-tertiary shrink-0" />
          <span className="text-center">{JOURNEY_HERO_CONTENT.trustNote}</span>
        </div>
      </form>
    </div>
  );
}
