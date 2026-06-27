"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type AdminJournalRow = {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  tags: string[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** Admin table of journal posts with edit + delete. */
export function JournalAdminList({ posts }: { posts: AdminJournalRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function remove(row: AdminJournalRow) {
    if (!confirm(`Delete "${row.title}"? This removes it from the website.`)) return;
    setBusyId(row.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/journal?id=${encodeURIComponent(row.id)}`, {
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

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ink/20 p-10 text-center">
        <p className="text-ink-soft">No posts yet.</p>
        <Link href="/admin/journal/new" className="btn-primary mt-4">Write your first post</Link>
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
              <th className="px-4 py-3">Post</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-ink/5 align-middle">
                <td className="px-4 py-3">
                  <Link href={`/journal/${p.slug}`} target="_blank" className="font-medium text-wine hover:underline">
                    {p.title}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{formatDate(p.publishedAt)}</td>
                <td className="px-4 py-3 text-ink-soft">{p.tags.join(", ")}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/journal/${p.id}/edit`}
                      className="rounded-full border border-wine/40 px-3 py-1.5 text-xs font-medium text-wine transition-colors hover:bg-wine/10"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => remove(p)}
                      disabled={busyId === p.id}
                      className="rounded-full border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      {busyId === p.id ? "Deleting…" : "Delete"}
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
