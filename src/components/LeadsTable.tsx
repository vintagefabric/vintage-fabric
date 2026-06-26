"use client";

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

export function LeadsTable({ leads, configured }: { leads: Lead[]; configured: boolean }) {
  function exportCsv() {
    const header = COLUMNS.map((c) => csvCell(c.label)).join(",");
    const rows = leads.map((l) =>
      COLUMNS.map((c) => {
        if (c.key === "createdAt" && l.createdAt) {
          return csvCell(new Date(l.createdAt).toISOString());
        }
        if (c.key === "message") {
          return csvCell([l.message, (l.interestedRefs ?? []).join("; ")].filter(Boolean).join(" | "));
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Leads</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {leads.length} {leads.length === 1 ? "lead" : "leads"}
            {!configured && " · showing local/empty data (Supabase not configured)"}
          </p>
        </div>
        <button onClick={exportCsv} disabled={leads.length === 0} className="btn-outline !py-2">
          Export CSV
        </button>
      </div>

      {!configured && (
        <p className="mt-6 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-wine">
          Supabase isn't configured yet, so no stored leads can be shown. Add
          <code className="mx-1 rounded bg-white px-1">NEXT_PUBLIC_SUPABASE_URL</code> and
          <code className="mx-1 rounded bg-white px-1">SUPABASE_SERVICE_ROLE_KEY</code> to
          <code className="mx-1 rounded bg-white px-1">.env.local</code> and run the SQL in
          <code className="mx-1 rounded bg-white px-1">supabase/schema.sql</code>.
        </p>
      )}

      {leads.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-ink/10 bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream-dark text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                {COLUMNS.map((c) => (
                  <th key={String(c.key)} className="whitespace-nowrap px-4 py-3">{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((l, i) => (
                <tr key={l.id ?? i} className="border-t border-ink/5 align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-ink-soft">
                    {l.createdAt ? new Date(l.createdAt).toLocaleString("en-GB") : "-"}
                  </td>
                  <td className="px-4 py-3">{l.type}</td>
                  <td className="px-4 py-3 font-medium text-ink">{l.name}</td>
                  <td className="px-4 py-3">{l.company || "-"}</td>
                  <td className="px-4 py-3">{l.country || "-"}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${l.email}`} className="text-wine hover:underline">{l.email}</a>
                  </td>
                  <td className="px-4 py-3">{l.phone || "-"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs text-wine">
                      {l.status ?? "new"}
                    </span>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-ink-soft">{l.message || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
