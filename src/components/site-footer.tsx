import Link from "next/link";
import { FOOTER_COLUMNS, FOOTER_NOTE } from "@/lib/constants";
import { Wordmark } from "./ui";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card px-6 py-12 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Wordmark size="sm" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {FOOTER_NOTE}
          </p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary">
              {column.title}
            </p>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/80 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
