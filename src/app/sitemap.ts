import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/catalog";

/**
 * Dr. Huxon Labs — XML sitemap
 *
 * The storefront is a mobile-first single-page application that uses
 * client-side (hash) routing, so every entry resolves to the same
 * server-rendered document at "/". Hash fragments are preserved in
 * the URL so crawlers learn the site structure and so users following
 * a deep link land on the correct view once the SPA hydrates.
 */
const BASE_URL = "https://drhuxon.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/#shop`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/#explore`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/#rewards`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/#bundle`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const productEntries: MetadataRoute.Sitemap = PRODUCTS.map((product) => ({
    url: `${BASE_URL}/#product/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
