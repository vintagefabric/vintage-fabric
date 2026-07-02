import type { Metadata } from "next";
import { getDesignBySlug } from "@/lib/data";
import { buildMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LeadForm } from "@/components/LeadForm";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Section, SectionHeading } from "@/components/ui";
import { BRAND, PHONES } from "@/lib/brand";

export const metadata: Metadata = buildMetadata({
  title: "Buyer Inquiry",
  description:
    "Send a wholesale or export inquiry to Vintage Fabric. Tell us your market and the qualities you need, and we'll respond with options, widths and lead times.",
  path: "/inquiry",
  keywords: ["fabric inquiry", "wholesale fabric inquiry", "export fabric India"],
});

export default async function InquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const referenced = ref ? await getDesignBySlug(ref) : undefined;

  return (
    <>
      <div className="container-vf pt-8">
        <Breadcrumbs items={[{ name: "Inquiry", path: "/inquiry" }]} />
      </div>
      <Section className="!pt-8">
        <div className="container-vf grid gap-12 lg:grid-cols-[1fr_minmax(0,520px)]">
          <div>
            <SectionHeading as="h1"
              eyebrow="Let's work together"
              title="Send an inquiry"
              intro="Share a few details and we'll get back to you. Prefer to chat? Message us on WhatsApp and we usually reply quickly."
            />
            {referenced && (
              <p className="mt-6 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-wine">
                Inquiring about <strong>{referenced.title}</strong> ({referenced.designNo}).
              </p>
            )}
            <div className="mt-8 space-y-4 text-sm text-ink-soft">
              <p className="font-medium text-ink">Other ways to reach us</p>
              <ul className="space-y-1">
                <li>Sales: {PHONES.sales.join(" · ")}</li>
                <li>Accounts / Office: {PHONES.accounts}</li>
                <li>Email: {BRAND.email}</li>
              </ul>
              <WhatsAppButton />
            </div>
          </div>

          <LeadForm type="inquiry" refSlug={referenced?.slug} />
        </div>
      </Section>
    </>
  );
}
