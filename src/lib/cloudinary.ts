import crypto from "crypto";

/**
 * Cloudinary config + signing helper for secure (signed) admin uploads.
 * The API secret stays on the server — the browser only ever receives a
 * short-lived signature for a specific upload.
 */
export const CLOUDINARY = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
  apiKey: process.env.CLOUDINARY_API_KEY ?? "",
  apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  folder: "vintage-fabric/designs",
};

export const isCloudinaryConfigured = Boolean(
  CLOUDINARY.cloudName && CLOUDINARY.apiKey && CLOUDINARY.apiSecret,
);

/**
 * Cloudinary signature: alphabetically-sorted `key=value` pairs joined by `&`,
 * with the API secret appended, hashed with SHA-1.
 */
export function signUpload(params: Record<string, string | number>): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(toSign + CLOUDINARY.apiSecret).digest("hex");
}
