import React from "react";

/**
 * Dr. Huxon Labs — JSON-LD structured data components (server-rendered).
 *
 * These <script type="application/ld+json"> tags are injected into the
 * document <body> (Next.js App Router lets us render them anywhere in
 * the React tree — they are hoisted to the document head at runtime).
 *
 * Components are intentionally framework-agnostic and side-effect free
 * so they can be embedded from layout.tsx, page.tsx, or any view.
 */

export const SITE_URL = "https://drhuxon.com";
export const BRAND_NAME = "Dr. Huxon Labs";
export const BRAND_LOGO = `${SITE_URL}/logo.svg`;
export const BRAND_EMAIL = "care@drhuxon.com";

const SOCIAL_LINKS = [
  "https://instagram.com/drhuxonlabs",
  "https://twitter.com/drhuxonlabs",
  "https://facebook.com/drhuxonlabs",
  "https://youtube.com/@drhuxonlabs",
];

/** JSON-LD for the brand / company itself (Organization). */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    legalName: BRAND_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: BRAND_LOGO,
      width: 512,
      height: 512,
    },
    image: BRAND_LOGO,
    description:
      "Pharmaceutical-grade plant-based protein & supplements, engineered in India. Lab-tested, clean-label, export-quality nutrition for performance living.",
    email: BRAND_EMAIL,
    foundingDate: "2023",
    founders: [{ "@type": "Person", name: "Dr. Huxon" }],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Dr. Huxon Labs, Whitefield",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      postalCode: "560066",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: BRAND_EMAIL,
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    ],
    sameAs: SOCIAL_LINKS,
  };

  return <JsonLd data={data} />;
}

/** JSON-LD for the website with a SearchAction (sitelinks search box). */
export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BRAND_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={data} />;
}

/**
 * BreadcrumbList JSON-LD.
 *
 * @param items - ordered list of { name, url } breadcrumbs.
 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

/**
 * Generic JSON-LD renderer.
 *
 * Renders an indented JSON-LD <script> tag. The contents are serialised
 * once on the server, so the markup is present in the initial HTML and
 * discoverable by search-engine crawlers.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inject inside a <script> element as
      // long as "</script>" sequences are escaped — they cannot occur in our
      // data because we only serialise primitives, arrays and objects.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
