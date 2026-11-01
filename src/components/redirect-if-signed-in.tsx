"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./auth-provider";

export function RedirectIfSignedIn() {
  const { status, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && user) {
      router.replace(user.hasProfile ? "/discover" : "/onboarding");
    }
  }, [status, user, router]);

  return null;
}
