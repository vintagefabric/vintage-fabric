import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { getAllCollections, getAllDesigns } from "@/lib/data";
import { AdminNav } from "@/components/AdminNav";
import { SeriesAdminList, type AdminSeriesRow } from "@/components/SeriesAdminList";

export const metadata: Metadata = { title: "Series", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminSeriesPage() {
  if (!(await isAdmin())) redirect("/admin");

  const [collections, designs] = await Promise.all([getAllCollections(), getAllDesigns()]);
  const rows: AdminSeriesRow[] = collections.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    status: c.status,
    heroImage: c.heroImage,
    designCount: designs.filter((d) => d.collectionId === c.id).length,
  }));

  return (
    <div className="container-vf py-12">
      <AdminNav />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Series</h1>
          <p className="mt-1 text-sm text-ink-soft">{rows.length} series</p>
        </div>
        <Link href="/admin/series/new" className="btn-gold !py-2">+ New series</Link>
      </div>
      <div className="mt-6">
        <SeriesAdminList rows={rows} />
      </div>
    </div>
  );
}
