/**
 * Domain types, mirror the Supabase/Postgres schema in plan §5.
 * The site reads through these types whether the data comes from the local
 * seed (default) or from Supabase (when configured).
 */

export type Seo = {
  title?: string;
  description?: string;
  keywords?: string[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  heroImage: string;
  description: string;
  sort: number;
  seo?: Seo;
};

export type Quality = {
  id: string;
  name: string;
  code: string; // e.g. "cambric-procian-heavy-print"
  slug: string;
  fabricType: string; // e.g. "60x60 Cambric"
  width: string; // e.g. '58"'
  composition: string; // e.g. "100% Cotton"
  foil: boolean;
  heroImage: string;
  categoryId: string;
  seo?: Seo;
};

export type CollectionType = "series" | "lookbook";
export type ItemStatus = "published" | "draft" | "unpublished";

export type Collection = {
  id: string;
  title: string;
  slug: string;
  type: CollectionType;
  heroImage: string;
  description: string;
  status: ItemStatus;
  seo?: Seo;
};

/** A single image view with descriptive alt text (for SEO + a11y). */
export type ImageView = {
  url: string;
  alt: string;
};

/**
 * designs.images is a JSON object that carries MULTIPLE views
 * (front/back/neck/dupatta) AND multiple colourways, matching how the
 * real catalogue works (plan §5).
 */
export type DesignImages = {
  front: ImageView;
  back?: ImageView;
  neck?: ImageView;
  dupatta?: ImageView;
  colourways?: ImageView[];
};

export type Design = {
  id: string;
  title: string;
  slug: string;
  designNo: string;
  categoryId: string;
  qualityId: string;
  collectionId: string;
  images: DesignImages;
  description: string;
  status: ItemStatus;
  seo?: Seo;
};

export type JournalPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string; // markdown-ish plain text for Stage 1
  tags: string[];
  publishedAt: string; // ISO date
  seo?: Seo;
};

export type LeadType = "inquiry" | "catalog";

export type Lead = {
  id?: string;
  type: LeadType;
  name: string;
  company?: string;
  country?: string;
  email: string;
  phone?: string;
  message?: string;
  interestedRefs?: string[];
  source?: string;
  utm?: Record<string, string>;
  status?: "new" | "contacted" | "won" | "lost";
  createdAt?: string;
};
