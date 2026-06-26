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
