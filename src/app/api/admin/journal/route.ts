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

/** PATCH /api/admin/journal — edit an existing post (slug stays the same). */
export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase not configured." }, { status: 500 });
  }

  const editSchema = schema.extend({ id: z.string().trim().min(1) });
  const parsed = editSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const d = parsed.data;

  const { data: existing } = await supabase.from("journal").select("slug").eq("id", d.id).single();
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Post not found." }, { status: 404 });
  }

  const { error } = await supabase
    .from("journal")
    .update({
      title: d.title,
      excerpt: d.excerpt,
      body: d.body,
      tags: d.tags,
      seo: {
        title: `${d.title} | ${BRAND.name}`,
        description: d.seoDescription || d.excerpt,
        keywords: d.keywords,
      },
      published_at: d.publishedAt,
    })
    .eq("id", d.id);
  if (error) {
    return NextResponse.json({ ok: false, error: "Could not update the post." }, { status: 500 });
  }

  revalidatePath("/journal");
  revalidatePath(`/journal/${existing.slug}`);
  return NextResponse.json({ ok: true, slug: existing.slug });
}

/** DELETE /api/admin/journal?id=... — remove a post. */
export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase not configured." }, { status: 500 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "Missing id." }, { status: 400 });

  const { error } = await supabase.from("journal").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, error: "Could not delete." }, { status: 500 });
  }
  revalidatePath("/journal");
  return NextResponse.json({ ok: true });
}
