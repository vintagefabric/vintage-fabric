import Link from "next/link";
import { BRAND, PHONES } from "@/lib/brand";
import { LogoLockup } from "./Logo";
import { WhatsAppButton } from "./WhatsAppButton";
import { MailIcon, PhoneIcon, PinIcon } from "./icons";

/**
 * Site footer, shows the full ALLOWED contact details (plan §1):
 * Sales + Accounts numbers, address, email, website, GSTIN, and a WhatsApp
 * button to the Accounts number. No personal numbers anywhere.
 */
export function Footer() {
  return (
    <footer className="mt-12 bg-wine text-ivory">
      <div className="container-vf grid gap-12 py-14 md:grid-cols-3">
        {/* Brand */}
        <div>
          <LogoLockup light />
          <p className="mt-4 max-w-xs text-sm text-ivory/80">
            {BRAND.tagline}. Premium printed & foil fabrics for kurti, dress,
            co-ord and 3-piece sets, made in India and shipped worldwide.
          </p>
          <div className="mt-6">
            <WhatsAppButton />
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-ivory">Contact</h3>
          <div className="rule-gold mt-3" />
          <ul className="mt-5 space-y-4 text-sm text-ivory/90">
            <li className="flex gap-3">
              <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <span>
                {BRAND.address.line1}
                <br />
                {BRAND.address.line2}, {BRAND.address.region}, {BRAND.address.country}
              </span>
            </li>
            <li className="flex gap-3">
              <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <span>
                <span className="block text-ivory/70">Sales</span>
                {PHONES.sales.map((p) => (
                  <a
                    key={p}
                    href={`tel:${p.replace(/[^+\d]/g, "")}`}
                    className="block hover:text-gold"
                  >
                    {p}
                  </a>
                ))}
                <span className="mt-2 block text-ivory/70">Accounts / Office</span>
                <a
                  href={`tel:${PHONES.accounts.replace(/[^+\d]/g, "")}`}
                  className="block hover:text-gold"
                >
                  {PHONES.accounts}
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <a href={`mailto:${BRAND.email}`} className="hover:text-gold">
                {BRAND.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Explore + legal */}
        <div>
          <h3 className="text-ivory">Explore</h3>
          <div className="rule-gold mt-3" />
          <ul className="mt-5 grid grid-cols-2 gap-2 text-sm text-ivory/90">
            <li><Link href="/" className="hover:text-gold">Home</Link></li>
            <li><Link href="/about" className="hover:text-gold">About</Link></li>
            <li><Link href="/collections" className="hover:text-gold">Collections</Link></li>
            <li><Link href="/catalog" className="hover:text-gold">Catalogue</Link></li>
            <li><Link href="/journal" className="hover:text-gold">Journal</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link href="/inquiry" className="hover:text-gold">Inquiry</Link></li>
            <li><Link href="/legal/privacy" className="hover:text-gold">Privacy</Link></li>
            <li><Link href="/legal/terms" className="hover:text-gold">Terms</Link></li>
            <li><Link href="/legal/export-policy" className="hover:text-gold">Export Policy</Link></li>
          </ul>
          <p className="mt-6 text-xs text-ivory/70">
            GSTIN: {BRAND.gstin}
            <br />
            {BRAND.website}
          </p>
        </div>
      </div>

      <div className="border-t border-gold/20">
        <div className="container-vf flex flex-col items-center justify-between gap-2 py-5 text-xs text-ivory/70 sm:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p>{BRAND.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
