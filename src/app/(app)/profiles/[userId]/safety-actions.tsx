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
      <div className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm font-semibold text-foreground">
          Block {name}?
        </p>
        <p className="text-xs text-muted-foreground">
          You will no longer see each other’s profiles, and any existing chat will close immediately.
        </p>
        {error && <Notice tone="error">{error}</Notice>}
        <div className="flex gap-2 pt-1">
          <Button
            variant="danger"
            busy={busy}
            onClick={() => run(() => api.block(userId))}
          >
            Block member
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
        className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          run(() => api.report(userId, reason, details));
        }}
      >
        <p className="text-sm font-semibold text-foreground">
          Report profile
        </p>
        <p className="text-xs text-muted-foreground">
          Reports are 100% confidential. Our safety team will review this profile within 24 hours.
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
            placeholder="Help our safety team understand what happened..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </Field>
        {error && <Notice tone="error">{error}</Notice>}
        <div className="flex gap-2 pt-1">
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
    <div className="flex gap-4 text-xs font-semibold">
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setMode("block")}
      >
        Block {name}
      </button>
      <span className="text-border">·</span>
      <button
        type="button"
        className="text-muted-foreground hover:text-destructive transition-colors"
        onClick={() => setMode("report")}
      >
        Report profile
      </button>
    </div>
  );
}
