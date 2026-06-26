"use client";

import Link from "next/link";
import { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";

type Option = { id: string; label: string };

const inputClass =
  "mt-1 w-full rounded-lg border border-ink/20 bg-white px-3 py-2.5 text-ink " +
  "shadow-sm focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine";
const fileClass =
  "mt-1 block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 " +
  "file:bg-wine file:px-4 file:py-2 file:text-sm file:font-medium file:text-ivory hover:file:bg-wine-dark";

export function AddDesignForm({
  collections,
  qualities,
}: {
  collections: Option[];
  qualities: Option[];
}) {
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [newSlug, setNewSlug] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("working");
    setError("");
    setProgress("");
    const form = e.currentTarget;
    const fd = new FormData(form);

    const title = String(fd.get("title") || "").trim();
    const designNo = String(fd.get("designNo") || "").trim();
    const collectionId = String(fd.get("collectionId") || "");
    const qualityId = String(fd.get("qualityId") || "");
    const description = String(fd.get("description") || "").trim();
    const statusVal = String(fd.get("status") || "published");

    const front = fd.get("front") as File | null;
    if (!front || front.size === 0) {
      setError("A front image is required.");
      setStatus("error");
      return;
    }

    try {
      const view = async (file: File | null, alt: string) =>
        file && file.size > 0 ? { url: await uploadToCloudinary(file), alt } : undefined;

      setProgress("Uploading main image…");
      const images: Record<string, unknown> = {
        front: { url: await uploadToCloudinary(front), alt: title },
      };

      setProgress("Uploading other views…");
      const back = await view(fd.get("back") as File, `${title} back view`);
      const dupatta = await view(fd.get("dupatta") as File, `${title} dupatta`);
      if (back) images.back = back;
      if (dupatta) images.dupatta = dupatta;

      const colourFiles = (fd.getAll("colourways") as File[]).filter((f) => f.size > 0);
      if (colourFiles.length) {
        const colourways = [];
        for (let i = 0; i < colourFiles.length; i++) {
          setProgress(`Uploading colourway ${i + 1} of ${colourFiles.length}…`);
          colourways.push({
            url: await uploadToCloudinary(colourFiles[i]),
            alt: `${title} colourway ${i + 1}`,
          });
        }
        images.colourways = colourways;
      }

      setProgress("Saving design…");
      const res = await fetch("/api/admin/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, designNo, collectionId, qualityId, description, status: statusVal, images }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Could not save the design.");

      setNewSlug(json.slug);
      setStatus("done");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-white p-8 text-center shadow-card">
        <h2 className="text-2xl">Design published</h2>
        <div className="rule-gold mx-auto mt-3" />
        <p className="mt-4 text-ink-soft">It's live on the site and in your catalogue.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {newSlug && (
            <Link href={`/design/${newSlug}`} target="_blank" className="btn-primary">
              View design
            </Link>
          )}
          <button onClick={() => setStatus("idle")} className="btn-outline">
            Add another
          </button>
          <Link href="/admin" className="btn-outline">
            Back to admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-ink">Design title *</span>
          <input name="title" required className={inputClass} placeholder="e.g. SUNSHINE Cambric Co-Ord" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Design no. *</span>
          <input name="designNo" required className={inputClass} placeholder="e.g. Top 507 / Bottom 105" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Series *</span>
          <select name="collectionId" required defaultValue="" className={inputClass}>
            <option value="" disabled>Choose a series…</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Fabric type *</span>
          <select name="qualityId" required defaultValue="" className={inputClass}>
            <option value="" disabled>Choose a fabric…</option>
            {qualities.map((q) => (
              <option key={q.id} value={q.id}>{q.label}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-5 block text-sm">
        <span className="font-medium text-ink">Description</span>
        <textarea name="description" rows={3} className={inputClass} placeholder="A short description of the design." />
      </label>

      <div className="mt-6 rounded-xl border border-line bg-cream p-5">
        <p className="text-sm font-semibold text-ink">Images</p>
        <p className="mt-1 text-xs text-ink-soft">
          Only the main image is required. A single photo of the design is enough.
          Add back, dupatta and colourways only if you have them.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-ink">Main image *</span>
            <input type="file" name="front" accept="image/*" required className={fileClass} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-ink">Back (optional)</span>
            <input type="file" name="back" accept="image/*" className={fileClass} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-ink">Dupatta (optional)</span>
            <input type="file" name="dupatta" accept="image/*" className={fileClass} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-ink">Colourways (optional, multiple)</span>
            <input type="file" name="colourways" accept="image/*" multiple className={fileClass} />
          </label>
        </div>
      </div>

      <label className="mt-5 block text-sm">
        <span className="font-medium text-ink">Status</span>
        <select name="status" defaultValue="published" className={inputClass}>
          <option value="published">Published (visible on site)</option>
          <option value="draft">Draft (hidden)</option>
        </select>
      </label>

      {status === "error" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
      {status === "working" && progress && (
        <p className="mt-4 rounded-lg bg-gold/10 px-4 py-3 text-sm text-wine">{progress}</p>
      )}

      <button type="submit" disabled={status === "working"} className="btn-primary mt-6 w-full sm:w-auto">
        {status === "working" ? "Publishing…" : "Publish design"}
      </button>
    </form>
  );
}
