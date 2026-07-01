"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type AdminSeriesRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  heroImage: string;
  designCount: number;
};

/** Admin table of series (collections) with edit + delete. */
export function SeriesAdminList({ rows }: { rows: AdminSeriesRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function remove(row: AdminSeriesRow) {
    if (!confirm(`Delete the "${row.title}" series?`)) return;
    setBusyId(row.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/collections?id=${encodeURIComponent(row.id)}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Could not delete.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete.");
    } finally {
      setBusyId(null);
    }
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ink/20 p-10 text-center">
        <p className="text-ink-soft">No series yet.</p>
        <Link href="/admin/series/new" className="btn-primary mt-4">Create your first series</Link>
      </div>
    );
  }

  return (
    <div>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="overflow-x-auto rounded-xl border border-ink/10 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream-dark text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Series</th>
              <th className="px-4 py-3">Designs</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-ink/5 align-middle">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-cream-dark">
                      {r.heroImage && <Image src={r.heroImage} alt={r.title} fill sizes="64px" className="object-cover" />}
                    </div>
                    <Link href={`/collections/${r.slug}`} target="_blank" className="font-medium text-wine hover:underline">
                      {r.title}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-soft">{r.designCount}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${r.status === "published" ? "bg-green-100 text-green-800" : "bg-gold/20 text-wine"}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/series/${r.id}/edit`} className="rounded-full border border-wine/40 px-3 py-1.5 text-xs font-medium text-wine transition-colors hover:bg-wine/10">
                      Edit
                    </Link>
                    <button
                      onClick={() => remove(r)}
                      disabled={busyId === r.id}
                      className="rounded-full border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      {busyId === r.id ? "…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
