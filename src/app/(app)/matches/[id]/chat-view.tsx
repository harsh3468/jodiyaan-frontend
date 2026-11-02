"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import {
  Avatar,
  Button,
  Notice,
  PageLoader,
  VerifiedBadge,
} from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { POLL_HIDDEN_MS, POLL_VISIBLE_MS } from "@/lib/constants";
import { formatTime } from "@/lib/format";
import type { MessageView } from "@/lib/types";
import { useApi } from "@/lib/use-api";

export function ChatView() {
  const { id } = useParams<{ id: string }>();
  const match = useApi(id, () => api.match(id));
  const [messages, setMessages] = useState<MessageView[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const lastSeenAt = useRef<string | undefined>(undefined);
  const endRef = useRef<HTMLDivElement>(null);

  function merge(batch: MessageView[]) {
    if (batch.length === 0) return;
    lastSeenAt.current = batch[batch.length - 1].createdAt;
    setMessages((current) => {
      const seen = new Set(current.map((m) => m.id));
      return [...current, ...batch.filter((m) => !seen.has(m.id))];
    });
  }

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
  }, [id]);

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

  if (match.loading) return <PageLoader />;
  if (match.error || !match.data) {
    return (
      <div className="space-y-4">
        <Notice tone="error">{match.error ?? "This chat is no longer available."}</Notice>
        <Link
          href="/matches"
          className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5"
        >
          <ArrowLeft className="size-4" /> Back to messages
        </Link>
      </div>
    );
  }

  const profile = match.data.profile;
  const name = profile?.fullName ?? "Member";

  return (
    <div className="-my-6 flex h-[calc(100dvh-4rem-5rem)] flex-col sm:h-[calc(100dvh-5rem)]">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 rounded-t-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/matches"
            className="text-muted-foreground hover:text-foreground p-1"
            aria-label="Back to messages"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <Link
            href={profile ? `/profiles/${profile.userId}` : "#"}
            className="flex items-center gap-3"
          >
            <Avatar
              name={name}
              photoUrl={profile?.photoUrl ?? null}
              className="size-10 rounded-xl"
            />
            <div>
              <p className="font-heading font-bold text-foreground text-sm flex items-center gap-1">
                <span>{name}</span>
                <VerifiedBadge />
              </p>
              <p className="text-xs text-primary font-semibold hover:underline">
                View profile
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4 bg-background">
        <div className="mx-auto mb-4 max-w-md rounded-xl bg-accent/60 border border-border p-3 text-center text-xs text-foreground/80 leading-relaxed shadow-sm">
          You matched on {formatTime(match.data.matchedAt)}. For your safety, never send money or share bank details.
        </div>
        {!loaded && !error && <PageLoader />}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.mine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-xl px-4 py-2.5 shadow-sm ${
                message.mine
                  ? "bg-primary text-primary-foreground rounded-br-xs"
                  : "border border-border bg-card text-foreground rounded-bl-xs"
              }`}
            >
              <p className="whitespace-pre-line break-words text-sm leading-relaxed">
                {message.body}
              </p>
              <p
                className={`mt-1 text-right text-[11px] ${
                  message.mine ? "text-primary-foreground/75" : "text-muted-foreground"
                }`}
              >
                {formatTime(message.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {error && (
        <div className="p-2 bg-card border-t border-border">
          <Notice tone="error">{error}</Notice>
        </div>
      )}

      {/* Message input */}
      <form
        onSubmit={send}
        className="flex gap-2 border-t border-border bg-card p-3 rounded-b-xl"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={2000}
          placeholder={`Message ${name.split(" ")[0]}...`}
          className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <Button type="submit" busy={sending} disabled={!draft.trim()}>
          <Send className="size-4" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </form>
    </div>
  );
}
