import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCollectionBySlug, getCollections, getDesignsByCollection } from "@/lib/data";
import { buildMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DesignGrid } from "@/components/DesignCard";
import { collectionPageJsonLd, JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/ui";

type Params = { slug: string };

export async function generateStaticParams() {
  return (await getCollections()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const col = await getCollectionBySlug(slug);
  if (!col) return { title: "Collection not found" };
  return buildMetadata({
    title: col.seo?.title ?? `${col.title} Series`,
    description: col.seo?.description ?? col.description,
    path: `/collections/${col.slug}`,
    keywords: col.seo?.keywords,
    image: col.heroImage,
  });
}

export default async function CollectionPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const col = await getCollectionBySlug(slug);
  if (!col) notFound();

  const designs = await getDesignsByCollection(col.id);

  return (
    <>
      <JsonLd
        data={collectionPageJsonLd(col.title, col.description, `/collections/${col.slug}`)}
      />

      {/* Series hero */}
      <section className="relative overflow-hidden bg-wine text-ivory">
        <Image
          src={col.heroImage}
          alt={`${col.title} series by Vintage Fabric`}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="container-vf relative py-20">
          <Breadcrumbs
            items={[
              { name: "Collections", path: "/collections" },
              { name: col.title, path: `/collections/${col.slug}` },
            ]}
          />
          <p className="eyebrow mt-6 text-gold">Design series</p>
          <h1 className="mt-2 text-5xl text-ivory">{col.title}</h1>
          <p className="mt-4 max-w-xl text-ivory/85">{col.description}</p>
        </div>
      </section>

      <Section>
        <div className="container-vf">
          <DesignGrid designs={designs} />
        </div>
      </Section>
    </>
  );
}
