"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import type { Quality } from "@/lib/types";

const inputClass =
  "mt-1 w-full rounded-lg border border-ink/20 bg-white px-3 py-2.5 text-ink " +
  "shadow-sm focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine";
const fileClass =
  "mt-1 block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 " +
  "file:bg-wine file:px-4 file:py-2 file:text-sm file:font-medium file:text-ivory hover:file:bg-wine-dark";

/** Create or edit a fabric type (quality). Pass `fabric` to edit. */
export function AddFabricForm({ fabric }: { fabric?: Quality }) {
  const router = useRouter();
  const isEdit = Boolean(fabric);
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("working");
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const fabricType = String(fd.get("fabricType") || "").trim();
    const width = String(fd.get("width") || "").trim();
    const composition = String(fd.get("composition") || "").trim();
    const foil = fd.get("foil") === "on";
    const hero = fd.get("hero") as File | null;

    if (!isEdit && (!hero || hero.size === 0)) {
      setError("A cover image is required.");
      setStatus("error");
      return;
    }

    try {
      let heroImage = fabric?.heroImage ?? "";
      if (hero && hero.size > 0) {
        setProgress("Uploading cover image…");
        heroImage = await uploadToCloudinary(hero);
      }

      setProgress("Saving fabric type…");
      const res = await fetch("/api/admin/qualities", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isEdit ? { id: fabric!.id } : {}),
          name,
          fabricType,
          width,
          composition,
          foil,
          heroImage,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Could not save the fabric type.");

      if (!isEdit) form.reset();
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
        <h2 className="text-2xl">{isEdit ? "Fabric type updated" : "Fabric type created"}</h2>
        <div className="rule-gold mx-auto mt-3" />
        <p className="mt-4 text-ink-soft">It's live on the site.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/admin/fabrics" className="btn-primary">Back to fabrics</Link>
          {!isEdit && <button onClick={() => setStatus("idle")} className="btn-outline">Add another</button>}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-ink">Fabric name *</span>
          <input name="name" required defaultValue={fabric?.name} className={inputClass} placeholder="e.g. 60×60 Cambric Procian" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Fabric type *</span>
          <input name="fabricType" required defaultValue={fabric?.fabricType} className={inputClass} placeholder="e.g. 60×60 Cambric" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Width *</span>
          <input name="width" required defaultValue={fabric?.width} className={inputClass} placeholder={'e.g. 58"'} />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Composition *</span>
          <input name="composition" required defaultValue={fabric?.composition} className={inputClass} placeholder="e.g. 100% Cotton" />
        </label>
      </div>

      <label className="mt-5 flex items-center gap-2 text-sm">
        <input type="checkbox" name="foil" defaultChecked={fabric?.foil} className="h-4 w-4 rounded border-ink/30 text-wine focus:ring-wine" />
        <span className="font-medium text-ink">Foil finish</span>
      </label>

      <div className="mt-5">
        <span className="text-sm font-medium text-ink">Cover image {isEdit ? "(leave blank to keep current)" : "*"}</span>
        {isEdit && fabric?.heroImage && (
          <div className="relative mt-2 h-24 w-32 overflow-hidden rounded-lg border border-line">
            <Image src={fabric.heroImage} alt="Current cover" fill sizes="128px" className="object-cover" />
          </div>
        )}
        <input type="file" name="hero" accept="image/*" required={!isEdit} className={fileClass} />
      </div>

      {status === "error" && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {status === "working" && progress && (
        <p className="mt-4 rounded-lg bg-gold/10 px-4 py-3 text-sm text-wine">{progress}</p>
      )}

      <button type="submit" disabled={status === "working"} className="btn-primary mt-6 w-full sm:w-auto">
        {status === "working" ? "Saving…" : isEdit ? "Save changes" : "Create fabric type"}
      </button>
    </form>
  );
}
