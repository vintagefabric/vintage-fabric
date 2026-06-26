import Link from "next/link";
import { breadcrumbJsonLd, JsonLd } from "./JsonLd";

export type Crumb = { name: string; path: string };

/** Visual + structured-data breadcrumb trail. The last crumb is the page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-ink-soft">
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-1.5">
              {last ? (
                <span className="text-ink" aria-current="page">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="hover:text-wine">
                  {c.name}
                </Link>
              )}
              {!last && <span className="text-gold">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
