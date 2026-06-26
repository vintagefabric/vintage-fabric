import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { getAllDesigns, getCollections, getQualities } from "@/lib/data";
import { AdminNav } from "@/components/AdminNav";
import { DesignsAdminList, type AdminDesignRow } from "@/components/DesignsAdminList";

export const metadata: Metadata = { title: "Designs", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminDesignsPage() {
  if (!(await isAdmin())) redirect("/admin");

  const [designs, collections, qualities] = await Promise.all([
    getAllDesigns(),
    getCollections(),
    getQualities(),
  ]);
  const seriesById = new Map(collections.map((c) => [c.id, c.title]));
  const fabricById = new Map(qualities.map((q) => [q.id, q.name]));

  const rows: AdminDesignRow[] = designs.map((d) => ({
    id: d.id,
    title: d.title,
    slug: d.slug,
    designNo: d.designNo,
    status: d.status,
    frontUrl: d.images?.front?.url ?? "",
    seriesTitle: seriesById.get(d.collectionId) ?? "—",
    fabricName: fabricById.get(d.qualityId) ?? "—",
  }));

  return (
    <div className="container-vf py-12">
      <AdminNav />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Designs</h1>
          <p className="mt-1 text-sm text-ink-soft">{rows.length} total</p>
        </div>
        <Link href="/admin/designs/new" className="btn-gold !py-2">+ Add design</Link>
      </div>
      <div className="mt-6">
        <DesignsAdminList designs={rows} />
      </div>
    </div>
  );
}
