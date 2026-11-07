"use client";

import Link from "next/link";
import { useState } from "react";
import { InterestSwipeDeck } from "@/components/interest-swipe-deck";
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
import { INTERESTS_COPY, SENT_STATUS_CONFIG } from "@/lib/constants";
import { compact } from "@/lib/format";
import type { InterestListProps, InterestTab, InterestView } from "@/lib/types";
import { useApi } from "@/lib/use-api";

export function InterestsView() {
  const [tab, setTab] = useState<InterestTab>("received");
  const { data, error, loading, setData } = useApi(tab, () =>
    tab === "received" ? api.receivedInterests() : api.sentInterests(),
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  async function decide(interest: InterestView, status: "accepted" | "declined") {
    setActionError(null);
    setBusyId(interest.id);
    try {
      const action =
        status === "accepted" ? api.acceptInterest : api.declineInterest;
      const updated = await action(interest.id);
      setData((current) => ({
        ...current!,
        items: current!.items.map((item) =>
          item.id === interest.id ? { ...item, status: updated.status } : item,
        ),
      }));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : String(err));
    } finally {
      setBusyId(null);
    }
  }

  async function withdraw(interest: InterestView) {
    setBusyId(interest.id);
    setActionError(null);
    try {
      const updated = await api.withdrawInterest(interest.id);
      setData((current) => ({
        ...current!,
        items: current!.items.map((item) =>
          item.id === interest.id ? { ...item, status: updated.status } : item,
        ),
      }));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : String(err));
    } finally {
      setBusyId(null);
    }
  }

  const items = data?.items ?? [];
  const pending = items.filter(
    (interest) => interest.status === "pending" && interest.profile,
  );
  const responded = items.filter((interest) => interest.status !== "pending");

  return (
    <>
      <PageHeader title={INTERESTS_COPY.title} subtitle={INTERESTS_COPY.subtitle} />

      <div className="mb-6 inline-flex rounded-lg border border-border bg-card p-1 shadow-sm">
        {(
          [
            ["received", INTERESTS_COPY.received],
            ["sent", INTERESTS_COPY.sent],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`rounded-md px-5 py-2 text-sm font-semibold transition-all ${
              tab === value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {(error || actionError) && !items.length && (
        <div className="mb-4">
          <Notice tone="error">{error ?? actionError}</Notice>
        </div>
      )}
      {actionError && items.length > 0 && (
        <div className="mb-4">
          <Notice tone="error">{actionError}</Notice>
        </div>
      )}

      {loading && !items.length ? (
        <PageLoader />
      ) : tab === "received" ? (
        <div className="space-y-8">
          {pending.length ? (
            <InterestSwipeDeck
              interests={pending}
              onAccept={(interest) => decide(interest, "accepted")}
              onDecline={(interest) => decide(interest, "declined")}
            />
          ) : (
            <EmptyState title={INTERESTS_COPY.emptyReceivedTitle}>
              {responded.length
                ? INTERESTS_COPY.caughtUp
                : INTERESTS_COPY.emptyReceivedBody}
            </EmptyState>
          )}
          {responded.length > 0 && (
            <InterestList
              interests={responded}
              tab="received"
              busyId={busyId}
              onWithdraw={withdraw}
            />
          )}
        </div>
      ) : !items.length ? (
        <EmptyState title={INTERESTS_COPY.emptySentTitle}>
          <Link href="/discover" className="font-semibold text-primary hover:underline">
            {INTERESTS_COPY.emptySentLink}
          </Link>
        </EmptyState>
      ) : (
        <InterestList
          interests={items}
          tab="sent"
          busyId={busyId}
          onWithdraw={withdraw}
        />
      )}
    </>
  );
}

function InterestList({
  interests,
  tab,
  busyId,
  onWithdraw,
}: InterestListProps) {
  return (
    <ul className="space-y-4">
      {interests.map((interest) => {
        const name = interest.profile?.fullName ?? "Member";
        return (
          <li
            key={interest.id}
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <Link
              href={
                interest.profile ? `/profiles/${interest.profile.userId}` : "/interests"
              }
              className="flex min-w-0 flex-1 items-center gap-4"
            >
              <Avatar
                name={name}
                photoUrl={interest.profile?.photoUrl ?? null}
                className="size-16 shrink-0 rounded-xl text-xl"
              />
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 font-heading text-lg font-bold text-foreground">
                  <span>
                    {interest.profile
                      ? `${interest.profile.fullName}, ${interest.profile.age}`
                      : name}
                  </span>
                  <VerifiedBadge />
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {compact(
                    interest.profile?.profession,
                    interest.profile?.annualIncome,
                    interest.profile?.community,
                    interest.profile?.city,
                  )}
                </p>
              </div>
            </Link>
            <div className="flex shrink-0 items-center gap-2">
              {interest.status === "accepted" ? (
                <ButtonLink href={`/matches/${interest.id}`}>
                  {INTERESTS_COPY.sendMessage}
                </ButtonLink>
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
                    onClick={() => onWithdraw(interest)}
                  >
                    {INTERESTS_COPY.withdraw}
                  </Button>
                </>
              ) : (
                <span
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    SENT_STATUS_CONFIG[interest.status]?.tone ?? ""
                  }`}
                >
                  {SENT_STATUS_CONFIG[interest.status]?.label}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
