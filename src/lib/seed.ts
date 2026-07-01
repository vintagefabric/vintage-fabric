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
    name: "60×60 Cambric Procion Heavy Print",
    code: "cambric-procian-heavy-print",
    slug: "cambric-procian-heavy-print",
    fabricType: "60×60 Cambric",
    width: '58"',
    composition: "100% Cotton",
    foil: true,
    categoryId: "cat-coord",
    heroImage: ph("vf-q-cambric", "Cambric Procion heavy print fabric close-up").url,
    seo: {
      title: "60×60 Cambric Procion Heavy Print | Vintage Fabric",
      description:
        "60×60 cambric Procion heavy print, 58\" width, 100% cotton, foil finish. A signature Vintage Fabric quality.",
      keywords: ["cambric fabric", "Procion print", "60x60 cambric", "foil print fabric"],
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
        "Dhabhu plain cotton kurti base, 58\" width, paired with Procion printed dupattas in the INDRIYA 3-piece sets.",
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
      "Three-piece sets pairing plain dhabhu kurti bases with Procion printed dupattas, a complete, ready-to-stitch look.",
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
      "Bright cambric Procion heavy prints with foil tops and matched bottoms, our sunniest, best-selling co-ords.",
    seo: {
      title: "SUNSHINE Series | Vintage Fabric",
      description:
        "The SUNSHINE series: 60×60 cambric Procion heavy print co-ord sets by Vintage Fabric.",
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
    title: "INDRIYA 3-Piece, Dhabhu Plain-9 + Procion Dupatta",
    slug: "indriya-3-piece-dhabhu-plain-9-6212",
    designNo: "Dhabhu Plain-9 + Dupatta D.No. 6212",
    categoryId: "cat-3piece",
    qualityId: "q-dhabhu-plain",
    collectionId: "col-indriya",
    status: "published",
    description:
      "A 3-piece set: a Dhabhu Plain-9 kurti base with a Procion printed dupatta (D.No. 6212) and matching bottom.",
    images: {
      front: ph("vf-d-6212-f", "INDRIYA 3-piece Dhabhu Plain-9, kurti front view"),
      dupatta: ph("vf-d-6212-d", "INDRIYA Procion printed dupatta D.No. 6212"),
      colourways: [
        ph("vf-d-6212-c1", "INDRIYA 6212, blush colourway", 600, 800),
        ph("vf-d-6212-c2", "INDRIYA 6212, sage colourway", 600, 800),
      ],
    },
  },
  {
    id: "d-indriya-6210",
    title: "INDRIYA 3-Piece, Dhabhu Plain-5 + Procion Dupatta",
    slug: "indriya-3-piece-dhabhu-plain-5-6210",
    designNo: "Dhabhu Plain-5 + Dupatta D.No. 6210",
    categoryId: "cat-3piece",
    qualityId: "q-dhabhu-plain",
    collectionId: "col-indriya",
    status: "published",
    description:
      "A 3-piece set: a Dhabhu Plain-5 kurti base with a Procion printed dupatta (D.No. 6210) and matching bottom.",
    images: {
      front: ph("vf-d-6210-f", "INDRIYA 3-piece Dhabhu Plain-5, kurti front view"),
      dupatta: ph("vf-d-6210-d", "INDRIYA Procion printed dupatta D.No. 6210"),
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
      "The SUNSHINE signature: a 60×60 cambric Procion heavy print co-ord, foil top (507) with matched bottom (105) on 58\" cotton.",
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
      "A companion SUNSHINE design, 60×60 cambric Procion heavy print with a foil top (512) and matched bottom (110).",
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
      "A flowing cambric dress material with a heavy Procion print, a versatile single-piece option for ready-to-wear.",
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
    id: "j-series",
    title: "Why We Design in Series",
    slug: "why-we-design-in-series",
    excerpt:
      "We design in series rather than scatter one-off prints. What that means for the shelf, the reorder and the story a retailer tells.",
    tags: ["fabric collections", "wholesale", "behind the scenes"],
    publishedAt: "2026-06-16",
    body: `It would be easier, in some ways, to chase one good print at a time. A pretty design comes along, you run it, you sell it, you move on. Plenty of the trade works exactly that way. We have chosen not to, and the reason has everything to do with the buyer standing at a shelf.

We design in series (UNIVERSE, SOULITAIRE, INDRIYA, SUNSHINE), and each one carries its own mood. UNIVERSE is floral and printed, contemporary, easy to wear and easy to sell across regions. SOULITAIRE is foil and discharge, deep and jewel-like, made for the buyer who wants something premium. INDRIYA is the complete three-piece, a plain dhabhu base and a printed dupatta ready to stitch. SUNSHINE is bright cambric, foil-topped and matched, our sunniest range, and our best-selling. They are not four random moods; they are four shelves a retailer can build around.

That is really the whole point of working in series. A retailer who stocks a series gets a set of designs that hang together, in widths and finishes that match, with a single clear story to tell the customer in front of them. "This is the SUNSHINE range" is an easier thing to say, and an easier thing to buy into, than a wall of unrelated prints. The shelf looks considered because it was considered.

It helps the dull, important work too. Series come with clean design numbers, which is what makes a reorder quick and exact six months later. A buyer does not have to describe a fabric from memory; they give us a D.No. and a series, and we know precisely what they mean. Most of our business is repeat business, and a tidy series is part of how we earn the second order, which, the way we see it, is the only order that really counts.`,
    seo: {
      title: "Why We Design in Series | Vintage Fabric",
      description:
        "We design in series rather than scatter one-off prints. Here is what that means for the shelf, the reorder and the story a retailer tells.",
      keywords: [
        "fabric design series",
        "co-ord fabric collections wholesale",
        "ethnic wear fabric supplier Ahmedabad",
        "kurti fabric manufacturer India",
      ],
    },
  },
  {
    id: "j-base-cloth",
    title: "Cambric or Dhabhu: Choosing the Base Cloth",
    slug: "cambric-or-dhabhu-choosing-base-cloth",
    excerpt:
      "Both are honest cottons, but they behave differently under a print and on the body. A plain guide to choosing the right base.",
    tags: ["cambric", "dhabhu", "cotton fabric", "buying guide"],
    publishedAt: "2026-05-12",
    body: `No amount of finishing rescues a poor base cloth. We have said that elsewhere and we mean it, which is why the choice of base is the first decision in any fabric we make, long before the print is even discussed. For most of our range that choice comes down to two 100% cotton grounds: cambric and dhabhu. Both are honest cottons. They are not interchangeable.

Cambric is the lighter, finer of the two. It takes a fine print crisply, carries a foil well, and sits close and easy on the body, which is why so much of our cambric Procion and our brighter co-ords are built on it. If you are selling kurtis, dress materials and co-ord sets where the print needs to read sharp and the cloth needs to feel light through a long day, cambric is usually the answer.

Dhabhu has more substance to it. It holds a plain ground beautifully and gives a three-piece set the kind of body that a kurti base wants, which is exactly why INDRIYA pairs plain dhabhu kurti bases with a printed dupatta. A dhabhu plain is doing a different job from a cambric print; it is the steady, structured half of an outfit, the part the dupatta is allowed to be loud against.

The honest way to choose between them is to start from the garment and the market, not from the cloth. A light, print-led range leans towards cambric. A structured three-piece or a plain base meant to be stitched up wants dhabhu. If you tell us the garment you have in mind and the market you are selling into, we will tell you which base we would put it on, and why; and if a sample would settle it faster than a conversation, we will send one.`,
    seo: {
      title: "Cambric or Dhabhu: Choosing the Base Cloth | Vintage Fabric",
      description:
        "Cambric and dhabhu are both honest cotton bases, but they behave differently under a print and on the body. A plain guide to choosing between them.",
      keywords: [
        "cambric vs dhabhu fabric",
        "cotton base cloth for kurti",
        "best cotton fabric for ethnic wear",
        "dhabhu plain fabric wholesale",
      ],
    },
  },
  {
    id: "j-finishes",
    title: "Foil, Discharge and Procion: A Plain Guide to Our Finishes",
    slug: "foil-discharge-procian-finishes-guide",
    excerpt:
      "Procion, discharge and foil. A plain explanation of the three finishes behind our range and what each one does on the cloth.",
    tags: ["foil print", "discharge print", "Procion print", "fabric finishes"],
    publishedAt: "2026-04-08",
    body: `Most of the character in our range comes from three finishes, and a buyer who understands the difference between them stocks better and sells with more confidence. None of this is technical for its own sake; it is simply what is happening on the cloth in your hand.

A Procion print is the everyday backbone of the range. The colour is laid into the cotton and, done properly, it stays bright through a wash and sits true on the body. It is the finish that lets a floral look like a floral after a season of wear rather than a faded memory of one. The whole quality of a Procion print rests on two unglamorous things: a base cloth that takes the dye cleanly, and not rushing the print. We hold to both.

Discharge work goes at it from the other direction. Instead of adding colour onto a pale ground, the design is brought out of an already-dyed cloth, which gives those deep, settled tones you see across SOULITAIRE. It is a finish that rewards patience and punishes haste, and it is where a fabric earns the word premium honestly rather than on a label.

Foil is the one that catches the eye first. It is the shine, the jewel-like lift on a co-ord that makes a customer stop at the shelf. Foil also asks for a little respect in return: a cooler iron, a cloth laid over it, a gentler wash, and we say so plainly rather than letting a buyer find out the hard way. Looked after, it holds its shine on the shelf and on the body for a long time.

In practice you rarely choose one finish in isolation. A SUNSHINE co-ord might carry a Procion heavy print on the bottom and a foil top above it; a SOULITAIRE piece leans on discharge for its depth. Knowing which finish is doing what is simply knowing what you are selling, and that is usually the difference between a buyer who reorders and one who guesses.`,
    seo: {
      title: "Foil, Discharge and Procion: A Plain Guide to Our Finishes | Vintage Fabric",
      description:
        "A plain explanation of the three finishes behind our range, Procion print, discharge and foil, and what each one does on the cloth and on the body.",
      keywords: [
        "foil print fabric",
        "discharge print fabric",
        "Procion print cotton",
        "types of fabric finishes",
      ],
    },
  },
  {
    id: "j-export-guide",
    title: "A Short Guide to Sourcing Fabrics from India for Export",
    slug: "sourcing-fabrics-from-india-export-guide",
    excerpt:
      "The questions worth settling before your first order from Ahmedabad: width, composition, finish, lead times and design numbers.",
    tags: ["export", "sourcing", "buyer guide"],
    publishedAt: "2026-03-05",
    body: `Sourcing fabric from India is mostly straightforward once you know which questions to ask before the first order, rather than after it. We work out of New Cloth Market in Ahmedabad, one of the busiest cloth markets in the country, and the buyers who have the smoothest time are almost always the ones who pin down a few specifics early.

Start with width, because width is where a lot of quiet trouble lives. Most of our range runs at 56 or 58 inches, and the number on the spec sheet only matters if it holds from the start of the roll to the end, this lot and the next. Ask how width is checked, not just what it is. A fabric that drifts half an inch across a consignment will cost a garment maker far more in wasted cutting than they ever saved on the cloth.

Composition is the next thing to settle plainly. Our bases are 100% cotton, cambric and dhabhu mostly, chosen because they take a print cleanly and still feel right in the hand after stitching. Be specific about the base you want, because cambric and dhabhu behave differently under a print and on the body, and the right choice depends on your market and the garment.

Finishes deserve their own line in any conversation. Procion prints, foil and discharge work each travel and wash a little differently, and a buyer shipping abroad should know what to expect from each so there are no surprises at the far end. Ask for a sample, and where you can, wash it. A sample tells you more in an afternoon than a specification does in a week.

After that it comes down to lead times, design numbers and reorders. We will tell you honestly what is running, what is available in the widths you need, and what we can make to order, along with a realistic timeline rather than a hopeful one. Keep a note of the design numbers you stock; a clean D.No. is what makes a reorder quick and exact months later. And settle the routine details (GST and export documentation, sampling, packing) before the bulk, not during it. Sorted up front, an India order is dependable. The buyers who treat the second order as the real test, as we do, tend to find the whole thing easy.`,
    seo: {
      title: "Sourcing Fabrics from India for Export | Vintage Fabric",
      description:
        "What international buyers should confirm on widths, compositions, finishes and lead times when sourcing printed and foil cotton from Ahmedabad.",
      keywords: [
        "sourcing fabric from India",
        "fabric export from Ahmedabad",
        "buy cotton fabric wholesale India",
        "import printed fabric from India",
      ],
    },
  },
  {
    id: "j-coord-trend",
    title: "Why Co-Ord Sets Are Winning in Ethnic Wear",
    slug: "why-co-ord-sets-are-winning-ethnic-wear",
    excerpt:
      "A matched top and bottom removes the guesswork for the customer, which is why co-ords keep gaining ground with retailers and exporters.",
    tags: ["co-ord sets", "trends", "retail"],
    publishedAt: "2026-02-10",
    body: `There was a time when a retailer bought fabric by the panel and left the rest to the customer's imagination. A printed length here, a plain bottom somewhere else, and the woman standing at the counter had to picture the whole garment before she was willing to buy any part of it. Co-ord sets quietly put an end to that. A printed top with a bottom chosen to sit beside it, sold as a single decision. It is a small idea, but it changed the way a shelf works.

We make a good deal of co-ord now, across UNIVERSE and SOULITAIRE in particular, and the reason has less to do with fashion than with arithmetic. A matched set is easier to sell because the hard part, the styling, is already done. The retailer is not asking a customer to imagine anything. She can see the whole look, and most of the time she buys the whole look.

It also photographs well, which matters more every year. A complete top-and-bottom shows far better in a WhatsApp catalogue or an online listing than a single flat panel of cloth ever could. And the format travels. The same co-ord idea carries a soft floral for one market and a deep foil discharge for another without changing what the buyer has to stock or how they sell it.

For a wholesaler or an exporter, that adds up to a higher average order and a tidier range. The one thing it depends on is discipline at our end. A co-ord only works if the two halves genuinely belong together: the same true width, colours that read as a pair under the same light, finishes that wear at the same rate. Get that wrong and you have two unrelated fabrics in one packet. Get it right, lot after lot, and the set sells itself.`,
    seo: {
      title: "Why Co-Ord Sets Are Winning in Ethnic Wear | Vintage Fabric",
      description:
        "Why coordinated top-and-bottom fabric sets keep gaining ground with retailers and exporters, from the manufacturer's bench and the shop floor.",
      keywords: [
        "co-ord set fabric wholesale",
        "coordinated ethnic wear fabric",
        "matching top and bottom fabric",
        "ethnic wear fabric trends",
      ],
    },
  },
  {
    id: "j-cambric-care",
    title: "How to Care for Cambric & Cotton Print Fabrics",
    slug: "care-for-cambric-cotton-print-fabrics",
    excerpt:
      "Cold water, drying in shade and a cloth over the foil. The simple care that keeps printed cambric and cotton bright for years.",
    tags: ["fabric care", "cambric", "cotton care"],
    publishedAt: "2026-01-15",
    body: `A good cambric print is honest cotton with a print that has been given time to set properly. Treat it that way and it will hold its colour and its hand for years. Most of the damage we ever hear about comes from the first few washes, when the garment is new and the owner is least careful with it.

For those early washes, cold water and a mild detergent do far more good than they get credit for. Turn printed pieces inside out before they go in; it is the simplest way to keep a foil or a Procion print away from the rubbing that dulls it. Harsh bleaches and strong powders have no place near a printed cotton; they take the brightness off faster than wear ever will.

Drying is where Procion colour is quietly won or lost. Dry in shade. A long stretch in direct sun will fade a bright print over a season in a way that no wash does, and once it has gone flat there is no bringing it back. The shade costs nothing and saves the colour.

When it comes to ironing, work on the reverse, at a medium setting. For anything with foil, lay a thin cloth between the iron and the design; foil and a hot plate do not forgive each other. And for storage, fold and keep the cloth somewhere cool and dry. A breathable cotton bag is better than plastic for the long term; plastic traps moisture, and trapped moisture is how marks and musty smells begin.

None of this is complicated, and none of it is new. It is simply the care a quality cotton was always meant to have, and the same care that lets a buyer's customer come back and say the fabric lasted.`,
    seo: {
      title: "How to Care for Cambric & Cotton Print Fabrics | Vintage Fabric",
      description:
        "How to wash, dry, iron and store printed cambric and cotton so the colour and hand-feel hold for years.",
      keywords: [
        "how to wash cambric fabric",
        "cotton print fabric care",
        "how to wash foil print fabric",
        "prevent fabric colour fading",
      ],
    },
  },
];
