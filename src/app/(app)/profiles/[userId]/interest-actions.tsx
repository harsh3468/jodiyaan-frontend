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
        <p className="font-serif text-xl text-ink">
          {justMatched ? "It’s a match!" : "You are matched"}
        </p>
        <p className="text-sm text-muted">
          You can now message {firstName} directly.
        </p>
        <ButtonLink href={`/matches/${rel.interestId}`} className="w-full">
          Send a message
        </ButtonLink>
      </>
    );
  } else if (rel?.status === "pending" && rel.direction === "sent") {
    content = (
      <>
        <p className="font-serif text-xl text-ink">Interest sent</p>
        <p className="text-sm text-muted">
          We will let you know when {firstName} responds.
        </p>
        <Button variant="ghost" busy={busy} onClick={withdraw}>
          Withdraw interest
        </Button>
      </>
    );
  } else if (rel?.status === "pending" && rel.direction === "received") {
    content = (
      <>
        <p className="font-serif text-xl text-ink">
          {firstName} is interested in you
        </p>
        <p className="text-sm text-muted">
          Accept to start a conversation with {firstName}.
        </p>
        <div className="grid grid-cols-2 gap-2">
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
      <p className="text-sm text-muted">
        {firstName} is not available right now.
      </p>
    );
  } else {
    content = (
      <>
        <p className="font-serif text-xl text-ink">Interested in {firstName}?</p>
        <p className="text-sm text-muted">
          If {firstName} accepts, you can chat. Your contact details stay
          private.
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
            className="text-left text-sm text-maroon hover:underline"
            onClick={() => setShowNote(true)}
          >
            + Add a short note
          </button>
        )}
        <Button busy={busy} onClick={send} className="w-full">
          Send interest
        </Button>
      </>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-line bg-card p-5">
      {content}
      {error && <Notice>{error}</Notice>}
    </div>
  );
}
