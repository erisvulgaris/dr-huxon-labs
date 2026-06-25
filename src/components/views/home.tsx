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
import { EducationSection } from "@/components/sections/education";
import { RecentlyViewed } from "@/components/sections/recently-viewed";
import { BundleCTA } from "@/components/sections/bundle-cta";
import { HuxonButton } from "@/components/huxon-button";
import { useNav } from "@/lib/store";
import { IconArrowRight, IconBolt } from "@/components/icons";

/**
 * Home view — composes all 10 sections of the homepage + recently viewed.
 */
export function HomeView() {
  return (
    <div className="relative">
      <HeroSection />
      <TrustWidgets />
      <RecentlyViewed />
      <ProductExplorer />
      <NutritionScience />
      <IngredientTransparency />
      <ManufacturingTimeline />
      <ProteinCalculator />
      <ComparisonWidget />
      <CustomerStories />
      <EducationSection />
      <BundleCTA />
      <FAQSection />
      <FooterCTA />
    </div>
  );
}

function FooterCTA() {
  const { setRoute } = useNav();
  return (
    <section className="relative px-4 py-12">
      <div className="relative overflow-hidden rounded-3xl border border-[oklch(var(--gold)/0.25)] bg-gradient-to-br from-[oklch(var(--espresso))] via-[oklch(var(--cocoa)/0.6)] to-[oklch(var(--charcoal)/0.8)] p-6">
        {/* Ambient */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[oklch(var(--gold)/0.25)] blur-3xl animate-glow-pulse" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[oklch(var(--gold)/0.15)] blur-3xl" />
        <div className="bg-molecular absolute inset-0 opacity-40" />

        <div className="relative">
          <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-gradient">
            Begin your journey
          </div>
          <h2 className="mt-2 font-display text-[26px] font-semibold leading-tight text-cream-gradient text-balance">
            Premium nutrition, delivered to your door.
          </h2>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Join 12,000+ athletes who chose science over hype. First order gets ₹200 off.
          </p>
          <div className="mt-4 flex gap-2">
            <HuxonButton size="md" glow onClick={() => setRoute("shop")}>
              <IconBolt size={16} />
              Shop now
              <IconArrowRight size={14} />
            </HuxonButton>
            <HuxonButton size="md" variant="secondary" onClick={() => setRoute("explore")}>
              Explore
            </HuxonButton>
          </div>
        </div>
      </div>
    </section>
  );
}
