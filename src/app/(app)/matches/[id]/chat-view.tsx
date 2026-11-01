"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar, Button, Notice, PageLoader } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { formatTime } from "@/lib/format";
import type { MessageView } from "@/lib/types";
import { useApi } from "@/lib/use-api";

const POLL_VISIBLE_MS = 4_000;
const POLL_HIDDEN_MS = 15_000;

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
        <Notice>{match.error ?? "This chat is no longer available."}</Notice>
        <Link href="/matches" className="text-sm text-maroon hover:underline">
          ← Back to matches
        </Link>
      </div>
    );
  }

  const profile = match.data.profile;
  const name = profile?.fullName ?? "Member";

  return (
    <div className="-my-8 flex h-[calc(100dvh-4rem-5rem)] flex-col sm:h-[calc(100dvh-4rem)]">
      <div className="flex items-center gap-3 border-b border-line py-3">
        <Link href="/matches" className="text-muted hover:text-ink" aria-label="Back">
          ←
        </Link>
        <Link
          href={profile ? `/profiles/${profile.userId}` : "#"}
          className="flex items-center gap-3"
        >
          <Avatar
            name={name}
            photoUrl={profile?.photoUrl ?? null}
            className="size-10 rounded-full"
          />
          <div>
            <p className="font-medium text-ink">{name}</p>
            <p className="text-xs text-muted">View profile</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto py-4">
        <p className="mx-auto mb-4 max-w-md rounded-xl bg-blush px-4 py-2 text-center text-xs text-muted">
          You matched {formatTime(match.data.matchedAt)}. Never send money or
          share bank details. Report anyone who asks.
        </p>
        {!loaded && !error && <PageLoader />}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.mine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                message.mine
                  ? "rounded-br-sm bg-maroon text-white"
                  : "rounded-bl-sm border border-line bg-card text-ink"
              }`}
            >
              <p className="whitespace-pre-line break-words text-[15px]">
                {message.body}
              </p>
              <p
                className={`mt-0.5 text-right text-[11px] ${message.mine ? "text-white/70" : "text-muted"}`}
              >
                {formatTime(message.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {error && (
        <div className="pb-2">
          <Notice>{error}</Notice>
        </div>
      )}
      <form onSubmit={send} className="flex gap-2 border-t border-line py-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={2000}
          placeholder={`Message ${name.split(" ")[0]}`}
          className="flex-1 rounded-full border border-line bg-card px-4 py-2.5 text-[15px] outline-none focus:border-maroon"
        />
        <Button type="submit" busy={sending} disabled={!draft.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
