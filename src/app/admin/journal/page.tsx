import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { getJournalPosts } from "@/lib/data";
import { AdminNav } from "@/components/AdminNav";
import { JournalAdminList, type AdminJournalRow } from "@/components/JournalAdminList";

export const metadata: Metadata = { title: "Journal", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminJournalPage() {
  if (!(await isAdmin())) redirect("/admin");

  const posts = await getJournalPosts();
  const rows: AdminJournalRow[] = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    publishedAt: p.publishedAt,
    tags: p.tags,
  }));

  return (
    <div className="container-vf py-12">
      <AdminNav />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Journal</h1>
          <p className="mt-1 text-sm text-ink-soft">{rows.length} posts</p>
        </div>
        <Link href="/admin/journal/new" className="btn-gold !py-2">+ New post</Link>
      </div>
      <div className="mt-6">
        <JournalAdminList posts={rows} />
      </div>
    </div>
  );
}
