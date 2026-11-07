import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import {
  BadgeCheck,
  ChevronDown,
  HeartHandshake,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { initials } from "@/lib/format";

const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

export function Wordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    sm: "h-9",
    md: "h-12 sm:h-13",
    lg: "h-14 sm:h-16",
    xl: "h-18 sm:h-20",
  };

  return (
    <div className={cx("inline-flex items-center select-none", className)}>
      <Image
        src="/logo.png"
        alt="Jodiyaan"
        width={240}
        height={88}
        priority
        className={cx("w-auto object-contain", sizes[size])}
      />
    </div>
  );
}

export function AppIcon({
  className,
  size = 48,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src="/app-icon.jpg"
      alt="Jodiyaan"
      width={size}
      height={size}
      className={cx("rounded-xl object-cover shadow-sm", className)}
    />
  );
}

export function VerifiedBadge({
  className,
  title = "Verified profile",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      aria-label={title}
      className={cx("inline-flex items-center text-tertiary", className)}
    >
      <BadgeCheck className="size-4 shrink-0 fill-tertiary/20" />
    </span>
  );
}

export function PillarIcon({
  name,
  className = "size-8 text-tertiary",
}: {
  name: string;
  className?: string;
}) {
  switch (name) {
    case "shield-check":
      return <ShieldCheck className={className} />;
    case "heart-handshake":
      return <HeartHandshake className={className} />;
    case "sparkles":
      return <Sparkles className={className} />;
    case "lock":
      return <Lock className={className} />;
    default:
      return <ShieldCheck className={className} />;
  }
}

const BUTTON_VARIANTS = {
  primary: "bg-primary text-primary-foreground hover:opacity-95 shadow-sm",
  secondary: "border border-border bg-card text-foreground hover:bg-secondary/40",
  outline: "border border-primary text-primary hover:bg-primary/5",
  tertiary: "bg-tertiary text-tertiary-foreground hover:opacity-95 shadow-sm",
  ghost: "text-muted-foreground hover:text-foreground",
  danger: "border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20",
};

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
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
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50",
        BUTTON_VARIANTS[variant],
        className,
      )}
    >
      {busy && <Loader2 className="size-4 animate-spin text-current" />}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return (
    <Link
      {...props}
      className={cx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all",
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
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20";

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={cx(inputClass, props.className)} />;
}

export function Select({
  className,
  children,
  ...props
}: ComponentProps<"select">) {
  return (
    <div className="relative w-full">
      <select
        {...props}
        className={cx(
          "w-full appearance-none rounded-xl border border-border bg-card px-3.5 pr-10 py-2.5 text-sm font-medium text-foreground outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-2xs",
          className,
        )}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
    </div>
  );
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
    error: "border-destructive/30 bg-destructive/10 text-destructive",
    success: "border-emerald-300 bg-emerald-50 text-emerald-900",
    info: "border-border bg-accent/40 text-foreground",
  };
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cx("rounded-lg border px-4 py-3 text-sm", tones[tone])}
    >
      {children}
    </p>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      aria-hidden
      className={cx("inline-block size-5 animate-spin text-primary", className)}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-primary">
      <Spinner className="size-8" />
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
      // Photos are already resized to WebP by the API
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
        "flex items-center justify-center bg-accent font-heading font-semibold text-primary",
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
    <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <p className="font-heading text-xl font-bold text-foreground">{title}</p>
      {children && (
        <div className="mt-2 text-sm text-muted-foreground">{children}</div>
      )}
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
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
