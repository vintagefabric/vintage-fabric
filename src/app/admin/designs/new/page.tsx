import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { getCollections, getQualities } from "@/lib/data";
import { AddDesignForm } from "@/components/AddDesignForm";
import { AdminNav } from "@/components/AdminNav";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "Add design", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function NewDesignPage() {
  if (!(await isAdmin())) redirect("/admin");

  const [collections, qualities] = await Promise.all([getCollections(), getQualities()]);

  return (
    <div className="container-vf py-12">
      <AdminNav />
      <div className="max-w-3xl">
        <SectionHeading eyebrow="Catalogue" title="Add a design" />

        {!isCloudinaryConfigured && (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Cloudinary isn't configured, so image uploads won't work. Add
            <code className="mx-1">CLOUDINARY_API_KEY</code> and
            <code className="mx-1">CLOUDINARY_API_SECRET</code> to <code>.env.local</code>.
          </p>
        )}

        <div className="mt-8">
          <AddDesignForm
            collections={collections.map((c) => ({ id: c.id, label: c.title }))}
            qualities={qualities.map((q) => ({ id: q.id, label: q.name }))}
          />
        </div>
      </div>
    </div>
  );
}
