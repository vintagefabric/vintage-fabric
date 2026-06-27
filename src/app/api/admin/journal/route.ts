import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { z } from "zod";
import { isAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { BRAND } from "@/lib/brand";

const schema = z.object({
  title: z.string().trim().min(3).max(160),
  excerpt: z.string().trim().min(10).max(400),
  body: z.string().trim().min(20),
  tags: z.array(z.string().trim().min(1)).max(8).default([]),
  keywords: z.array(z.string().trim().min(1)).max(12).default([]),
  publishedAt: z.string().trim().min(4), // YYYY-MM-DD
  seoDescription: z.string().trim().max(400).optional().or(z.literal("")),
});

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** POST /api/admin/journal — create a journal post (admin only). */
export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase not configured." }, { status: 500 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const d = parsed.data;

  let slug = slugify(d.title) || `post-${Date.now().toString(36)}`;
  const { data: clash } = await supabase.from("journal").select("id").eq("slug", slug).maybeSingle();
  if (clash) slug = `${slug}-${Date.now().toString(36)}`;

  const row = {
    id: `j-${crypto.randomUUID()}`,
    title: d.title,
    slug,
    excerpt: d.excerpt,
    body: d.body,
    tags: d.tags,
    seo: {
      title: `${d.title} | ${BRAND.name}`,
      description: d.seoDescription || d.excerpt,
      keywords: d.keywords,
    },
    published_at: d.publishedAt,
  };

  const { error } = await supabase.from("journal").insert(row);
  if (error) {
    console.error("[admin/journal] insert failed:", error.message);
    return NextResponse.json({ ok: false, error: "Could not save the post." }, { status: 500 });
  }

  revalidatePath("/journal");
  revalidatePath(`/journal/${slug}`);
  return NextResponse.json({ ok: true, slug });
}
