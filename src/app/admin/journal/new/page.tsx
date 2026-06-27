import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { AdminNav } from "@/components/AdminNav";
import { AddJournalForm } from "@/components/AddJournalForm";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "New journal post", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function NewJournalPage() {
  if (!(await isAdmin())) redirect("/admin");

  return (
    <div className="container-vf py-12">
      <AdminNav />
      <div className="max-w-3xl">
        <SectionHeading eyebrow="Journal" title="New journal post" />
        <div className="mt-8">
          <AddJournalForm />
        </div>
      </div>
    </div>
  );
}
