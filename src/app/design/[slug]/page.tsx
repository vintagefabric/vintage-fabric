import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDesignBySlug,
  getDesignContext,
  getDesignsByCollection,
} from "@/lib/data";
import { buildMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DesignGallery } from "@/components/DesignGallery";
import { DesignGrid } from "@/components/DesignCard";
import { JsonLd, productJsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { Pill, Section, SectionHeading } from "@/components/ui";
import { WhatsAppButton } from "@/components/WhatsAppButton";

type Params = { slug: string };

// Render from live Supabase data at request time, never frozen at build
// (so real images and admin edits always show; seed is only an offline fallback).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const design = await getDesignBySlug(slug);
  if (!design) return { title: "Design not found" };
  const { quality } = await getDesignContext(design);
  return buildMetadata({
    title: design.seo?.title ?? design.title,
    description:
      design.seo?.description ??
      `${design.title} (${design.designNo}). ${quality?.fabricType}, ${quality?.width}. ${design.description}`,
    path: `/design/${design.slug}`,
    keywords: design.seo?.keywords,
    image: design.images.front.url,
  });
}

export default async function DesignPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const design = await getDesignBySlug(slug);
  if (!design || design.status !== "published") notFound();

  const { quality, collection } = await getDesignContext(design);

  // Related = other designs in the same series (fall back to none).
  const related = collection
    ? (await getDesignsByCollection(collection.id)).filter((d) => d.id !== design.id)
    : [];

  const inquiryMsg = `Hello Vintage Fabric, I'm interested in ${design.title} (${design.designNo}). Please share details.`;

  const specs: { label: string; value?: string }[] = [
    { label: "Design No.", value: design.designNo },
    { label: "Fabric type", value: quality?.fabricType },
    { label: "Width", value: quality?.width },
    { label: "Composition", value: quality?.composition },
    { label: "Finish", value: quality?.foil ? "Foil" : "Non-foil" },
    { label: "Series", value: collection?.title },
  ];

  return (
    <>
      <JsonLd data={productJsonLd(design, quality?.name)} />

      <div className="container-vf pt-8">
        <Breadcrumbs
          items={[
            ...(quality ? [{ name: quality.name, path: `/fabric/${quality.code}` }] : []),
            { name: design.title, path: `/design/${design.slug}` },
          ]}
        />
      </div>

      <Section className="!pt-8">
        <div className="container-vf grid gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <Reveal soft>
            <DesignGallery images={design.images} />
          </Reveal>

          {/* Details */}
          <div>
            <Reveal delay={80}>
              {collection && (
                <Link
                  href={`/collections/${collection.slug}`}
                  className="link-draw text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark hover:text-wine"
                >
                  {collection.title} series
                </Link>
              )}
              <h1 className="mt-2 text-4xl">{design.title}</h1>
              <p className="mt-2 text-ink-soft">{design.designNo}</p>
            </Reveal>

            <Reveal delay={160} className="mt-4 flex flex-wrap gap-2">
              {quality && <Pill>{quality.fabricType}</Pill>}
              {quality && <Pill>{quality.width}</Pill>}
              {quality && <Pill>{quality.foil ? "Foil" : "Non-foil"}</Pill>}
            </Reveal>

            <Reveal delay={220} as="p" className="mt-6 text-ink-soft">
              {design.description}
            </Reveal>

            {/* Spec table */}
            <Reveal delay={280}>
              <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-ink/10 bg-ink/10 sm:grid-cols-2">
                {specs
                  .filter((s) => s.value)
                  .map((s) => (
                    <div key={s.label} className="bg-white p-4 transition-colors duration-300 hover:bg-cream">
                      <dt className="text-xs uppercase tracking-wide text-ink-soft">{s.label}</dt>
                      <dd className="mt-1 font-medium text-ink">{s.value}</dd>
                    </div>
                  ))}
              </dl>
            </Reveal>

            {/* Link to the fabric type */}
            {quality && (
              <Reveal delay={320} as="p" className="mt-6 text-sm text-ink-soft">
                Fabric:{" "}
                <Link
                  href={`/fabric/${quality.code}`}
                  className="link-draw font-medium text-wine hover:text-gold-dark"
                >
                  {quality.name}
                </Link>
              </Reveal>
            )}

            {/* CTAs */}
            <Reveal delay={380} className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/inquiry?ref=${encodeURIComponent(design.slug)}`}
                className="btn-primary"
              >
                Inquire about this design
              </Link>
              <WhatsAppButton message={inquiryMsg} />
              <Link href="/catalog" className="btn-outline">
                Request catalogue
              </Link>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Related designs */}
      {related.length > 0 && (
        <Section className="bg-cream-dark">
          <div className="container-vf">
            <SectionHeading
              eyebrow="More from this series"
              title={`${collection?.title} designs`}
            />
            <div className="mt-10">
              <DesignGrid designs={related} />
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
