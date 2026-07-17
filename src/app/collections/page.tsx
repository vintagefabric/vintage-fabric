import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCollections, getDesigns } from "@/lib/data";
import { buildMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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
            {collections.map((col) => {
              const count = countFor(col.id);
              return (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className="group grid overflow-hidden rounded-xl border border-line bg-white shadow-card transition-all hover:shadow-card-hover sm:grid-cols-2"
                >
                  <div className="relative aspect-[4/3] sm:aspect-auto">
                    <Image
                      src={col.heroImage}
                      alt={`${col.title} series by Vintage Fabric`}
                      fill
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col p-6">
                    <h2 className="text-2xl text-wine group-hover:text-gold-dark">{col.title}</h2>
                    <p className="mt-2 flex-1 text-sm text-ink-soft">{col.description}</p>
                    <span className="mt-4 text-xs font-medium uppercase tracking-wide text-gold-dark">
                      {count} {count === 1 ? "design" : "designs"} →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Section>
    </>
  );
}
