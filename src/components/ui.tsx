import Link from "next/link";
import type { ReactNode } from "react";

/** Standard page section wrapper with consistent vertical rhythm. */
export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`py-14 sm:py-20 ${className}`}>{children}</section>;
}

/**
 * Eyebrow + heading + optional intro, used to open most sections.
 * Pass `as="h1"` when this is the page's main heading (each page should have
 * exactly one h1 for SEO and screen readers).
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = false,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Heading className="mt-2 text-3xl sm:text-4xl">{title}</Heading>
      <div className={`rule-gold mt-4 ${center ? "mx-auto" : ""}`} />
      {intro && <p className="mt-5 text-ink-soft">{intro}</p>}
    </div>
  );
}

/** A simple text link with a gold arrow. */
export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-sm font-medium text-wine hover:text-gold-dark"
    >
      {children}
      <span className="transition-transform group-hover:translate-x-1">→</span>
    </Link>
  );
}

/** Pill / chip label. */
export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-xs font-medium text-wine">
      {children}
    </span>
  );
}
