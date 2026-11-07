"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { INTERESTS_COPY, SWIPE_ACCEPT_PX } from "@/lib/constants";
import { formatInterestQueue, formatLastActive, profileSnapshotFacts } from "@/lib/format";
import type { InterestSwipeDeckProps, SwipeCardProps } from "@/lib/types";
import { useIsMounted } from "@/lib/use-mounted";
import { Avatar, Button, VerifiedBadge } from "./ui";

export function InterestSwipeDeck({
  interests,
  onAccept,
  onDecline,
}: InterestSwipeDeckProps) {
  const top = interests[0];
  const next = interests[1];
  if (!top?.profile) return null;

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {formatInterestQueue(interests.length)}
      </p>
      <div className="relative h-[calc(100dvh-22rem)] sm:h-[calc(100dvh-18rem)]">
        {next?.profile && (
          <article className="absolute inset-x-3 top-3 bottom-0 rounded-2xl border border-border bg-card shadow-sm" />
        )}
        <SwipeCard
          key={top.id}
          interest={top}
          onAccept={onAccept}
          onDecline={onDecline}
        />
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {INTERESTS_COPY.swipeHint}
      </p>
    </div>
  );
}

function SwipeCard({ interest, onAccept, onDecline }: SwipeCardProps) {
  const isMounted = useIsMounted();
  const profile = interest.profile;
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exit, setExit] = useState<"left" | "right" | null>(null);
  const originX = useRef(0);

  if (!profile) return null;

  const facts = profileSnapshotFacts(profile);
  const active = isMounted ? formatLastActive(profile.lastActiveAt) : null;
  const offset = exit === "right" ? 560 : exit === "left" ? -560 : dragX;
  const rotation = Math.max(-14, Math.min(14, offset / 20));

  function finish(direction: "left" | "right") {
    if (exit) return;
    setExit(direction);
    window.setTimeout(() => {
      if (direction === "right") onAccept(interest);
      else onDecline(interest);
    }, 220);
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (exit) return;
    originX.current = event.clientX;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging || exit) return;
    setDragX(event.clientX - originX.current);
  }

  function onPointerUp() {
    if (!dragging || exit) return;
    setDragging(false);
    if (dragX > SWIPE_ACCEPT_PX) finish("right");
    else if (dragX < -SWIPE_ACCEPT_PX) finish("left");
    else setDragX(0);
  }

  return (
    <article
      className={`absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md ${
        dragging ? "" : "transition-transform duration-200"
      }`}
      style={{ transform: `translateX(${offset}px) rotate(${rotation}deg)` }}
    >
      <div
        className="relative h-[38%] shrink-0 cursor-grab touch-none bg-accent/50 active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Avatar
          name={profile.fullName}
          photoUrl={profile.photoUrl}
          className="size-full text-6xl"
        />
        {active && (
          <span className="absolute left-3 top-3 rounded-full border border-border/50 bg-card/90 px-2.5 py-1 text-xs font-semibold text-emerald-800">
            {active}
          </span>
        )}
        <span
          className={`absolute left-4 top-14 rounded-lg border border-emerald-700/20 bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800 ${
            offset > 36 ? "opacity-100" : "opacity-0"
          }`}
        >
          {INTERESTS_COPY.accept}
        </span>
        <span
          className={`absolute right-4 top-14 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-1 text-sm font-bold text-destructive ${
            offset < -36 ? "opacity-100" : "opacity-0"
          }`}
        >
          {INTERESTS_COPY.pass}
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div>
          <h2 className="flex items-center gap-1.5 font-heading text-2xl font-bold text-foreground">
            <span>
              {profile.fullName}, {profile.age}
            </span>
            <VerifiedBadge />
          </h2>
          <Link
            href={`/profiles/${profile.userId}`}
            className="text-xs font-semibold text-primary hover:underline"
          >
            {INTERESTS_COPY.fullProfile}
          </Link>
        </div>

        <dl className="grid grid-cols-2 gap-x-3 gap-y-3">
          {facts.map((fact) => (
            <div key={fact.label} className="min-w-0">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {fact.label}
              </dt>
              <dd className="break-words text-sm font-semibold text-foreground">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        {profile.about && (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {INTERESTS_COPY.about}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/85">
              {profile.about}
            </p>
          </div>
        )}

        {interest.message && (
          <div className="rounded-xl border border-border bg-accent/40 p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {INTERESTS_COPY.theyWrote}
            </p>
            <p className="mt-1 text-sm italic leading-relaxed text-foreground">
              “{interest.message}”
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 border-t border-border px-4 py-3">
        <Button
          variant="secondary"
          className="size-14 rounded-full px-0"
          aria-label={INTERESTS_COPY.pass}
          disabled={exit !== null}
          onClick={() => finish("left")}
        >
          <X className="size-5" />
        </Button>
        <Button
          className="size-14 rounded-full px-0"
          aria-label={INTERESTS_COPY.accept}
          disabled={exit !== null}
          onClick={() => finish("right")}
        >
          <Check className="size-5" />
        </Button>
      </div>
    </article>
  );
}
