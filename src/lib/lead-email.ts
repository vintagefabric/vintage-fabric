/**
 * Builds the internal "new inquiry" notification email.
 *
 * Kept separate from the API route so the template is easy to read and tweak.
 * HTML uses tables + inline styles, which is what email clients actually
 * render reliably; a plain-text version is always sent alongside it.
 */

import { SITE_URL } from "./site";

/** Brand hexes inlined for email clients (they can't use CSS variables). */
const COLORS = {
  wine: "#702040",
  gold: "#D09030",
  ivory: "#F6F1E4",
  ink: "#2C2A2C",
  cream: "#FBF9F5",
} as const;

export type LeadEmailInput = {
  type: "inquiry" | "catalog";
  name: string;
  company?: string;
  country?: string;
  email: string;
  phone?: string;
  message?: string;
  interest?: string;
  ref?: string;
};

/** Digits-only phone for a wa.me link, or "" when unusable. */
function waDigits(phone?: string): string {
  if (!phone) return "";
  const d = phone.replace(/[^\d]/g, "");
  return d.length >= 10 ? d : "";
}

/** Minimal HTML escaping for values interpolated into the template. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function leadSubject(d: LeadEmailInput): string {
  const kind = d.type === "catalog" ? "Catalogue request" : "New inquiry";
  const who = d.company ? `${d.name} (${d.company})` : d.name;
  const where = d.country ? ` · ${d.country}` : "";
  return `${kind}: ${who}${where}`;
}

export function leadText(d: LeadEmailInput): string {
  return [
    d.type === "catalog" ? "CATALOGUE REQUEST" : "NEW INQUIRY",
    "",
    `Name:      ${d.name}`,
    `Company:   ${d.company || "-"}`,
    `Country:   ${d.country || "-"}`,
    `Email:     ${d.email}`,
    `Phone:     ${d.phone || "-"}`,
    `Interest:  ${d.interest || "-"}`,
    `Reference: ${d.ref || "-"}`,
    "",
    "Message:",
    d.message || "-",
    "",
    "---",
    `Reply directly to this email to reach ${d.name}.`,
    `Manage inquiries: ${SITE_URL}/admin`,
  ].join("\n");
}

export function leadHtml(d: LeadEmailInput): string {
  const kind = d.type === "catalog" ? "Catalogue request" : "New inquiry";
  const wa = waDigits(d.phone);

  const row = (label: string, value: string, link?: string) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #EFE9E1;font:13px/1.4 Arial,sans-serif;color:#6B6569;width:110px;vertical-align:top;">${esc(label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #EFE9E1;font:14px/1.5 Arial,sans-serif;color:${COLORS.ink};vertical-align:top;">
        ${link ? `<a href="${link}" style="color:${COLORS.wine};text-decoration:none;">${esc(value)}</a>` : esc(value)}
      </td>
    </tr>`;

  const button = (href: string, label: string, bg: string, fg: string) => `
    <a href="${href}" style="display:inline-block;margin:0 8px 8px 0;padding:11px 20px;border-radius:999px;background:${bg};color:${fg};font:bold 13px/1 Arial,sans-serif;text-decoration:none;">${esc(label)}</a>`;

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${COLORS.cream};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.cream};padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #E7DFD4;border-radius:14px;overflow:hidden;">

            <!-- Header -->
            <tr>
              <td style="background:${COLORS.wine};padding:22px 26px;">
                <div style="font:bold 17px/1.2 Georgia,serif;color:${COLORS.ivory};letter-spacing:.5px;">VINTAGE FABRIC</div>
                <div style="margin-top:3px;font:12px/1.2 Arial,sans-serif;color:${COLORS.gold};">${esc(kind)}</div>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:26px;">
                <p style="margin:0 0 18px;font:15px/1.5 Arial,sans-serif;color:${COLORS.ink};">
                  <strong>${esc(d.name)}</strong> just sent ${d.type === "catalog" ? "a catalogue request" : "an inquiry"} through the website.
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${row("Name", d.name)}
                  ${row("Company", d.company || "-")}
                  ${row("Country", d.country || "-")}
                  ${row("Email", d.email, `mailto:${d.email}`)}
                  ${row("Phone", d.phone || "-", d.phone ? `tel:${d.phone}` : undefined)}
                  ${d.interest ? row("Interest", d.interest) : ""}
                  ${d.ref ? row("Reference", d.ref) : ""}
                </table>

                ${
                  d.message
                    ? `<div style="margin-top:20px;padding:16px 18px;background:${COLORS.cream};border-radius:10px;">
                         <div style="font:11px/1 Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;color:#6B6569;">Message</div>
                         <div style="margin-top:8px;font:14px/1.6 Arial,sans-serif;color:${COLORS.ink};white-space:pre-wrap;">${esc(d.message)}</div>
                       </div>`
                    : ""
                }

                <div style="margin-top:24px;">
                  ${button(`mailto:${d.email}`, "Reply by email", COLORS.wine, COLORS.ivory)}
                  ${wa ? button(`https://wa.me/${wa}`, "WhatsApp", "#25D366", "#ffffff") : ""}
                  ${button(`${SITE_URL}/admin`, "Open dashboard", "#ffffff", COLORS.wine)}
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:16px 26px;background:${COLORS.cream};border-top:1px solid #E7DFD4;">
                <div style="font:12px/1.5 Arial,sans-serif;color:#6B6569;">
                  Replying to this email goes straight to ${esc(d.name)}.
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
