"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import {
  Avatar,
  Button,
  Notice,
  PageLoader,
  VerifiedBadge,
} from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import {
  CHAT_COMPOSER_HINT,
  CHAT_SAFETY_NOTE,
  CHAT_STARTERS,
  CHAT_STATUS,
  POLL_HIDDEN_MS,
  POLL_VISIBLE_MS,
} from "@/lib/constants";
import {
  compact,
  formatChatDay,
  formatChatEmpty,
  formatClock,
  formatLastActive,
  formatMatchNotice,
  isNewChatDay,
} from "@/lib/format";
import type { MessageView } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { useIsMounted } from "@/lib/use-mounted";

export function ChatView() {
  const isMounted = useIsMounted();
  const { id } = useParams<{ id: string }>();
  const match = useApi(id, () => api.match(id));
  const [messages, setMessages] = useState<MessageView[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const lastSeenAt = useRef<string | undefined>(undefined);
  const endRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const merge = useCallback((batch: MessageView[]) => {
    if (batch.length === 0) return;
    lastSeenAt.current = batch[batch.length - 1].createdAt;
    setMessages((current) => {
      const seen = new Set(current.map((m) => m.id));
      return [...current, ...batch.filter((m) => !seen.has(m.id))];
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    lastSeenAt.current = undefined;

    async function poll() {
      try {
        const batch = await api.messages(id, lastSeenAt.current);
        if (cancelled) return;
        merge(batch);
        setLoaded(true);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : String(err));
        if (err instanceof ApiError && err.status === 404) return;
      }
      timer = setTimeout(
        poll,
        document.hidden ? POLL_HIDDEN_MS : POLL_VISIBLE_MS,
      );
    }

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id, merge]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setSending(true);

    try {
      merge([await api.sendMessage(id, body)]);
      setDraft("");
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
    } finally {
      setSending(false);
    }
  }

  function onComposerKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  function applyStarter(text: string) {
    setDraft(text);
    composerRef.current?.focus();
  }

  const matchData = match.data;
  if (match.loading && !matchData) return <PageLoader />;
  if (!matchData) {
    return (
      <div className="space-y-4">
        <Notice tone="error">{match.error ?? "This chat is no longer available."}</Notice>
        <Link
          href="/matches"
          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-4" /> Back to messages
        </Link>
      </div>
    );
  }

  const profile = matchData.profile;
  const name = profile?.fullName ?? "Member";
  const firstName = name.split(" ")[0];
  const presence = isMounted ? formatLastActive(profile?.lastActiveAt ?? null) : null;
  const subtitle = compact(profile?.city, presence);
  const matchNotice = isMounted
    ? formatMatchNotice(matchData.matchedAt, CHAT_SAFETY_NOTE)
    : CHAT_SAFETY_NOTE;
  const lastOwnId = [...messages].reverse().find((message) => message.mine)?.id;
  const showStarters = loaded && messages.length < 3;

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem-5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm sm:h-[calc(100dvh-8rem)]">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Link
          href="/matches"
          className="p-1 text-muted-foreground hover:text-foreground"
          aria-label="Back to messages"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <Link
          href={profile ? `/profiles/${profile.userId}` : "/matches"}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          <Avatar
            name={name}
            photoUrl={profile?.photoUrl ?? null}
            className="size-10 shrink-0 rounded-xl"
          />
          <div className="min-w-0">
            <p className="flex items-center gap-1 font-heading text-sm font-bold text-foreground">
              <span className="truncate">{name}</span>
              <VerifiedBadge />
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {subtitle || "View profile"}
            </p>
          </div>
        </Link>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-md rounded-xl border border-border bg-accent/60 p-3 text-center text-xs leading-relaxed text-foreground/80">
          {matchNotice}
        </div>
        {!loaded && !error && <PageLoader />}
        {loaded && messages.length === 0 && (
          <p className="pt-8 text-center text-sm text-muted-foreground">
            {formatChatEmpty(firstName)}
          </p>
        )}
        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const showDay =
            isMounted && isNewChatDay(previous?.createdAt, message.createdAt);
          const seen =
            message.mine && message.id === lastOwnId
              ? message.readAt
                ? CHAT_STATUS.seen
                : CHAT_STATUS.sent
              : null;
          return (
            <div key={message.id} className="space-y-3">
              {showDay && (
                <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {formatChatDay(message.createdAt)}
                </p>
              )}
              <div className={`flex ${message.mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-xl px-4 py-2.5 shadow-sm ${
                    message.mine
                      ? "rounded-br-xs bg-primary text-primary-foreground"
                      : "rounded-bl-xs border border-border bg-card text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-line break-words text-sm leading-relaxed">
                    {message.body}
                  </p>
                  <p
                    className={`mt-1 text-right text-[11px] ${
                      message.mine
                        ? "text-primary-foreground/75"
                        : "text-muted-foreground"
                    }`}
                  >
                    {isMounted ? formatClock(message.createdAt) : ""}
                    {seen ? ` · ${seen}` : ""}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {error && (
        <div className="border-t border-border bg-card p-2">
          <Notice tone="error">{error}</Notice>
        </div>
      )}

      <form onSubmit={send} className="border-t border-border bg-card p-3">
        {showStarters && (
          <div className="mb-3 flex gap-2 overflow-x-auto">
            {CHAT_STARTERS.map((starter) => (
              <button
                key={starter}
                type="button"
                onClick={() => applyStarter(starter)}
                className="shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary"
              >
                {starter}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            ref={composerRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onComposerKeyDown}
            maxLength={2000}
            rows={1}
            placeholder={`Message ${firstName}...`}
            className="max-h-32 min-h-11 flex-1 resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <Button type="submit" busy={sending} disabled={!draft.trim()}>
            <Send className="size-4" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">{CHAT_COMPOSER_HINT}</p>
      </form>
    </div>
  );
}
