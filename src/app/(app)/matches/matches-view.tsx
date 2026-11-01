"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import {
  Avatar,
  EmptyState,
  Notice,
  PageHeader,
  PageLoader,
} from "@/components/ui";
import { api } from "@/lib/api";
import { formatTime } from "@/lib/format";
import { useApi } from "@/lib/use-api";

export function MatchesView() {
  const { user } = useAuth();
  const { data, error, loading } = useApi("matches", api.matches);

  return (
    <>
      <PageHeader
        title="Matches"
        subtitle="People who said yes to each other."
      />
      {error && <Notice>{error}</Notice>}
      {loading ? (
        <PageLoader />
      ) : !data?.length ? (
        <EmptyState title="No matches yet">
          When someone accepts your interest, or you accept theirs, you can chat
          here.{" "}
          <Link href="/interests" className="text-maroon hover:underline">
            Check your interests
          </Link>
        </EmptyState>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
          {data.map((match) => {
            const name = match.profile?.fullName ?? "Member";
            const preview = match.lastMessage
              ? `${match.lastMessage.senderId === user?.id ? "You: " : ""}${match.lastMessage.body}`
              : "Say hello 👋";
            return (
              <li key={match.id}>
                <Link
                  href={`/matches/${match.id}`}
                  className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-paper"
                >
                  <Avatar
                    name={name}
                    photoUrl={match.profile?.photoUrl ?? null}
                    className="size-14 shrink-0 rounded-full text-lg"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate font-medium text-ink">{name}</p>
                      <span className="shrink-0 text-xs text-muted">
                        {formatTime(
                          match.lastMessage?.createdAt ?? match.matchedAt,
                        )}
                      </span>
                    </div>
                    <p
                      className={`truncate text-sm ${match.unreadCount ? "font-medium text-ink" : "text-muted"}`}
                    >
                      {preview}
                    </p>
                  </div>
                  {match.unreadCount > 0 && (
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-maroon text-xs font-medium text-white">
                      {match.unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
