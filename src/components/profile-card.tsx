import Link from "next/link";
import { compact, formatHeight, formatLastActive } from "@/lib/format";
import type { ProfileCard as ProfileCardData } from "@/lib/types";
import { Avatar } from "./ui";

export function ProfileCard({ profile }: { profile: ProfileCardData }) {
  const active = formatLastActive(profile.lastActiveAt);
  return (
    <Link
      href={`/profiles/${profile.userId}`}
      className="group overflow-hidden rounded-2xl border border-line bg-card transition hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgba(28,25,23,0.25)]"
    >
      <div className="relative aspect-[4/5] bg-blush">
        <Avatar
          name={profile.fullName}
          photoUrl={profile.photoUrl}
          className="size-full text-5xl"
        />
        {active && (
          <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium text-leaf">
            ● {active}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="font-serif text-lg text-ink">
          {profile.fullName.split(" ")[0]}, {profile.age}
        </p>
        <p className="mt-0.5 text-sm text-muted">
          {compact(profile.city, formatHeight(profile.heightCm))}
        </p>
        <p className="mt-1 truncate text-sm text-muted">
          {compact(profile.profession, profile.religion)}
        </p>
      </div>
    </Link>
  );
}
