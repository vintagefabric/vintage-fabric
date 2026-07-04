import type { Metadata } from "next";
import { buildMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Section, SectionHeading } from "@/components/ui";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { BRAND, PHONES } from "@/lib/brand";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact Vintage Fabric, Mfg. of Quality Fabrics, Ahmedabad. Sales and accounts numbers, address, email and WhatsApp.",
  path: "/contact",
  keywords: ["contact Vintage Fabric", "fabric manufacturer Ahmedabad contact"],
});

export default function ContactPage() {
  return (
    <>
      <div className="container-vf pt-8">
        <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      </div>
      <Section className="!pt-8">
        <div className="container-vf grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading as="h1"
              eyebrow="Get in touch"
              title="Contact us"
              intro="We welcome wholesale and export inquiries from buyers worldwide. Reach us by phone, email or WhatsApp."
            />

            <dl className="mt-8 space-y-6">
              <div className="flex gap-4">
                <PinIcon className="mt-1 h-6 w-6 shrink-0 text-gold-dark" />
                <div>
                  <dt className="font-medium text-ink">Address</dt>
                  <dd className="mt-1 text-ink-soft">
                    {BRAND.address.line1}
                    <br />
                    {BRAND.address.line2}, {BRAND.address.region}, {BRAND.address.country}
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <PhoneIcon className="mt-1 h-6 w-6 shrink-0 text-gold-dark" />
                <div>
                  <dt className="font-medium text-ink">Phone</dt>
                  <dd className="mt-1 space-y-1 text-ink-soft">
                    <p>
                      <span className="text-ink-soft/70">Sales: </span>
                      {PHONES.sales.map((p, i) => (
                        <span key={p}>
                          <a href={`tel:${p.replace(/[^+\d]/g, "")}`} className="hover:text-wine">
                            {p}
                          </a>
                          {i < PHONES.sales.length - 1 ? " · " : ""}
                        </span>
                      ))}
                    </p>
                    <p>
                      <span className="text-ink-soft/70">Accounts / Office: </span>
                      <a
                        href={`tel:${PHONES.accounts.replace(/[^+\d]/g, "")}`}
                        className="hover:text-wine"
                      >
                        {PHONES.accounts}
                      </a>
                    </p>
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <MailIcon className="mt-1 h-6 w-6 shrink-0 text-gold-dark" />
                <div>
                  <dt className="font-medium text-ink">Email & web</dt>
                  <dd className="mt-1 text-ink-soft">
                    <a href={`mailto:${BRAND.email}`} className="hover:text-wine">
                      {BRAND.email}
                    </a>
                    <br />
                    {BRAND.website}
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-8">
              <WhatsAppButton />
            </div>

            <p className="mt-8 text-xs text-ink-soft">GSTIN: {BRAND.gstin}</p>
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-xl border border-ink/10 shadow-card">
            <iframe
              title="Vintage Fabric location, New Cloth Market, Ahmedabad"
              src="https://www.google.com/maps?q=Vintage+Fabric,+New+Cloth+Market,+146,+Ahmedabad,+Gujarat+380002&ftid=0x395e8517289c6e45:0x99be5a6dd45b4d07&output=embed"
              className="h-full min-h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
