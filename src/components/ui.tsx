import Link from "next/link";
import type { ComponentProps } from "react";
import { initials } from "@/lib/format";

const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        "font-serif text-2xl font-semibold tracking-tight text-maroon",
        className,
      )}
    >
      Jodiyaan
    </span>
  );
}

const BUTTON_VARIANTS = {
  primary: "bg-maroon text-white hover:bg-maroon-dark",
  secondary: "border border-line bg-card text-ink hover:border-muted",
  ghost: "text-muted hover:text-ink",
  danger: "border border-red-200 bg-card text-red-700 hover:bg-red-50",
};

type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof BUTTON_VARIANTS;
  busy?: boolean;
};

export function Button({
  variant = "primary",
  busy,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || busy}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        BUTTON_VARIANTS[variant],
        className,
      )}
    >
      {busy && <Spinner className="size-4" />}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: keyof typeof BUTTON_VARIANTS }) {
  return (
    <Link
      {...props}
      className={cx(
        "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
        BUTTON_VARIANTS[variant],
        className,
      )}
    />
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none transition placeholder:text-muted/70 focus:border-maroon focus:ring-2 focus:ring-maroon/15";

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={cx(inputClass, props.className)} />;
}

export function Select(props: ComponentProps<"select">) {
  return <select {...props} className={cx(inputClass, props.className)} />;
}

export function Textarea(props: ComponentProps<"textarea">) {
  return <textarea {...props} className={cx(inputClass, props.className)} />;
}

export function Notice({
  tone = "error",
  children,
}: {
  tone?: "error" | "success" | "info";
  children: React.ReactNode;
}) {
  const tones = {
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    info: "border-line bg-blush text-ink",
  };
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cx("rounded-xl border px-4 py-3 text-sm", tones[tone])}
    >
      {children}
    </p>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cx(
        "inline-block size-5 animate-spin rounded-full border-2 border-current border-r-transparent",
        className,
      )}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-maroon">
      <Spinner className="size-7" />
    </div>
  );
}

export function Avatar({
  name,
  photoUrl,
  className,
}: {
  name: string;
  photoUrl: string | null;
  className?: string;
}) {
  if (photoUrl) {
    return (
      // Photos are already resized to WebP by the API, so next/image adds nothing.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        className={cx("object-cover", className)}
      />
    );
  }
  return (
    <div
      aria-label={name}
      className={cx(
        "flex items-center justify-center bg-blush font-serif text-maroon",
        className,
      )}
    >
      {initials(name)}
    </div>
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-6 py-12 text-center">
      <p className="font-serif text-xl text-ink">{title}</p>
      {children && <div className="mt-2 text-sm text-muted">{children}</div>}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
