import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/site";
import { BRAND } from "@/lib/brand";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Section } from "@/components/ui";

type Params = { doc: string };

type LegalSection = { h: string; p?: string; list?: string[] };
type LegalDoc = { title: string; intro: string; sections: LegalSection[] };

/** Last reviewed date shown on each policy. Update when the content changes. */
const LAST_UPDATED = "1 July 2026";

const DOCS: Record<string, LegalDoc> = {
  privacy: {
    title: "Privacy Policy",
    intro:
      "This policy explains what information Vintage Fabric collects through this website, how we use it, and the choices you have. We have kept it short and plain.",
    sections: [
      {
        h: "Who we are",
        p: `This website (${BRAND.website}) is operated by ${BRAND.name}, ${BRAND.tagline}, at ${BRAND.address.full}. GSTIN ${BRAND.gstin}. You can reach us any time at ${BRAND.email}.`,
      },
      {
        h: "What we collect",
        p: "We only collect the information you choose to give us through our inquiry and catalogue-request forms:",
        list: [
          "Your name",
          "Company or business name",
          "Country",
          "Email address",
          "Phone number",
          "Anything you write in the message field",
          "Which design or series you were viewing when you got in touch",
        ],
      },
      {
        h: "What we do not collect",
        p: "There is no login or account to create, and we do not ask for any sensitive personal information or payment details. No payments are taken on this site.",
      },
      {
        h: "How we use it",
        p: "We use your details only to run our business relationship with you:",
        list: [
          "To reply to your inquiry or send the catalogue you asked for",
          "To follow up about your requirement and prepare a quote",
          "To keep a record of our correspondence",
        ],
      },
      {
        h: "We do not sell your data",
        p: "We never sell, rent or trade your personal information to anyone.",
      },
      {
        h: "Cookies",
        p: "This website does not use advertising or visitor-tracking cookies. The only cookie we set is a temporary one that keeps the site administrator signed in to the private admin area; it is not used to track you.",
      },
      {
        h: "Where your information is stored",
        p: "To run the site and respond to you, we rely on a few trusted providers who process data on our behalf:",
        list: [
          "Supabase, the secure database that stores your inquiry",
          "Cloudinary, which hosts our images",
          "Vercel, which hosts the website",
          "If you message us on WhatsApp, that chat is also covered by WhatsApp's own privacy terms",
        ],
      },
      {
        h: "International transfers",
        p: "Some of these providers may process data on servers outside India. We only use reputable providers with appropriate safeguards.",
      },
      {
        h: "How long we keep it",
        p: "We keep inquiry records only as long as needed for our business relationship and our own record-keeping, after which they are removed.",
      },
      {
        h: "Your choices",
        p: `You can ask us to show you, correct, or delete the personal information we hold about you. Email ${BRAND.email} and we will act on any reasonable request.`,
      },
      {
        h: "Changes to this policy",
        p: "We may update this policy from time to time. The date at the bottom of this page shows when it was last changed.",
      },
    ],
  },
  terms: {
    title: "Terms of Use",
    intro: "By using this website you agree to these terms. Please read them.",
    sections: [
      {
        h: "About this website",
        p: "This website showcases the fabrics manufactured by Vintage Fabric and lets buyers get in touch. It is not an online shop: no orders are placed and no payments are taken here. Everything shown, including designs, specifications, availability and any pricing, is for information and is subject to confirmation with our team.",
      },
      {
        h: "Inquiries are not orders",
        p: "Sending an inquiry or requesting our catalogue does not create an order or a binding contract. Prices, quantities, minimum order quantities, lead times and terms are agreed directly with us for each order, and we may decline or limit any request.",
      },
      {
        h: "Product images and colours",
        p: "We photograph our fabrics as accurately as we can, but screens vary and printed colours can differ slightly from what you see online. Where colour is critical, please ask us for a physical sample before ordering.",
      },
      {
        h: "Intellectual property",
        p: "The designs, images, text, logo and layout on this site are the property of Vintage Fabric and may not be copied, reproduced or used commercially without our written permission.",
      },
      {
        h: "Acceptable use",
        p: "Please use the site lawfully. Do not attempt to disrupt it, misuse the inquiry forms (for example with spam or false details), or access the private admin area without authorisation.",
      },
      {
        h: "Third-party links",
        p: "The site may link to third-party services such as WhatsApp and Google Maps. We are not responsible for the content or practices of those services.",
      },
      {
        h: "Limitation of liability",
        p: "The website is provided on an 'as is' basis. To the extent permitted by law, Vintage Fabric is not liable for any loss arising from the use of, or reliance on, information on this site. Nothing here limits any liability that cannot be limited by law.",
      },
      {
        h: "Governing law",
        p: "These terms are governed by the laws of India, and any dispute is subject to the courts of Ahmedabad, Gujarat.",
      },
      {
        h: "Changes",
        p: "We may update these terms from time to time. The version on this page is always the current one.",
      },
      {
        h: "Contact",
        p: `Questions about these terms? Email ${BRAND.email}.`,
      },
    ],
  },
  "export-policy": {
    title: "Export Policy",
    intro:
      "Guidance for wholesale and international buyers sourcing fabric from Vintage Fabric. It sits alongside our Terms of Use; the specific terms of any order are always confirmed with you in writing.",
    sections: [
      {
        h: "Markets we serve",
        p: "We supply wholesalers, retailers and exporters in India and worldwide, and we welcome inquiries from any market. Tell us where you are selling and we will advise on suitable qualities.",
      },
      {
        h: "Specifications",
        p: "Most of our range runs at 56 or 58 inch widths on 100% cotton bases such as cambric and dhabhu, with Procion prints and foil or discharge finishing. Exact width, composition and finish are confirmed per order for your costing, customs and labelling.",
      },
      {
        h: "Samples",
        p: "We can provide a sample or swatch before a bulk order, which we recommend where colour or hand-feel matters. Talk to us about sample availability and any cost.",
      },
      {
        h: "Minimum orders and lead times",
        p: "Minimum order quantities and lead times vary by design, quality and finish. Please confirm both with us early so we can plan production around your shipping window. We give realistic timelines, not hopeful ones.",
      },
      {
        h: "Quotations and payment",
        p: "Pricing is quoted per order and held for the period stated in the quotation. Payment terms, currency and any advance are agreed in writing before production. No payment is taken through this website.",
      },
      {
        h: "Shipping",
        p: "We agree the delivery basis (for example ex-works, FOB or CIF) with you for each order. Freight, insurance and the point at which risk passes are set out in the order confirmation.",
      },
      {
        h: "Customs, duties and documentation",
        p: "Import duties, taxes and clearance in the destination country are the buyer's responsibility. We provide the standard export documentation (such as the commercial invoice and packing list, and others as agreed) to support your import.",
      },
      {
        h: "Quality, inspection and claims",
        p: "We check width and finish before dispatch. Please inspect goods on arrival and raise any claim promptly, with photographs and the relevant design numbers, so we can resolve it quickly.",
      },
      {
        h: "Compliance",
        p: `We comply with applicable Indian export regulations. GSTIN ${BRAND.gstin}.`,
      },
      {
        h: "Contact",
        p: `To discuss an export order, email ${BRAND.email} or message us on WhatsApp.`,
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { doc } = await params;
  const found = DOCS[doc];
  if (!found) return { title: "Not found" };
  return buildMetadata({
    title: found.title,
    description: found.intro,
    path: `/legal/${doc}`,
  });
}

export default async function LegalPage({ params }: { params: Promise<Params> }) {
  const { doc } = await params;
  const found = DOCS[doc];
  if (!found) notFound();

  return (
    <>
      <div className="container-vf pt-8">
        <Breadcrumbs items={[{ name: found.title, path: `/legal/${doc}` }]} />
      </div>
      <Section className="!pt-8">
        <article className="container-vf max-w-3xl">
          <h1 className="text-4xl">{found.title}</h1>
          <div className="rule-gold mt-4" />
          <p className="mt-6 text-ink-soft">{found.intro}</p>
          <div className="mt-8 space-y-8">
            {found.sections.map((s) => (
              <section key={s.h}>
                <h2 className="text-xl">{s.h}</h2>
                {s.p && <p className="mt-2 text-ink-soft">{s.p}</p>}
                {s.list && (
                  <ul className="mt-3 space-y-1.5 pl-1 text-ink-soft">
                    {s.list.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
          <p className="mt-10 border-t border-line pt-6 text-xs text-ink-soft">
            Last updated: {LAST_UPDATED}. For any question about this policy, contact {BRAND.email}.
          </p>
        </article>
      </Section>
    </>
  );
}
