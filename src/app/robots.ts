import type { MetadataRoute } from "next";

/**
 * Dr. Huxon Labs — robots.txt
 *
 * Allows all major crawlers to access the storefront, blocks internal
 * surfaces (/admin, /api) and points every crawler at the XML sitemap.
 */
const BASE_URL = "https://drhuxon.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
