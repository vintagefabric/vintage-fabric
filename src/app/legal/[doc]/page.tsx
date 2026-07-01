import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/site";
import { BRAND } from "@/lib/brand";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Section } from "@/components/ui";

type Params = { doc: string };

/** Legal documents, plain content for Stage 1; review with counsel before launch. */
const DOCS: Record<string, { title: string; intro: string; sections: { h: string; p: string }[] }> = {
  privacy: {
    title: "Privacy Policy",
    intro:
      "This policy explains what information we collect through this website and how we use it.",
    sections: [
      {
        h: "What we collect",
        p: "When you send an inquiry or request our catalogue, we collect the details you provide, typically your name, company, country, email, phone and message.",
      },
      {
        h: "How we use it",
        p: "We use your details solely to respond to your request, send the materials you asked for, and follow up about your inquiry. We do not sell your data.",
      },
      {
        h: "Storage",
        p: "Inquiries may be stored in our database and emailed to our team so we can respond. We keep them only as long as needed for our business relationship.",
      },
      {
        h: "Contact",
        p: `For any privacy request, email us at ${BRAND.email}.`,
      },
    ],
  },
  terms: {
    title: "Terms of Use",
    intro: "By using this website you agree to the following terms.",
    sections: [
      {
        h: "Showcase only",
        p: "This website showcases our fabrics and captures inquiries. It is not an online store; no orders or payments are processed here. All designs, specifications and availability are subject to confirmation.",
      },
      {
        h: "Content & imagery",
        p: "Designs, images and text are the property of Vintage Fabric and may not be reproduced without permission. Colours may vary slightly from on-screen representations.",
      },
      {
        h: "Inquiries",
        p: "Submitting an inquiry does not create a binding order. Pricing, quantities and lead times are confirmed directly with our team.",
      },
    ],
  },
  "export-policy": {
    title: "Export Policy",
    intro: "Guidance for international buyers sourcing from Vintage Fabric.",
    sections: [
      {
        h: "Markets served",
        p: "We welcome wholesale and export inquiries worldwide. Share your market and requirements and we'll advise on suitable qualities.",
      },
      {
        h: "Specifications",
        p: "Most qualities run 56\" or 58\" on 100% cotton bases. Exact composition, width and finish are confirmed per order for your customs and labelling needs.",
      },
      {
        h: "Quantities & lead times",
        p: "Minimum order quantities and lead times vary by design and finish. Contact us early so we can plan production around your shipping windows.",
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
        <Breadcrumbs
          items={[{ name: found.title, path: `/legal/${doc}` }]}
        />
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
                <p className="mt-2 text-ink-soft">{s.p}</p>
              </section>
            ))}
          </div>
          <p className="mt-10 text-xs text-ink-soft">
            This is a Stage-1 placeholder document. Please review with legal counsel before launch.
          </p>
        </article>
      </Section>
    </>
  );
}
