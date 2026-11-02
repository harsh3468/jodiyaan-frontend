"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, MessageCircle, Search, UserRound } from "lucide-react";
import { APP_NAV_ITEMS } from "@/lib/constants";
import { Wordmark } from "./ui";

const ICONS = {
  search: Search,
  heart: Heart,
  "message-circle": MessageCircle,
  user: UserRound,
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/discover" aria-label="Jodiyaan home">
            <Wordmark />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold sm:flex">
            {APP_NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors ${
                    active
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6 lg:p-10">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-border bg-card py-2 sm:hidden">
        {APP_NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = ICONS[item.icon as keyof typeof ICONS] ?? Search;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 text-xs font-semibold ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
