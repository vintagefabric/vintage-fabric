import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { getAllDesigns, getQualities } from "@/lib/data";
import { AdminNav } from "@/components/AdminNav";
import { FabricsAdminList, type AdminFabricRow } from "@/components/FabricsAdminList";

export const metadata: Metadata = { title: "Fabrics", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminFabricsPage() {
  if (!(await isAdmin())) redirect("/admin");

  const [qualities, designs] = await Promise.all([getQualities(), getAllDesigns()]);
  const rows: AdminFabricRow[] = qualities.map((q) => ({
    id: q.id,
    name: q.name,
    code: q.code,
    fabricType: q.fabricType,
    width: q.width,
    foil: q.foil,
    heroImage: q.heroImage,
    designCount: designs.filter((d) => d.qualityId === q.id).length,
  }));

  return (
    <div className="container-vf py-12">
      <AdminNav />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Fabric types</h1>
          <p className="mt-1 text-sm text-ink-soft">{rows.length} fabric types</p>
        </div>
        <Link href="/admin/fabrics/new" className="btn-gold !py-2">+ New fabric</Link>
      </div>
      <div className="mt-6">
        <FabricsAdminList rows={rows} />
      </div>
    </div>
  );
}
