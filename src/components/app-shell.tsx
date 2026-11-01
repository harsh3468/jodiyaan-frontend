"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "./ui";

const NAV = [
  { href: "/discover", label: "Discover", icon: "◎" },
  { href: "/interests", label: "Interests", icon: "♡" },
  { href: "/matches", label: "Matches", icon: "✉" },
  { href: "/me", label: "Me", icon: "☺" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/discover" aria-label="Jodiyaan home">
            <Wordmark />
          </Link>
          <nav className="hidden gap-1 sm:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  isActive(item.href)
                    ? "bg-blush font-medium text-maroon"
                    : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-4 border-t border-line bg-paper sm:hidden">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 py-2.5 text-xs ${
              isActive(item.href) ? "text-maroon" : "text-muted"
            }`}
          >
            <span aria-hidden className="text-lg leading-none">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
