"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Avatar, ButtonLink, Notice, PageLoader } from "@/components/ui";
import { api } from "@/lib/api";
import {
  compact,
  formatHeight,
  formatLastActive,
  MANAGED_BY_LABELS,
  MARITAL_STATUS_LABELS,
} from "@/lib/format";
import { useApi } from "@/lib/use-api";
import { InterestActions } from "./interest-actions";
import { SafetyActions } from "./safety-actions";

export function ProfileView() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const { data: profile, error, loading, setData } = useApi(userId, () =>
    api.profile(userId),
  );

  if (loading) return <PageLoader />;
  if (error || !profile) {
    return (
      <div className="space-y-4">
        <Notice>{error ?? "Profile not found."}</Notice>
        <Link href="/discover" className="text-sm text-maroon hover:underline">
          ← Back to Discover
        </Link>
      </div>
    );
  }

  const isOwn = user?.id === profile.userId;
  const firstName = profile.fullName.split(" ")[0];
  const details: [string, string | null][] = [
    ["Marital status", MARITAL_STATUS_LABELS[profile.maritalStatus]],
    ["Height", formatHeight(profile.heightCm)],
    ["Religion", profile.religion],
    ["Community", profile.community],
    ["Mother tongue", profile.motherTongue],
    ["Education", profile.education],
    ["Profession", profile.profession],
    ["Lives in", compact(profile.city, profile.state, profile.country)],
    ["Profile created by", MANAGED_BY_LABELS[profile.managedBy]],
  ];
  const lookingFor =
    profile.partnerAgeMin || profile.partnerAgeMax
      ? `${profile.partnerAgeMin ?? 18}–${profile.partnerAgeMax ?? 80} years`
      : null;

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="space-y-4">
        <Avatar
          name={profile.fullName}
          photoUrl={profile.photoUrl}
          className="aspect-[4/5] w-full rounded-3xl text-7xl"
        />
        {isOwn ? (
          <Notice tone="info">
            This is how other members see your profile.{" "}
            <Link href="/me/edit" className="font-medium text-maroon">
              Edit profile
            </Link>
          </Notice>
        ) : (
          <InterestActions
            profile={profile}
            onChange={(relationship) =>
              setData((current) => ({ ...current!, relationship }))
            }
          />
        )}
      </div>

      <div>
        <h1 className="font-serif text-4xl text-ink">
          {profile.fullName}
          <span className="text-muted">, {profile.age}</span>
        </h1>
        <p className="mt-2 text-muted">
          {compact(profile.profession, profile.city)}
          {formatLastActive(profile.lastActiveAt) && (
            <span className="ml-2 text-leaf">
              ● {formatLastActive(profile.lastActiveAt)}
            </span>
          )}
        </p>

        {profile.about && (
          <section className="mt-8">
            <h2 className="font-serif text-xl text-ink">About {firstName}</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-ink/90">
              {profile.about}
            </p>
          </section>
        )}

        <section className="mt-8">
          <h2 className="font-serif text-xl text-ink">Details</h2>
          <dl className="mt-3 divide-y divide-line rounded-2xl border border-line bg-card">
            {details
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-sm text-muted">{label}</dt>
                  <dd className="text-right text-sm text-ink">{value}</dd>
                </div>
              ))}
          </dl>
        </section>

        {lookingFor && (
          <section className="mt-8">
            <h2 className="font-serif text-xl text-ink">Looking for</h2>
            <p className="mt-2 text-ink/90">A partner aged {lookingFor}.</p>
          </section>
        )}

        {!isOwn && (
          <div className="mt-10 border-t border-line pt-6">
            <SafetyActions userId={profile.userId} name={firstName} />
          </div>
        )}
        {isOwn && (
          <div className="mt-10">
            <ButtonLink href="/me" variant="secondary">
              Back to my profile
            </ButtonLink>
          </div>
        )}
      </div>
    </div>
  );
}
