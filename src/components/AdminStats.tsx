import Link from "next/link";

export type AdminStat = {
  label: string;
  value: number;
  href: string;
  /** Highlight the card (used for new inquiries needing attention). */
  accent?: boolean;
};

/** At-a-glance counts across the catalogue and inbox, each linking to its page. */
export function AdminStats({ stats }: { stats: AdminStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
      {stats.map((s) => (
        <Link
          key={s.label}
          href={s.href}
          className={`group rounded-xl border p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover ${
            s.accent && s.value > 0
              ? "border-gold/60 bg-gold/10"
              : "border-ink/10 bg-white hover:border-gold/50"
          }`}
        >
          <div
            className={`font-display text-3xl leading-none ${
              s.accent && s.value > 0 ? "text-wine" : "text-ink"
            }`}
          >
            {s.value}
          </div>
          <div className="mt-2 text-xs uppercase tracking-wide text-ink-soft">{s.label}</div>
        </Link>
      ))}
    </div>
  );
}

/** Shortcuts to the things the owner adds most often. */
export function AdminQuickActions() {
  const actions = [
    { href: "/admin/designs/new", label: "Add design" },
    { href: "/admin/series/new", label: "Add series" },
    { href: "/admin/fabrics/new", label: "Add fabric type" },
    { href: "/admin/journal/new", label: "Write journal post" },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className="rounded-full border border-wine/25 bg-white px-4 py-2 text-sm font-medium text-wine transition-colors hover:bg-wine hover:text-ivory"
        >
          {a.label}
        </Link>
      ))}
    </div>
  );
}
