"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";

const inputClass =
  "mt-1 w-full rounded-lg border border-ink/20 bg-white px-3 py-2.5 text-ink " +
  "shadow-sm focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine";
const fileClass =
  "mt-1 block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 " +
  "file:bg-wine file:px-4 file:py-2 file:text-sm file:font-medium file:text-ivory hover:file:bg-wine-dark";

/** Create a new catalogue series (collection). */
export function AddSeriesForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("working");
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const title = String(fd.get("title") || "").trim();
    const description = String(fd.get("description") || "").trim();
    const statusVal = String(fd.get("status") || "published");
    const hero = fd.get("hero") as File | null;

    if (!hero || hero.size === 0) {
      setError("A cover image is required.");
      setStatus("error");
      return;
    }

    try {
      setProgress("Uploading cover image…");
      const heroImage = await uploadToCloudinary(hero);

      setProgress("Saving series…");
      const res = await fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, heroImage, status: statusVal }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Could not save the series.");

      form.reset();
      setStatus("done");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-white p-8 text-center shadow-card">
        <h2 className="text-2xl">Series created</h2>
        <div className="rule-gold mx-auto mt-3" />
        <p className="mt-4 text-ink-soft">It's now available when adding designs.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => setStatus("idle")} className="btn-primary">Add another</button>
          <Link href="/admin/designs/new" className="btn-outline">Add a design</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card sm:p-8">
      <label className="block text-sm">
        <span className="font-medium text-ink">Series name *</span>
        <input name="title" required className={inputClass} placeholder="e.g. SUNSHINE" />
      </label>
      <label className="mt-5 block text-sm">
        <span className="font-medium text-ink">Description</span>
        <textarea name="description" rows={3} className={inputClass} placeholder="A short description of the series." />
      </label>
      <label className="mt-5 block text-sm">
        <span className="font-medium text-ink">Cover image *</span>
        <input type="file" name="hero" accept="image/*" required className={fileClass} />
      </label>
      <label className="mt-5 block text-sm">
        <span className="font-medium text-ink">Status</span>
        <select name="status" defaultValue="published" className={inputClass}>
          <option value="published">Published (visible on site)</option>
          <option value="draft">Draft (hidden)</option>
        </select>
      </label>

      {status === "error" && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {status === "working" && progress && (
        <p className="mt-4 rounded-lg bg-gold/10 px-4 py-3 text-sm text-wine">{progress}</p>
      )}

      <button type="submit" disabled={status === "working"} className="btn-primary mt-6 w-full sm:w-auto">
        {status === "working" ? "Saving…" : "Create series"}
      </button>
    </form>
  );
}
