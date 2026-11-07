"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuth } from "@/components/auth-provider";
import { ProfileForm } from "@/components/profile-form";
import { api } from "@/lib/api";

export function OnboardingForm() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const justCreated = useRef(false);

  useEffect(() => {
    if (user?.hasProfile && !justCreated.current) {
      router.replace("/discover");
    }
  }, [user, router]);

  return (
    <ProfileForm
      submitLabel="Create profile"
      onSubmit={async (input) => {
        await api.createProfile(input);
        justCreated.current = true;
        await refresh();
        router.replace("/me");
      }}
    />
  );
}
