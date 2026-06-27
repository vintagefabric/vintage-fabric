"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { JournalPost } from "@/lib/types";

const inputClass =
  "mt-1 w-full rounded-lg border border-ink/20 bg-white px-3 py-2.5 text-ink " +
  "shadow-sm focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine";

const today = new Date().toISOString().slice(0, 10);

/** Create or edit a journal post (admin only). Pass `post` to edit. */
export function AddJournalForm({ post }: { post?: JournalPost }) {
  const router = useRouter();
  const isEdit = Boolean(post);
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [slug, setSlug] = useState<string | null>(post?.slug ?? null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("working");
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);

    const toList = (v: FormDataEntryValue | null) =>
      String(v || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const payload: Record<string, unknown> = {
      title: String(fd.get("title") || "").trim(),
      excerpt: String(fd.get("excerpt") || "").trim(),
      body: String(fd.get("body") || "").trim(),
      tags: toList(fd.get("tags")),
      keywords: toList(fd.get("keywords")),
      publishedAt: String(fd.get("publishedAt") || today),
      seoDescription: String(fd.get("seoDescription") || "").trim(),
    };
    if (isEdit && post) payload.id = post.id;

    try {
      const res = await fetch("/api/admin/journal", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Could not save the post.");
      setSlug(json.slug);
      setStatus("done");
      if (!isEdit) form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-white p-8 text-center shadow-card">
        <h2 className="text-2xl">{isEdit ? "Post updated" : "Post published"}</h2>
        <div className="rule-gold mx-auto mt-3" />
        <p className="mt-4 text-ink-soft">It's live in the Journal.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {slug && (
            <Link href={`/journal/${slug}`} target="_blank" className="btn-primary">
              View post
            </Link>
          )}
          <Link href="/admin/journal" className="btn-outline">Back to journal</Link>
          {!isEdit && (
            <button onClick={() => setStatus("idle")} className="btn-outline">Add another</button>
          )}
        </div>
      </div>
    );
  }

  const kw = post?.seo?.keywords?.join(", ") ?? "";

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card sm:p-8">
      <label className="block text-sm">
        <span className="font-medium text-ink">Title *</span>
        <input name="title" required defaultValue={post?.title} className={inputClass} placeholder="e.g. Caring for Foil Print Fabrics" />
      </label>

      <label className="mt-5 block text-sm">
        <span className="font-medium text-ink">Excerpt * (short summary on the journal card)</span>
        <textarea name="excerpt" required rows={2} defaultValue={post?.excerpt} className={inputClass} placeholder="One or two sentences that tease the post." />
      </label>

      <label className="mt-5 block text-sm">
        <span className="font-medium text-ink">Body *</span>
        <textarea
          name="body"
          required
          rows={14}
          defaultValue={post?.body}
          className={`${inputClass} font-sans`}
          placeholder={"Write the full post here.\n\nSeparate paragraphs with a blank line.\n\nWrap **a phrase** in double asterisks to make it bold."}
        />
        <span className="mt-1 block text-xs text-ink-soft">
          Separate paragraphs with a blank line. Use **text** for bold.
        </span>
      </label>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-ink">Tags (comma separated)</span>
          <input name="tags" defaultValue={post?.tags.join(", ")} className={inputClass} placeholder="fabric care, foil print" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Publish date</span>
          <input type="date" name="publishedAt" defaultValue={(post?.publishedAt ?? today).slice(0, 10)} className={inputClass} />
        </label>
      </div>

      <label className="mt-5 block text-sm">
        <span className="font-medium text-ink">SEO keywords (comma separated, optional)</span>
        <input name="keywords" defaultValue={kw} className={inputClass} placeholder="how to wash foil fabric, foil print care" />
      </label>

      <label className="mt-5 block text-sm">
        <span className="font-medium text-ink">SEO description (optional, falls back to the excerpt)</span>
        <textarea name="seoDescription" rows={2} defaultValue={post?.seo?.description} className={inputClass} placeholder="The summary search engines show. Leave blank to reuse the excerpt." />
      </label>

      {status === "error" && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <button type="submit" disabled={status === "working"} className="btn-primary mt-6 w-full sm:w-auto">
        {status === "working" ? "Saving…" : isEdit ? "Save changes" : "Publish post"}
      </button>
    </form>
  );
}
