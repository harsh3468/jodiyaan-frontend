"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";
import {
  formatHeight,
  MANAGED_BY_LABELS,
  MARITAL_STATUS_LABELS,
} from "@/lib/format";
import type {
  Gender,
  ManagedBy,
  MaritalStatus,
  OwnProfile,
  ProfileInput,
} from "@/lib/types";
import { Button, Field, Input, Notice, Select, Textarea } from "./ui";

const HEIGHTS_CM = Array.from({ length: 31 }, (_, i) =>
  Math.round((54 + i) * 2.54),
);
const RELIGIONS = [
  "Hindu",
  "Muslim",
  "Sikh",
  "Christian",
  "Jain",
  "Buddhist",
  "Parsi",
  "Jewish",
  "No religion",
  "Other",
];
const TEXT_FIELDS = [
  "fullName",
  "religion",
  "community",
  "motherTongue",
  "city",
  "state",
  "education",
  "profession",
  "about",
] as const;

type FormState = Record<(typeof TEXT_FIELDS)[number], string> & {
  gender: Gender | "";
  dateOfBirth: string;
  maritalStatus: MaritalStatus;
  managedBy: ManagedBy;
  heightCm: string;
  partnerAgeMin: string;
  partnerAgeMax: string;
};

function initialState(profile?: OwnProfile): FormState {
  return {
    fullName: profile?.fullName ?? "",
    gender: profile?.gender ?? "",
    dateOfBirth: profile?.dateOfBirth ?? "",
    maritalStatus: profile?.maritalStatus ?? "never_married",
    managedBy: profile?.managedBy ?? "self",
    heightCm: profile?.heightCm ? String(profile.heightCm) : "",
    religion: profile?.religion ?? "",
    community: profile?.community ?? "",
    motherTongue: profile?.motherTongue ?? "",
    city: profile?.city ?? "",
    state: profile?.state ?? "",
    education: profile?.education ?? "",
    profession: profile?.profession ?? "",
    about: profile?.about ?? "",
    partnerAgeMin: profile?.partnerAgeMin ? String(profile.partnerAgeMin) : "",
    partnerAgeMax: profile?.partnerAgeMax ? String(profile.partnerAgeMax) : "",
  };
}

function toInput(state: FormState, isCreate: boolean): ProfileInput {
  const input: Record<string, unknown> = {
    gender: state.gender,
    dateOfBirth: state.dateOfBirth,
    maritalStatus: state.maritalStatus,
    managedBy: state.managedBy,
  };
  for (const field of TEXT_FIELDS) {
    const value = state[field].trim();
    // On edit, an empty string clears the field; on create it is simply left out.
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
}: {
  profile?: OwnProfile;
  submitLabel: string;
  onSubmit: (input: ProfileInput) => Promise<void>;
}) {
  const isCreate = !profile;
  const [state, setState] = useState<FormState>(() => initialState(profile));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    <K extends keyof FormState>(key: K) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setState((current) => ({
        ...current,
        [key]: event.target.value as FormState[K],
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
      <Section title="Basics">
        <Field label="Full name">
          <Input
            required
            minLength={2}
            maxLength={80}
            value={state.fullName}
            onChange={set("fullName")}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="I am">
            <Select
              required
              value={state.gender}
              onChange={set("gender")}
              disabled={!isCreate}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="female">A woman (bride)</option>
              <option value="male">A man (groom)</option>
            </Select>
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
        </div>
        <Field label="Profile created by">
          <Select value={state.managedBy} onChange={set("managedBy")}>
            {Object.entries(MANAGED_BY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
      </Section>

      <Section title="Background">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Religion">
            <Select value={state.religion} onChange={set("religion")}>
              <option value="">Prefer not to say</option>
              {RELIGIONS.map((religion) => (
                <option key={religion}>{religion}</option>
              ))}
            </Select>
          </Field>
          <Field label="Community" hint="Optional">
            <Input
              maxLength={60}
              value={state.community}
              onChange={set("community")}
            />
          </Field>
          <Field label="Mother tongue">
            <Input
              maxLength={40}
              placeholder="Hindi"
              value={state.motherTongue}
              onChange={set("motherTongue")}
            />
          </Field>
        </div>
      </Section>

      <Section title="Where you live">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City">
            <Input
              required
              minLength={2}
              maxLength={60}
              placeholder="Pune"
              value={state.city}
              onChange={set("city")}
            />
          </Field>
          <Field label="State">
            <Input
              maxLength={60}
              placeholder="Maharashtra"
              value={state.state}
              onChange={set("state")}
            />
          </Field>
        </div>
      </Section>

      <Section title="Education and work">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Highest education">
            <Input
              maxLength={120}
              placeholder="B.Tech, IIT Delhi"
              value={state.education}
              onChange={set("education")}
            />
          </Field>
          <Field label="Profession">
            <Input
              maxLength={120}
              placeholder="Software engineer"
              value={state.profession}
              onChange={set("profession")}
            />
          </Field>
        </div>
      </Section>

      <Section title="In your words">
        <Field
          label="About you"
          hint="A few honest lines about you, your family, and what you value."
        >
          <Textarea
            rows={5}
            maxLength={1000}
            value={state.about}
            onChange={set("about")}
          />
        </Field>
      </Section>

      <Section title="Looking for">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Partner age from">
            <Input
              type="number"
              min={18}
              max={80}
              value={state.partnerAgeMin}
              onChange={set("partnerAgeMin")}
            />
          </Field>
          <Field label="to">
            <Input
              type="number"
              min={18}
              max={80}
              value={state.partnerAgeMax}
              onChange={set("partnerAgeMax")}
            />
          </Field>
        </div>
      </Section>

      {error && <Notice>{error}</Notice>}
      <Button type="submit" busy={busy} className="w-full sm:w-auto">
        {submitLabel}
      </Button>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-3 font-serif text-lg text-ink">{title}</legend>
      {children}
    </fieldset>
  );
}
