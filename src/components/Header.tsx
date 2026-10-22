"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // A brighter gold keyline appears under the bar once the page scrolls,
  // so the sticky header reads as a deliberate edge over the content.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-wine text-ivory transition-shadow duration-300 ${
        scrolled ? "shadow-[0_10px_28px_-14px_rgba(44,42,44,0.45)]" : ""
      }`}
    >
      <div className="container-vf flex h-20 items-center justify-between">
        <Link href="/" aria-label="Vintage Fabric home" onClick={() => setOpen(false)}>
          <LogoLockup light />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`nav-link text-sm tracking-wide transition-colors duration-300 hover:text-gold ${
                  active ? "text-gold" : "text-ivory/90"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
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
          {/* Three bars that morph into a cross. */}
          <span aria-hidden="true" className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 h-0.5 w-6 rounded-full bg-current transition-transform duration-300 ease-out ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-6 rounded-full bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-6 rounded-full bg-current transition-transform duration-300 ease-out ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          id="mobile-nav"
          className="animate-menu-in border-t border-gold/30 bg-wine-dark lg:hidden"
          aria-label="Primary mobile"
        >
          <div className="container-vf flex flex-col gap-1 py-4">
            {NAV.map((item, i) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  style={{ animationDelay: `${60 + i * 45}ms` }}
                  className={`animate-menu-item rounded-md px-2 py-2 transition-colors hover:bg-wine hover:text-gold ${
                    active ? "text-gold" : "text-ivory/90"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div
              className="animate-menu-item mt-3 flex flex-col gap-3 px-2"
              style={{ animationDelay: `${60 + NAV.length * 45}ms` }}
            >
              <Link href="/inquiry" className="btn-gold w-full" onClick={() => setOpen(false)}>
                Inquire
              </Link>
              <WhatsAppButton className="btn-outline w-full !border-ivory !text-ivory hover:!bg-ivory hover:!text-wine" />
            </div>
          </div>
        </nav>
      )}

      {/* Gold keyline: quiet at the top of the page, brightens on scroll. */}
      <div
        aria-hidden="true"
        className={`h-px w-full transition-opacity duration-300 ${
          scrolled
            ? "bg-gradient-to-r from-gold/20 via-gold to-gold/20 opacity-100"
            : "bg-gold/30 opacity-70"
        }`}
      />
    </header>
  );
}
