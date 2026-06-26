# Vintage Fabric — Setup Guide

The site runs **without any of these services** (it falls back to local seed data and
logs leads to the console). Add each service when you're ready. Order below is the
recommended one.

All keys go into a file named **`.env.local`** in the project root. Start by copying
the example:

```bash
cp .env.example .env.local
```

After editing `.env.local`, **restart the dev server** (`npm run dev`) so it picks up
the new values.

> Which keys are secret: `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, and
> `ADMIN_PASSWORD` must never be shared or committed. The `NEXT_PUBLIC_*` ones are
> safe to expose (they ship to the browser).

---

## 1. Supabase (database + leads + admin)

Stores inquiries so `/admin` can show them, and (later) holds the design catalog.

1. Go to <https://supabase.com> → sign up → **New project**.
   - Name: `vintage-fabric`
   - Database password: pick a strong one and save it.
   - Region: choose the closest — **Mumbai (ap-south-1)** or Singapore.
2. Wait ~2 minutes for it to provision.
3. Left sidebar → **Project Settings → API**. Copy these into `.env.local`:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (secret) → `SUPABASE_SERVICE_ROLE_KEY`
4. Left sidebar → **SQL Editor → New query**. Paste the contents of
   [`supabase/schema.sql`](../supabase/schema.sql), run it. Then do the same with
   [`supabase/seed.sql`](../supabase/seed.sql).
5. Restart the dev server. Submit a test inquiry — it should now appear in
   Supabase (Table editor → `leads`) and in `/admin`.

---

## 2. Admin password (`/admin`)

Protects the leads dashboard.

- In `.env.local`, set `ADMIN_PASSWORD` to a strong password.
- Visit `/admin`, enter it, and you'll see the leads table with CSV export.

---

## 3. Cloudinary (images)

Hosts the real design photos (free tier is plenty to start).

1. Go to <https://cloudinary.com> → sign up.
2. On the **Dashboard**, copy your **Cloud name** → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
3. For now, upload photos in **Media Library** and copy each image's delivery URL
   (looks like `https://res.cloudinary.com/<cloud-name>/image/upload/v123/your-image.jpg`).
   Those URLs go into the design records (replacing the `picsum.photos` placeholders).
4. (Later) For the in-admin **direct upload** feature, Cloudinary needs an *upload
   preset* — I'll set that up when we build that screen.

`next.config.mjs` already allows `res.cloudinary.com`, so Cloudinary URLs work
immediately.

---

## 4. Resend (inquiry emails)

Emails you each inquiry automatically.

1. Go to <https://resend.com> → sign up.
2. **Domains → Add domain** → `vintagefabric.in`. Resend shows DNS records
   (SPF/DKIM). Add them at **Hostinger** (your domain's DNS). Wait for "Verified".
   - *To test before the domain is verified*, you can use Resend's onboarding
     sender `onboarding@resend.dev` as `LEADS_FROM_EMAIL`.
3. **API Keys → Create API Key** → copy into `RESEND_API_KEY`.
4. In `.env.local` set:
   - `LEADS_FROM_EMAIL` = a sender on the verified domain, e.g. `inquiries@vintagefabric.in`
   - `LEADS_TO_EMAIL` = where inquiries should land, e.g. `vintagefabric666@gmail.com`

Email is best-effort: even if it fails, the lead is still saved to Supabase.

---

## 5. Deploy to Vercel + connect the domain

1. Push this project to a **GitHub** repo.
2. Go to <https://vercel.com> → **Add New → Project** → import the repo.
3. In **Settings → Environment Variables**, add every key from your `.env.local`
   (set `NEXT_PUBLIC_SITE_URL` to `https://www.vintagefabric.in`).
4. **Deploy**. You'll get a `*.vercel.app` URL to test.
5. **Settings → Domains** → add `vintagefabric.in` and `www.vintagefabric.in`.
   Vercel shows the DNS records to set at **Hostinger** (usually an `A` record for
   the apex and a `CNAME` for `www`). Once DNS propagates, the site is live.

---

## Quick reference — every variable

| Variable | Where to get it | Secret? |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | your URL (`http://localhost:3000` / prod domain) | no |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | no |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | no |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | **yes** |
| `RESEND_API_KEY` | Resend → API Keys | **yes** |
| `LEADS_FROM_EMAIL` | a sender on your verified domain | no |
| `LEADS_TO_EMAIL` | where inquiries are delivered | no |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary → Dashboard | no |
| `ADMIN_PASSWORD` | you choose it | **yes** |

You can add these one service at a time — nothing breaks if a service is missing.
