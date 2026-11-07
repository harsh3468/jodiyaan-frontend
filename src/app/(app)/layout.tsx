import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { AuthGuard } from "@/components/auth-guard";
import { PageLoader } from "@/components/ui";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Suspense fallback={<PageLoader />}>
        <AppShell>{children}</AppShell>
      </Suspense>
    </AuthGuard>
  );
}
