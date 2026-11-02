"use client";

import { useRouter } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { Notice, PageHeader, PageLoader } from "@/components/ui";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";

export function EditProfileView() {
  const router = useRouter();
  const { data: profile, error, loading } = useApi("me", api.myProfile);

  if (loading) return <PageLoader />;
  if (!profile) return <Notice tone="error">{error ?? "Could not load your profile."}</Notice>;

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Edit Profile"
        subtitle="Keep your details accurate and complete for better matching."
      />
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <ProfileForm
          profile={profile}
          submitLabel="Save changes"
          onSubmit={async (input) => {
            await api.updateProfile(input);
            router.push("/me");
          }}
        />
      </div>
    </div>
  );
}
