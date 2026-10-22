import type { Metadata } from "next";
import Link from "next/link";
import { getCollections, getDesigns } from "@/lib/data";
import { buildMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FadeImage } from "@/components/FadeImage";
import { gridStagger } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/ui";

// Render from live Supabase data at request time, never frozen at build
// (so real images and admin edits always show; seed is only an offline fallback).
export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Collections & Design Series",
  description:
    "Browse Vintage Fabric design series: UNIVERSE, SOULITAIRE, INDRIYA and SUNSHINE. Premium printed and foil fabrics for ethnic wear.",
  path: "/collections",
  keywords: ["fabric collections", "design series", "co-ord fabric series", "Vintage Fabric series"],
});

export default async function CollectionsPage() {
  const [collections, designs] = await Promise.all([getCollections(), getDesigns()]);
  const countFor = (cid: string) => designs.filter((d) => d.collectionId === cid).length;

  return (
    <>
      <div className="container-vf pt-8">
        <Breadcrumbs items={[{ name: "Collections", path: "/collections" }]} />
      </div>
      <Section className="!pt-8">
        <div className="container-vf">
          <SectionHeading as="h1"
            eyebrow="Design series"
            title="Collections"
            intro="Each series is a themed set of designs. Explore the story, then browse the fabrics."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {collections.map((col, i) => {
              const count = countFor(col.id);
              return (
                <div key={col.id} data-reveal="" style={gridStagger(i, 2, 120)}>
                  <Link
                    href={`/collections/${col.slug}`}
                    className="group grid h-full overflow-hidden rounded-xl border border-line bg-white shadow-card transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-card-hover sm:grid-cols-2"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden sm:aspect-auto">
                      <FadeImage
                        src={col.heroImage}
                        alt={`${col.title} series by Vintage Fabric`}
                        fill
                        sizes="(max-width: 640px) 100vw, 300px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col p-6">
                      <h2 className="text-2xl text-wine transition-colors duration-300 group-hover:text-gold-dark">
                        {col.title}
                      </h2>
                      <p className="mt-2 flex-1 text-sm text-ink-soft">{col.description}</p>
                      <span className="mt-4 text-xs font-medium uppercase tracking-wide text-gold-dark">
                        {count} {count === 1 ? "design" : "designs"}{" "}
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </Section>
    </>
  );
}
