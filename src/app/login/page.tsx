import type { Metadata } from "next";
import Link from "next/link";
import { RedirectIfSignedIn } from "@/components/redirect-if-signed-in";
import { Wordmark } from "@/components/ui";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <RedirectIfSignedIn />
      <Link href="/" aria-label="Jodiyaan home">
        <Wordmark className="text-3xl" />
      </Link>
      <div className="mt-8 w-full max-w-sm rounded-3xl border border-line bg-card p-8">
        <LoginForm />
      </div>
      <p className="mt-6 max-w-sm text-center text-xs text-muted">
        By continuing you confirm you are looking for marriage and agree to be
        respectful to every member.
      </p>
    </div>
  );
}
