import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { CLOUDINARY, isCloudinaryConfigured, signUpload } from "@/lib/cloudinary";

/**
 * POST /api/admin/cloudinary-sign
 * Admin-only. Returns a short-lived signature so the browser can upload one
 * image directly to Cloudinary without ever seeing the API secret.
 */
export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  if (!isCloudinaryConfigured) {
    return NextResponse.json(
      { ok: false, error: "Cloudinary is not configured on the server." },
      { status: 500 },
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signUpload({ folder: CLOUDINARY.folder, timestamp });

  return NextResponse.json({
    ok: true,
    cloudName: CLOUDINARY.cloudName,
    apiKey: CLOUDINARY.apiKey,
    folder: CLOUDINARY.folder,
    timestamp,
    signature,
  });
}
