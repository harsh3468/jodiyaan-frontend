import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JourneyStartCard } from "@/components/journey-start-card";
import { RedirectIfSignedIn } from "@/components/redirect-if-signed-in";
import { SiteFooter } from "@/components/site-footer";
import { ButtonLink, Wordmark } from "@/components/ui";
import {
  ABOUT_CONTENT,
  APPROACH_CONTENT,
  HERO_CONTENT,
  LANDING_NAV_ITEMS,
  MEMBERSHIP_BANNER,
  STORIES_SECTION,
  SUCCESS_STORIES,
} from "@/lib/constants";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#FDF8F3] text-foreground flex flex-col relative selection:bg-primary/20">
      <RedirectIfSignedIn />

      {/* Header */}
      <header className="px-6 lg:px-16 py-4.5 bg-[#FFFBF6]/95 backdrop-blur-md border-b border-[#EAD6C6]/60 flex items-center justify-between sticky top-0 z-40">
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
          <ButtonLink
            href="/login"
            variant="outline"
            className="rounded-lg px-4.5 py-2 text-sm border-primary text-primary hover:bg-primary/5 font-semibold"
          >
            Log In
          </ButtonLink>
          <ButtonLink
            href="/login"
            variant="primary"
            className="rounded-lg px-5 py-2 text-sm bg-primary text-primary-foreground shadow-sm hover:opacity-95 font-semibold"
          >
            Sign Up
          </ButtonLink>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Full-Bleed Panoramic Hero Section */}
        <section className="relative w-full bg-[#FDF8F3] overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
          {/* Background Couple Photo with smooth gradient feathering on right side */}
          <div className="absolute inset-y-0 right-0 w-full lg:w-[48%] pointer-events-none select-none overflow-hidden hero-image-fade">
            <Image
              src="/images/hero-couple.jpg"
              alt="Indian wedding couple smiling together in traditional attire"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover object-[center_20%] lg:object-[55%_18%]"
            />
            {/* Soft gradient wash on left edge of the image to ensure seamless blend with #FDF8F3 */}
            <div className="hidden lg:block absolute inset-y-0 left-0 w-44 bg-gradient-to-r from-[#FDF8F3] via-[#FDF8F3]/70 to-transparent pointer-events-none z-10" />
            {/* Soft bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FDF8F3] via-[#FDF8F3]/70 to-transparent pointer-events-none z-10" />
            {/* Subtle mobile overlay for text contrast */}
            <div className="lg:hidden absolute inset-0 bg-[#FDF8F3]/80 pointer-events-none z-10" />
          </div>

          <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
            {/* Left Headline Area */}
            <div className="max-w-xl pt-4 pb-8 lg:pb-12">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-tertiary">
                {HERO_CONTENT.badge}
              </p>

              <h1 className="mt-3 text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-foreground leading-[1.08] tracking-tight">
                Find Your <br />
                <span className="text-primary">Life Partner</span>
              </h1>

              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
                {HERO_CONTENT.subtitle}
              </p>
            </div>

            {/* "Let's Begin Your Journey" Entry Flow Card */}
            <JourneyStartCard />
          </div>
        </section>

        {/* "Our Approach" Section: Tradition, with a Modern Touch */}
        <section className="px-6 lg:px-16 py-16 lg:py-24 bg-[#FFFBF6] border-t border-border/60 relative overflow-hidden">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Sandstone Pavilion Inside Arched Jharokha Window Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="relative aspect-[3/4] rounded-t-[140px] rounded-b-2xl overflow-hidden shadow-2xl border-4 border-card ring-1 ring-border/80">
                  <Image
                    src={APPROACH_CONTENT.imageSrc}
                    alt={APPROACH_CONTENT.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/25 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Right Column: Story Copy matching UI kit */}
            <div className="lg:col-span-7 space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-tertiary">
                {APPROACH_CONTENT.badge}
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary tracking-tight">
                {APPROACH_CONTENT.title}
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                {APPROACH_CONTENT.description}
              </p>

              <div className="pt-2">
                <ButtonLink
                  href={APPROACH_CONTENT.ctaHref}
                  variant="outline"
                  className="rounded-full px-7 py-3 border-border hover:border-primary text-foreground hover:text-primary font-semibold text-sm inline-flex items-center gap-2 transition-all bg-card shadow-xs"
                >
                  <span>{APPROACH_CONTENT.ctaText}</span>
                  <ArrowRight className="size-4" />
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        <section id="stories" className="scroll-mt-24 border-t border-border/60 bg-background px-6 py-16 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-tertiary">
              {STORIES_SECTION.badge}
            </p>
            <h2 className="mt-3 max-w-xl font-heading text-3xl font-bold text-foreground sm:text-4xl">
              {STORIES_SECTION.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              {STORIES_SECTION.subtitle}
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {SUCCESS_STORIES.map((story) => (
                <article
                  key={story.names}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <p className="text-sm leading-relaxed text-foreground/80">
                    “{story.quote}”
                  </p>
                  <p className="mt-5 font-heading text-sm font-bold text-primary">
                    {story.names}
                  </p>
                  <p className="text-xs text-muted-foreground">{story.place}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="membership" className="scroll-mt-24 bg-primary px-6 py-16 text-primary-foreground lg:px-16">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-tertiary">
                {MEMBERSHIP_BANNER.badge}
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold text-primary-foreground sm:text-4xl">
                {MEMBERSHIP_BANNER.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-primary-foreground/80">
                {MEMBERSHIP_BANNER.description}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {MEMBERSHIP_BANNER.points.map((point) => (
                  <li
                    key={point}
                    className="rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <ButtonLink
              href={MEMBERSHIP_BANNER.href}
              variant="tertiary"
              className="shrink-0 rounded-full px-7"
            >
              {MEMBERSHIP_BANNER.cta}
            </ButtonLink>
          </div>
        </section>

        <section id="about" className="scroll-mt-24 border-t border-border/60 bg-[#FFFBF6] px-6 py-16 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-tertiary">
              {ABOUT_CONTENT.badge}
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-primary sm:text-4xl">
              {ABOUT_CONTENT.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {ABOUT_CONTENT.description}
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
