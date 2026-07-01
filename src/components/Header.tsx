"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoLockup } from "./Logo";
import { WhatsAppButton } from "./WhatsAppButton";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/collections", label: "Collections" },
  { href: "/catalog", label: "Catalogue" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/30 bg-wine text-ivory">
      <div className="container-vf flex h-20 items-center justify-between">
        <Link href="/" aria-label="Vintage Fabric home" onClick={() => setOpen(false)}>
          <LogoLockup light />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm tracking-wide text-ivory/90 transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/inquiry" className="btn-gold !py-2">
            Inquire
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md
                     text-ivory focus:outline-none focus:ring-2 focus:ring-gold"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-gold/30 bg-wine-dark lg:hidden"
          aria-label="Primary mobile"
        >
          <div className="container-vf flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-ivory/90 hover:bg-wine hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-3 px-2">
              <Link href="/inquiry" className="btn-gold w-full" onClick={() => setOpen(false)}>
                Inquire
              </Link>
              <WhatsAppButton className="btn-outline w-full !border-ivory !text-ivory hover:!bg-ivory hover:!text-wine" />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
