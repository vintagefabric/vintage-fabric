import type { Metadata } from "next";
import { buildMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LeadForm } from "@/components/LeadForm";
import { Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = buildMetadata({
  title: "Catalogue Centre",
  description:
    "Download the Vintage Fabric catalogue and lookbooks. Share your details and get instant access to our latest collections.",
  path: "/catalog",
  keywords: ["fabric catalogue", "fabric lookbook download", "Vintage Fabric catalogue"],
});

/**
 * Catalog Center, a lead-gated download. The form captures name + email, then
 * returns the file URL in the thank-you state (plan §4/§7). Replace the
 * placeholder PDF in /public/catalog with the real lookbook when ready.
 */
const CATALOG_URL = "/catalog/vintage-fabric-catalog.pdf";

export default function CatalogPage() {
  return (
    <>
      <div className="container-vf pt-8">
        <Breadcrumbs items={[{ name: "Catalogue", path: "/catalog" }]} />
      </div>
      <Section className="!pt-8">
        <div className="container-vf grid gap-12 lg:grid-cols-[1fr_minmax(0,520px)]">
          <div>
            <SectionHeading
              eyebrow="Catalogue centre"
              title="Download our catalogue"
              intro="Get the latest Vintage Fabric lookbook with every series, including design numbers, fabric types and widths. Just tell us where to send it."
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

          <LeadForm type="catalog" catalogUrl={CATALOG_URL} />
        </div>
      </Section>
    </>
  );
}
