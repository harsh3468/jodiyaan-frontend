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
} from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { compact, formatHeight } from "@/lib/format";
import type { OwnProfile } from "@/lib/types";
import { useApi } from "@/lib/use-api";

const PHOTO_MAX_MB = 5;

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

  if (profile.loading) return <PageLoader />;
  const me = profile.data;
  if (!me) return <Notice>{profile.error ?? "Could not load your profile."}</Notice>;

  const missing = [
    !me.photoUrl && "a photo",
    !me.about && "a few lines about you",
    !me.profession && "your profession",
  ].filter(Boolean);

  return (
    <>
      <PageHeader title="My profile" subtitle={user?.email} />
      {error && (
        <div className="mb-6">
          <Notice>{error}</Notice>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="space-y-3">
          <Avatar
            name={me.fullName}
            photoUrl={me.photoUrl}
            className="aspect-[4/5] w-full rounded-3xl text-7xl"
          />
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
          <p className="text-center text-xs text-muted">
            A clear, recent photo of your face. JPG, PNG, or WebP up to{" "}
            {PHOTO_MAX_MB} MB.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-3xl text-ink">
              {me.fullName}
              <span className="text-muted">, {me.age}</span>
            </h2>
            <p className="mt-1 text-muted">
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
            <ButtonLink href="/me/edit">Edit profile</ButtonLink>
            <ButtonLink href={`/profiles/${me.userId}`} variant="secondary">
              See how others see you
            </ButtonLink>
          </div>

          <section className="rounded-2xl border border-line bg-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-ink">
                  {me.isVisible ? "Visible in Discover" : "Hidden from Discover"}
                </p>
                <p className="text-sm text-muted">
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

          <section className="rounded-2xl border border-line bg-card p-5">
            <p className="font-medium text-ink">Blocked members</p>
            {!blocked.data?.length ? (
              <p className="mt-1 text-sm text-muted">You haven’t blocked anyone.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {blocked.data.map((member) => (
                  <li
                    key={member.userId}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm text-ink">{member.fullName}</span>
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
