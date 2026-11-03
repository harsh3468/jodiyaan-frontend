import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JourneyStartCard } from "@/components/journey-start-card";
import { RedirectIfSignedIn } from "@/components/redirect-if-signed-in";
import { ButtonLink, Wordmark } from "@/components/ui";
import {
  APPROACH_CONTENT,
  HERO_CONTENT,
  LANDING_NAV_ITEMS,
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
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card px-6 lg:px-16 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Wordmark size="sm" />
          <p className="text-xs text-muted-foreground text-center">
            Jodiyaan · Modern Indian Matrimonial · Sachi jodiyaan, sache log.
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
