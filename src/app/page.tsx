import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Search, Sparkles } from "lucide-react";
import { RedirectIfSignedIn } from "@/components/redirect-if-signed-in";
import { ButtonLink, PillarIcon, Wordmark } from "@/components/ui";
import {
  APPROACH_CONTENT,
  HERO_CONTENT,
  LANDING_NAV_ITEMS,
  QUICK_SEARCH_AGE_OPTIONS,
  RELIGIONS_LIST,
  TOP_INDIAN_CITIES,
  TRUST_PILLARS,
} from "@/lib/constants";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative selection:bg-primary/20">
      <RedirectIfSignedIn />

      {/* Header */}
      <header className="px-6 lg:px-12 py-4 bg-card border-b border-border flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-card/95">
        <Link href="/" aria-label="Jodiyaan">
          <Wordmark size="md" />
        </Link>

        <nav className="hidden lg:flex gap-8 text-sm font-semibold">
          {LANDING_NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
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
        <section className="px-6 lg:px-12 py-12 lg:py-18 bg-secondary/70 border-b border-border/50">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                {HERO_CONTENT.badge}
              </span>

              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-balance leading-tight text-foreground">
                {HERO_CONTENT.titlePrefix}
                <span className="text-primary">{HERO_CONTENT.titleHighlight}</span>
              </h1>

              <p className="mt-4 max-w-xl text-muted-foreground text-pretty text-base sm:text-lg leading-relaxed">
                {HERO_CONTENT.subtitle}
              </p>

              {/* Floating Quick Search Card */}
              <form
                action="/discover"
                className="mt-8 bg-card rounded-2xl shadow-xl border border-border p-5 sm:p-6"
              >
                <div className="mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    Looking for
                  </span>
                  <div className="grid grid-cols-2 gap-2 max-w-xs">
                    <label className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-border bg-background cursor-pointer text-sm font-semibold text-foreground hover:bg-secondary/40 has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary transition-all">
                      <input
                        type="radio"
                        name="lookingFor"
                        value="bride"
                        defaultChecked
                        className="sr-only"
                      />
                      <span>Bride</span>
                    </label>
                    <label className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-border bg-background cursor-pointer text-sm font-semibold text-foreground hover:bg-secondary/40 has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary transition-all">
                      <input
                        type="radio"
                        name="lookingFor"
                        value="groom"
                        className="sr-only"
                      />
                      <span>Groom</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Age
                    <select
                      name="ageRange"
                      className="mt-1 w-full bg-background border border-input rounded-lg p-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
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
                    Community
                    <select
                      name="religion"
                      className="mt-1 w-full bg-background border border-input rounded-lg p-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                      defaultValue="Hindu"
                    >
                      <option value="">Any religion</option>
                      {RELIGIONS_LIST.map((rel) => (
                        <option key={rel} value={rel}>
                          {rel}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Location
                    <select
                      name="city"
                      className="mt-1 w-full bg-background border border-input rounded-lg p-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
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
                </div>

                <div className="mt-4 pt-3 border-t border-border flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-11 px-8 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 shadow-sm transition-all"
                  >
                    <Search className="size-4" />
                    <span>{HERO_CONTENT.searchButtonText}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Hero Image Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-card">
                <Image
                  src={HERO_CONTENT.heroImage}
                  alt="Traditional Indian wedding couple in festive bridal attire"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top"
                />

                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Trust Badge */}
                <div className="absolute bottom-5 inset-x-5 bg-card/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-border flex items-center gap-3.5">
                  <div className="size-11 rounded-xl bg-tertiary/15 text-tertiary flex items-center justify-center shrink-0 border border-tertiary/30">
                    <Sparkles className="size-5 fill-tertiary/20" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm text-foreground">
                      {HERO_CONTENT.verifiedBadgeText}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Rooted in Indian traditions & sacred trust
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Trust Pillars */}
        <section className="px-6 lg:px-12 py-16 lg:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TRUST_PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="size-12 rounded-xl bg-tertiary/10 flex items-center justify-center mb-4">
                      <PillarIcon name={pillar.icon} className="size-6 text-tertiary" />
                    </div>
                    <h2 className="text-lg font-bold font-heading text-foreground capitalize">
                      {pillar.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {pillar.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* "Our Approach" Section: Tradition, with a Modern Touch */}
        <section className="px-6 lg:px-12 py-16 lg:py-24 bg-secondary/60 border-t border-border/50">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Heritage Pavilion Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-card">
                <Image
                  src={APPROACH_CONTENT.imageSrc}
                  alt={APPROACH_CONTENT.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Right Approach Story */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                {APPROACH_CONTENT.badge}
              </span>

              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
                {APPROACH_CONTENT.title}
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {APPROACH_CONTENT.description}
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-tertiary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground font-medium">
                    Hand-verified profiles with government ID and phone authenticity
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-tertiary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground font-medium">
                    Respectful matchmaking respecting community, family, and horoscope choices
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-tertiary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground font-medium">
                    Uncompromising privacy with photo blur & contact visibility controls
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <ButtonLink
                  href={APPROACH_CONTENT.ctaHref}
                  variant="primary"
                  className="inline-flex items-center gap-2 px-8"
                >
                  <span>{APPROACH_CONTENT.ctaText}</span>
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 lg:px-12 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Wordmark size="sm" />
          <p className="text-xs text-muted-foreground text-center">
            Jodiyaan · Modern Indian Matrimonial · Sacred unions, sincere hearts.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="/#about" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/#about" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/#about" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
