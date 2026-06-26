import type { MetadataRoute } from "next";
import { abs } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep the admin dashboard out of search results.
        disallow: ["/admin"],
      },
    ],
    sitemap: abs("/sitemap.xml"),
  };
}
