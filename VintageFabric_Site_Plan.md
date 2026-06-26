# Vintage Fabric — Website Build Plan (Stage 1, build-ready)

> The first build: a premium, worldwide-facing showcase for the fabrics Vintage Fabric makes. No checkout — the goal is to display every quality beautifully, rank on Google/AI search, and capture buyer inquiries. Written to hand straight to Claude Code: drop this file in the repo (e.g. as `CLAUDE.md` or `docs/PLAN.md`) and say "build the site following this plan."

---

## 1. Brand (locked from the logo + visiting card)

**Identity:** Vintage Fabric — *Mfg. of Quality Fabrics*. Premium, editorial, Indian-luxury.

**Colours (exact, from the logo file):**
| Token | Hex | Use |
|---|---|---|
| `--wine` | `#702040` | Primary: header, brand bar, footer, headings |
| `--gold` | `#D09030` | Accent: rules, the "V" monogram, highlights |
| `--ivory` | `#F4F0DC` | Light text on wine, soft backgrounds |
| `--ink` | `#2C2A2C` | Body text |

**Logo:** circular wine medallion with a gold mandala border, a gold "V" monogram, "VINTAGE FABRIC" in ivory, tagline "Mfg. of Quality Fabrics". Use the full circular mark in the header/hero; a simplified wine "V + VINTAGE FABRIC" lockup for the footer and favicon.

**Fonts:** elegant serif or strong italic display for headings (matches the logo's italic wordmark — e.g. Cormorant / a clean italicised sans); clean sans for body (Inter). Finalise against the logo.

**Business details to DISPLAY on the website (footer / contact / about):**
- Vintage Fabric — Mfg. of Quality Fabrics
- 146, 1st Floor, New Cloth Market, Raipur, Ahmedabad-380002, Gujarat, INDIA
- Sales: +91-85119 73246 / +91-99983 23246
- Accounts: +91-88495 78658
- vintagefabric666@gmail.com · www.vintagefabric.in
- GSTIN: 24DFNPS5386J1ZN

> IMPORTANT: Do NOT display the owners' personal numbers (Abhishek / Aditya) anywhere on the website. Public contact = **Sales and Accounts numbers only**. The WhatsApp / office button uses the **Accounts (office) number: +91-88495 78658**.

## 2. Goal & scope

- **Showcase + lead generation.** Display collections, categories and every fabric quality; convert global buyers into inquiries (form + WhatsApp).
- **Out of scope now:** payments/checkout, user accounts. (Content can later auto-publish from Vastrmaze; for launch it is hand-added.)

## 3. Sitemap (Next.js App Router)

```
/                        Home
/collections             All collections / design series
/collections/[slug]      One series (e.g. UNIVERSE, SUNSHINE)
/categories              Category index
/c/[category]            Kurti · Dress · Co-Ord · 3-Piece · …
/quality/[code]          One fabric quality (e.g. cambric-procian-heavy-print)
/catalog                 Catalog Center (PDF / lookbook downloads, lead-gated)
/journal                 Editorial / SEO blog
/journal/[slug]          Article
/about                   Brand story
/inquiry                 Buyer inquiry (main conversion)
/contact                 Contact + WhatsApp
/legal/[doc]             Privacy · Terms · Export policy
sitemap.xml · robots.txt (auto-generated)
```

Rendering: Home, collections, categories, quality pages, journal = static / ISR. Inquiry & contact = interactive islands → API routes.

## 4. Page-by-page

- **Home:** hero (signature design + tagline "Mfg. of Quality Fabrics"), featured categories, latest series, export/trust band, catalog-download CTA, inquiry CTA, footer with WhatsApp + full contact.
- **Category page:** intro + grid of designs in that category, cross-links to series.
- **Quality / design page (`/quality/[code]`):** the SEO workhorse — large images, **all available views (front, back, neck, dupatta) and all colourways**, fabric details (type, width e.g. 56"/58", composition, foil/non-foil), design number(s), related series, "Inquire / Request catalog" CTA, JSON-LD `Product`.
- **Series / collection page:** themed set (e.g. UNIVERSE, SUNSHINE), hero + grid.
- **Catalog Center:** downloadable PDF catalogs/lookbooks; download asks for name + email (captures a lead) → returns the file.
- **Journal:** short SEO articles (fabric care, trend notes, export guides).
- **Inquiry:** name, company, country, email, phone, interest, message → saved + emailed + WhatsApp deep link.
- **About / Contact / Legal:** brand story, address, WhatsApp, GSTIN, policies.

## 5. Data model (Supabase / Postgres)

```sql
categories  (id, name, slug, hero_image, description, seo jsonb, sort)
qualities   (id, name, code, slug, fabric_type, width, composition, foil bool,
             hero_image, category_id, seo jsonb)
collections (id, title, slug, type, hero_image, description, status, seo jsonb)  -- design series
collection_items (collection_id, design_id)
designs     (id, title, slug, design_no, category_id, quality_id, collection_id,
             images jsonb,        -- {front, back, neck, dupatta, colourways:[…]}
             description, status, seo jsonb)
leads       (id, type, name, company, country, email, phone, message,
             interested_refs text[], source, utm jsonb, status, created_at)
journal     (id, title, slug, body, tags text[], seo jsonb, published_at)
```

`designs.images` is a JSON object so one design can carry **multiple views** (front/back/neck/dupatta) and **multiple colourways** — matching how your catalogue actually works. Images live in **Cloudinary**; tables store URLs.

## 6. Seed content (your real series — confirm/extend)

| Series | Design No. | Type / details |
|---|---|---|
| UNIVERSE | D.No. 10400 | Co-ord set, floral |
| UNIVERSE | 9241-TOP / 9242-BOTTOM | Co-ord, printed top + striped bottom (multi-region) |
| SOULITAIRE | D.No. 5025 FOIL | Co-ord, Vertical Discharge 56" |
| SOULITAIRE | D.No. 5027 FOIL | Co-ord, Vertical Discharge 56" |
| INDRIYA | Dhabhu Plain-9 + Procian Dupatta D.No. 6212 | 3-piece, plain kurti + printed dupatta |
| INDRIYA | Dhabhu Plain-5 + Procian Dupatta D.No. 6210 | 3-piece, plain kurti + printed dupatta |
| SUNSHINE | Top 507 (foil) / Bottom 105 | 60×60 Cambric Procian Heavy Print 58" |

(Seed ~8–12 designs across 2–3 categories so the site looks full at launch.)

## 7. Lead capture flow

```
Inquiry form / catalog download
  → POST /api/leads  (validated, simple spam check)
  → insert into leads  →  email via Resend  →  WhatsApp deep-link to office/Accounts (wa.me/918849578658?text=…)
  → thank-you (catalog: return file URL)
Admin /admin: leads list + status (new→contacted→won/lost) + CSV export.
```

## 8. SEO setup (the reason this site exists)

- Per-page `generateMetadata` from each row's `seo` field.
- **JSON-LD:** `Organization` site-wide (with address + GSTIN as identifier); `Product` on design/quality pages; `CollectionPage`; `BreadcrumbList`; `ImageObject` with captions.
- Descriptive image filenames + alt text; auto `sitemap.xml`; `hreflang` scaffold for international buyers.
- Fast Core Web Vitals via `next/image` + ISR.

## 9. Tech stack (all free-tier to start)

Next.js (App Router) on **Vercel** · **Supabase** (DB + simple admin auth) · **Cloudinary** (images) · **Resend** (email) · WhatsApp deep-links. Near-zero fixed cost; scales with traffic.

## 10. Build steps (Claude Code checklist)

1. Scaffold Next.js + Tailwind + brand tokens (`#702040 / #D09030 / #F4F0DC`) + layout (header with circular logo, footer with full contact + WhatsApp).
2. Supabase project + tables above; seed with the designs in §6.
3. Core pages static/ISR: Home → Category → Quality/Design → Series.
4. Inquiry + catalog forms → `/api/leads` → Supabase + Resend + WhatsApp; thank-you states.
5. Admin `/admin`: leads list + status + CSV export.
6. SEO: metadata, JSON-LD, sitemap, robots, alt text.
7. Journal (MDX or DB) — a few launch articles.
8. Polish + launch: domain (vintagefabric.in), analytics, Lighthouse pass, go live.

## 11. What's still needed from you

1. **Logo file** in SVG or high-res PNG (you've shared the image; the source file gives crispest results).
2. **8–12 real design images** with details (series, D.No., fabric type, width) to seed §6 — including any back/neck/dupatta views you want shown.
3. Confirm which series are yours to publish (UNIVERSE, SUNSHINE, … ).
4. DNS access for vintagefabric.in.
