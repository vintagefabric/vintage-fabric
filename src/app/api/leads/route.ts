import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadSchema } from "@/lib/leads";
import { getSupabaseAdmin } from "@/lib/supabase";
import { BRAND, WHATSAPP } from "@/lib/brand";

/**
 * POST /api/leads
 * Validates → (Supabase insert if configured) → (Resend email if configured)
 * → returns a WhatsApp deep link to the office/Accounts number (plan §7).
 *
 * Works with zero services configured: it validates and logs the lead so the
 * form flow is fully testable locally.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Spam check: honeypot field must be empty.
  if (data.website && data.website.length > 0) {
    // Pretend success so bots don't learn anything.
    return NextResponse.json({ ok: true, whatsapp: WHATSAPP.link });
  }

  const lead = {
    type: data.type,
    name: data.name,
    company: data.company || null,
    country: data.country || null,
    email: data.email,
    phone: data.phone || null,
    message: data.message || null,
    interested_refs: [data.interest, data.ref].filter(Boolean) as string[],
    source: data.type === "catalog" ? "catalog-form" : "inquiry-form",
    status: "new" as const,
    created_at: new Date().toISOString(),
  };

  // 1) Persist to Supabase (if configured).
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("leads").insert(lead);
    if (error) {
      console.error("[leads] Supabase insert failed:", error.message);
      return NextResponse.json(
        { ok: false, error: "Could not save your inquiry. Please try WhatsApp or email." },
        { status: 500 },
      );
    }
  } else {
    console.log("[leads] (no Supabase configured) lead received:", lead);
  }

  // 2) Notify by email (if Resend configured).
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const to = process.env.LEADS_TO_EMAIL || BRAND.email;
      const from = process.env.LEADS_FROM_EMAIL || "inquiries@vintagefabric.in";
      await resend.emails.send({
        from: `Vintage Fabric <${from}>`,
        to,
        replyTo: data.email,
        subject: `New ${data.type}, ${data.name}${data.company ? ` (${data.company})` : ""}`,
        text: [
          `Type: ${data.type}`,
          `Name: ${data.name}`,
          `Company: ${data.company || "-"}`,
          `Country: ${data.country || "-"}`,
          `Email: ${data.email}`,
          `Phone: ${data.phone || "-"}`,
          `Interest: ${data.interest || "-"}`,
          `Reference: ${data.ref || "-"}`,
          "",
          "Message:",
          data.message || "-",
        ].join("\n"),
      });
    } catch (err) {
      // Email is best-effort, the lead is already saved.
      console.error("[leads] Resend email failed:", err);
    }
  }

  // 3) Build a prefilled WhatsApp deep link to the Accounts (office) number.
  const waText = `Hello Vintage Fabric, this is ${data.name}${
    data.company ? ` from ${data.company}` : ""
  }. ${data.type === "catalog" ? "I'd like your catalog." : "I have an inquiry."}${
    data.ref ? ` (Ref: ${data.ref})` : ""
  }`;

  return NextResponse.json({ ok: true, whatsapp: WHATSAPP.withText(waText) });
}
