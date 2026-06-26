import Image from "next/image";

/**
 * Brand mark, the real Vintage Fabric logo: a circular wine medallion with a
 * gold mandala border, gold "V" monogram, "VINTAGE FABRIC" wordmark and the
 * "Mfg. of Quality Fabrics" tagline.
 *
 * The image lives at /public/logo.png. It's a self-contained medallion, so it
 * needs no extra background or ring around it.
 */
export function LogoMark({
  size = 96,
  className,
}: {
  size?: number;
  withWordmark?: boolean;
  /** When set, overrides the fixed size with responsive Tailwind classes. */
  className?: string;
}) {
  return (
    <Image
      src="/logo.png"
      alt="Vintage Fabric, Mfg. of Quality Fabrics"
      width={size}
      height={size}
      priority={size >= 200}
      className={className ?? "h-auto w-auto"}
      style={className ? undefined : { width: size, height: size }}
    />
  );
}

/**
 * Compact horizontal lockup for the header/footer: the circular mark plus a
 * legible text wordmark (the medallion's own inner text is too small to read
 * at header size).
 */
export function LogoLockup({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <Image
        src="/logo.png"
        alt="Vintage Fabric logo"
        width={48}
        height={48}
        priority
        className="h-12 w-12 shrink-0"
      />
      <span className="leading-none">
        <span
          className={`block font-display text-lg font-semibold tracking-wide ${
            light ? "text-ivory" : "text-wine"
          }`}
        >
          VINTAGE FABRIC
        </span>
        <span
          className={`block text-[10px] uppercase tracking-[0.25em] ${
            light ? "text-ivory/80" : "text-gold-dark"
          }`}
        >
          Mfg. of Quality Fabrics
        </span>
      </span>
    </span>
  );
}
