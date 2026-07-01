import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { getQualityById } from "@/lib/data";
import { AdminNav } from "@/components/AdminNav";
import { AddFabricForm } from "@/components/AddFabricForm";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "Edit fabric type", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditFabricPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin");
  const { id } = await params;
  const fabric = await getQualityById(id);
  if (!fabric) notFound();

  return (
    <div className="container-vf py-12">
      <AdminNav />
      <div className="max-w-3xl">
        <Link href="/admin/fabrics" className="text-sm text-wine hover:text-gold-dark">← Back to fabrics</Link>
        <div className="mt-3">
          <SectionHeading eyebrow="Catalogue" title="Edit fabric type" />
        </div>
        <div className="mt-8">
          <AddFabricForm fabric={fabric} />
        </div>
      </div>
    </div>
  );
}
