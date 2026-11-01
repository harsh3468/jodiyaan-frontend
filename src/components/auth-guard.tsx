"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./auth-provider";
import { PageLoader } from "./ui";

export function AuthGuard({
  children,
  requireProfile = true,
}: {
  children: React.ReactNode;
  requireProfile?: boolean;
}) {
  const { status, user } = useAuth();
  const router = useRouter();
  const needsProfile = requireProfile && user && !user.hasProfile;

  useEffect(() => {
    if (status === "anonymous") router.replace("/login");
    else if (needsProfile) router.replace("/onboarding");
  }, [status, needsProfile, router]);

  if (status !== "authenticated" || needsProfile) {
    return <PageLoader />;
  }
  return <>{children}</>;
}
