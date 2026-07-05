import React from "react";
import { PRODUCTS, type BrandProduct } from "@/lib/catalog";
import {
  BreadcrumbJsonLd,
  BRAND_LOGO,
  BRAND_NAME,
  JsonLd,
  SITE_URL,
} from "@/components/structured-data";

/**
 * Product JSON-LD structured data.
 *
 * Renders a schema.org/Product block for every product, including offers
 * (price in INR), brand, image, description, and aggregate rating. The
 * component is mounted inside the ProductView so the JSON-LD updates
 * whenever the active product changes.
 *
 * Reference: https://developers.google.com/search/docs/appearance/structured-data/product
 */
export function ProductStructuredData({ product }: { product: BrandProduct }) {
  const productUrl = `${SITE_URL}/#product/${product.slug}`;
  const imageUrl = `${SITE_URL}${product.heroImage}`;
  const priceValidUntil = new Date(
    new Date().setFullYear(new Date().getFullYear() + 1),
  )
    .toISOString()
    .split("T")[0];

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productUrl,
    name: product.name,
    alternateName: product.tagline,
    description: product.description,
    image: [
      imageUrl,
      ...product.galleryImages.map((g) => `${SITE_URL}${g}`),
    ],
    url: productUrl,
    sku: product.id.toUpperCase(),
    mpn: product.id.toUpperCase(),
    category: product.category,
    brand: {
      "@type": "Brand",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND_NAME,
      logo: BRAND_LOGO,
    },
    flavor: product.flavor,
    proteinContent: {
      "@type": "QuantitativeValue",
      value: product.proteinGrams,
      unitCode: "GRM",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: BRAND_NAME,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return <JsonLd data={data} />;
}

/**
 * BreadcrumbList for the product detail view.
 *
 * Home → Shop → {Product name}
 */
export function ProductBreadcrumbJsonLd({
  product,
}: {
  product: BrandProduct;
}) {
  return (
    <BreadcrumbJsonLd
      items={[
        { name: "Home", url: SITE_URL },
        { name: "Shop", url: `${SITE_URL}/#shop` },
        {
          name: product.name,
          url: `${SITE_URL}/#product/${product.slug}`,
        },
      ]}
    />
  );
}

/**
 * Renders Product JSON-LD for every product in the catalog.
 *
 * Mounted once at the layout level so all product structured data is
 * present in the initial server-rendered HTML — independent of which
 * client-side route the user happens to be on.
 */
export function AllProductsStructuredData() {
  return (
    <>
      {PRODUCTS.map((product) => (
        <ProductStructuredData key={product.id} product={product} />
      ))}
    </>
  );
}
