"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import {
  Avatar,
  ButtonLink,
  Notice,
  PageLoader,
  VerifiedBadge,
} from "@/components/ui";
import { api } from "@/lib/api";
import { PROFILE_TABS, SAMPLE_PROFILE_DETAILS } from "@/lib/constants";
import {
  compact,
  formatHeight,
  formatLastActive,
  MANAGED_BY_LABELS,
  MARITAL_STATUS_LABELS,
} from "@/lib/format";
import type { ProfileDetail } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { InterestActions } from "./interest-actions";
import { SafetyActions } from "./safety-actions";

export function ProfileView() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("about");
  const [copied, setCopied] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const sampleData: ProfileDetail | null =
    userId && userId in SAMPLE_PROFILE_DETAILS
      ? SAMPLE_PROFILE_DETAILS[userId]
      : null;

  const { data: apiProfile, error, loading, setData } = useApi(
    sampleData ? null : userId,
    () => (sampleData ? Promise.resolve(sampleData) : api.profile(userId)),
  );

  const profile = sampleData ?? apiProfile;

  if (loading && !profile) return <PageLoader />;
  if ((error || !profile) && !sampleData) {
    return (
      <div className="space-y-4">
        <Notice tone="error">{error ?? "Profile not found."}</Notice>
        <Link
          href="/discover"
          className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5"
        >
          <ArrowLeft className="size-4" /> Back to matches
        </Link>
      </div>
    );
  }

  if (!profile) return null;

  const isOwn = user?.id === profile.userId;
  const firstName = profile.fullName.split(" ")[0];

  const galleryPhotos = [
    profile.photoUrl,
    "/images/heritage-palace.jpg",
    "/images/hero-couple.jpg",
  ].filter(Boolean) as string[];

  const currentPhoto = selectedPhoto ?? profile.photoUrl;

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
      ? `${profile.partnerAgeMin ?? 18} – ${profile.partnerAgeMax ?? 80} years`
      : null;

  const quickBadges = [
    profile.religion,
    profile.community,
    profile.education,
    profile.profession,
  ].filter(Boolean) as string[];

  function handleShare() {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <Link
          href="/discover"
          className="text-sm font-semibold text-primary flex items-center gap-2 hover:underline"
        >
          <ArrowLeft className="size-4" />
          <span>Back to matches</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="p-2 rounded-xl border border-border bg-card text-foreground hover:bg-secondary/40 text-sm flex items-center gap-1.5 transition-colors"
          title="Share profile"
        >
          <Share2 className="size-4 text-muted-foreground" />
          <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-8">
        {/* Left Column: Photos & Interaction */}
        <section className="space-y-5">
          <div className="rounded-2xl bg-accent/60 border border-border overflow-hidden aspect-[4/5] relative shadow-md flex items-center justify-center">
            {currentPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentPhoto}
                alt={profile.fullName}
                className="size-full object-cover"
              />
            ) : (
              <Avatar
                name={profile.fullName}
                photoUrl={null}
                className="size-full text-8xl"
              />
            )}
            {formatLastActive(profile.lastActiveAt) && (
              <span className="absolute left-3 top-3 rounded-full bg-card/90 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-border/50 shadow-sm">
                ● {formatLastActive(profile.lastActiveAt)}
              </span>
            )}
          </div>

          {/* Photo gallery thumbnails */}
          {galleryPhotos.length > 1 && (
            <div className="grid grid-cols-4 gap-2.5">
              {galleryPhotos.map((photo, idx) => {
                const active = currentPhoto === photo;
                return (
                  <button
                    key={photo + idx}
                    type="button"
                    onClick={() => setSelectedPhoto(photo)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      active
                        ? "border-primary ring-2 ring-primary/20 scale-95"
                        : "border-border hover:border-primary/50 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={photo}
                      alt={`Photo thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {isOwn ? (
            <Notice tone="info">
              This is how your profile appears to potential matches.{" "}
              <Link href="/me/edit" className="font-semibold text-primary underline">
                Edit profile
              </Link>
            </Notice>
          ) : (
            <InterestActions
              profile={profile}
              onChange={(relationship) =>
                setData((current) => ({ ...(current ?? profile), relationship }))
              }
            />
          )}
        </section>

        {/* Right Column: Profile Content */}
        <section className="space-y-6">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground flex items-center gap-2">
              <span>{profile.fullName}</span>
              <VerifiedBadge />
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-muted-foreground">
              {profile.age} years · {formatHeight(profile.heightCm)} ·{" "}
              {compact(profile.city, profile.state)}
            </p>
          </div>

          {/* Quick Info Badges */}
          {quickBadges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {quickBadges.map((badge) => (
                <span
                  key={badge}
                  className="px-3.5 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-xs font-semibold border border-border/40"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Action Row for Non-own profiles */}
          {!isOwn && (
            <div className="grid sm:grid-cols-2 gap-3">
              <Link
                href="/matches"
                className="min-h-11 rounded-xl bg-card border border-border text-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-secondary/40 transition-colors shadow-sm"
              >
                <Heart className="size-4 text-primary" />
                <span>Shortlist profile</span>
              </Link>
              <Link
                href="/matches"
                className="min-h-11 rounded-xl bg-card border border-border text-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-secondary/40 transition-colors shadow-sm"
              >
                <MessageCircle className="size-4 text-foreground" />
                <span>Send direct message</span>
              </Link>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="border-b border-border flex gap-6 overflow-x-auto text-sm font-semibold pt-2">
            {PROFILE_TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 transition-colors shrink-0 ${
                    active
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="space-y-6 pt-2">
            {activeTab === "about" && (
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  About {firstName}
                </h2>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-foreground/90 whitespace-pre-line">
                  {profile.about ||
                    `${firstName} has not added an introductory note yet.`}
                </p>
              </div>
            )}

            {activeTab === "family" && (
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Family & Background
                </h2>
                <dl className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
                  <div className="flex justify-between px-5 py-3.5 text-sm">
                    <dt className="text-muted-foreground">Community</dt>
                    <dd className="font-semibold text-foreground">{profile.community || "Not specified"}</dd>
                  </div>
                  <div className="flex justify-between px-5 py-3.5 text-sm">
                    <dt className="text-muted-foreground">Mother tongue</dt>
                    <dd className="font-semibold text-foreground">{profile.motherTongue || "Not specified"}</dd>
                  </div>
                  <div className="flex justify-between px-5 py-3.5 text-sm">
                    <dt className="text-muted-foreground">Profile managed by</dt>
                    <dd className="font-semibold text-foreground">{MANAGED_BY_LABELS[profile.managedBy]}</dd>
                  </div>
                </dl>
              </div>
            )}

            {activeTab === "education" && (
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Education & Career
                </h2>
                <dl className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
                  <div className="flex justify-between px-5 py-3.5 text-sm">
                    <dt className="text-muted-foreground">Highest education</dt>
                    <dd className="font-semibold text-foreground">{profile.education || "Not specified"}</dd>
                  </div>
                  <div className="flex justify-between px-5 py-3.5 text-sm">
                    <dt className="text-muted-foreground">Profession</dt>
                    <dd className="font-semibold text-foreground">{profile.profession || "Not specified"}</dd>
                  </div>
                  <div className="flex justify-between px-5 py-3.5 text-sm">
                    <dt className="text-muted-foreground">Work city</dt>
                    <dd className="font-semibold text-foreground">{profile.city}</dd>
                  </div>
                </dl>
              </div>
            )}

            {activeTab === "lifestyle" && (
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Lifestyle & Values
                </h2>
                <dl className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
                  <div className="flex justify-between px-5 py-3.5 text-sm">
                    <dt className="text-muted-foreground">Dietary preference</dt>
                    <dd className="font-semibold text-foreground">Vegetarian</dd>
                  </div>
                  <div className="flex justify-between px-5 py-3.5 text-sm">
                    <dt className="text-muted-foreground">Values & Beliefs</dt>
                    <dd className="font-semibold text-foreground">Modern outlook with traditional values</dd>
                  </div>
                  <div className="flex justify-between px-5 py-3.5 text-sm">
                    <dt className="text-muted-foreground">Interests & Hobbies</dt>
                    <dd className="font-semibold text-foreground">Travel, Music, Classical Arts, Reading</dd>
                  </div>
                </dl>
              </div>
            )}

            {activeTab === "partner" && (
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Partner Preferences
                </h2>
                <div className="mt-3 rounded-2xl border border-border bg-card p-5">
                  <p className="text-sm text-foreground">
                    Looking for a partner aged:{" "}
                    <span className="font-semibold text-primary">
                      {lookingFor ?? "Open to all age ranges"}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* General Details Summary */}
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground mb-3">
                Key Details
              </h2>
              <dl className="divide-y divide-border rounded-2xl border border-border bg-card">
                {details
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between gap-4 px-5 py-3.5 text-sm"
                    >
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="text-right font-semibold text-foreground">
                        {value}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
          </div>

          {!isOwn && (
            <div className="pt-6 border-t border-border">
              <SafetyActions userId={profile.userId} name={firstName} />
            </div>
          )}

          {isOwn && (
            <div className="pt-6">
              <ButtonLink href="/me" variant="secondary">
                Back to my profile
              </ButtonLink>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
