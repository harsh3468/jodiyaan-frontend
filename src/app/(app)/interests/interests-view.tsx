"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Avatar,
  Button,
  ButtonLink,
  EmptyState,
  Notice,
  PageHeader,
  PageLoader,
} from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { compact } from "@/lib/format";
import type { InterestStatus, InterestView } from "@/lib/types";
import { useApi } from "@/lib/use-api";

type Tab = "received" | "sent";

const SENT_STATUS: Record<InterestStatus, { label: string; tone: string }> = {
  pending: { label: "Awaiting reply", tone: "bg-blush text-maroon" },
  accepted: { label: "Matched", tone: "bg-emerald-50 text-leaf" },
  declined: { label: "Not available", tone: "bg-stone-100 text-muted" },
  withdrawn: { label: "Withdrawn", tone: "bg-stone-100 text-muted" },
};

export function InterestsView() {
  const [tab, setTab] = useState<Tab>("received");
  const { data, error, loading, setData } = useApi(tab, () =>
    tab === "received" ? api.receivedInterests() : api.sentInterests(),
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function act(
    interest: InterestView,
    action: (id: string) => Promise<InterestView>,
  ) {
    setBusyId(interest.id);
    setActionError(null);
    try {
      const updated = await action(interest.id);
      setData((current) => ({
        ...current!,
        items: current!.items.map((i) =>
          i.id === interest.id ? { ...i, status: updated.status } : i,
        ),
      }));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : String(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <PageHeader title="Interests" />
      <div className="mb-6 inline-flex rounded-full border border-line bg-card p-1">
        {(["received", "sent"] as const).map((value) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`rounded-full px-5 py-2 text-sm capitalize transition-colors ${
              tab === value ? "bg-maroon text-white" : "text-muted hover:text-ink"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {(error || actionError) && (
        <div className="mb-4">
          <Notice>{error ?? actionError}</Notice>
        </div>
      )}
      {loading ? (
        <PageLoader />
      ) : !data?.items.length ? (
        <EmptyState
          title={
            tab === "received" ? "No new interests yet" : "You haven’t sent any"
          }
        >
          {tab === "received" ? (
            "When someone likes your profile, they will appear here. A good photo and a few lines about you help."
          ) : (
            <Link href="/discover" className="text-maroon hover:underline">
              Find someone on Discover
            </Link>
          )}
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {data.items.map((interest) => (
            <li
              key={interest.id}
              className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-4 sm:flex-row sm:items-center"
            >
              <Link
                href={interest.profile ? `/profiles/${interest.profile.userId}` : "#"}
                className="flex min-w-0 flex-1 items-center gap-4"
              >
                <Avatar
                  name={interest.profile?.fullName ?? "Member"}
                  photoUrl={interest.profile?.photoUrl ?? null}
                  className="size-16 shrink-0 rounded-2xl text-xl"
                />
                <div className="min-w-0">
                  <p className="font-serif text-lg text-ink">
                    {interest.profile
                      ? `${interest.profile.fullName}, ${interest.profile.age}`
                      : "Member"}
                  </p>
                  <p className="truncate text-sm text-muted">
                    {compact(interest.profile?.city, interest.profile?.profession)}
                  </p>
                  {interest.message && (
                    <p className="mt-1 line-clamp-2 text-sm italic text-ink/80">
                      “{interest.message}”
                    </p>
                  )}
                </div>
              </Link>

              <div className="flex shrink-0 gap-2">
                {interest.status === "accepted" ? (
                  <ButtonLink href={`/matches/${interest.id}`}>Message</ButtonLink>
                ) : tab === "received" && interest.status === "pending" ? (
                  <>
                    <Button
                      busy={busyId === interest.id}
                      onClick={() => act(interest, api.acceptInterest)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={busyId === interest.id}
                      onClick={() => act(interest, api.declineInterest)}
                    >
                      Decline
                    </Button>
                  </>
                ) : tab === "sent" && interest.status === "pending" ? (
                  <>
                    <span
                      className={`self-center rounded-full px-3 py-1 text-xs font-medium ${SENT_STATUS.pending.tone}`}
                    >
                      {SENT_STATUS.pending.label}
                    </span>
                    <Button
                      variant="ghost"
                      busy={busyId === interest.id}
                      onClick={() => act(interest, api.withdrawInterest)}
                    >
                      Withdraw
                    </Button>
                  </>
                ) : (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${SENT_STATUS[interest.status].tone}`}
                  >
                    {tab === "received" && interest.status === "declined"
                      ? "Declined"
                      : SENT_STATUS[interest.status].label}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
