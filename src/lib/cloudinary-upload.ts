/**
 * Client-side helper: upload one file to Cloudinary using a server-signed
 * request. No secrets here — the signature comes from /api/admin/cloudinary-sign.
 * Used by the admin forms (designs, series, fabric types).
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const signRes = await fetch("/api/admin/cloudinary-sign", { method: "POST" });
  const s = await signRes.json();
  if (!signRes.ok || !s.ok) throw new Error(s.error || "Could not authorize upload.");

  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", s.apiKey);
  fd.append("timestamp", String(s.timestamp));
  fd.append("signature", s.signature);
  fd.append("folder", s.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${s.cloudName}/image/upload`, {
    method: "POST",
    body: fd,
  });
  const json = await res.json();
  if (!res.ok || !json.secure_url) {
    throw new Error(json?.error?.message || "Image upload failed.");
  }
  return json.secure_url as string;
}
