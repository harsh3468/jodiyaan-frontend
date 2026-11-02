import Image from "next/image";
import Link from "next/link";
import {
  HeartHandshake,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { RedirectIfSignedIn } from "@/components/redirect-if-signed-in";
import { ButtonLink, Wordmark } from "@/components/ui";
import {
  LANDING_NAV_ITEMS,
  QUICK_SEARCH_AGE_OPTIONS,
  SUBTAGLINE,
  TAGLINE,
  TOP_INDIAN_CITIES,
  TRUST_PILLARS,
} from "@/lib/constants";

const PILLAR_ICONS = {
  "shield-check": ShieldCheck,
  "heart-handshake": HeartHandshake,
  sparkles: Sparkles,
  lock: Lock,
};

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative">
      <RedirectIfSignedIn />

      {/* Header */}
      <header className="px-6 lg:px-12 py-4 bg-card border-b border-border flex items-center justify-between">
        <Link href="/" aria-label="Jodiyaan">
          <Wordmark />
        </Link>

        <nav className="hidden lg:flex gap-7 text-sm font-semibold">
          {LANDING_NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-2">
          <ButtonLink href="/login" variant="outline">
            Log in
          </ButtonLink>
          <ButtonLink href="/login" variant="primary">
            Sign up
          </ButtonLink>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-6 lg:px-12 py-12 lg:py-16 bg-secondary">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-secondary-foreground font-bold">
                Indian Matrimonial
              </p>
              <h1 className="mt-4 text-5xl lg:text-6xl font-heading font-bold text-balance leading-tight">
                Find your <span className="text-primary">{TAGLINE.replace("Find your ", "")}</span>
              </h1>
              <p className="mt-5 max-w-lg text-muted-foreground text-pretty text-base leading-relaxed">
                {SUBTAGLINE}
              </p>

              {/* Quick Search Widget */}
              <form
                action="/discover"
                className="mt-8 bg-card rounded-xl shadow-md border border-border p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end"
              >
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Looking for
                  <select
                    name="lookingFor"
                    className="mt-1 w-full bg-background border border-input rounded-lg p-2.5 text-sm text-foreground outline-none focus:border-primary"
                    defaultValue="bride"
                  >
                    <option value="bride">Bride</option>
                    <option value="groom">Groom</option>
                  </select>
                </label>

                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Age
                  <select
                    name="ageRange"
                    className="mt-1 w-full bg-background border border-input rounded-lg p-2.5 text-sm text-foreground outline-none focus:border-primary"
                    defaultValue="24-30"
                  >
                    {QUICK_SEARCH_AGE_OPTIONS.map((opt) => (
                      <option key={opt.label} value={`${opt.min}-${opt.max}`}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Location
                  <select
                    name="city"
                    className="mt-1 w-full bg-background border border-input rounded-lg p-2.5 text-sm text-foreground outline-none focus:border-primary"
                    defaultValue="Bengaluru"
                  >
                    <option value="">All India</option>
                    {TOP_INDIAN_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </label>

                <ButtonLink
                  href="/login"
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Search className="size-4" />
                  Find matches
                </ButtonLink>
              </form>
            </div>

            {/* Feature Card / Hero Highlight */}
            <div className="rounded-2xl bg-gradient-to-br from-[#72242E] to-[#401118] p-8 h-96 flex flex-col justify-between overflow-hidden relative shadow-theme text-primary-foreground border border-border/20">
              <div className="flex items-center gap-4">
                <Image
                  src="/app-icon.jpg"
                  alt="Jodiyaan Emblem"
                  width={64}
                  height={64}
                  priority
                  className="size-16 rounded-xl shadow-md border border-white/20 object-cover shrink-0"
                />
                <div>
                  <p className="font-heading font-bold text-lg text-primary-foreground">
                    Jodiyaan Matchmaking
                  </p>
                  <p className="text-xs text-primary-foreground/80">
                    Rooted in Indian traditions & values
                  </p>
                </div>
              </div>

              <div className="bg-card/95 backdrop-blur rounded-xl p-6 shadow-md w-full border border-border text-foreground">
                <p className="font-heading text-xl font-bold text-foreground">
                  A beginning worth celebrating
                </p>
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Thoughtful profiles. Verified backgrounds. Safer conversations. Families welcome.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Pillars */}
        <section className="px-6 lg:px-12 py-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRUST_PILLARS.map((pillar) => {
              const Icon =
                PILLAR_ICONS[pillar.icon as keyof typeof PILLAR_ICONS] ??
                ShieldCheck;
              return (
                <div
                  key={pillar.title}
                  className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/40 transition-colors"
                >
                  <Icon className="size-8 text-tertiary" />
                  <h2 className="mt-3 text-lg font-bold text-foreground">
                    {pillar.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {pillar.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-6 text-center text-xs text-muted-foreground">
        Jodiyaan · Modern Indian Matrimonial · Sachi jodiyaan, sache log
      </footer>
    </div>
  );
}
