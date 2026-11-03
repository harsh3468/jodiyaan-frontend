"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button, Field, Input, Notice, Select, Textarea } from "@/components/ui";
import { ApiError } from "@/lib/api";
import {
  COMMUNITIES_LIST,
  EDUCATION_LIST,
  HEIGHTS_CM,
  ONBOARDING_STEPS,
  PROFILE_TEXT_FIELDS,
  RELIGIONS_LIST,
} from "@/lib/constants";
import {
  formatHeight,
  MANAGED_BY_LABELS,
  MARITAL_STATUS_LABELS,
} from "@/lib/format";
import type {
  ManagedBy,
  OwnProfile,
  ProfileFormProps,
  ProfileFormState,
  ProfileInput,
} from "@/lib/types";

function initialState(profile?: OwnProfile): ProfileFormState {
  let savedGender: "male" | "female" = "female";
  let savedManagedBy: ManagedBy = "self";
  let savedReligion = "Hindu";
  let savedPartnerAgeMin = "";
  let savedPartnerAgeMax = "";

  if (!profile && typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem("jodiyaan_journey_preferences");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.lookingFor === "bride") {
          savedGender = "male";
        } else if (parsed.lookingFor === "groom") {
          savedGender = "female";
        }
        if (parsed.profileFor) {
          savedManagedBy = parsed.profileFor as ManagedBy;
        }
        if (parsed.religion) {
          savedReligion = parsed.religion;
        }
        if (parsed.ageRange) {
          const [min, max] = parsed.ageRange.split("-");
          if (min) savedPartnerAgeMin = min;
          if (max) savedPartnerAgeMax = max;
        }
      }
    } catch {
      // Ignore sessionStorage parsing errors
    }
  }

  return {
    fullName: profile?.fullName ?? "",
    gender: profile?.gender ?? savedGender,
    dateOfBirth: profile?.dateOfBirth ?? "",
    maritalStatus: profile?.maritalStatus ?? "never_married",
    managedBy: profile?.managedBy ?? savedManagedBy,
    heightCm: profile?.heightCm ? String(profile.heightCm) : "",
    religion: profile?.religion ?? savedReligion,
    community: profile?.community ?? "",
    motherTongue: profile?.motherTongue ?? "",
    city: profile?.city ?? "",
    state: profile?.state ?? "",
    education: profile?.education ?? "",
    profession: profile?.profession ?? "",
    about: profile?.about ?? "",
    partnerAgeMin: profile?.partnerAgeMin
      ? String(profile.partnerAgeMin)
      : savedPartnerAgeMin,
    partnerAgeMax: profile?.partnerAgeMax
      ? String(profile.partnerAgeMax)
      : savedPartnerAgeMax,
  };
}

function toInput(state: ProfileFormState, isCreate: boolean): ProfileInput {
  const input: Record<string, unknown> = {
    gender: state.gender,
    dateOfBirth: state.dateOfBirth,
    maritalStatus: state.maritalStatus,
    managedBy: state.managedBy,
  };
  for (const field of PROFILE_TEXT_FIELDS) {
    const value = state[field].trim();
    if (value || !isCreate) input[field] = value;
  }
  for (const field of ["heightCm", "partnerAgeMin", "partnerAgeMax"] as const) {
    if (state[field]) input[field] = Number(state[field]);
  }
  return input as unknown as ProfileInput;
}

export function ProfileForm({
  profile,
  submitLabel,
  onSubmit,
}: ProfileFormProps) {
  const isCreate = !profile;
  const [state, setState] = useState<ProfileFormState>(() =>
    initialState(profile),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    <K extends keyof ProfileFormState>(key: K) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setState((current) => ({
        ...current,
        [key]: event.target.value as ProfileFormState[K],
      }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onSubmit(toInput(state, isCreate));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1: Basic Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-border">
          <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
            {ONBOARDING_STEPS[0].id}
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
            {ONBOARDING_STEPS[0].label} · {ONBOARDING_STEPS[0].sublabel}
          </h2>
        </div>

        {/* Looking for / Gender choice */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            I am registering a
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <button
              type="button"
              disabled={!isCreate}
              onClick={() => setState((s) => ({ ...s, gender: "female" }))}
              className={`min-h-11 rounded-xl font-semibold transition-all text-sm border ${
                state.gender === "female"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background text-foreground border-border hover:bg-secondary/40"
              }`}
            >
              Bride (Woman)
            </button>
            <button
              type="button"
              disabled={!isCreate}
              onClick={() => setState((s) => ({ ...s, gender: "male" }))}
              className={`min-h-11 rounded-xl font-semibold transition-all text-sm border ${
                state.gender === "male"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background text-foreground border-border hover:bg-secondary/40"
              }`}
            >
              Groom (Man)
            </button>
          </div>
        </div>

        {/* Basic Essentials */}
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Full name">
            <Input
              required
              minLength={2}
              maxLength={80}
              placeholder="First and last name"
              value={state.fullName}
              onChange={set("fullName")}
            />
          </Field>

          <Field label="Date of birth">
            <Input
              type="date"
              required
              value={state.dateOfBirth}
              onChange={set("dateOfBirth")}
            />
          </Field>

          <Field label="Marital status">
            <Select value={state.maritalStatus} onChange={set("maritalStatus")}>
              {Object.entries(MARITAL_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Height">
            <Select value={state.heightCm} onChange={set("heightCm")}>
              <option value="">Prefer not to say</option>
              {HEIGHTS_CM.map((cm) => (
                <option key={cm} value={cm}>
                  {formatHeight(cm)} ({cm} cm)
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Profile managed by">
            <Select value={state.managedBy} onChange={set("managedBy")}>
              {Object.entries(MANAGED_BY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Religion">
            <Select value={state.religion} onChange={set("religion")}>
              {RELIGIONS_LIST.map((religion) => (
                <option key={religion} value={religion}>
                  {religion}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>

      {/* Step 2: Personal & Background */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2.5 pb-2 border-b border-border">
          <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
            {ONBOARDING_STEPS[1].id}
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
            {ONBOARDING_STEPS[1].label} · {ONBOARDING_STEPS[1].sublabel}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Community / Caste (Optional)">
            <Input
              placeholder="e.g. Agarwal, Brahmin, Khatri"
              list="community-options"
              maxLength={60}
              value={state.community}
              onChange={set("community")}
            />
            <datalist id="community-options">
              {COMMUNITIES_LIST.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>

          <Field label="Mother tongue">
            <Input
              maxLength={40}
              placeholder="e.g. Hindi, Punjabi, Bengali"
              value={state.motherTongue}
              onChange={set("motherTongue")}
            />
          </Field>

          <Field label="Current city">
            <Input
              required
              minLength={2}
              maxLength={60}
              placeholder="e.g. Bengaluru, Mumbai, Pune"
              value={state.city}
              onChange={set("city")}
            />
          </Field>

          <Field label="State / Region">
            <Input
              maxLength={60}
              placeholder="e.g. Karnataka, Maharashtra"
              value={state.state}
              onChange={set("state")}
            />
          </Field>
        </div>
      </div>

      {/* Step 3: Education & Career */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2.5 pb-2 border-b border-border">
          <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
            {ONBOARDING_STEPS[2].id}
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
            {ONBOARDING_STEPS[2].label} · {ONBOARDING_STEPS[2].sublabel}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Highest education">
            <Input
              maxLength={120}
              placeholder="e.g. B.Tech (IIT), MBA (IIM)"
              list="education-options"
              value={state.education}
              onChange={set("education")}
            />
            <datalist id="education-options">
              {EDUCATION_LIST.map((edu) => (
                <option key={edu} value={edu} />
              ))}
            </datalist>
          </Field>

          <Field label="Profession / Occupation">
            <Input
              maxLength={120}
              placeholder="e.g. Software Engineer, Doctor, CA"
              value={state.profession}
              onChange={set("profession")}
            />
          </Field>
        </div>
      </div>

      {/* Step 4: Family & Personal Note */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2.5 pb-2 border-b border-border">
          <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
            {ONBOARDING_STEPS[3].id}
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
            {ONBOARDING_STEPS[3].label} · {ONBOARDING_STEPS[3].sublabel}
          </h2>
        </div>

        <Field
          label="About you"
          hint="A few thoughtful lines about your values, lifestyle, and family background."
        >
          <Textarea
            rows={4}
            maxLength={1000}
            placeholder="Share a little about who you are, what brings you joy, and what you seek in a life partner..."
            value={state.about}
            onChange={set("about")}
          />
        </Field>
      </div>

      {/* Step 5: Partner Preferences */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2.5 pb-2 border-b border-border">
          <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
            {ONBOARDING_STEPS[4].id}
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
            {ONBOARDING_STEPS[4].label} · {ONBOARDING_STEPS[4].sublabel}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Partner age from">
            <Input
              type="number"
              min={18}
              max={80}
              placeholder="22"
              value={state.partnerAgeMin}
              onChange={set("partnerAgeMin")}
            />
          </Field>
          <Field label="Partner age to">
            <Input
              type="number"
              min={18}
              max={80}
              placeholder="32"
              value={state.partnerAgeMax}
              onChange={set("partnerAgeMax")}
            />
          </Field>
        </div>
      </div>

      {error && <Notice tone="error">{error}</Notice>}

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          busy={busy}
          className="min-h-11 px-8 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2"
        >
          <span>{submitLabel}</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
