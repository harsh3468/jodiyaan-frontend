import Link from "next/link";
import { Heart } from "lucide-react";
import { compact, formatHeight, formatLastActive } from "@/lib/format";
import type { ProfileCard as ProfileCardData } from "@/lib/types";
import { Avatar, VerifiedBadge } from "./ui";

export function ProfileCard({ profile }: { profile: ProfileCardData }) {
  const active = formatLastActive(profile.lastActiveAt);
  const firstName = profile.fullName.split(" ")[0];

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <Link href={`/profiles/${profile.userId}`} className="block relative">
        <div className="relative aspect-[4/5] bg-accent/60 flex items-center justify-center overflow-hidden">
          <Avatar
            name={profile.fullName}
            photoUrl={profile.photoUrl}
            className="size-full text-6xl"
          />
          {active && (
            <span className="absolute left-3 top-3 rounded-full bg-card/90 backdrop-blur px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-border/50">
              ● {active}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-1.5 truncate">
              <span>{firstName}, {profile.age}</span>
              <VerifiedBadge />
            </h2>
            <button
              type="button"
              aria-label="Save profile"
              className="text-primary/70 hover:text-primary transition-colors shrink-0 p-1"
            >
              <Heart className="size-5" />
            </button>
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
          className="mt-4 min-h-10 w-full rounded-lg border border-primary text-primary font-semibold text-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
        >
          View profile
        </Link>
      </div>
    </article>
  );
}
