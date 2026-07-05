import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import {
  OrganizationJsonLd,
  WebSiteJsonLd,
} from "@/components/structured-data";
import { AllProductsStructuredData } from "@/components/product-structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const SITE_URL = "https://drhuxon.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dr. Huxon Labs — Premium Plant-Based Nutrition",
    template: "%s · Dr. Huxon Labs",
  },
  description:
    "Pharmaceutical-grade plant-based protein & supplements, engineered in India. Lab-tested, clean-label, export-quality nutrition for performance living.",
  applicationName: "Dr. Huxon Labs",
  keywords: [
    "plant protein",
    "vegan protein",
    "high protein",
    "Indian nutrition",
    "Dr. Huxon Labs",
    "clean label supplements",
    "premium nutrition",
    "pea protein isolate",
    "plant-based protein India",
    "recovery matrix",
    "pre-workout plant-based",
    "daily greens",
    "omega-3 algae oil",
    "protein bars",
  ],
  authors: [{ name: "Dr. Huxon Labs", url: SITE_URL }],
  creator: "Dr. Huxon Labs",
  publisher: "Dr. Huxon Labs",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  category: "Health & Nutrition",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Dr. Huxon Labs",
    title: "Dr. Huxon Labs — Premium Plant-Based Nutrition",
    description:
      "Pharmaceutical-grade plant-based protein engineered in India. Lab-tested, clean-label, export-quality nutrition for performance living.",
    images: [
      {
        url: "/products/gold-isolate.png",
        width: 1200,
        height: 1200,
        alt: "Huxon Gold Isolate — flagship plant protein",
      },
      {
        url: "/products/recovery-matrix.png",
        width: 1200,
        height: 1200,
        alt: "Huxon Recovery Matrix — post-workout recovery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@drhuxonlabs",
    creator: "@drhuxonlabs",
    title: "Dr. Huxon Labs — Premium Plant-Based Nutrition",
    description:
      "Pharmaceutical-grade plant-based protein & supplements, engineered in India.",
    images: ["/products/gold-isolate.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Huxon",
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ec" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1410" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Site-wide JSON-LD: Organization + WebSite (with SearchAction) */}
          <OrganizationJsonLd />
          <WebSiteJsonLd />
          {/* Per-product structured data for rich product snippets */}
          <AllProductsStructuredData />
          {children}
          <Toaster />
          <SonnerToaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
