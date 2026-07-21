import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadHtml, leadSubject, leadText } from "@/lib/lead-email";
import { leadSchema } from "@/lib/leads";

/** Resend's shared sender, usable without any domain verification. */
const FALLBACK_FROM = "onboarding@resend.dev";
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

  // 2) Notify by email (if Resend is configured).
  //    Best-effort on purpose: the lead is already saved above, so a mail
  //    outage must never cost us the inquiry or fail the visitor's request.
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const to = process.env.LEADS_TO_EMAIL || BRAND.email;
      // A custom sender (inquiries@vintagefabric.in) needs its domain verified
      // in Resend; FALLBACK_FROM always works, so it is both the default and
      // the retry sender.
      const from = process.env.LEADS_FROM_EMAIL || FALLBACK_FROM;
      const payload = {
        type: data.type,
        name: data.name,
        company: data.company,
        country: data.country,
        email: data.email,
        phone: data.phone,
        message: data.message,
        interest: data.interest,
        ref: data.ref,
      };

      const send = (sender: string) =>
        resend.emails.send({
          from: `Vintage Fabric <${sender}>`,
          to,
          replyTo: data.email,
          subject: leadSubject(payload),
          text: leadText(payload),
          html: leadHtml(payload),
        });

      // Resend reports delivery problems in the response, not by throwing.
      const { error } = await send(from);

      if (error) {
        console.error("[leads] Resend rejected the notification:", error);
        // A custom sender only works once its domain is verified in Resend.
        // Fall back to the always-available sender so an inquiry is never
        // missed while DNS is still propagating.
        if (from !== FALLBACK_FROM) {
          console.warn(`[leads] Retrying notification from ${FALLBACK_FROM}.`);
          const retry = await send(FALLBACK_FROM);
          if (retry.error) {
            console.error("[leads] Fallback notification also failed:", retry.error);
          }
        }
      }
    } catch (err) {
      console.error("[leads] Notification email failed to send:", err);
    }
  } else {
    console.warn("[leads] RESEND_API_KEY not set, skipping notification email.");
  }

  // 3) Build a prefilled WhatsApp deep link to the Accounts (office) number.
  const waText = `Hello Vintage Fabric, this is ${data.name}${
    data.company ? ` from ${data.company}` : ""
  }. ${data.type === "catalog" ? "I'd like your catalogue." : "I have an inquiry."}${
    data.ref ? ` (Ref: ${data.ref})` : ""
  }`;

  return NextResponse.json({ ok: true, whatsapp: WHATSAPP.withText(waText) });
}
