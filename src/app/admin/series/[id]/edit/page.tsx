import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { getCollectionById } from "@/lib/data";
import { AdminNav } from "@/components/AdminNav";
import { AddSeriesForm } from "@/components/AddSeriesForm";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "Edit series", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditSeriesPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin");
  const { id } = await params;
  const series = await getCollectionById(id);
  if (!series) notFound();

  return (
    <div className="container-vf py-12">
      <AdminNav />
      <div className="max-w-3xl">
        <Link href="/admin/series" className="text-sm text-wine hover:text-gold-dark">← Back to series</Link>
        <div className="mt-3">
          <SectionHeading eyebrow="Catalogue" title="Edit series" />
        </div>
        <div className="mt-8">
          <AddSeriesForm series={series} />
        </div>
      </div>
    </div>
  );
}
