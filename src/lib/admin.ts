import { cookies } from "next/headers";

/**
 * Server-side admin gate. Returns true when the request carries a valid
 * `vf_admin` cookie matching ADMIN_PASSWORD. Use in admin pages and admin API
 * routes before doing anything privileged.
 */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get("vf_admin")?.value;
  return Boolean(token && process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD);
}
