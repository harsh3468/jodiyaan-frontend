"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Field, Notice, Select, Textarea } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { REPORT_REASON_LABELS } from "@/lib/format";
import type { ReportReason } from "@/lib/types";

export function SafetyActions({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"idle" | "block" | "report">("idle");
  const [reason, setReason] = useState<ReportReason>("fake_profile");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await action();
      router.replace("/discover");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
      setBusy(false);
    }
  }

  if (mode === "block") {
    return (
      <div className="space-y-3 rounded-2xl border border-line bg-card p-5">
        <p className="text-sm text-ink">
          Block {name}? You will no longer see each other, and any chat will
          close.
        </p>
        {error && <Notice>{error}</Notice>}
        <div className="flex gap-2">
          <Button
            variant="danger"
            busy={busy}
            onClick={() => run(() => api.block(userId))}
          >
            Block
          </Button>
          <Button variant="ghost" onClick={() => setMode("idle")}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (mode === "report") {
    return (
      <form
        className="space-y-4 rounded-2xl border border-line bg-card p-5"
        onSubmit={(e) => {
          e.preventDefault();
          run(() => api.report(userId, reason, details));
        }}
      >
        <p className="text-sm text-ink">
          Reports are private. We will review this profile, and {name} will be
          blocked for you.
        </p>
        <Field label="Reason">
          <Select
            value={reason}
            onChange={(e) => setReason(e.target.value as ReportReason)}
          >
            {Object.entries(REPORT_REASON_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Details (optional)">
          <Textarea
            rows={3}
            maxLength={1000}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </Field>
        {error && <Notice>{error}</Notice>}
        <div className="flex gap-2">
          <Button type="submit" variant="danger" busy={busy}>
            Submit report
          </Button>
          <Button type="button" variant="ghost" onClick={() => setMode("idle")}>
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex gap-4 text-sm">
      <button
        className="text-muted hover:text-ink"
        onClick={() => setMode("block")}
      >
        Block {name}
      </button>
      <button
        className="text-muted hover:text-red-700"
        onClick={() => setMode("report")}
      >
        Report profile
      </button>
    </div>
  );
}
