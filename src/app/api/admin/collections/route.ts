import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { z } from "zod";
import { isAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";

const schema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  heroImage: z.string().url(),
  status: z.enum(["published", "draft"]).default("published"),
});

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** POST /api/admin/collections — create a new series (admin only). */
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

  let slug = slugify(d.title) || `series-${Date.now().toString(36)}`;
  const { data: clash } = await supabase.from("collections").select("id").eq("slug", slug).maybeSingle();
  if (clash) slug = `${slug}-${Date.now().toString(36)}`;

  const row = {
    id: `col-${crypto.randomUUID()}`,
    title: d.title,
    slug,
    type: "series",
    hero_image: d.heroImage,
    description: d.description || null,
    status: d.status,
    seo: null,
  };

  const { error } = await supabase.from("collections").insert(row);
  if (error) {
    console.error("[admin/collections] insert failed:", error.message);
    return NextResponse.json({ ok: false, error: "Could not save the series." }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath(`/collections/${slug}`);
  return NextResponse.json({ ok: true, slug });
}

const editSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  status: z.enum(["published", "draft"]).default("published"),
  heroImage: z.string().url().optional().or(z.literal("")), // optional on edit
});

/** PATCH /api/admin/collections — edit a series (slug stays the same). */
export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase not configured." }, { status: 500 });
  }
  const parsed = editSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Validation failed." }, { status: 422 });
  }
  const d = parsed.data;
  const { data: existing } = await supabase.from("collections").select("slug").eq("id", d.id).single();
  if (!existing) return NextResponse.json({ ok: false, error: "Series not found." }, { status: 404 });

  const update: Record<string, unknown> = {
    title: d.title,
    description: d.description || null,
    status: d.status,
  };
  if (d.heroImage) update.hero_image = d.heroImage;

  const { error } = await supabase.from("collections").update(update).eq("id", d.id);
  if (error) return NextResponse.json({ ok: false, error: "Could not update." }, { status: 500 });

  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath(`/collections/${existing.slug}`);
  return NextResponse.json({ ok: true, slug: existing.slug });
}

/** DELETE /api/admin/collections?id=... — remove a series (blocked if designs use it). */
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

  const { count } = await supabase
    .from("designs")
    .select("id", { count: "exact", head: true })
    .eq("collection_id", id);
  if (count && count > 0) {
    return NextResponse.json(
      { ok: false, error: `Can't delete: ${count} design(s) still use this series. Reassign or delete those designs first.` },
      { status: 409 },
    );
  }

  await supabase.from("collection_items").delete().eq("collection_id", id);
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: "Could not delete." }, { status: 500 });

  revalidatePath("/");
  revalidatePath("/collections");
  return NextResponse.json({ ok: true });
}
