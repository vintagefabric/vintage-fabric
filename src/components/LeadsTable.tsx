"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Lead } from "@/lib/types";

/** CSV-escape a single cell. */
function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

const COLUMNS: { key: keyof Lead; label: string }[] = [
  { key: "createdAt", label: "Date" },
  { key: "type", label: "Type" },
  { key: "name", label: "Name" },
  { key: "company", label: "Company" },
  { key: "country", label: "Country" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "status", label: "Status" },
  { key: "message", label: "Message" },
];

type Status = NonNullable<Lead["status"]>;
const STATUSES: Status[] = ["new", "contacted", "won", "lost"];

/** Colour per pipeline stage, so the list can be scanned at a glance. */
const STATUS_STYLE: Record<Status, string> = {
  new: "bg-gold/20 text-wine ring-1 ring-gold/40",
  contacted: "bg-wine/10 text-wine ring-1 ring-wine/20",
  won: "bg-green-100 text-green-800 ring-1 ring-green-300",
  lost: "bg-ink/10 text-ink-soft ring-1 ring-ink/15",
};

/** Digits-only phone for tel:/wa.me links. Returns "" when unusable. */
function phoneDigits(phone?: string): string {
  if (!phone) return "";
  const d = phone.replace(/[^\d]/g, "");
  return d.length >= 10 ? d : "";
}

function formatDate(iso?: string): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Relative age ("2h ago") so new inquiries stand out. */
function timeAgo(iso?: string): string {
  if (!iso) return "";
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}

export function LeadsTable({ leads, configured }: { leads: Lead[]; configured: boolean }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | Lead["type"]>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    for (const s of STATUSES) c[s] = leads.filter((l) => (l.status ?? "new") === s).length;
    return c;
  }, [leads]);

  const visible = useMemo(
    () =>
      leads.filter(
        (l) =>
          (filter === "all" || (l.status ?? "new") === filter) &&
          (typeFilter === "all" || l.type === typeFilter),
      ),
    [leads, filter, typeFilter],
  );

  async function setStatus(id: string, status: Status) {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Could not update the inquiry.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Delete the inquiry from ${name}? This cannot be undone.`)) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch("/api/admin/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Could not delete the inquiry.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusyId(null);
    }
  }

  function exportCsv() {
    const header = COLUMNS.map((c) => csvCell(c.label)).join(",");
    const rows = visible.map((l) =>
      COLUMNS.map((c) => {
        if (c.key === "createdAt" && l.createdAt) {
          return csvCell(new Date(l.createdAt).toISOString());
        }
        if (c.key === "message") {
          return csvCell(
            [l.message, (l.interestedRefs ?? []).join("; ")].filter(Boolean).join(" | "),
          );
        }
        return csvCell(l[c.key]);
      }).join(","),
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vintage-fabric-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl">Inquiries</h2>
          <p className="mt-1 text-sm text-ink-soft">
            {counts.new} new · {leads.length} total
          </p>
        </div>
        <button onClick={exportCsv} disabled={visible.length === 0} className="btn-outline !py-2">
          Export CSV
        </button>
      </div>

      {!configured && (
        <p className="mt-6 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-wine">
          Supabase isn&apos;t configured, so stored inquiries can&apos;t be shown.
        </p>
      )}

      {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {/* Filters */}
      {leads.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                filter === s ? "bg-wine text-ivory" : "bg-wine/10 text-wine hover:bg-wine/20"
              }`}
            >
              {s} ({counts[s] ?? 0})
            </button>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-line sm:block" />
          {(["all", "inquiry", "catalog"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                typeFilter === t
                  ? "bg-gold text-ink"
                  : "border border-gold/40 text-gold-dark hover:bg-gold/10"
              }`}
            >
              {t === "catalog" ? "catalogue" : t}
            </button>
          ))}
        </div>
      )}

      {/* Empty states */}
      {leads.length === 0 && configured && (
        <div className="mt-8 rounded-2xl border border-dashed border-gold/40 bg-cream/40 p-10 text-center">
          <h3 className="text-xl">No inquiries yet</h3>
          <div className="rule-gold mx-auto mt-3" />
          <p className="mx-auto mt-4 max-w-md text-sm text-ink-soft">
            When a buyer sends an inquiry or requests the catalogue, it will appear here with their
            details, so you can reply on WhatsApp or by email straight from this page.
          </p>
        </div>
      )}

      {leads.length > 0 && visible.length === 0 && (
        <p className="mt-8 rounded-xl border border-line bg-white px-4 py-6 text-center text-sm text-ink-soft">
          No inquiries match this filter.
        </p>
      )}

      {/* Lead cards */}
      <div className="mt-6 space-y-4">
        {visible.map((l, i) => {
          const id = l.id ?? String(i);
          const status = (l.status ?? "new") as Status;
          const wa = phoneDigits(l.phone);
          const busy = busyId === id;
          return (
            <article
              key={id}
              className={`rounded-2xl border bg-white p-5 shadow-card transition-opacity ${
                status === "new" ? "border-gold/50" : "border-ink/10"
              } ${busy ? "opacity-60" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-medium text-ink">{l.name}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLE[status]}`}
                    >
                      {status}
                    </span>
                    <span className="rounded-full bg-cream-dark px-2 py-0.5 text-xs text-ink-soft">
                      {l.type === "catalog" ? "Catalogue request" : "Inquiry"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">
                    {[l.company, l.country].filter(Boolean).join(" · ") || "No company given"}
                  </p>
                </div>
                <div className="text-right text-xs text-ink-soft">
                  <div>{timeAgo(l.createdAt)}</div>
                  <div className="mt-0.5">{formatDate(l.createdAt)}</div>
                </div>
              </div>

              {(l.message || (l.interestedRefs?.length ?? 0) > 0) && (
                <div className="mt-4 rounded-lg bg-cream/60 px-4 py-3">
                  {l.message && <p className="whitespace-pre-wrap text-sm text-ink">{l.message}</p>}
                  {(l.interestedRefs?.length ?? 0) > 0 && (
                    <p className="mt-2 text-xs text-ink-soft">
                      Interested in: {l.interestedRefs!.join(", ")}
                    </p>
                  )}
                </div>
              )}

              {/* Quick contact */}
              <div className="mt-4 flex flex-wrap gap-2">
                {wa && (
                  <a
                    href={`https://wa.me/${wa}?text=${encodeURIComponent(
                      `Hello ${l.name}, thank you for your inquiry to Vintage Fabric.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:brightness-95"
                  >
                    WhatsApp
                  </a>
                )}
                <a
                  href={`mailto:${l.email}?subject=${encodeURIComponent(
                    "Your inquiry to Vintage Fabric",
                  )}`}
                  className="rounded-full bg-wine px-4 py-2 text-sm font-medium text-ivory hover:bg-wine-dark"
                >
                  Email
                </a>
                {wa && (
                  <a
                    href={`tel:+${wa}`}
                    className="rounded-full border border-wine/30 px-4 py-2 text-sm font-medium text-wine hover:bg-wine/10"
                  >
                    Call
                  </a>
                )}
                <span className="hidden items-center text-xs text-ink-soft sm:flex">
                  {l.email}
                  {l.phone ? ` · ${l.phone}` : ""}
                </span>
              </div>

              {/* Pipeline */}
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                <span className="text-xs uppercase tracking-wide text-ink-soft">Mark as</span>
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    disabled={busy || s === status}
                    onClick={() => l.id && setStatus(l.id, s)}
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                      s === status
                        ? "cursor-default bg-wine text-ivory"
                        : "bg-ink/5 text-ink-soft hover:bg-wine/10 hover:text-wine"
                    }`}
                  >
                    {s}
                  </button>
                ))}
                <button
                  disabled={busy}
                  onClick={() => l.id && remove(l.id, l.name)}
                  className="ml-auto rounded-full px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
