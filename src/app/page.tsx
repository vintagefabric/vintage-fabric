import Image from "next/image";
import Link from "next/link";
import { getCollections, getDesigns, getFeaturedDesigns, getQualities } from "@/lib/data";
import { BRAND } from "@/lib/brand";
import { LogoMark } from "@/components/Logo";
import { DesignGrid } from "@/components/DesignCard";
import { DesignMarquee } from "@/components/DesignMarquee";
import { ArrowLink, Section, SectionHeading } from "@/components/ui";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default async function HomePage() {
  const [qualities, collections, featured, allDesigns] = await Promise.all([
    getQualities(),
    getCollections(),
    getFeaturedDesigns(8),
    getDesigns(),
  ]);

  return (
    <>
      {/* ── Hero (light editorial) ───────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-cream">
        {/* Faint woven texture in wine, very low opacity */}
        <div className="fabric-weave-wine pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        {/* Warm gold light, upper-right */}
        <div
          className="pointer-events-none absolute -right-40 -top-44 h-[36rem] w-[36rem] rounded-full bg-gold/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-vf relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">
              {BRAND.tagline}
            </span>
            <div className="mt-5 w-fit">
              <h1 className="text-5xl leading-[1.04] text-wine sm:text-6xl">
                Quality Fabrics,{" "}
                <br />
                crafted to be worn…
              </h1>
              <div className="mt-6 h-1 w-full rounded-full bg-gold" />
            </div>
            <p className="mt-6 max-w-md text-lg text-ink-soft">
              Premium printed and foil fabrics for kurti, dress,{" "}
              <span className="whitespace-nowrap">co-ord</span> and{" "}
              <span className="whitespace-nowrap">3-piece</span> sets. Made in
              India, shipped to buyers worldwide.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/collections" className="btn-primary">
                Explore collections
              </Link>
              <Link href="/inquiry" className="btn-gold">
                Request a catalogue
              </Link>
            </div>
            <p className="mt-6 text-sm text-ink-soft">
              Wholesale and export inquiries welcome.
            </p>
          </div>

          {/* Logo medallion sitting directly on the background, with a soft gold halo */}
          <div className="relative mt-4 flex justify-center lg:mt-0 lg:justify-end">
            <div
              className="gold-halo animate-halo pointer-events-none absolute inset-0 m-auto h-[15rem] w-[15rem] sm:h-[20rem] sm:w-[20rem] lg:h-[26rem] lg:w-[26rem]"
              aria-hidden="true"
            />
            <div className="animate-float relative">
              <LogoMark size={330} className="h-auto w-[200px] sm:w-[260px] lg:w-[330px]" />
            </div>
          </div>
        </div>

      </section>

      {/* Thick gold divider after the hero */}
      <div className="h-1 w-full bg-gradient-to-r from-gold-dark via-gold to-gold-dark" />

      {/* ── Our fabrics (by fabric type) ─────────────────────── */}
      <Section>
        <div className="container-vf">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <SectionHeading
              eyebrow="What we make"
              title="Our fabrics"
              intro="Every quality, beautifully shown. Browse by fabric type, with width, composition and finish."
            />
            <ArrowLink href="/fabrics">All fabrics</ArrowLink>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {qualities.map((q) => (
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
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wine/90 via-wine/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="text-xl text-ivory">{q.name}</h3>
                  <span className="text-sm text-gold">{q.width} · View designs →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Flowing design ribbon ────────────────────────────── */}
      <section className="overflow-hidden bg-cream py-10">
        <div className="container-vf mb-7 text-center">
          <p className="eyebrow">The collection</p>
          <h2 className="mt-2 text-3xl sm:text-4xl">Designs in motion</h2>
          <div className="rule-gold mx-auto mt-4" />
        </div>
        <DesignMarquee designs={allDesigns} />
      </section>

      {/* ── Latest series ────────────────────────────────────── */}
      <Section>
        <div className="container-vf">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <SectionHeading eyebrow="Design series" title="Latest collections" />
            <ArrowLink href="/collections">All collections</ArrowLink>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="group overflow-hidden rounded-xl border border-gold/40 bg-wine text-ivory shadow-card transition-all hover:-translate-y-1 hover:border-gold/70 hover:shadow-card-hover"
              >
                <div className="relative aspect-[16/10] bg-wine-dark">
                  <Image
                    src={col.heroImage}
                    alt={`${col.title} series by Vintage Fabric`}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl text-ivory group-hover:text-gold">{col.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-ivory/75">{col.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Featured designs ─────────────────────────────────── */}
      <Section>
        <div className="container-vf">
          <SectionHeading
            eyebrow="From the catalogue"
            title="Featured designs"
            intro="A taste of the range. Each design shows every view and colourway on its page."
          />
          <div className="mt-10">
            <DesignGrid designs={featured} />
          </div>
        </div>
      </Section>

      {/* ── Export / trust band ──────────────────────────────── */}
      <section className="bg-wine text-ivory">
        <div className="container-vf grid gap-8 py-14 text-center sm:grid-cols-3">
          {[
            { k: "Made in India", v: "Crafted with care and supplied to buyers across India and abroad." },
            { k: "Export ready", v: "Consistent widths (56\"/58\"), 100% cotton bases and dependable finishes." },
            { k: "Worldwide buyers", v: "Wholesale and export inquiries welcomed from every market." },
          ].map((item) => (
            <div key={item.k}>
              <h3 className="text-gold">{item.k}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-ivory/85">{item.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Conversion CTA ───────────────────────────────────── */}
      <Section>
        <div className="container-vf">
          <div className="rounded-2xl border border-gold/25 bg-white p-10 text-center shadow-card">
            <SectionHeading
              center
              eyebrow="Let's work together"
              title="Request our catalogue or send an inquiry"
              intro="Tell us your market and the qualities you're after, and we'll get back with options, widths and lead times."
            />
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/inquiry" className="btn-primary">
                Send an inquiry
              </Link>
              <Link href="/catalog" className="btn-outline">
                Request the catalogue
              </Link>
              <WhatsAppButton />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
