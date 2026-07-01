import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { z } from "zod";
import { isAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";

const schema = z.object({
  name: z.string().trim().min(2).max(160),
  fabricType: z.string().trim().min(1).max(120),
  width: z.string().trim().min(1).max(40),
  composition: z.string().trim().min(1).max(120),
  foil: z.boolean().default(false),
  heroImage: z.string().url(),
});

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** POST /api/admin/qualities — create a new fabric type (admin only). */
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

  let code = slugify(d.name) || `fabric-${Date.now().toString(36)}`;
  const { data: clash } = await supabase.from("qualities").select("id").eq("code", code).maybeSingle();
  if (clash) code = `${code}-${Date.now().toString(36)}`;

  const row = {
    id: `q-${crypto.randomUUID()}`,
    name: d.name,
    code,
    slug: code,
    fabric_type: d.fabricType,
    width: d.width,
    composition: d.composition,
    foil: d.foil,
    hero_image: d.heroImage,
    category_id: null, // fabric types are browsed on their own, not by garment category
    seo: null,
  };

  const { error } = await supabase.from("qualities").insert(row);
  if (error) {
    console.error("[admin/qualities] insert failed:", error.message);
    return NextResponse.json({ ok: false, error: "Could not save the fabric type." }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/fabrics");
  revalidatePath(`/fabric/${code}`);
  return NextResponse.json({ ok: true, code });
}

const editSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(2).max(160),
  fabricType: z.string().trim().min(1).max(120),
  width: z.string().trim().min(1).max(40),
  composition: z.string().trim().min(1).max(120),
  foil: z.boolean().default(false),
  heroImage: z.string().url().optional().or(z.literal("")), // optional on edit
});

/** PATCH /api/admin/qualities — edit a fabric type (code/slug stay the same). */
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
  const { data: existing } = await supabase.from("qualities").select("code").eq("id", d.id).single();
  if (!existing) return NextResponse.json({ ok: false, error: "Fabric type not found." }, { status: 404 });

  const update: Record<string, unknown> = {
    name: d.name,
    fabric_type: d.fabricType,
    width: d.width,
    composition: d.composition,
    foil: d.foil,
  };
  if (d.heroImage) update.hero_image = d.heroImage;

  const { error } = await supabase.from("qualities").update(update).eq("id", d.id);
  if (error) return NextResponse.json({ ok: false, error: "Could not update." }, { status: 500 });

  revalidatePath("/");
  revalidatePath("/fabrics");
  revalidatePath(`/fabric/${existing.code}`);
  return NextResponse.json({ ok: true, code: existing.code });
}

/** DELETE /api/admin/qualities?id=... — remove a fabric type (blocked if designs use it). */
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
    .eq("quality_id", id);
  if (count && count > 0) {
    return NextResponse.json(
      { ok: false, error: `Can't delete: ${count} design(s) still use this fabric type. Reassign or delete those designs first.` },
      { status: 409 },
    );
  }

  const { error } = await supabase.from("qualities").delete().eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: "Could not delete." }, { status: 500 });

  revalidatePath("/");
  revalidatePath("/fabrics");
  return NextResponse.json({ ok: true });
}
