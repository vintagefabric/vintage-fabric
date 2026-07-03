import Image from "next/image";
import Link from "next/link";
import type { Design } from "@/lib/types";

/**
 * Auto-flowing ribbon of design tiles. Pure CSS animation (see globals.css):
 * the track renders two copies of the list and slides to -50% on a loop, so it
 * scrolls seamlessly. Pauses on hover; stops entirely for reduced-motion users.
 */
export function DesignMarquee({ designs }: { designs: Design[] }) {
  if (designs.length === 0) return null;
  // Cap the ribbon so the page stays light however large the catalogue grows.
  const shown = designs.slice(0, 16);
  // Two copies for a seamless loop.
  const items = [...shown, ...shown];
  // Scale duration with tile count so the glide speed stays constant
  // (~45px/s) no matter how many designs are in the ribbon.
  const duration = `${Math.max(45, shown.length * 5.5)}s`;

  return (
    <div className="marquee group relative overflow-hidden">
      <div
        className="marquee-track gap-5 py-1"
        style={{ "--marquee-duration": duration } as React.CSSProperties}
      >
        {items.map((d, i) => (
          <Link
            key={`${d.id}-${i}`}
            href={`/design/${d.slug}`}
            aria-hidden={i >= shown.length}
            tabIndex={i >= shown.length ? -1 : 0}
            className="group/card relative block w-[200px] shrink-0 overflow-hidden rounded-xl
                       border border-gold/40 bg-wine shadow-card transition-colors hover:border-gold/70 sm:w-[230px]"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-wine-dark">
              <Image
                src={d.images.front.url}
                alt={d.images.front.alt}
                fill
                sizes="230px"
                className="object-cover transition-transform duration-500 group-hover/card:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wine/90 via-wine/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-3">
                <p className="font-display text-base leading-snug text-ivory">{d.title}</p>
                <p className="text-[10px] uppercase tracking-wide text-gold">{d.designNo}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Soft fade at both edges so tiles glide in and out gracefully. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cream to-transparent sm:w-28" />
    </div>
  );
}
