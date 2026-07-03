import Image from "next/image";
import Link from "next/link";
import { getCollectionById, getQualityById } from "@/lib/data";
import type { Design } from "@/lib/types";

/** Card linking to a design's detail page. Wine tile with a light body. */
export async function DesignCard({ design }: { design: Design }) {
  const quality = await getQualityById(design.qualityId);
  const collection = await getCollectionById(design.collectionId);

  return (
    <Link
      href={`/design/${design.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gold/40 bg-wine text-ivory shadow-card
                 transition-all duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-card-hover"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-wine-dark">
        <Image
          src={design.images.front.url}
          alt={design.images.front.alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {design.images.colourways && design.images.colourways.length > 0 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-gold px-2.5 py-1 text-[10px] font-medium text-wine-dark">
            {design.images.colourways.length} colourways
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {collection && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
            {collection.title}
          </span>
        )}
        <h3 className="font-display text-lg leading-snug text-ivory group-hover:text-gold">
          {design.title}
        </h3>
        <p className="font-display text-sm italic text-ivory/75">{design.designNo}</p>
        {quality && (
          <div className="mt-auto pt-2">
            <span className="inline-flex items-center rounded-full border border-gold/40 bg-wine-dark px-3 py-1 font-display text-sm font-semibold text-gold">
              {quality.fabricType} · {quality.width}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

/** Responsive grid of design cards. */
export function DesignGrid({ designs }: { designs: Design[] }) {
  if (designs.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-ink/20 p-8 text-center text-ink-soft">
        No designs to show yet. Please check back soon.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {designs.map((d) => (
        <DesignCard key={d.id} design={d} />
      ))}
    </div>
  );
}
