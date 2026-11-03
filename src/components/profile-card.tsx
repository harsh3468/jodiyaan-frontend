import Link from "next/link";
import { Heart } from "lucide-react";
import { compact, formatHeight, formatLastActive } from "@/lib/format";
import type { ProfileCard as ProfileCardData } from "@/lib/types";
import { Avatar, VerifiedBadge } from "./ui";

export function ProfileCard({ profile }: { profile: ProfileCardData }) {
  const active = formatLastActive(profile.lastActiveAt);
  const firstName = profile.fullName.split(" ")[0];

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between">
      <div className="relative aspect-[4/5] bg-accent/60 overflow-hidden">
        <Link
          href={`/profiles/${profile.userId}`}
          className="block size-full relative focus:outline-none"
        >
          <Avatar
            name={profile.fullName}
            photoUrl={profile.photoUrl}
            className="size-full text-6xl group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {active && (
          <span className="absolute left-3 top-3 rounded-full bg-card/90 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-border/50 shadow-sm pointer-events-none">
            ● {active}
          </span>
        )}

        <button
          type="button"
          aria-label="Save profile"
          className="absolute top-3 right-3 size-9 rounded-full bg-card/90 backdrop-blur-md shadow-md flex items-center justify-center text-primary/80 hover:text-primary hover:scale-110 active:scale-95 transition-all border border-border/50"
        >
          <Heart className="size-4.5" />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-1.5 truncate">
              <span>{firstName}, {profile.age}</span>
              <VerifiedBadge />
            </h2>
          </div>

          <p className="text-xs mt-1.5 text-muted-foreground font-medium truncate">
            {compact(profile.profession, profile.city)}
          </p>

          <p className="text-xs mt-1 text-foreground/80 font-medium truncate">
            {compact(profile.education, formatHeight(profile.heightCm))}
          </p>
        </div>

        <Link
          href={`/profiles/${profile.userId}`}
          className="mt-4 min-h-10 w-full rounded-lg bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-1.5 hover:opacity-95 shadow-sm transition-all"
        >
          Express Interest
        </Link>
      </div>
    </article>
  );
}
