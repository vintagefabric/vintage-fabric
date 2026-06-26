/**
 * Optional Supabase clients. The site works without Supabase (it falls back to
 * local seed data and console-logs leads); these helpers only activate when the
 * relevant env vars are present.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

/** True when the server can write leads / read the admin list. */
export const isSupabaseAdminConfigured = Boolean(url && serviceKey);

/** Public (anon) client, safe for read-only use. Null when unconfigured. */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}

/**
 * Server-only client using the service-role key. NEVER import this into a
 * client component. Null when unconfigured.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
