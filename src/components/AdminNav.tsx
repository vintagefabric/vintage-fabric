"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Leads" },
  { href: "/admin/designs", label: "Designs" },
  { href: "/admin/designs/new", label: "Add design" },
  { href: "/admin/series/new", label: "New series" },
  { href: "/admin/fabrics/new", label: "New fabric" },
  { href: "/admin/journal/new", label: "New journal" },
];

/** Shared admin navigation + sign out, shown on every authed admin page. */
export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="mb-8 flex items-center gap-2 border-b border-line pb-4">
      <nav className="no-scrollbar flex flex-1 gap-1 overflow-x-auto" aria-label="Admin">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                active ? "bg-wine text-ivory" : "text-wine hover:bg-wine/10"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <button onClick={logout} className="btn-outline shrink-0 !px-4 !py-2">
        Sign out
      </button>
    </div>
  );
}
