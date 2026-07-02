import type { Metadata } from "next";
import { buildMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LeadForm } from "@/components/LeadForm";
import { Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = buildMetadata({
  title: "Catalogue",
  description:
    "Request the Vintage Fabric catalogue. Share your details and we'll send our latest collections across.",
  path: "/catalog",
  keywords: ["fabric catalogue", "fabric lookbook", "Vintage Fabric catalogue"],
});

/**
 * Catalogue request. Captures name + email and we email the catalogue across.
 * When a real PDF lookbook is ready, drop it in /public/catalog and pass its
 * URL to <LeadForm catalogUrl=... /> to switch to an instant download.
 */
export default function CatalogPage() {
  return (
    <>
      <div className="container-vf pt-8">
        <Breadcrumbs items={[{ name: "Catalogue", path: "/catalog" }]} />
      </div>
      <Section className="!pt-8">
        <div className="container-vf grid gap-12 lg:grid-cols-[1fr_minmax(0,520px)]">
          <div>
            <SectionHeading as="h1"
              eyebrow="Catalogue"
              title="Request our catalogue"
              intro="Tell us where to send it and we'll email you the latest Vintage Fabric catalogue, with every series, its fabric types, widths and design numbers."
            />
            <ul className="mt-8 space-y-3 text-sm text-ink-soft">
              {[
                "All current series: UNIVERSE, SOULITAIRE, INDRIYA, SUNSHINE",
                "Fabric type, width and finish for every quality",
                "Design numbers for quick reordering",
              ].map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <LeadForm type="catalog" />
        </div>
      </Section>
    </>
  );
}
