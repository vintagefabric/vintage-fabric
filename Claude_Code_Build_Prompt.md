Build a production-quality showcase website for my fabric business, "Vintage Fabric".

A complete build plan is in this folder as VintageFabric_Site_Plan.md — read it first and follow it as the source of truth. This message highlights the must-not-miss points.

WHAT IT IS
A premium, worldwide-facing showcase site for ladies' kurti/dress fabrics. It displays our collections, categories and fabric qualities, ranks well on search, and captures buyer inquiries. NO checkout, NO user accounts — showcase + lead capture only.

STACK (all free-tier friendly)
- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres) for data + a simple password-protected /admin
- Cloudinary for images
- Resend for inquiry emails
- Hosting: build to deploy on Vercel (free tier). The domain (vintagefabric.in) is registered at Hostinger and will be pointed to Vercel via DNS — so set the project up for a Vercel deploy, not for shared-hosting/cPanel.
Build it to run locally first (npm run dev). Use a .env.example for all keys; never hardcode secrets.

BRAND
- Colours: wine #702040 (primary), gold #D09030 (accent), ivory #F4F0DC (light), ink #2C2A2C (text). Set these as Tailwind theme tokens.
- Logo: circular wine medallion with gold mandala border + gold "V" monogram + "VINTAGE FABRIC" in ivory, tagline "Mfg. of Quality Fabrics". I'll provide the file — use a placeholder SVG with the same shape/colours until I do.
- Feel: premium, editorial, Indian-luxury. Elegant serif/italic display headings, clean sans (Inter) body. Fully responsive, fast, accessible.

CRITICAL CONTACT RULE
Display ONLY these public numbers anywhere on the site:
- Sales: +91-85119 73246 and +91-99983 23246
- Accounts (office): +91-88495 78658
NEVER display the owners' personal numbers. The WhatsApp / "chat with us" button must use the ACCOUNTS (office) number: wa.me/918849578658.
Other details OK to show: address (146, 1st Floor, New Cloth Market, Raipur, Ahmedabad-380002, Gujarat, India), email vintagefabric666@gmail.com, www.vintagefabric.in, GSTIN 24DFNPS5386J1ZN.

DATA MODEL
Follow the schema in the plan (categories, qualities, collections/series, designs, leads, journal). Important: designs.images is a JSON object supporting multiple views (front/back/neck/dupatta) AND multiple colourways per design. Seed the DB with the sample series in the plan (UNIVERSE, SOULITAIRE, INDRIYA, SUNSHINE) using placeholder images so the site looks full.

PAGES
Home, Collections, Collection/Series, Categories, Category, Quality/Design detail, Catalog Center (lead-gated downloads), Journal + article, About, Inquiry, Contact, Legal. Inquiry & catalog-download forms POST to /api/leads -> save to Supabase + email via Resend + show a thank-you. /admin lists leads with status + CSV export.

SEO
Per-page metadata, JSON-LD (Organization with GSTIN, Product on design pages, BreadcrumbList), descriptive alt text, auto sitemap.xml + robots.txt, next/image, ISR.

HOW TO WORK
1. Start by scaffolding the project, Tailwind brand tokens, and the shared layout (header with logo, footer with the allowed contact details + WhatsApp button to the Accounts number).
2. Then set up Supabase tables and seed data.
3. Then build pages Home -> Category -> Design detail -> Series.
4. Then the inquiry/lead flow + /admin.
5. Then SEO + journal + polish.
Work incrementally, keep the app running at every step, explain each step briefly, and ask me before anything destructive. Use clean, well-organised, commented code. When you need a real asset (logo, design photos, API keys), use a sensible placeholder and tell me exactly what to provide.

Begin with step 1 now.
