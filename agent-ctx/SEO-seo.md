# Task ID: SEO — Dr. Huxon Labs SEO Infrastructure

**Agent:** SEO
**Date:** 2026-07-05
**Status:** ✅ Complete

## Scope

Built a complete, production-grade SEO infrastructure for the Dr. Huxon Labs
single-page App Router storefront:

1. XML sitemap (`/sitemap.xml`)
2. Robots.txt (`/robots.txt`)
3. JSON-LD structured data (Organization, WebSite, BreadcrumbList, Product ×6)
4. Enhanced `<Metadata>` in `layout.tsx` (metadataBase, canonical, OG, Twitter,
   robots directives, icons)
5. Per-product structured data component

## Files Created

| File | Purpose |
| --- | --- |
| `src/app/sitemap.ts` | Next.js 16 metadata route. Emits 11 URLs: home, shop, explore, rewards, bundle + 6 product deep links (`#product/{slug}`). Daily/weekly changeFreq, priority 0.6–1.0. |
| `src/app/robots.ts` | Next.js 16 metadata route. `User-agent: *` allow `/`, disallow `/admin` and `/api`, host + sitemap directives. |
| `src/components/structured-data.tsx` | Generic `JsonLd` renderer + `OrganizationJsonLd`, `WebSiteJsonLd` (with SearchAction) and `BreadcrumbJsonLd` schema components. Server-rendered. |
| `src/components/product-structured-data.tsx` | `ProductStructuredData` (schema.org/Product with offers in INR, brand, image, aggregateRating, proteinContent) + `ProductBreadcrumbJsonLd` + `AllProductsStructuredData` helper that renders all 6 products. |

## Files Modified

| File | Change |
| --- | --- |
| `src/app/layout.tsx` | Expanded `metadata`: metadataBase → `https://drhuxon.com`, title template, expanded keywords, canonical, OG images (`/products/gold-isolate.png` + `recovery-matrix.png` with width/height/alt), Twitter card with `@drhuxonlabs`, robots/googleBot directives (`max-image-preview: large`), icons, formatDetection. Mounted `<OrganizationJsonLd/>`, `<WebSiteJsonLd/>`, `<AllProductsStructuredData/>` inside `<ThemeProvider>` so they ship in the initial SSR HTML. |
| `public/robots.txt` | **Deleted** — superseded by `src/app/robots.ts` to avoid route/static conflict. |

## Key Decisions

- **Hash-based deep-link URLs** (`#shop`, `#product/{slug}`) used in sitemap
  because the storefront uses pure client-side state routing (Zustand
  `useNav`). Hash URLs all resolve to `/` so crawlers never see a 404, while
  still documenting the site structure.
- **All Product schemas rendered in `layout.tsx`** (not only on the active
  product view) so all 6 product rich-snippet blocks are present in the
  initial server-rendered HTML — independent of which client-side route is
  active. This is the correct pattern for SPAs.
- **JSON-LD rendered via `dangerouslySetInnerHTML`** with `<` escaped to
  `\u003c` to prevent any HTML-injection / `</script>`-termination issues.
- **INR currency** and India-specific address/contactPoint used throughout
  to match the brand's market.

## Verification

### Lint
```
$ bun run lint
$ eslint .
(no output — passed)
```

### Sitemap (first 30 lines)
```
HTTP 200 | 1909 bytes
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
  <loc>https://drhuxon.com/</loc>
  <lastmod>2026-07-05T03:04:18.389Z</lastmod>
  <changefreq>daily</changefreq>
  <priority>1</priority>
</url>
<url>
  <loc>https://drhuxon.com/#shop</loc>
  ...
</url>
... (11 URLs total: 1 home + 4 nav + 6 products)
```

### Robots
```
HTTP 200 | 123 bytes
User-Agent: *
Allow: /
Disallow: /admin
Disallow: /api

Host: https://drhuxon.com
Sitemap: https://drhuxon.com/sitemap.xml
```

### JSON-LD on `/` (curl)
8 `<script type="application/ld+json">` blocks rendered in the initial HTML:
- 1 × Organization (with ContactPoint, PostalAddress, founder, sameAs)
- 1 × WebSite (with SearchAction)
- 6 × Product (each with Brand, Offer INR, AggregateRating, QuantitativeValue)

`@type`s present:
```
"@type":"AggregateRating"
"@type":"Brand"
"@type":"ContactPoint"
"@type":"EntryPoint"
"@type":"ImageObject"
"@type":"Offer"
"@type":"Organization"
"@type":"Person"
"@type":"PostalAddress"
"@type":"Product"
"@type":"QuantitativeValue"
"@type":"SearchAction"
"@type":"WebSite"
```

### Meta tags on `/`
- `<link rel="canonical" href="https://drhuxon.com"/>`
- `<meta name="robots" content="index, follow"/>`
- OG: title, description, url, site_name, locale `en_IN`, type `website`, two images (1200×1200 with alt)
- Twitter: `summary_large_image`, `@drhuxonlabs` site + creator, image

### Dev log
```
GET /sitemap.xml 200 in 337ms
GET /robots.txt 200 in 129ms
GET / 200 in 461ms
```
No errors. All routes return 200.

## Notes for Future Agents

- The `ProductStructuredData` and `ProductBreadcrumbJsonLd` components are
  exported but currently only `AllProductsStructuredData` is mounted (in
  `layout.tsx`). If the app later moves to true URL-based routing
  (`/product/[slug]`), the per-product component can be dropped into the
  new dynamic route's `page.tsx` and `AllProductsStructuredData` removed
  from the layout to avoid duplicate IDs.
- `SITE_URL` is hard-coded to `https://drhuxon.com` in
  `src/components/structured-data.tsx`. Move to `process.env.NEXT_PUBLIC_SITE_URL`
  if multi-environment support is needed.
- Schema uses `@id` anchors (`#organization`, `#website`, `#product/{slug}`)
  so the Organization, WebSite and Product graphs are linked — Google
  prefers this pattern for connected entities.
