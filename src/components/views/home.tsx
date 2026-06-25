"use client";

import { HeroSection } from "@/components/sections/hero";
import { TrustWidgets } from "@/components/sections/trust";
import { ProductExplorer } from "@/components/sections/products";
import { NutritionScience } from "@/components/sections/science";
import { IngredientTransparency } from "@/components/sections/ingredients";
import { ManufacturingTimeline } from "@/components/sections/manufacturing";
import { ProteinCalculator } from "@/components/sections/calculator";
import { ComparisonWidget } from "@/components/sections/comparison";
import { CustomerStories } from "@/components/sections/stories";
import { FAQSection } from "@/components/sections/faq";

/**
 * Home view — composes all 10 sections of the homepage.
 */
export function HomeView() {
  return (
    <div className="relative">
      <HeroSection />
      <TrustWidgets />
      <ProductExplorer />
      <NutritionScience />
      <IngredientTransparency />
      <ManufacturingTimeline />
      <ProteinCalculator />
      <ComparisonWidget />
      <CustomerStories />
      <FAQSection />
      <FooterCTA />
    </div>
  );
}

function FooterCTA() {
  return (
    <section className="relative px-4 py-12">
      <div className="relative overflow-hidden rounded-3xl border border-[oklch(0.78_0.13_75_/_0.25)] bg-gradient-to-br from-[oklch(0.22_0.02_55)] via-[oklch(0.17_0.012_55)] to-[oklch(0.13_0.008_50)] p-6">
        {/* Ambient */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[oklch(0.78_0.13_75_/_0.25)] blur-3xl" />
        <div className="bg-molecular absolute inset-0 opacity-40" />

        <div className="relative">
          <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[oklch(0.78_0.13_75)]">
            Begin your journey
          </div>
          <h2 className="mt-2 font-display text-[26px] font-semibold leading-tight text-cream-gradient text-balance">
            Premium nutrition, delivered to your door.
          </h2>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Join 12,000+ athletes who chose science over hype.
          </p>
        </div>
      </div>
    </section>
  );
}
