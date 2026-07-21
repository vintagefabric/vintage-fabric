import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";

const patchSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["new", "contacted", "won", "lost"]),
});

const deleteSchema = z.object({ id: z.string().min(1) });

/** PATCH /api/admin/leads — move a lead through the pipeline (admin only). */
export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase not configured." }, { status: 500 });
  }

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { id, status } = parsed.data;
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}

/** DELETE /api/admin/leads — remove a lead (spam, duplicates). Admin only. */
export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase not configured." }, { status: 500 });
  }

  const parsed = deleteSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "A lead id is required." }, { status: 422 });
  }

  const { error } = await supabase.from("leads").delete().eq("id", parsed.data.id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}
