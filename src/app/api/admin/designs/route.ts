import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { z } from "zod";
import { isAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";

const imageView = z.object({ url: z.string().url(), alt: z.string().min(1) });

const designSchema = z.object({
  title: z.string().trim().min(2).max(160),
  designNo: z.string().trim().min(1).max(120),
  collectionId: z.string().trim().min(1),
  qualityId: z.string().trim().min(1),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  status: z.enum(["published", "draft"]).default("published"),
  images: z.object({
    front: imageView,
    back: imageView.optional(),
    neck: imageView.optional(),
    dupatta: imageView.optional(),
    colourways: z.array(imageView).optional(),
  }),
});

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** POST /api/admin/designs — create a design (admin only). */
export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Supabase is not configured on the server." },
      { status: 500 },
    );
  }

  const parsed = designSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const d = parsed.data;

  // Derive the (garment) category from the chosen fabric quality, and grab the
  // quality code + collection slug so we can revalidate their pages.
  const [{ data: quality }, { data: collection }] = await Promise.all([
    supabase.from("qualities").select("code,category_id").eq("id", d.qualityId).single(),
    supabase.from("collections").select("slug").eq("id", d.collectionId).single(),
  ]);
  if (!quality) {
    return NextResponse.json({ ok: false, error: "Unknown fabric quality." }, { status: 422 });
  }

  // Build a unique slug.
  let slug = slugify(`${d.title}-${d.designNo}`) || `design-${Date.now().toString(36)}`;
  const { data: clash } = await supabase.from("designs").select("id").eq("slug", slug).maybeSingle();
  if (clash) slug = `${slug}-${Date.now().toString(36)}`;

  const row = {
    id: `d-${crypto.randomUUID()}`,
    title: d.title,
    slug,
    design_no: d.designNo,
    category_id: quality.category_id,
    quality_id: d.qualityId,
    collection_id: d.collectionId,
    images: d.images,
    description: d.description || null,
    status: d.status,
    seo: null,
  };

  const { error } = await supabase.from("designs").insert(row);
  if (error) {
    console.error("[admin/designs] insert failed:", error.message);
    return NextResponse.json({ ok: false, error: "Could not save the design." }, { status: 500 });
  }

  // Refresh the pages that show this design.
  revalidatePath("/");
  revalidatePath("/fabrics");
  revalidatePath(`/fabric/${quality.code}`);
  if (collection?.slug) revalidatePath(`/collections/${collection.slug}`);
  revalidatePath("/collections");
  revalidatePath(`/design/${slug}`);

  return NextResponse.json({ ok: true, slug });
}

/** PATCH /api/admin/designs?id=...&status=published|draft — change publish state. */
export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase not configured." }, { status: 500 });
  }
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const status = url.searchParams.get("status");
  const allowed = ["published", "draft", "unpublished"];
  if (!id || !status || !allowed.includes(status)) {
    return NextResponse.json({ ok: false, error: "Missing id or status." }, { status: 400 });
  }

  const { error } = await supabase.from("designs").update({ status }).eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, error: "Could not update." }, { status: 500 });
  }
  revalidatePath("/");
  revalidatePath("/fabrics");
  revalidatePath("/collections");
  return NextResponse.json({ ok: true });
}

/** DELETE /api/admin/designs?id=... — remove a design (admin only). */
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

  const { error } = await supabase.from("designs").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, error: "Could not delete." }, { status: 500 });
  }
  revalidatePath("/");
  revalidatePath("/fabrics");
  revalidatePath("/collections");
  return NextResponse.json({ ok: true });
}
