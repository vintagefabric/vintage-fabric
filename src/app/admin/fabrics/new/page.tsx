import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { AdminNav } from "@/components/AdminNav";
import { AddFabricForm } from "@/components/AddFabricForm";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "New fabric type", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function NewFabricPage() {
  if (!(await isAdmin())) redirect("/admin");

  return (
    <div className="container-vf py-12">
      <AdminNav />
      <div className="max-w-3xl">
        <SectionHeading eyebrow="Catalogue" title="New fabric type" />
        <div className="mt-8">
          <AddFabricForm />
        </div>
      </div>
    </div>
  );
}
