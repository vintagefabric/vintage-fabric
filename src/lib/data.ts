/**
 * Data-access layer.
 *
 * Reads live from Supabase when it's configured (so designs added through the
 * admin appear on the site), and falls back to the local seed otherwise (so the
 * site still runs with zero setup). All accessors are async.
 *
 * "Fetch all" functions are wrapped in React's `cache` so each request hits the
 * database at most once per table, even though many components look rows up by
 * id/slug.
 */

import { cache } from "react";
import {
  categories as seedCategories,
  collections as seedCollections,
  designs as seedDesigns,
  journal as seedJournal,
  qualities as seedQualities,
} from "./seed";
import { getSupabaseAdmin } from "./supabase";
import type {
  Category,
  Collection,
  Design,
  JournalPost,
  Quality,
} from "./types";

type Row = Record<string, unknown>;

// ── Row → domain mappers (snake_case DB → camelCase types) ─────────────────
function toCategory(r: Row): Category {
  return {
    id: r.id as string,
    name: r.name as string,
    slug: r.slug as string,
    heroImage: (r.hero_image as string) ?? "",
    description: (r.description as string) ?? "",
    sort: (r.sort as number) ?? 0,
    seo: (r.seo as Category["seo"]) ?? undefined,
  };
}

function toQuality(r: Row): Quality {
  return {
    id: r.id as string,
    name: r.name as string,
    code: r.code as string,
    slug: r.slug as string,
    fabricType: (r.fabric_type as string) ?? "",
    width: (r.width as string) ?? "",
    composition: (r.composition as string) ?? "",
    foil: Boolean(r.foil),
    heroImage: (r.hero_image as string) ?? "",
    categoryId: (r.category_id as string) ?? "",
    seo: (r.seo as Quality["seo"]) ?? undefined,
  };
}

function toCollection(r: Row): Collection {
  return {
    id: r.id as string,
    title: r.title as string,
    slug: r.slug as string,
    type: (r.type as Collection["type"]) ?? "series",
    heroImage: (r.hero_image as string) ?? "",
    description: (r.description as string) ?? "",
    status: (r.status as Collection["status"]) ?? "published",
    seo: (r.seo as Collection["seo"]) ?? undefined,
  };
}

function toDesign(r: Row): Design {
  return {
    id: r.id as string,
    title: r.title as string,
    slug: r.slug as string,
    designNo: (r.design_no as string) ?? "",
    categoryId: (r.category_id as string) ?? "",
    qualityId: (r.quality_id as string) ?? "",
    collectionId: (r.collection_id as string) ?? "",
    images: (r.images as Design["images"]) ?? { front: { url: "", alt: "" } },
    description: (r.description as string) ?? "",
    status: (r.status as Design["status"]) ?? "published",
    seo: (r.seo as Design["seo"]) ?? undefined,
  };
}

function toJournal(r: Row): JournalPost {
  return {
    id: r.id as string,
    title: r.title as string,
    slug: r.slug as string,
    excerpt: (r.excerpt as string) ?? "",
    body: (r.body as string) ?? "",
    tags: (r.tags as string[]) ?? [],
    publishedAt: (r.published_at as string) ?? new Date().toISOString(),
    seo: (r.seo as JournalPost["seo"]) ?? undefined,
  };
}

// ── Cached "fetch all" loaders (Supabase, else seed) ───────────────────────
const allCategories = cache(async (): Promise<Category[]> => {
  const sb = getSupabaseAdmin();
  if (!sb) return seedCategories;
  const { data, error } = await sb.from("categories").select("*");
  if (error || !data) return seedCategories;
  return data.map(toCategory);
});

const allQualities = cache(async (): Promise<Quality[]> => {
  const sb = getSupabaseAdmin();
  if (!sb) return seedQualities;
  const { data, error } = await sb.from("qualities").select("*");
  if (error || !data) return seedQualities;
  return data.map(toQuality);
});

const allCollections = cache(async (): Promise<Collection[]> => {
  const sb = getSupabaseAdmin();
  if (!sb) return seedCollections;
  const { data, error } = await sb.from("collections").select("*");
  if (error || !data) return seedCollections;
  return data.map(toCollection);
});

const allDesigns = cache(async (): Promise<Design[]> => {
  const sb = getSupabaseAdmin();
  if (!sb) return seedDesigns;
  const { data, error } = await sb.from("designs").select("*");
  if (error || !data) return seedDesigns;
  return data.map(toDesign);
});

const allJournal = cache(async (): Promise<JournalPost[]> => {
  const sb = getSupabaseAdmin();
  if (!sb) return seedJournal;
  const { data, error } = await sb.from("journal").select("*");
  if (error || !data) return seedJournal;
  return data.map(toJournal);
});

// ── Categories ─────────────────────────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  return (await allCategories()).slice().sort((a, b) => a.sort - b.sort);
}
export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return (await allCategories()).find((c) => c.slug === slug);
}

// ── Qualities ──────────────────────────────────────────────────────────────
export async function getQualities(): Promise<Quality[]> {
  return allQualities();
}
export async function getQualityByCode(code: string): Promise<Quality | undefined> {
  return (await allQualities()).find((q) => q.code === code || q.slug === code);
}
export async function getQualityById(id: string): Promise<Quality | undefined> {
  return (await allQualities()).find((q) => q.id === id);
}
export async function getQualitiesByCategory(categoryId: string): Promise<Quality[]> {
  return (await allQualities()).filter((q) => q.categoryId === categoryId);
}

// ── Collections / series ───────────────────────────────────────────────────
/**
 * Display order for the series. The founding four keep their catalogue order
 * with SUNSHINE last; anything the admin adds later lands after them.
 */
const SERIES_RANK: Record<string, number> = {
  universe: 1,
  soulitaire: 2,
  indriya: 3,
  sunshine: 99,
};
const seriesRank = (c: Collection) => SERIES_RANK[c.slug] ?? 50;

export async function getCollections(): Promise<Collection[]> {
  return (await allCollections())
    .filter((c) => c.status === "published")
    .sort((a, b) => seriesRank(a) - seriesRank(b) || a.title.localeCompare(b.title));
}
/** All collections incl. drafts — for the admin manager only. */
export async function getAllCollections(): Promise<Collection[]> {
  return allCollections();
}
export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  return (await allCollections()).find((c) => c.slug === slug);
}
export async function getCollectionById(id: string): Promise<Collection | undefined> {
  return (await allCollections()).find((c) => c.id === id);
}

// ── Designs ────────────────────────────────────────────────────────────────
export async function getDesigns(): Promise<Design[]> {
  return (await allDesigns()).filter((d) => d.status === "published");
}
/** All designs incl. drafts — for the admin manager only. */
export async function getAllDesigns(): Promise<Design[]> {
  return allDesigns();
}
export async function getDesignBySlug(slug: string): Promise<Design | undefined> {
  return (await allDesigns()).find((d) => d.slug === slug);
}
export async function getDesignById(id: string): Promise<Design | undefined> {
  return (await allDesigns()).find((d) => d.id === id);
}
export async function getDesignsByCategory(categoryId: string): Promise<Design[]> {
  return (await getDesigns()).filter((d) => d.categoryId === categoryId);
}
export async function getDesignsByCollection(collectionId: string): Promise<Design[]> {
  return (await getDesigns()).filter((d) => d.collectionId === collectionId);
}
export async function getDesignsByQuality(qualityId: string): Promise<Design[]> {
  return (await getDesigns()).filter((d) => d.qualityId === qualityId);
}
export async function getFeaturedDesigns(limit = 6): Promise<Design[]> {
  return (await getDesigns()).slice(0, limit);
}

// ── Journal ────────────────────────────────────────────────────────────────
export async function getJournalPosts(): Promise<JournalPost[]> {
  return (await allJournal())
    .slice()
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}
export async function getJournalPostBySlug(slug: string): Promise<JournalPost | undefined> {
  return (await allJournal()).find((p) => p.slug === slug);
}
export async function getJournalPostById(id: string): Promise<JournalPost | undefined> {
  return (await allJournal()).find((p) => p.id === id);
}

// ── Convenience: a design with its related rows resolved ───────────────────
export async function getDesignContext(design: Design) {
  const [category, quality, collection] = await Promise.all([
    getCategoryById(design.categoryId),
    getQualityById(design.qualityId),
    getCollectionById(design.collectionId),
  ]);
  return { design, category, quality, collection };
}

async function getCategoryById(id: string): Promise<Category | undefined> {
  return (await allCategories()).find((c) => c.id === id);
}
