"use client";

import { useState } from "react";
import { Button, ButtonLink, Notice, Textarea } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import type { ProfileDetail, ProfileRelationship } from "@/lib/types";

export function InterestActions({
  profile,
  onChange,
}: {
  profile: ProfileDetail;
  onChange: (relationship: ProfileRelationship | null) => void;
}) {
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justMatched, setJustMatched] = useState(false);
  const firstName = profile.fullName.split(" ")[0];
  const rel = profile.relationship;

  async function run(action: () => Promise<ProfileRelationship | null>) {
    setBusy(true);
    setError(null);
    try {
      onChange(await action());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  const send = () =>
    run(async () => {
      const { interest, matched } = await api.sendInterest(
        profile.userId,
        note,
      );
      setJustMatched(matched);
      return {
        interestId: interest.id,
        status: interest.status,
        direction: interest.direction,
      };
    });

  const respond = (accept: boolean) =>
    run(async () => {
      const interest = accept
        ? await api.acceptInterest(rel!.interestId)
        : await api.declineInterest(rel!.interestId);
      setJustMatched(accept);
      return { ...rel!, status: interest.status };
    });

  const withdraw = () =>
    run(async () => {
      await api.withdrawInterest(rel!.interestId);
      return null;
    });

  let content: React.ReactNode;
  if (rel?.status === "accepted") {
    content = (
      <>
        <p className="font-heading text-lg font-bold text-foreground">
          {justMatched ? "It’s a match! 🎉" : "You are matched"}
        </p>
        <p className="text-xs text-muted-foreground">
          You and {firstName} have expressed mutual interest. You can now chat directly.
        </p>
        <ButtonLink href={`/matches/${rel.interestId}`} className="w-full">
          Send a message
        </ButtonLink>
      </>
    );
  } else if (rel?.status === "pending" && rel.direction === "sent") {
    content = (
      <>
        <p className="font-heading text-lg font-bold text-foreground">Interest sent</p>
        <p className="text-xs text-muted-foreground">
          We will notify you as soon as {firstName} responds.
        </p>
        <Button variant="ghost" busy={busy} onClick={withdraw}>
          Withdraw interest
        </Button>
      </>
    );
  } else if (rel?.status === "pending" && rel.direction === "received") {
    content = (
      <>
        <p className="font-heading text-lg font-bold text-foreground">
          {firstName} is interested in you
        </p>
        <p className="text-xs text-muted-foreground">
          Accept to start a conversation with {firstName}.
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button busy={busy} onClick={() => respond(true)}>
            Accept
          </Button>
          <Button
            variant="secondary"
            disabled={busy}
            onClick={() => respond(false)}
          >
            Decline
          </Button>
        </div>
      </>
    );
  } else if (rel?.status === "declined" && rel.direction === "sent") {
    content = (
      <p className="text-xs text-muted-foreground">
        {firstName} is not available for new introductions at this time.
      </p>
    );
  } else {
    content = (
      <>
        <p className="font-heading text-lg font-bold text-foreground">Interested in {firstName}?</p>
        <p className="text-xs text-muted-foreground">
          Send an interest. Chat opens when both of you say yes. Your contact details stay private.
        </p>
        {showNote ? (
          <Textarea
            rows={3}
            maxLength={300}
            placeholder={`Say hello to ${firstName} (optional)`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        ) : (
          <button
            type="button"
            className="text-left text-xs text-primary font-semibold hover:underline"
            onClick={() => setShowNote(true)}
          >
            + Add a personalized note
          </button>
        )}
        <Button busy={busy} onClick={send} className="w-full">
          Express interest
        </Button>
      </>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-sm">
      {content}
      {error && <Notice tone="error">{error}</Notice>}
    </div>
  );
}
