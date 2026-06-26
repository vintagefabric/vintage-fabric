import { BRAND, PHONES } from "@/lib/brand";
import { abs, SITE_URL } from "@/lib/site";
import type { Design } from "@/lib/types";

/** Renders a JSON-LD <script> block. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD is trusted, server-generated structured data.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Site-wide Organization schema, with address + GSTIN identifier (plan §8). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    description: `${BRAND.tagline}. Premium fabric manufacturer in Ahmedabad, India.`,
    url: SITE_URL,
    email: BRAND.email,
    telephone: PHONES.sales[0],
    identifier: { "@type": "PropertyValue", name: "GSTIN", value: BRAND.gstin },
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND.address.line1,
      addressLocality: "Ahmedabad",
      addressRegion: BRAND.address.region,
      postalCode: "380002",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: PHONES.sales.join(", "),
        email: BRAND.email,
        areaServed: "Worldwide",
      },
    ],
  };
}

/** Product schema for a design / quality page (plan §8). */
export function productJsonLd(design: Design, qualityName?: string) {
  const images = [
    design.images.front,
    design.images.back,
    design.images.neck,
    design.images.dupatta,
    ...(design.images.colourways ?? []),
  ]
    .filter(Boolean)
    .map((v) => v!.url);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: design.title,
    sku: design.designNo,
    image: images,
    description: design.description,
    brand: { "@type": "Brand", name: BRAND.name },
    category: qualityName,
    manufacturer: { "@type": "Organization", name: BRAND.name },
    url: abs(`/design/${design.slug}`),
  };
}

/** BreadcrumbList schema. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

/** CollectionPage schema for a series page. */
export function collectionPageJsonLd(title: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: abs(path),
    isPartOf: { "@type": "WebSite", name: BRAND.name, url: SITE_URL },
  };
}
