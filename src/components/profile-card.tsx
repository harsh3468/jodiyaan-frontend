"use client";

import Link from "next/link";
import { GraduationCap, Heart, Ruler } from "lucide-react";
import { formatHeight, formatLastActive } from "@/lib/format";
import type { ProfileCard as ProfileCardData } from "@/lib/types";
import { useIsMounted } from "@/lib/use-mounted";
import { Avatar, VerifiedBadge } from "./ui";

export function ProfileCard({ profile }: { profile: ProfileCardData }) {
  const isMounted = useIsMounted();
  const active = isMounted ? formatLastActive(profile.lastActiveAt) : null;

  const firstName = profile.fullName.split(" ")[0];
  const lastInitial = profile.fullName.split(" ")[1]?.charAt(0);
  const displayName = lastInitial ? `${firstName} ${lastInitial}.` : firstName;

  return (
    <article className="group bg-card rounded-2xl border border-border/80 overflow-hidden p-3.5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between">
      {/* Photo with top-right floating heart */}
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-accent/40">
        <Link
          href={`/profiles/${profile.userId}`}
          className="block size-full focus:outline-none"
        >
          <Avatar
            name={profile.fullName}
            photoUrl={profile.photoUrl}
            className="size-full text-6xl group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {active && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-card/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 border border-border/50 shadow-xs pointer-events-none">
            ● {active}
          </span>
        )}

        <button
          type="button"
          aria-label="Save profile"
          className="absolute top-2.5 right-2.5 size-8 rounded-full bg-card/95 backdrop-blur-md shadow-sm flex items-center justify-center text-primary/80 hover:text-primary hover:scale-110 active:scale-95 transition-all border border-border/60"
        >
          <Heart className="size-4" />
        </button>
      </div>

      {/* Details matching UI kit layout */}
      <div className="pt-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Name & Age with Gold Verified Checkmark */}
          <div className="flex items-center gap-1.5">
            <h2 className="font-heading text-base font-bold text-foreground">
              {displayName} {profile.age}
            </h2>
            <VerifiedBadge />
          </div>

          {/* Profession & City on separate lines as in UI kit */}
          <p className="text-xs text-muted-foreground font-medium mt-1">
            {profile.profession || "Professional"}
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            {profile.city}
          </p>

          {/* Education & Height with iconography */}
          <div className="flex items-center gap-4 text-xs text-foreground/80 font-medium mt-2.5 pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5 truncate">
              <GraduationCap className="size-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{profile.education || "Graduate"}</span>
            </div>
            {profile.heightCm && (
              <div className="flex items-center gap-1 shrink-0">
                <Ruler className="size-3.5 text-muted-foreground shrink-0" />
                <span>{formatHeight(profile.heightCm)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Outline Button: Express Interest */}
        <Link
          href={`/profiles/${profile.userId}`}
          className="mt-3.5 min-h-10 w-full rounded-xl border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-sm flex items-center justify-center transition-all shadow-2xs"
        >
          Express Interest
        </Link>
      </div>
    </article>
  );
}
