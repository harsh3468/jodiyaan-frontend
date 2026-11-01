import { RedirectIfSignedIn } from "@/components/redirect-if-signed-in";
import { ButtonLink, Wordmark } from "@/components/ui";

const PROMISES = [
  {
    title: "Real people",
    body: "Every member signs in with a verified email. Report or block anyone in one tap.",
  },
  {
    title: "Mutual interest first",
    body: "Chat opens only when both of you say yes. No unwanted messages.",
  },
  {
    title: "Calm by design",
    body: "A short daily list instead of endless scrolling, boosts, or ads.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <RedirectIfSignedIn />
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <Wordmark />
        <ButtonLink href="/login" variant="secondary">
          Sign in
        </ButtonLink>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-maroon">
          Sachi jodiyaan, sache log
        </p>
        <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.1] text-ink sm:text-6xl">
          A quieter way to find your life partner.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Create a simple profile, see a few thoughtful matches, and talk only
          when the interest is mutual.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/login" className="px-7 py-3 text-base">
            Create your profile — free
          </ButtonLink>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          {PROMISES.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-line bg-card p-6"
            >
              <h2 className="font-serif text-xl text-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-line py-6 text-center text-xs text-muted">
        Jodiyaan · Made with care in India
      </footer>
    </div>
  );
}
