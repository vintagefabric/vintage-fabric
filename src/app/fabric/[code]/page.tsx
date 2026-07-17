import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCollectionById,
  getDesignsByQuality,
  getQualityByCode,
} from "@/lib/data";
import { buildMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DesignGrid } from "@/components/DesignCard";
import { Pill, Section, SectionHeading } from "@/components/ui";

type Params = { code: string };

// Render from live Supabase data at request time, never frozen at build
// (so real images and admin edits always show; seed is only an offline fallback).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { code } = await params;
  const quality = await getQualityByCode(code);
  if (!quality) return { title: "Fabric not found" };
  return buildMetadata({
    title: quality.seo?.title ?? quality.name,
    description:
      quality.seo?.description ??
      `${quality.name}: ${quality.fabricType}, ${quality.width}, ${quality.composition}.`,
    path: `/fabric/${quality.code}`,
    keywords: quality.seo?.keywords,
    image: quality.heroImage,
  });
}

export default async function FabricPage({ params }: { params: Promise<Params> }) {
  const { code } = await params;
  const quality = await getQualityByCode(code);
  if (!quality) notFound();

  const designs = await getDesignsByQuality(quality.id);

  // Series that use this fabric, for cross-linking.
  const seriesIds = Array.from(new Set(designs.map((d) => d.collectionId)));
  const series = (
    await Promise.all(seriesIds.map((id) => getCollectionById(id)))
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <>
      <div className="container-vf pt-8">
        <Breadcrumbs
          items={[
            { name: "Our Fabrics", path: "/fabrics" },
            { name: quality.name, path: `/fabric/${quality.code}` },
          ]}
        />
      </div>

      <Section className="!pt-8">
        <div className="container-vf">
          <SectionHeading as="h1"
            eyebrow="Fabric type"
            title={quality.name}
            intro={quality.seo?.description}
          />

          {/* Spec chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Pill>{quality.fabricType}</Pill>
            <Pill>{quality.width}</Pill>
            <Pill>{quality.composition}</Pill>
            <Pill>{quality.foil ? "Foil" : "Non-foil"}</Pill>
          </div>

          {series.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-ink-soft">Used in:</span>
              {series.map((s) => (
                <Link
                  key={s.id}
                  href={`/collections/${s.slug}`}
                  className="rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-xs font-medium text-wine hover:bg-gold/20"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10">
            <DesignGrid designs={designs} />
          </div>
        </div>
      </Section>
    </>
  );
}
