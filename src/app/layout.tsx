import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

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

export const metadata: Metadata = {
  title: "Dr. Huxon Labs — Premium Plant-Based Nutrition",
  description:
    "Pharmaceutical-grade plant-based protein & supplements, engineered in India. Lab-tested, clean-label, export-quality nutrition for performance living.",
  keywords: [
    "plant protein",
    "vegan protein",
    "high protein",
    "Indian nutrition",
    "Dr. Huxon Labs",
    "clean label supplements",
    "premium nutrition",
  ],
  authors: [{ name: "Dr. Huxon Labs" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Huxon",
  },
  openGraph: {
    title: "Dr. Huxon Labs — Premium Plant-Based Nutrition",
    description:
      "Pharmaceutical-grade plant-based protein engineered in India.",
    siteName: "Dr. Huxon Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Huxon Labs",
    description: "Premium plant-based nutrition, engineered in India.",
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
          {children}
          <Toaster />
          <SonnerToaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
