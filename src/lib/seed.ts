/**
 * Local seed content, the real series from plan §6 plus enough designs that
 * the site looks full at launch. Images are deterministic placeholders
 * (picsum.photos) with descriptive alt text; swap the URLs for Cloudinary
 * assets when the real photography is ready.
 *
 * This same data is the source of truth when Supabase is NOT configured, and
 * it is also what `supabase/seed.sql` mirrors for the database.
 */

import type {
  Category,
  Collection,
  Design,
  ImageView,
  JournalPost,
  Quality,
} from "./types";

/** Deterministic placeholder image with a descriptive alt string. */
function ph(seed: string, alt: string, w = 900, h = 1200): ImageView {
  return { url: `https://picsum.photos/seed/${seed}/${w}/${h}`, alt };
}

// ── Categories ─────────────────────────────────────────────────────────────
export const categories: Category[] = [
  {
    id: "cat-kurti",
    name: "Kurti",
    slug: "kurti",
    sort: 1,
    heroImage: ph("vf-kurti", "Vintage Fabric printed kurti fabric").url,
    description:
      "Printed and foil kurti fabrics in cambric, cotton and discharge, the heart of our collection for ladies' ethnic wear.",
    seo: {
      title: "Kurti Fabrics | Vintage Fabric",
      description:
        "Premium printed & foil kurti fabrics by Vintage Fabric, Ahmedabad. Cambric, cotton and discharge qualities for wholesale & export.",
      keywords: ["kurti fabric", "printed kurti fabric", "wholesale kurti fabric Ahmedabad"],
    },
  },
  {
    id: "cat-dress",
    name: "Dress",
    slug: "dress",
    sort: 2,
    heroImage: ph("vf-dress", "Vintage Fabric dress material").url,
    description:
      "Flowing dress materials with refined prints and finishes, built for premium ready-to-wear and export buyers.",
    seo: {
      title: "Dress Materials | Vintage Fabric",
      description:
        "Elegant dress materials by Vintage Fabric, refined prints, dependable widths, export-ready quality.",
      keywords: ["dress material", "printed dress fabric", "export dress fabric India"],
    },
  },
  {
    id: "cat-coord",
    name: "Co-Ord",
    slug: "co-ord",
    sort: 3,
    heroImage: ph("vf-coord", "Vintage Fabric co-ord set fabric").url,
    description:
      "Coordinated top + bottom fabric sets, matched prints and stripes designed to be sold together.",
    seo: {
      title: "Co-Ord Set Fabrics | Vintage Fabric",
      description:
        "Co-ord set fabrics (matched top + bottom) by Vintage Fabric. Floral, foil and discharge designs for modern ethnic wear.",
      keywords: ["co-ord set fabric", "coordinated fabric set", "top bottom fabric set"],
    },
  },
  {
    id: "cat-3piece",
    name: "3-Piece",
    slug: "3-piece",
    sort: 4,
    heroImage: ph("vf-3piece", "Vintage Fabric three-piece suit fabric").url,
    description:
      "Three-piece suit sets, plain kurti, bottom and a printed dupatta, ready to stitch into a complete look.",
    seo: {
      title: "3-Piece Suit Fabrics | Vintage Fabric",
      description:
        "Three-piece suit fabric sets (kurti + bottom + printed dupatta) by Vintage Fabric, Ahmedabad.",
      keywords: ["3 piece suit fabric", "unstitched suit set", "dupatta suit set"],
    },
  },
];

// ── Qualities ──────────────────────────────────────────────────────────────
export const qualities: Quality[] = [
  {
    id: "q-cambric-procian-heavy",
    name: "60×60 Cambric Procian Heavy Print",
    code: "cambric-procian-heavy-print",
    slug: "cambric-procian-heavy-print",
    fabricType: "60×60 Cambric",
    width: '58"',
    composition: "100% Cotton",
    foil: true,
    categoryId: "cat-coord",
    heroImage: ph("vf-q-cambric", "Cambric procian heavy print fabric close-up").url,
    seo: {
      title: "60×60 Cambric Procian Heavy Print | Vintage Fabric",
      description:
        "60×60 cambric procian heavy print, 58\" width, 100% cotton, foil finish. A signature Vintage Fabric quality.",
      keywords: ["cambric fabric", "procian print", "60x60 cambric", "foil print fabric"],
    },
  },
  {
    id: "q-vertical-discharge",
    name: "Vertical Discharge 56\"",
    code: "vertical-discharge-56",
    slug: "vertical-discharge-56",
    fabricType: "Discharge Print",
    width: '56"',
    composition: "100% Cotton",
    foil: true,
    categoryId: "cat-coord",
    heroImage: ph("vf-q-discharge", "Vertical discharge print fabric close-up").url,
    seo: {
      title: "Vertical Discharge 56\" Foil | Vintage Fabric",
      description:
        "Vertical discharge print, 56\" width, foil finish, used in the SOULITAIRE co-ord series.",
      keywords: ["discharge print fabric", "vertical discharge", "foil fabric 56 inch"],
    },
  },
  {
    id: "q-dhabhu-plain",
    name: "Dhabhu Plain",
    code: "dhabhu-plain",
    slug: "dhabhu-plain",
    fabricType: "Dhabhu Plain",
    width: '58"',
    composition: "100% Cotton",
    foil: false,
    categoryId: "cat-3piece",
    heroImage: ph("vf-q-dhabhu", "Dhabhu plain cotton fabric close-up").url,
    seo: {
      title: "Dhabhu Plain Cotton | Vintage Fabric",
      description:
        "Dhabhu plain cotton kurti base, 58\" width, paired with procian printed dupattas in the INDRIYA 3-piece sets.",
      keywords: ["dhabhu plain", "plain cotton kurti fabric", "kurti base fabric"],
    },
  },
  {
    id: "q-cotton-floral",
    name: "Cotton Floral Print",
    code: "cotton-floral-print",
    slug: "cotton-floral-print",
    fabricType: "Cotton Print",
    width: '56"',
    composition: "100% Cotton",
    foil: false,
    categoryId: "cat-coord",
    heroImage: ph("vf-q-floral", "Cotton floral print fabric close-up").url,
    seo: {
      title: "Cotton Floral Print | Vintage Fabric",
      description:
        "Soft cotton floral print, 56\" width, the base of the UNIVERSE co-ord designs.",
      keywords: ["cotton floral print", "floral kurti fabric", "printed cotton fabric"],
    },
  },
];

// ── Collections / design series ──────────────────────────────────────────
export const collections: Collection[] = [
  {
    id: "col-universe",
    title: "UNIVERSE",
    slug: "universe",
    type: "series",
    status: "published",
    heroImage: ph("vf-universe", "UNIVERSE series fabric collection").url,
    description:
      "Floral and printed co-ord sets with a contemporary, multi-region appeal, easy to wear, easy to sell.",
    seo: {
      title: "UNIVERSE Series | Vintage Fabric",
      description:
        "The UNIVERSE series: floral & printed co-ord set fabrics by Vintage Fabric.",
      keywords: ["UNIVERSE series", "co-ord fabric series", "floral co-ord fabric"],
    },
  },
  {
    id: "col-soulitaire",
    title: "SOULITAIRE",
    slug: "soulitaire",
    type: "series",
    status: "published",
    heroImage: ph("vf-soulitaire", "SOULITAIRE series fabric collection").url,
    description:
      "Foil vertical-discharge co-ords with a jewel-like finish, premium designs for the discerning buyer.",
    seo: {
      title: "SOULITAIRE Series | Vintage Fabric",
      description:
        "The SOULITAIRE series: foil vertical-discharge co-ord set fabrics by Vintage Fabric.",
      keywords: ["SOULITAIRE series", "foil co-ord fabric", "discharge co-ord set"],
    },
  },
  {
    id: "col-indriya",
    title: "INDRIYA",
    slug: "indriya",
    type: "series",
    status: "published",
    heroImage: ph("vf-indriya", "INDRIYA series fabric collection").url,
    description:
      "Three-piece sets pairing plain dhabhu kurti bases with procian printed dupattas, a complete, ready-to-stitch look.",
    seo: {
      title: "INDRIYA Series | Vintage Fabric",
      description:
        "The INDRIYA series: 3-piece suit sets (plain kurti + printed dupatta) by Vintage Fabric.",
      keywords: ["INDRIYA series", "3 piece suit set", "dupatta suit fabric"],
    },
  },
  {
    id: "col-sunshine",
    title: "SUNSHINE",
    slug: "sunshine",
    type: "series",
    status: "published",
    heroImage: ph("vf-sunshine", "SUNSHINE series fabric collection").url,
    description:
      "Bright cambric procian heavy prints with foil tops and matched bottoms, our sunniest, best-selling co-ords.",
    seo: {
      title: "SUNSHINE Series | Vintage Fabric",
      description:
        "The SUNSHINE series: 60×60 cambric procian heavy print co-ord sets by Vintage Fabric.",
      keywords: ["SUNSHINE series", "cambric co-ord", "heavy print co-ord set"],
    },
  },
];

// ── Designs (seeded from plan §6, extended to ~10) ─────────────────────────
export const designs: Design[] = [
  {
    id: "d-universe-10400",
    title: "UNIVERSE Floral Co-Ord",
    slug: "universe-floral-co-ord-10400",
    designNo: "D.No. 10400",
    categoryId: "cat-coord",
    qualityId: "q-cotton-floral",
    collectionId: "col-universe",
    status: "published",
    description:
      "A floral co-ord set from the UNIVERSE series, a printed top with a coordinated bottom on soft 56\" cotton.",
    images: {
      front: ph("vf-d-10400-f", "UNIVERSE floral co-ord D.No. 10400, front view"),
      back: ph("vf-d-10400-b", "UNIVERSE floral co-ord D.No. 10400, back view"),
      colourways: [
        ph("vf-d-10400-c1", "UNIVERSE D.No. 10400, wine colourway", 600, 800),
        ph("vf-d-10400-c2", "UNIVERSE D.No. 10400, teal colourway", 600, 800),
        ph("vf-d-10400-c3", "UNIVERSE D.No. 10400, mustard colourway", 600, 800),
      ],
    },
  },
  {
    id: "d-universe-9241",
    title: "UNIVERSE Printed Top + Striped Bottom",
    slug: "universe-printed-top-striped-bottom-9241",
    designNo: "9241-TOP / 9242-BOTTOM",
    categoryId: "cat-coord",
    qualityId: "q-cotton-floral",
    collectionId: "col-universe",
    status: "published",
    description:
      "A co-ord pairing a printed top (9241) with a striped bottom (9242), a multi-region favourite.",
    images: {
      front: ph("vf-d-9241-f", "UNIVERSE printed top + striped bottom 9241/9242, front view"),
      back: ph("vf-d-9241-b", "UNIVERSE printed top + striped bottom 9241/9242, back view"),
      colourways: [
        ph("vf-d-9241-c1", "UNIVERSE 9241, indigo colourway", 600, 800),
        ph("vf-d-9241-c2", "UNIVERSE 9241, rust colourway", 600, 800),
      ],
    },
  },
  {
    id: "d-soulitaire-5025",
    title: "SOULITAIRE Foil Co-Ord 5025",
    slug: "soulitaire-foil-co-ord-5025",
    designNo: "D.No. 5025 FOIL",
    categoryId: "cat-coord",
    qualityId: "q-vertical-discharge",
    collectionId: "col-soulitaire",
    status: "published",
    description:
      "A foil vertical-discharge co-ord set on 56\" cotton, part of the premium SOULITAIRE series.",
    images: {
      front: ph("vf-d-5025-f", "SOULITAIRE foil co-ord D.No. 5025, front view"),
      neck: ph("vf-d-5025-n", "SOULITAIRE foil co-ord D.No. 5025, neck detail"),
      colourways: [
        ph("vf-d-5025-c1", "SOULITAIRE 5025, emerald foil colourway", 600, 800),
        ph("vf-d-5025-c2", "SOULITAIRE 5025, wine foil colourway", 600, 800),
      ],
    },
  },
  {
    id: "d-soulitaire-5027",
    title: "SOULITAIRE Foil Co-Ord 5027",
    slug: "soulitaire-foil-co-ord-5027",
    designNo: "D.No. 5027 FOIL",
    categoryId: "cat-coord",
    qualityId: "q-vertical-discharge",
    collectionId: "col-soulitaire",
    status: "published",
    description:
      "A second foil vertical-discharge co-ord (D.No. 5027) on 56\" cotton from the SOULITAIRE series.",
    images: {
      front: ph("vf-d-5027-f", "SOULITAIRE foil co-ord D.No. 5027, front view"),
      neck: ph("vf-d-5027-n", "SOULITAIRE foil co-ord D.No. 5027, neck detail"),
      colourways: [
        ph("vf-d-5027-c1", "SOULITAIRE 5027, sapphire foil colourway", 600, 800),
        ph("vf-d-5027-c2", "SOULITAIRE 5027, black foil colourway", 600, 800),
      ],
    },
  },
  {
    id: "d-indriya-6212",
    title: "INDRIYA 3-Piece, Dhabhu Plain-9 + Procian Dupatta",
    slug: "indriya-3-piece-dhabhu-plain-9-6212",
    designNo: "Dhabhu Plain-9 + Dupatta D.No. 6212",
    categoryId: "cat-3piece",
    qualityId: "q-dhabhu-plain",
    collectionId: "col-indriya",
    status: "published",
    description:
      "A 3-piece set: a Dhabhu Plain-9 kurti base with a procian printed dupatta (D.No. 6212) and matching bottom.",
    images: {
      front: ph("vf-d-6212-f", "INDRIYA 3-piece Dhabhu Plain-9, kurti front view"),
      dupatta: ph("vf-d-6212-d", "INDRIYA procian printed dupatta D.No. 6212"),
      colourways: [
        ph("vf-d-6212-c1", "INDRIYA 6212, blush colourway", 600, 800),
        ph("vf-d-6212-c2", "INDRIYA 6212, sage colourway", 600, 800),
      ],
    },
  },
  {
    id: "d-indriya-6210",
    title: "INDRIYA 3-Piece, Dhabhu Plain-5 + Procian Dupatta",
    slug: "indriya-3-piece-dhabhu-plain-5-6210",
    designNo: "Dhabhu Plain-5 + Dupatta D.No. 6210",
    categoryId: "cat-3piece",
    qualityId: "q-dhabhu-plain",
    collectionId: "col-indriya",
    status: "published",
    description:
      "A 3-piece set: a Dhabhu Plain-5 kurti base with a procian printed dupatta (D.No. 6210) and matching bottom.",
    images: {
      front: ph("vf-d-6210-f", "INDRIYA 3-piece Dhabhu Plain-5, kurti front view"),
      dupatta: ph("vf-d-6210-d", "INDRIYA procian printed dupatta D.No. 6210"),
      colourways: [
        ph("vf-d-6210-c1", "INDRIYA 6210, peach colourway", 600, 800),
        ph("vf-d-6210-c2", "INDRIYA 6210, slate colourway", 600, 800),
      ],
    },
  },
  {
    id: "d-sunshine-507",
    title: "SUNSHINE Cambric Co-Ord (Top 507 / Bottom 105)",
    slug: "sunshine-cambric-co-ord-507-105",
    designNo: "Top 507 (foil) / Bottom 105",
    categoryId: "cat-coord",
    qualityId: "q-cambric-procian-heavy",
    collectionId: "col-sunshine",
    status: "published",
    description:
      "The SUNSHINE signature: a 60×60 cambric procian heavy print co-ord, foil top (507) with matched bottom (105) on 58\" cotton.",
    images: {
      front: ph("vf-d-507-f", "SUNSHINE cambric co-ord Top 507, front view"),
      back: ph("vf-d-507-b", "SUNSHINE cambric co-ord Top 507, back view"),
      colourways: [
        ph("vf-d-507-c1", "SUNSHINE 507, sunflower colourway", 600, 800),
        ph("vf-d-507-c2", "SUNSHINE 507, coral colourway", 600, 800),
        ph("vf-d-507-c3", "SUNSHINE 507, wine colourway", 600, 800),
      ],
    },
  },
  {
    id: "d-sunshine-512",
    title: "SUNSHINE Cambric Co-Ord (Top 512 / Bottom 110)",
    slug: "sunshine-cambric-co-ord-512-110",
    designNo: "Top 512 (foil) / Bottom 110",
    categoryId: "cat-coord",
    qualityId: "q-cambric-procian-heavy",
    collectionId: "col-sunshine",
    status: "published",
    description:
      "A companion SUNSHINE design, 60×60 cambric procian heavy print with a foil top (512) and matched bottom (110).",
    images: {
      front: ph("vf-d-512-f", "SUNSHINE cambric co-ord Top 512, front view"),
      back: ph("vf-d-512-b", "SUNSHINE cambric co-ord Top 512, back view"),
      colourways: [
        ph("vf-d-512-c1", "SUNSHINE 512, turquoise colourway", 600, 800),
        ph("vf-d-512-c2", "SUNSHINE 512, magenta colourway", 600, 800),
      ],
    },
  },
  {
    id: "d-universe-kurti-2201",
    title: "UNIVERSE Printed Kurti 2201",
    slug: "universe-printed-kurti-2201",
    designNo: "D.No. 2201",
    categoryId: "cat-kurti",
    qualityId: "q-cotton-floral",
    collectionId: "col-universe",
    status: "published",
    description:
      "A standalone printed kurti fabric on soft cotton, small all-over floral, easy to stitch and stock.",
    images: {
      front: ph("vf-d-2201-f", "UNIVERSE printed kurti D.No. 2201, front view"),
      neck: ph("vf-d-2201-n", "UNIVERSE printed kurti D.No. 2201, neck detail"),
      colourways: [
        ph("vf-d-2201-c1", "UNIVERSE 2201, rose colourway", 600, 800),
        ph("vf-d-2201-c2", "UNIVERSE 2201, ink colourway", 600, 800),
      ],
    },
  },
  {
    id: "d-sunshine-dress-880",
    title: "SUNSHINE Cambric Dress Material 880",
    slug: "sunshine-cambric-dress-material-880",
    designNo: "D.No. 880",
    categoryId: "cat-dress",
    qualityId: "q-cambric-procian-heavy",
    collectionId: "col-sunshine",
    status: "published",
    description:
      "A flowing cambric dress material with a heavy procian print, a versatile single-piece option for ready-to-wear.",
    images: {
      front: ph("vf-d-880-f", "SUNSHINE cambric dress material D.No. 880, front view"),
      colourways: [
        ph("vf-d-880-c1", "SUNSHINE 880, amber colourway", 600, 800),
        ph("vf-d-880-c2", "SUNSHINE 880, plum colourway", 600, 800),
      ],
    },
  },
];

// ── Journal (launch articles) ──────────────────────────────────────────────
export const journal: JournalPost[] = [
  {
    id: "j-cambric-care",
    title: "How to Care for Cambric & Cotton Print Fabrics",
    slug: "care-for-cambric-cotton-print-fabrics",
    excerpt:
      "Simple washing and storage tips to keep printed cambric and cotton looking fresh, season after season.",
    tags: ["fabric care", "cambric", "cotton"],
    publishedAt: "2026-01-15",
    body: `Cambric and fine cotton prints reward a little gentle care.

**Washing.** Use cold water and a mild detergent for the first few washes; turn printed garments inside out to protect foil and procian prints. Avoid harsh bleaching.

**Drying.** Dry in shade. Direct, prolonged sun can dull bright procian colours over time.

**Ironing.** Iron on the reverse side at a medium setting. For foil designs, place a thin cloth between the iron and the foil.

**Storage.** Keep folded in a cool, dry place. A breathable cotton bag is better than plastic for long-term storage.

Treated this way, a good cambric procian print holds its colour and hand-feel for years, which is exactly what buyers expect from a quality fabric.`,
    seo: {
      title: "How to Care for Cambric & Cotton Print Fabrics | Vintage Fabric",
      description:
        "Washing, drying, ironing and storage tips for printed cambric and cotton fabrics from Vintage Fabric.",
      keywords: ["fabric care", "how to wash cambric", "cotton print care"],
    },
  },
  {
    id: "j-coord-trend",
    title: "Why Co-Ord Sets Are Winning in Ethnic Wear",
    slug: "why-co-ord-sets-are-winning-ethnic-wear",
    excerpt:
      "Matched top-and-bottom sets sell themselves. Here's why co-ords keep gaining ground with retailers and buyers.",
    tags: ["trends", "co-ord"],
    publishedAt: "2026-02-10",
    body: `Co-ord sets, a printed top with a coordinated or contrasting bottom, have moved from a trend to a staple.

**They're easy to sell.** A matched set removes the guesswork for the end customer; the styling is already done.

**They photograph well.** A complete look is more compelling online than a single panel of fabric.

**They suit every region.** Floral, striped, foil or discharge, the same co-ord format flexes across markets, which is why series like UNIVERSE and SOULITAIRE travel so well.

For wholesalers and exporters, co-ords mean higher average order value and a cleaner range. That's a trend worth stocking.`,
    seo: {
      title: "Why Co-Ord Sets Are Winning in Ethnic Wear | Vintage Fabric",
      description:
        "A look at why coordinated top-and-bottom fabric sets keep gaining ground with retailers and exporters.",
      keywords: ["co-ord trend", "ethnic wear trends", "co-ord set wholesale"],
    },
  },
  {
    id: "j-export-guide",
    title: "A Short Guide to Sourcing Fabrics from India for Export",
    slug: "sourcing-fabrics-from-india-export-guide",
    excerpt:
      "What international buyers should know about widths, compositions and lead times when sourcing from Ahmedabad.",
    tags: ["export", "guide"],
    publishedAt: "2026-03-05",
    body: `India remains one of the world's great fabric sources, and Ahmedabad is at the centre of it.

**Know your width.** Most of our qualities run 56" or 58". Confirm width up front, since it affects yield and garment costing.

**Composition matters.** Our prints are on 100% cotton bases like cambric and dhabhu. Ask for the exact composition for your customs and labelling needs.

**Mind the finish.** Foil and discharge finishes look spectacular but have specific care needs, share these with your end customers.

**Lead times & MOQs.** Talk to us early about quantities and timelines so we can plan production around your shipping windows.

When in doubt, request our catalog and send an inquiry, we'll guide you through what suits your market.`,
    seo: {
      title: "Sourcing Fabrics from India for Export | Vintage Fabric",
      description:
        "A practical guide for international buyers on widths, compositions, finishes and lead times when sourcing fabrics from Ahmedabad.",
      keywords: ["fabric sourcing India", "export fabric guide", "buy fabric from Ahmedabad"],
    },
  },
];
