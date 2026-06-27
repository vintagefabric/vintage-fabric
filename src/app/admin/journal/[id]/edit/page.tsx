import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { getJournalPostById } from "@/lib/data";
import { AdminNav } from "@/components/AdminNav";
import { AddJournalForm } from "@/components/AddJournalForm";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "Edit journal post", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditJournalPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin");
  const { id } = await params;
  const post = await getJournalPostById(id);
  if (!post) notFound();

  return (
    <div className="container-vf py-12">
      <AdminNav />
      <div className="max-w-3xl">
        <Link href="/admin/journal" className="text-sm text-wine hover:text-gold-dark">
          ← Back to journal
        </Link>
        <div className="mt-3">
          <SectionHeading eyebrow="Journal" title="Edit post" />
        </div>
        <div className="mt-8">
          <AddJournalForm post={post} />
        </div>
      </div>
    </div>
  );
}
