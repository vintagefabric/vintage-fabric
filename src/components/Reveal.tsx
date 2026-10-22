import type { CSSProperties, ElementType, ReactNode } from "react";

/**
 * Rises its children into place: straight away (pure CSS) when on screen at
 * load, or as they scroll into view when below the fold. The scroll half is
 * handled site-wide by <MotionObserver />, so this stays a server component
 * and adds no client JavaScript per element. See "Motion system" in
 * globals.css.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  soft = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Stagger in milliseconds. */
  delay?: number;
  /** Smaller travel, for reading content where big motion distracts. */
  soft?: boolean;
  as?: ElementType;
}) {
  return (
    <Tag
      data-reveal={soft ? "soft" : ""}
      className={className}
      style={delay ? revealDelay(delay) : undefined}
    >
      {children}
    </Tag>
  );
}

/** Same delay for the on-load entrance and the on-scroll reveal. */
export function revealDelay(ms: number): CSSProperties {
  return { "--reveal-delay": `${ms}ms` } as CSSProperties;
}

/**
 * Stagger for item `i` of a grid. On scroll, items in a row enter left to
 * right (column-based, so every row gets the same gentle wave). On load, the
 * first items cascade in order, capped so a long grid doesn't wait.
 */
export function gridStagger(i: number, cols = 4, step = 80): CSSProperties {
  return {
    "--reveal-delay": `${(i % cols) * step}ms`,
    "--enter-delay": `${Math.min(i, 7) * 70}ms`,
  } as CSSProperties;
}
