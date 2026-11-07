import { INTERESTS_COPY, PROFILE_FACT_LABELS } from "./constants";
import type {
  Gender,
  ManagedBy,
  MaritalStatus,
  ProfileCard,
  ProfileFact,
  ReportReason,
} from "./types";

export const MARITAL_STATUS_LABELS: Record<MaritalStatus, string> = {
  never_married: "Never married",
  divorced: "Divorced",
  widowed: "Widowed",
  awaiting_divorce: "Awaiting divorce",
};

export const MANAGED_BY_LABELS: Record<ManagedBy, string> = {
  self: "Myself",
  parent: "Parent",
  sibling: "Sibling",
  relative: "Relative",
  friend: "Friend",
};

export const GENDER_LABELS: Record<Gender, string> = {
  male: "Man",
  female: "Woman",
};

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  fake_profile: "Fake profile",
  inappropriate_content: "Inappropriate photos or text",
  harassment: "Harassment",
  scam: "Asking for money or a scam",
  already_married: "Already married",
  other: "Something else",
};

export function formatHeight(cm: number | null): string | null {
  if (!cm) return null;
  const totalInches = Math.round(cm / 2.54);
  return `${Math.floor(totalInches / 12)}′${totalInches % 12}″`;
}

export function formatLastActive(iso: string | null): string | null {
  if (!iso) return null;
  if (typeof window === "undefined") return null;
  const minutes = (Date.now() - new Date(iso).getTime()) / 60_000;
  if (minutes < 15) return "Active now";
  if (minutes < 60 * 24) return "Active today";
  if (minutes < 60 * 24 * 7) return "Active this week";
  return null;
}

export function formatTime(iso: string): string {
  if (typeof window === "undefined") return "";
  const date = new Date(iso);
  const sameDay = date.toDateString() === new Date().toDateString();
  return sameDay
    ? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString([], { day: "numeric", month: "short" });
}

export function formatClock(iso: string): string {
  if (typeof window === "undefined") return "";
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatChatDay(iso: string): string {
  if (typeof window === "undefined") return "";
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatMatchedPhrase(iso: string): string {
  const label = formatChatDay(iso);
  if (!label) return "";
  if (label === "Today" || label === "Yesterday") return label.toLowerCase();
  return `on ${label}`;
}

export function formatMatchNotice(iso: string, safetyNote: string): string {
  const phrase = formatMatchedPhrase(iso);
  const lead = phrase ? `You matched ${phrase}.` : "You matched.";
  return `${lead} ${safetyNote}`;
}

export function formatChatEmpty(firstName: string): string {
  return `Say hello to ${firstName}. A short note is enough to begin.`;
}

export function formatInterestQueue(total: number): string {
  return total === 1
    ? INTERESTS_COPY.queueOne
    : `${total} ${INTERESTS_COPY.queueMany}`;
}

export function isNewChatDay(previousIso: string | undefined, iso: string): boolean {
  if (!previousIso) return true;
  return new Date(previousIso).toDateString() !== new Date(iso).toDateString();
}

function profileFact(
  label: string,
  value: string | null | undefined,
): ProfileFact | null {
  if (!value) return null;
  return { label, value };
}

export function profileSnapshotFacts(profile: ProfileCard): ProfileFact[] {
  const lookingFor =
    profile.partnerAgeMin || profile.partnerAgeMax
      ? `${profile.partnerAgeMin ?? "—"}–${profile.partnerAgeMax ?? "—"} years`
      : null;
  const rows = [
    profileFact(PROFILE_FACT_LABELS.profession, profile.profession),
    profileFact(PROFILE_FACT_LABELS.salary, profile.annualIncome),
    profileFact(PROFILE_FACT_LABELS.education, profile.education),
    profileFact(PROFILE_FACT_LABELS.caste, profile.community),
    profileFact(PROFILE_FACT_LABELS.religion, profile.religion),
    profileFact(PROFILE_FACT_LABELS.motherTongue, profile.motherTongue),
    profileFact(
      PROFILE_FACT_LABELS.maritalStatus,
      MARITAL_STATUS_LABELS[profile.maritalStatus],
    ),
    profileFact(PROFILE_FACT_LABELS.height, formatHeight(profile.heightCm)),
    profileFact(
      PROFILE_FACT_LABELS.livesIn,
      compact(profile.city, profile.state, profile.country),
    ),
    profileFact(
      PROFILE_FACT_LABELS.gender,
      profile.gender ? GENDER_LABELS[profile.gender] : null,
    ),
    profileFact(
      PROFILE_FACT_LABELS.managedBy,
      profile.managedBy ? MANAGED_BY_LABELS[profile.managedBy] : null,
    ),
    profileFact(PROFILE_FACT_LABELS.lookingFor, lookingFor),
  ];
  return rows.filter((row): row is ProfileFact => row !== null);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function compact(...parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join(" · ");
}
