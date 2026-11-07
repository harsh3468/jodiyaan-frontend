"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import {
  Avatar,
  EmptyState,
  Notice,
  PageHeader,
  PageLoader,
  VerifiedBadge,
} from "@/components/ui";
import { api } from "@/lib/api";
import { formatTime } from "@/lib/format";
import { useApi } from "@/lib/use-api";
import { useIsMounted } from "@/lib/use-mounted";

export function MatchesView() {
  const isMounted = useIsMounted();
  const { user } = useAuth();
  const { data, error, loading } = useApi("matches", api.matches);
  const matches = data ?? [];

  return (
    <>
      <PageHeader
        title="Messages"
        subtitle="Meaningful conversations with mutual matches."
      />
      {error && !matches.length && <Notice tone="error">{error}</Notice>}
      {loading && !matches.length ? (
        <PageLoader />
      ) : !matches.length ? (
        <EmptyState title="No messages yet">
          When someone accepts your interest, or you accept theirs, you can chat
          here.{" "}
          <Link href="/interests" className="text-primary font-semibold hover:underline">
            Check your interests
          </Link>
        </EmptyState>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {matches.map((match) => {
            const name = match.profile?.fullName ?? "Member";
            const preview = match.lastMessage
              ? `${match.lastMessage.senderId === user?.id ? "You: " : ""}${match.lastMessage.body}`
              : "Say hello 👋";
            return (
              <li key={match.id}>
                <Link
                  href={`/matches/${match.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/30"
                >
                  <Avatar
                    name={name}
                    photoUrl={match.profile?.photoUrl ?? null}
                    className="size-14 shrink-0 rounded-xl text-lg"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate font-heading font-bold text-foreground flex items-center gap-1.5">
                        <span>{name}</span>
                        <VerifiedBadge />
                      </p>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {isMounted
                          ? formatTime(
                              match.lastMessage?.createdAt ?? match.matchedAt,
                            )
                          : null}
                      </span>
                    </div>
                    <p
                      className={`truncate text-sm mt-0.5 ${
                        match.unreadCount
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {preview}
                    </p>
                  </div>
                  {match.unreadCount > 0 && (
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
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
