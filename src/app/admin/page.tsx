import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminNav } from "@/components/AdminNav";
import { LeadsTable } from "@/components/LeadsTable";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase";
import type { Lead } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Always render fresh (reads cookie + live leads).
export const dynamic = "force-dynamic";

async function isAuthed() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vf_admin")?.value;
  return Boolean(token && process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD);
}

async function loadLeads(): Promise<Lead[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error || !data) return [];
  // Map DB snake_case → our camelCase Lead shape.
  return data.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    type: r.type as Lead["type"],
    name: r.name as string,
    company: (r.company as string) ?? undefined,
    country: (r.country as string) ?? undefined,
    email: r.email as string,
    phone: (r.phone as string) ?? undefined,
    message: (r.message as string) ?? undefined,
    interestedRefs: (r.interested_refs as string[]) ?? undefined,
    status: (r.status as Lead["status"]) ?? "new",
    createdAt: (r.created_at as string) ?? undefined,
  }));
}

export default async function AdminPage() {
  if (!(await isAuthed())) {
    return (
      <div className="container-vf py-20">
        <AdminLogin />
      </div>
    );
  }

  const leads = await loadLeads();

  return (
    <div className="container-vf py-12">
      <AdminNav />
      <LeadsTable leads={leads} configured={isSupabaseAdminConfigured} />
    </div>
  );
}
