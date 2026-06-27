/**
 * One-off: replace the Supabase `journal` table with the posts in
 * src/lib/seed.ts (delete all, then insert). Reads Supabase creds from
 * .env.local.  Run:  node --experimental-strip-types scripts/sync-journal.ts
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { journal } from "../src/lib/seed.ts";

function envFromLocal(key: string): string {
  const txt = readFileSync(".env.local", "utf8");
  const line = txt.split(/\r?\n/).find((l) => l.startsWith(`${key}=`));
  if (!line) throw new Error(`Missing ${key} in .env.local`);
  return line.slice(key.length + 1).trim();
}

const url = envFromLocal("NEXT_PUBLIC_SUPABASE_URL");
const key = envFromLocal("SUPABASE_SERVICE_ROLE_KEY");
const sb = createClient(url, key, { auth: { persistSession: false } });

const rows = journal.map((p) => ({
  id: p.id,
  title: p.title,
  slug: p.slug,
  excerpt: p.excerpt,
  body: p.body,
  tags: p.tags,
  seo: p.seo ?? null,
  published_at: p.publishedAt,
}));

const del = await sb.from("journal").delete().neq("id", "__never__");
if (del.error) throw del.error;
const ins = await sb.from("journal").insert(rows);
if (ins.error) throw ins.error;

console.log(`Synced ${rows.length} journal posts to Supabase.`);
