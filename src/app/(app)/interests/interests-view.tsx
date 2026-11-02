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
  VerifiedBadge,
} from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { SENT_STATUS_CONFIG } from "@/lib/constants";
import { compact } from "@/lib/format";
import type { InterestTab, InterestView } from "@/lib/types";
import { useApi } from "@/lib/use-api";

export function InterestsView() {
  const [tab, setTab] = useState<InterestTab>("received");
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
      <PageHeader
        title="Interests"
        subtitle="Manage invitations and responses from people who wish to connect."
      />

      <div className="mb-6 inline-flex rounded-lg border border-border bg-card p-1 shadow-sm">
        {(["received", "sent"] as const).map((value) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`rounded-md px-5 py-2 text-sm font-semibold capitalize transition-all ${
              tab === value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {(error || actionError) && (
        <div className="mb-4">
          <Notice tone="error">{error ?? actionError}</Notice>
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
            "When someone likes your profile, they will appear here. A complete profile with photos gets far more interest."
          ) : (
            <Link href="/discover" className="text-primary font-semibold hover:underline">
              Find someone on Discover
            </Link>
          )}
        </EmptyState>
      ) : (
        <ul className="space-y-4">
          {data.items.map((interest) => (
            <li
              key={interest.id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <Link
                href={
                  interest.profile
                    ? `/profiles/${interest.profile.userId}`
                    : "#"
                }
                className="flex min-w-0 flex-1 items-center gap-4"
              >
                <Avatar
                  name={interest.profile?.fullName ?? "Member"}
                  photoUrl={interest.profile?.photoUrl ?? null}
                  className="size-16 shrink-0 rounded-xl text-xl"
                />
                <div className="min-w-0">
                  <p className="font-heading text-lg font-bold text-foreground flex items-center gap-1.5">
                    <span>
                      {interest.profile
                        ? `${interest.profile.fullName}, ${interest.profile.age}`
                        : "Member"}
                    </span>
                    <VerifiedBadge />
                  </p>
                  <p className="truncate text-xs text-muted-foreground mt-0.5">
                    {compact(
                      interest.profile?.city,
                      interest.profile?.profession,
                    )}
                  </p>
                  {interest.message && (
                    <p className="mt-1 line-clamp-2 text-sm italic text-foreground/85">
                      “{interest.message}”
                    </p>
                  )}
                </div>
              </Link>

              <div className="flex shrink-0 items-center gap-2">
                {interest.status === "accepted" ? (
                  <ButtonLink href={`/matches/${interest.id}`}>
                    Send message
                  </ButtonLink>
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
                      className={`self-center rounded-lg px-3 py-1.5 text-xs font-semibold ${SENT_STATUS_CONFIG.pending.tone}`}
                    >
                      {SENT_STATUS_CONFIG.pending.label}
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
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      SENT_STATUS_CONFIG[interest.status]?.tone ?? ""
                    }`}
                  >
                    {tab === "received" && interest.status === "declined"
                      ? "Declined"
                      : SENT_STATUS_CONFIG[interest.status]?.label}
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
