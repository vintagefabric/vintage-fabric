/**
 * One-off import: upload the real catalogue photos to Cloudinary and replace
 * the placeholder designs in Supabase with the 46 real designs.
 *
 * Run:  node scripts/import-real-designs.mjs "C:/Users/ASUS/Desktop/New folder"
 */
import crypto from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const SRC = process.argv[2];
if (!SRC) throw new Error("Pass the image folder path");

const env = (k) => {
  const t = readFileSync(".env.local", "utf8");
  const l = t.split(/\r?\n/).find((x) => x.startsWith(`${k}=`));
  if (!l) throw new Error(`Missing ${k}`);
  return l.slice(k.length + 1).trim();
};
const CLOUD = env("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
const CKEY = env("CLOUDINARY_API_KEY");
const CSECRET = env("CLOUDINARY_API_SECRET");
const sb = createClient(env("NEXT_PUBLIC_SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { persistSession: false },
});

// Files sorted the same way the contact sheets were numbered (1-46).
const files = readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
if (files.length !== 46) throw new Error(`Expected 46 files, found ${files.length}`);

const U = (dno, look) => ({
  series: "col-universe", quality: "q-cotton-floral", cat: "cat-coord",
  title: `UNIVERSE ${look} Co-Ord`, designNo: `D.No. ${dno}`,
  slug: `universe-${look.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-co-ord-${dno}`,
  desc: `A ${look.toLowerCase()} co-ord from the UNIVERSE series, printed top with a matched bottom on soft 56" cotton.`,
  alt: `UNIVERSE ${look.toLowerCase()} printed co-ord set fabric, D.No. ${dno}, by Vintage Fabric`,
});
const S = (dno, ways) => ({
  series: "col-soulitaire", quality: "q-vertical-discharge", cat: "cat-coord",
  title: `SOULITAIRE Foil Co-Ord ${dno}`, designNo: `D.No. ${dno} FOIL`,
  slug: `soulitaire-foil-co-ord-${dno}`,
  desc: `Foil vertical-discharge co-ord on 56" cotton, shown in two colourways, ${ways}.`,
  alt: `SOULITAIRE foil vertical discharge co-ord D.No. ${dno} in ${ways}, by Vintage Fabric`,
});
const I = (plain, dno) => ({
  series: "col-indriya", quality: "q-dhabhu-plain", cat: "cat-3piece",
  title: `INDRIYA 3-Piece, Dhabhu Plain-${plain} + Procion Dupatta`,
  designNo: `Dhabhu Plain-${plain} + Dupatta D.No. ${dno}`,
  slug: `indriya-3-piece-dhabhu-plain-${plain.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${dno}`,
  desc: `A 3-piece set: Dhabhu Plain-${plain} kurti base with a Procion printed dupatta (D.No. ${dno}) and matching bottom, on 58" cotton.`,
  alt: `INDRIYA 3-piece set, Dhabhu Plain-${plain} kurti with Procion printed dupatta D.No. ${dno}, by Vintage Fabric`,
});
const N = (top, bottom) => ({
  series: "col-sunshine", quality: "q-cambric-procian-heavy", cat: "cat-coord",
  title: `SUNSHINE Cambric Co-Ord (Top ${top} / Bottom ${bottom})`,
  designNo: `Top ${top} (foil) / Bottom ${bottom}`,
  slug: `sunshine-cambric-co-ord-${top}-${bottom}`,
  desc: `60×60 cambric Procion heavy print co-ord, foil top (${top}) with a matched bottom (${bottom}), on 58" cotton.`,
  alt: `SUNSHINE 60x60 cambric Procion heavy print co-ord, foil top ${top} with bottom ${bottom}, by Vintage Fabric`,
});

// Index (1-46, contact-sheet order) -> design metadata.
const META = [
  U(10072, "Mustard Floral"),        // 1
  U(10377, "Teal Tropical Leaf"),    // 2
  U(10400, "Wine Floral"),           // 3
  U(10422, "Pink Coral Bloom"),      // 4
  U(10427, "Ivory Autumn Leaf"),     // 5
  U(10190, "Maroon Magnolia"),       // 6
  U(10192, "Rani Pink Blossom"),     // 7
  U(10203, "Green Wildflower"),      // 8
  U(10212, "Charcoal Blossom"),      // 9
  U(10221, "Navy Lily"),             // 10
  U(10251, "Olive Vine"),            // 11
  U(10285, "Berry Patchwork"),       // 12
  U(10363, "Lavender Blossom"),      // 13
  U(10056, "Plum Daisy"),            // 14
  S(5027, "red and mustard"),        // 15
  S(5025, "sage and lime"),          // 16
  S(5031, "red and black"),          // 17
  S(5034, "maroon and umber"),       // 18
  S(5037, "rose pink and sage"),     // 19
  S(5029, "rani pink and deep teal"),// 20
  S(5040, "rose and jade"),          // 21
  S(5041, "crimson and black"),      // 22
  S(5044, "red and olive"),          // 23
  S(5045, "ivory and black"),        // 24
  S(5039, "red and teal"),           // 25
  I("Black", 6164),                  // 26
  I("Wine", 6161),                   // 27
  I("Rani", 6168),                   // 28
  I("Chatni", 6170),                 // 29
  I("Maroon", 6171),                 // 30
  I("Morpich", 6173),                // 31
  I("Rust", 6165),                   // 32
  I("05", 6181),                     // 33
  I("01", 6177),                     // 34
  I("13", 6189),                     // 35
  I("Wine-2", 6175),                 // 36 (second Wine plain, dupatta 6175)
  I("11", 6187),                     // 37
  I("19", 6194),                     // 38
  I("18", 6193),                     // 39
  I("12", 6188),                     // 40
  N(503, 103),                       // 41
  N(505, 103),                       // 42
  N(508, 105),                       // 43
  N(501, 101),                       // 44
  N(513, 110),                       // 45
  N(512, 109),                       // 46
];
if (META.length !== 46) throw new Error("META must have 46 entries");

// Fix the display strings for the second Wine plain (keep label "Wine").
META[35].title = "INDRIYA 3-Piece, Dhabhu Plain-Wine + Procion Dupatta";
META[35].designNo = "Dhabhu Plain-Wine + Dupatta D.No. 6175";
META[35].desc = META[35].desc.replace("Plain-Wine-2", "Plain-Wine");
META[35].alt = META[35].alt.replace("Plain-Wine-2", "Plain-Wine");

async function uploadToCloudinary(filePath, publicId) {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "vintage-fabric/designs";
  const toSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${CSECRET}`;
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");
  const fd = new FormData();
  fd.append("file", new Blob([readFileSync(filePath)], { type: "image/jpeg" }), "img.jpg");
  fd.append("api_key", CKEY);
  fd.append("timestamp", String(timestamp));
  fd.append("signature", signature);
  fd.append("folder", folder);
  fd.append("public_id", publicId);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: "POST",
    body: fd,
  });
  const json = await res.json();
  if (!json.secure_url) throw new Error(`Upload failed for ${publicId}: ${JSON.stringify(json)}`);
  return json.secure_url;
}

// 1) Upload all 46 images.
console.log("Uploading 46 images to Cloudinary...");
const urls = [];
for (let i = 0; i < 46; i++) {
  const url = await uploadToCloudinary(path.join(SRC, files[i]), META[i].slug);
  urls.push(url);
  process.stdout.write(`${i + 1} `);
}
console.log("\nAll uploaded.");

// 2) Wipe placeholder designs.
let r = await sb.from("collection_items").delete().neq("collection_id", "__never__");
if (r.error) throw r.error;
r = await sb.from("designs").delete().neq("id", "__never__");
if (r.error) throw r.error;
console.log("Old designs removed.");

// 3) Insert the 46 designs, interleaving series so listings feel mixed.
const bySeries = new Map();
META.forEach((m, i) => {
  const arr = bySeries.get(m.series) ?? [];
  arr.push({ ...m, url: urls[i] });
  bySeries.set(m.series, arr);
});
const queues = [...bySeries.values()];
const ordered = [];
while (queues.some((q) => q.length)) {
  for (const q of queues) if (q.length) ordered.push(q.shift());
}

const rows = ordered.map((m) => ({
  id: `d-${crypto.randomUUID()}`,
  title: m.title,
  slug: m.slug,
  design_no: m.designNo,
  category_id: m.cat,
  quality_id: m.quality,
  collection_id: m.series,
  images: { front: { url: m.url, alt: m.alt } },
  description: m.desc,
  status: "published",
  seo: {
    title: `${m.title} | Vintage Fabric`,
    description: m.desc,
  },
}));
r = await sb.from("designs").insert(rows);
if (r.error) throw r.error;
console.log(`Inserted ${rows.length} designs.`);

// 4) Real hero images for series and fabric types.
const urlBySlug = new Map(META.map((m, i) => [m.slug, urls[i]]));
const heroes = [
  ["collections", "col-universe", urlBySlug.get("universe-wine-floral-co-ord-10400")],
  ["collections", "col-soulitaire", urlBySlug.get("soulitaire-foil-co-ord-5025")],
  ["collections", "col-indriya", urlBySlug.get("indriya-3-piece-dhabhu-plain-wine-6161")],
  ["collections", "col-sunshine", urlBySlug.get("sunshine-cambric-co-ord-503-103")],
  ["qualities", "q-cotton-floral", urlBySlug.get("universe-plum-daisy-co-ord-10056")],
  ["qualities", "q-vertical-discharge", urlBySlug.get("soulitaire-foil-co-ord-5027")],
  ["qualities", "q-dhabhu-plain", urlBySlug.get("indriya-3-piece-dhabhu-plain-black-6164")],
  ["qualities", "q-cambric-procian-heavy", urlBySlug.get("sunshine-cambric-co-ord-508-105")],
];
for (const [table, id, url] of heroes) {
  if (!url) { console.warn("No hero url for", id); continue; }
  const res2 = await sb.from(table).update({ hero_image: url }).eq("id", id);
  if (res2.error) throw res2.error;
}
console.log("Hero images updated.");
console.log("DONE");
