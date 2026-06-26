# Vintage Fabric — Showcase Website

A premium, worldwide-facing showcase + lead-capture site for **Vintage Fabric — Mfg. of Quality Fabrics**.
Built per [`VintageFabric_Site_Plan.md`](./VintageFabric_Site_Plan.md). No checkout, no user accounts — it
displays every collection, category and fabric quality, ranks on search, and captures buyer inquiries.

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS**
- **Supabase** (Postgres) for lead storage + a password-gated `/admin` *(optional)*
- **Resend** for inquiry emails *(optional)*
- **Cloudinary** for production images *(optional)*
- Deploys to **Vercel**

> **Runs with zero services configured.** Out of the box the site uses local seed data
> (`src/lib/seed.ts`) and logs leads to the console, so `npm run dev` works immediately.
> Add each service when you're ready (see `.env.example`).

## Run locally

```bash
npm install
cp .env.example .env.local   # optional — site runs without it
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run seed:sql` (regenerates `supabase/seed.sql` from the local seed data).

## Project structure

```
src/
  app/            Routes (home, collections, categories, /c, /quality, catalog,
                  journal, about, inquiry, contact, legal, admin, api/leads)
  components/     Header, Footer, Logo, DesignCard/Gallery, LeadForm, JsonLd, …
  lib/            brand.ts (contacts), seed.ts (content), data.ts (accessors),
                  leads.ts (validation), site.ts (SEO), supabase.ts, types.ts
supabase/         schema.sql + seed.sql (run in the Supabase SQL editor)
public/           favicon, placeholder catalog PDF
```

## Going live — what to wire up

1. **Supabase** — create a project, run `supabase/schema.sql` then `supabase/seed.sql`, and set
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
   Leads then persist and show in `/admin`.
2. **Resend** — set `RESEND_API_KEY`, `LEADS_FROM_EMAIL`, `LEADS_TO_EMAIL` for inquiry emails.
3. **Cloudinary** — upload real photos; set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and replace the
   placeholder `picsum.photos` URLs in `src/lib/seed.ts` with `res.cloudinary.com` URLs.
4. **Admin** — set `ADMIN_PASSWORD`; visit `/admin` to view/export leads (CSV).
5. **Deploy to Vercel** — import the repo, add the env vars, then point `vintagefabric.in`
   (registered at Hostinger) to Vercel via DNS. Set `NEXT_PUBLIC_SITE_URL=https://www.vintagefabric.in`.

## Contact rule (important)

Public contact = **Sales + Accounts numbers only**, defined once in `src/lib/brand.ts`.
The WhatsApp / "chat with us" button always uses the **Accounts (office)** number `+91-88495 78658`
(`wa.me/918849578658`). The owners' personal numbers are **never** displayed.

## Still needed from you (plan §11)

- ~~Real **logo** file~~ ✅ installed at `public/logo.png` (original high-res kept at `public/logo-source.png`).
- Real **design photos** + details to replace the seeded placeholders.
- The real **catalog PDF** → `public/catalog/vintage-fabric-catalog.pdf`.
- Confirm which series to publish; DNS access for `vintagefabric.in`.
```
