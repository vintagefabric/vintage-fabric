import type { Metadata } from "next";
import { BRAND } from "./brand";

/** Canonical site URL (env override for prod, localhost for dev). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const SITE_NAME = `${BRAND.name} | ${BRAND.tagline}`;

/** Absolute URL helper for canonical links, sitemap and JSON-LD. */
export function abs(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Build per-page metadata with sensible brand defaults (plan §8). */
export function buildMetadata({
  title,
  description,
  path = "/",
  keywords,
  image,
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
}): Metadata {
  const url = abs(path);
  const fullTitle = title.includes(BRAND.name) ? title : `${title} | ${BRAND.name}`;
  return {
    // `absolute` bypasses the root layout's title template so the brand
    // suffix isn't appended twice.
    title: { absolute: fullTitle },
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: BRAND.name,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: image ? [image] : undefined,
    },
  };
}
