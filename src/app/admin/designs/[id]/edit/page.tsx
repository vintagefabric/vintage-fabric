import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { getAllCollections, getDesignById, getQualities } from "@/lib/data";
import { AdminNav } from "@/components/AdminNav";
import { AddDesignForm } from "@/components/AddDesignForm";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "Edit design", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditDesignPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin");
  const { id } = await params;
  const [design, collections, qualities] = await Promise.all([
    getDesignById(id),
    getAllCollections(),
    getQualities(),
  ]);
  if (!design) notFound();

  return (
    <div className="container-vf py-12">
      <AdminNav />
      <div className="max-w-3xl">
        <Link href="/admin/designs" className="text-sm text-wine hover:text-gold-dark">
          ← Back to designs
        </Link>
        <div className="mt-3">
          <SectionHeading eyebrow="Catalogue" title="Edit design" />
        </div>
        <div className="mt-8">
          <AddDesignForm
            design={design}
            collections={collections.map((c) => ({ id: c.id, label: c.title }))}
            qualities={qualities.map((q) => ({ id: q.id, label: q.name }))}
          />
        </div>
      </div>
    </div>
  );
}
