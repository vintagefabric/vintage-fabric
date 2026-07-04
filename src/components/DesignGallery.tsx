"use client";

import Image from "next/image";
import { useState } from "react";
import type { DesignImages, ImageView } from "@/lib/types";

/**
 * Interactive gallery for a design page, shows the active view large with
 * thumbnails for every available view (front/back/neck/dupatta) and each
 * colourway. All images carry descriptive alt text for SEO + a11y.
 */
export function DesignGallery({ images }: { images: DesignImages }) {
  // Build an ordered, labelled list of every available image.
  const views: { label: string; img: ImageView }[] = [];
  if (images.front) views.push({ label: "Front", img: images.front });
  if (images.back) views.push({ label: "Back", img: images.back });
  if (images.neck) views.push({ label: "Neck", img: images.neck });
  if (images.dupatta) views.push({ label: "Dupatta", img: images.dupatta });
  (images.colourways ?? []).forEach((img, i) =>
    views.push({ label: `Colourway ${i + 1}`, img }),
  );

  const [active, setActive] = useState(0);
  const current = views[active] ?? views[0];

  return (
    <div>
      {/* 9:14 matches the catalogue photography, so the full plate shows. */}
      <div className="relative aspect-[9/14] overflow-hidden rounded-xl border border-line bg-white shadow-card">
        <Image
          src={current.img.url}
          alt={current.img.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 500px"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-wine/90 px-3 py-1 text-xs font-medium text-ivory">
          {current.label}
        </span>
      </div>

      {views.length > 1 && (
        <ul className="mt-4 grid grid-cols-5 gap-3" role="tablist" aria-label="Design views">
          {views.map((v, i) => (
            <li key={`${v.label}-${i}`}>
              <button
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={v.label}
                onClick={() => setActive(i)}
                className={`relative block aspect-square w-full overflow-hidden rounded-lg border-2 transition-colors ${
                  i === active ? "border-gold" : "border-transparent hover:border-gold/50"
                }`}
              >
                <Image
                  src={v.img.url}
                  alt={v.img.alt}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
