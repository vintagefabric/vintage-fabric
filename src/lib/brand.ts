/**
 * Brand + business constants, the single source of truth for everything the
 * site displays publicly.
 *
 * ⚠️ CRITICAL CONTACT RULE (plan §1):
 *   - ONLY the Sales and Accounts numbers below may ever appear on the site.
 *   - The owners' personal numbers must NEVER be displayed anywhere.
 *   - The WhatsApp / "chat with us" button uses the ACCOUNTS (office) number.
 * Keeping these here (and nowhere else) makes that rule easy to enforce.
 */

export const BRAND = {
  name: "Vintage Fabric",
  tagline: "Mfg. of Quality Fabrics",
  website: "www.vintagefabric.in",
  websiteUrl: "https://www.vintagefabric.in",
  email: "vintagefabric666@gmail.com",
  gstin: "24DFNPS5386J1ZN",
  address: {
    line1: "146, 1st Floor, New Cloth Market",
    line2: "Raipur, Ahmedabad-380002",
    region: "Gujarat",
    country: "INDIA",
    full: "146, 1st Floor, New Cloth Market, Raipur, Ahmedabad-380002, Gujarat, INDIA",
  },
} as const;

/** Public phone numbers, these are the ONLY numbers allowed on the site. */
export const PHONES = {
  sales: ["+91-85119 73246", "+91-99983 23246"],
  accounts: "+91-88495 78658",
} as const;

/**
 * WhatsApp / office contact uses the ACCOUNTS (office) number per the plan.
 * Stored in wa.me format (country code + number, digits only).
 */
export const WHATSAPP = {
  number: "918849578658",
  link: "https://wa.me/918849578658",
  /** Build a deep link with a prefilled message. */
  withText(text: string) {
    return `https://wa.me/918849578658?text=${encodeURIComponent(text)}`;
  },
} as const;

/** Brand colours (mirror of the Tailwind tokens) for inline / SVG use. */
export const COLORS = {
  wine: "#702040",
  gold: "#D09030",
  ivory: "#F4F0DC",
  ink: "#2C2A2C",
} as const;
