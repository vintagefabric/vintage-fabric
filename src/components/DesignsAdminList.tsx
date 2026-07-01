"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type AdminDesignRow = {
  id: string;
  title: string;
  slug: string;
  designNo: string;
  status: string;
  frontUrl: string;
  seriesTitle: string;
  fabricName: string;
};

type Tab = "all" | "published" | "draft" | "unpublished";

/** Admin table of all designs with tabs (All / Published / Drafts), publish
 *  toggle, and delete. */
export function DesignsAdminList({ designs }: { designs: AdminDesignRow[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const publishedCount = designs.filter((d) => d.status === "published").length;
  const draftCount = designs.filter((d) => d.status === "draft").length;
  const unpublishedCount = designs.filter((d) => d.status === "unpublished").length;
  const rows = designs.filter((d) => (tab === "all" ? true : d.status === tab));

  async function setStatus(row: AdminDesignRow, status: "published" | "draft" | "unpublished") {
    setBusyId(row.id);
    setError("");
    try {
      const res = await fetch(
        `/api/admin/designs?id=${encodeURIComponent(row.id)}&status=${status}`,
        { method: "PATCH" },
      );
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Could not update.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(row: AdminDesignRow) {
    if (!confirm(`Delete "${row.title}"? This removes it from the website.`)) return;
    setBusyId(row.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/designs?id=${encodeURIComponent(row.id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Could not delete.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete.");
    } finally {
      setBusyId(null);
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: `All (${designs.length})` },
    { key: "published", label: `Published (${publishedCount})` },
    { key: "draft", label: `Drafts (${draftCount})` },
    { key: "unpublished", label: `Unpublished (${unpublishedCount})` },
  ];

  return (
    <div>
      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key ? "bg-wine text-ivory" : "text-wine hover:bg-wine/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink/20 p-10 text-center">
          <p className="text-ink-soft">
            {tab === "draft"
              ? "No drafts pending publish."
              : tab === "unpublished"
                ? "Nothing has been unpublished from the website."
                : "No designs here yet."}
          </p>
          {tab !== "draft" && tab !== "unpublished" && (
            <Link href="/admin/designs/new" className="btn-primary mt-4">Add a design</Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink/10 bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream-dark text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3">Design</th>
                <th className="px-4 py-3">Series</th>
                <th className="px-4 py-3">Fabric</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id} className="border-t border-ink/5 align-middle">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-md bg-cream-dark">
                        {d.frontUrl && (
                          <Image src={d.frontUrl} alt={d.title} fill sizes="44px" className="object-cover" />
                        )}
                      </div>
                      <div>
                        <Link href={`/design/${d.slug}`} target="_blank" className="font-medium text-wine hover:underline">
                          {d.title}
                        </Link>
                        <p className="text-xs text-ink-soft">{d.designNo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{d.seriesTitle}</td>
                  <td className="px-4 py-3 text-ink-soft">{d.fabricName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        d.status === "published"
                          ? "bg-green-100 text-green-800"
                          : d.status === "unpublished"
                            ? "bg-red-100 text-red-700"
                            : "bg-gold/20 text-wine"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/designs/${d.id}/edit`}
                        className="rounded-full border border-wine/40 px-3 py-1.5 text-xs font-medium text-wine transition-colors hover:bg-wine/10"
                      >
                        Edit
                      </Link>
                      {d.status === "published" ? (
                        <button
                          onClick={() => setStatus(d, "unpublished")}
                          disabled={busyId === d.id}
                          className="rounded-full border border-ink/20 px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:bg-ink/5 disabled:opacity-50"
                        >
                          {busyId === d.id ? "…" : "Unpublish"}
                        </button>
                      ) : (
                        <button
                          onClick={() => setStatus(d, "published")}
                          disabled={busyId === d.id}
                          className="rounded-full border border-green-300 px-3 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-50 disabled:opacity-50"
                        >
                          {busyId === d.id ? "…" : "Publish"}
                        </button>
                      )}
                      <button
                        onClick={() => remove(d)}
                        disabled={busyId === d.id}
                        className="rounded-full border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
