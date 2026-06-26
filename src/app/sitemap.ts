import type { MetadataRoute } from "next";
import {
  getCollections,
  getDesigns,
  getJournalPosts,
  getQualities,
} from "@/lib/data";
import { abs } from "@/lib/site";

/** Auto-generated sitemap covering all static + content pages (plan §8). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPaths = [
    "/",
    "/collections",
    "/fabrics",
    "/catalog",
    "/journal",
    "/about",
    "/inquiry",
    "/contact",
    "/legal/privacy",
    "/legal/terms",
    "/legal/export-policy",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: abs(p),
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.7,
  }));

  const [collections, qualities, designs, posts] = await Promise.all([
    getCollections(),
    getQualities(),
    getDesigns(),
    getJournalPosts(),
  ]);

  for (const c of collections) {
    entries.push({ url: abs(`/collections/${c.slug}`), lastModified: now, priority: 0.8 });
  }
  for (const q of qualities) {
    entries.push({ url: abs(`/fabric/${q.code}`), lastModified: now, priority: 0.8 });
  }
  for (const d of designs) {
    entries.push({ url: abs(`/design/${d.slug}`), lastModified: now, priority: 0.9 });
  }
  for (const p of posts) {
    entries.push({
      url: abs(`/journal/${p.slug}`),
      lastModified: new Date(p.publishedAt),
      priority: 0.6,
    });
  }

  return entries;
}
