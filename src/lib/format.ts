import type { ManagedBy, MaritalStatus, ReportReason } from "./types";

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
  const minutes = (Date.now() - new Date(iso).getTime()) / 60_000;
  if (minutes < 15) return "Active now";
  if (minutes < 60 * 24) return "Active today";
  if (minutes < 60 * 24 * 7) return "Active this week";
  return null;
}

export function formatTime(iso: string): string {
  const date = new Date(iso);
  const sameDay = date.toDateString() === new Date().toDateString();
  return sameDay
    ? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString([], { day: "numeric", month: "short" });
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
