import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getDesigns, getQualities } from "@/lib/data";
import { buildMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = buildMetadata({
  title: "Our Fabrics",
  description:
    "Browse Vintage Fabric by fabric type: cambric Procion, Vertican discharge, dhabhu plain and cotton floral. Premium printed and foil fabrics for wholesale and export.",
  path: "/fabrics",
  keywords: ["cambric fabric", "discharge print fabric", "dhabhu plain", "cotton print fabric", "fabric types"],
});

export default async function FabricsPage() {
  const [qualities, designs] = await Promise.all([getQualities(), getDesigns()]);
  const countFor = (qid: string) => designs.filter((d) => d.qualityId === qid).length;

  return (
    <>
      <div className="container-vf pt-8">
        <Breadcrumbs items={[{ name: "Our Fabrics", path: "/fabrics" }]} />
      </div>
      <Section className="!pt-8">
        <div className="container-vf">
          <SectionHeading as="h1"
            eyebrow="What we make"
            title="Our Fabrics"
            intro="Source by fabric type. Every quality lists its width, composition and finish, and the designs woven on it."
          />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {qualities.map((q) => {
              const count = countFor(q.id);
              return (
                <Link
                  key={q.id}
                  href={`/fabric/${q.code}`}
                  className="group relative overflow-hidden rounded-xl border border-gold/40 transition-colors hover:border-gold/70"
                >
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={q.heroImage}
                      alt={`${q.name} fabric by Vintage Fabric`}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-wine/90 via-wine/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 p-3 sm:p-5">
                    <h2 className="text-base leading-snug text-ivory sm:text-xl">{q.name}</h2>
                    <p className="mt-1 text-xs text-gold">
                      {q.width} · {q.foil ? "Foil" : "Non-foil"}
                    </p>
                    <span className="mt-1 block text-xs text-ivory/80">
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
