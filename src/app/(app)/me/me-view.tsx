"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  Avatar,
  Button,
  ButtonLink,
  Notice,
  PageHeader,
  PageLoader,
  VerifiedBadge,
} from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { PHOTO_MAX_MB } from "@/lib/constants";
import { compact, formatHeight } from "@/lib/format";
import type { OwnProfile } from "@/lib/types";
import { useApi } from "@/lib/use-api";

export function MeView() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const profile = useApi("me", api.myProfile);
  const blocked = useApi("blocked", api.blocked);
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"photo" | "visibility" | string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  async function run<T>(key: string, action: () => Promise<T>) {
    setBusy(key);
    setError(null);
    try {
      return await action();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  }

  async function uploadPhoto(file: File) {
    if (file.size > PHOTO_MAX_MB * 1024 * 1024) {
      setError(`Please choose a photo under ${PHOTO_MAX_MB} MB.`);
      return;
    }
    const updated = await run("photo", () => api.uploadPhoto(file));
    if (updated) profile.setData(() => updated);
  }

  async function toggleVisibility(me: OwnProfile) {
    const updated = await run("visibility", () =>
      api.updateProfile({ isVisible: !me.isVisible }),
    );
    if (updated) profile.setData(() => updated);
  }

  const me = profile.data;
  if (profile.loading && !me) return <PageLoader />;
  if (!me) return <Notice tone="error">{profile.error ?? "Could not load your profile."}</Notice>;

  const missing = [
    !me.photoUrl && "a photo",
    !me.about && "a few lines about you",
    !me.profession && "your profession",
  ].filter(Boolean);

  return (
    <>
      <PageHeader title="My Profile" subtitle={user?.email} />
      {error && (
        <div className="mb-6">
          <Notice tone="error">{error}</Notice>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="space-y-3">
          <div className="rounded-xl bg-accent/60 border border-border aspect-[4/5] overflow-hidden flex items-center justify-center shadow-sm">
            <Avatar
              name={me.fullName}
              photoUrl={me.photoUrl}
              className="size-full text-7xl"
            />
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadPhoto(file);
              e.target.value = "";
            }}
          />
          <Button
            variant="secondary"
            className="w-full"
            busy={busy === "photo"}
            onClick={() => fileInput.current?.click()}
          >
            {me.photoUrl ? "Change photo" : "Add a photo"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            A clear, recent photo of your face. JPG, PNG, or WebP up to{" "}
            {PHOTO_MAX_MB} MB.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground flex items-center gap-2">
              <span>{me.fullName}, {me.age}</span>
              <VerifiedBadge />
            </h2>
            <p className="mt-1 text-muted-foreground">
              {compact(me.city, formatHeight(me.heightCm), me.profession)}
            </p>
          </div>

          {missing.length > 0 && (
            <Notice tone="info">
              Profiles with {missing.join(", ")} get far more interest. Add
              them to stand out.
            </Notice>
          )}

          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/me/edit" variant="primary">Edit profile</ButtonLink>
            <ButtonLink href={`/profiles/${me.userId}`} variant="secondary">
              See public view
            </ButtonLink>
          </div>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-heading font-bold text-foreground">
                  {me.isVisible ? "Visible in Discover" : "Hidden from Discover"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {me.isVisible
                    ? "New members can find you."
                    : "Only your existing matches can see you."}
                </p>
              </div>
              <Button
                variant="secondary"
                busy={busy === "visibility"}
                onClick={() => toggleVisibility(me)}
              >
                {me.isVisible ? "Hide" : "Show"}
              </Button>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="font-heading font-bold text-foreground">Blocked members</p>
            {!blocked.data?.length ? (
              <p className="mt-1 text-sm text-muted-foreground">You haven’t blocked anyone.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border">
                {blocked.data.map((member) => (
                  <li
                    key={member.userId}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm text-foreground">{member.fullName}</span>
                    <Button
                      variant="ghost"
                      busy={busy === member.userId}
                      onClick={async () => {
                        await run(member.userId, () =>
                          api.unblock(member.userId),
                        );
                        blocked.reload();
                      }}
                    >
                      Unblock
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <Button
            variant="ghost"
            onClick={() => {
              signOut();
              router.replace("/");
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    </>
  );
}
