"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INGREDIENTS, type BrandIngredient } from "@/lib/catalog";
import {
  SectionHeader,
  Reveal,
  ProteinRing,
  Stagger,
  StaggerItem,
} from "@/components/primitives";
import { useNav } from "@/lib/store";
import {
  IconClose,
  IconLocation,
  IconCheck,
  IconLeaf,
  IconArrowUpRight,
} from "@/components/icons";

/**
 * Section 5 — Ingredient transparency.
 * Premium ingredient cards + bottom sheet with scientific details.
 */
export function IngredientTransparency() {
  const { setIngredientSheet } = useNav();

  return (
    <section className="relative px-4 py-12">
      <SectionHeader
        kicker="Full Transparency"
        title={
          <>
            Every ingredient, <span className="text-gold-gradient">traceable.</span>
          </>
        }
        subtitle="Tap any ingredient to see its origin, processing method, and quality score."
      />

      <Stagger className="mt-7 grid grid-cols-2 gap-3" staggerChildren={0.06}>
        {INGREDIENTS.map((ing) => (
          <StaggerItem key={ing.id}>
            <IngredientCard
              ingredient={ing}
              onClick={() => setIngredientSheet(ing.id)}
            />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

function IngredientCard({
  ingredient,
  onClick,
}: {
  ingredient: BrandIngredient;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative flex w-full flex-col overflow-hidden rounded-3xl glass p-3 text-left"
    >
      {/* Macro image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[oklch(0.13_0.008_50)]">
        <img
          src={ingredient.macroImage}
          alt={ingredient.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Quality score badge */}
        <div className="absolute right-2 top-2">
          <div className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.62_0.10_160)]" />
            <span className="text-[9px] font-semibold text-text-gold tabular">
              {ingredient.qualityScore}
            </span>
          </div>
        </div>
        {/* Origin */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[9px] text-cream/90">
          <IconLocation size={10} />
          {ingredient.origin.split(",")[0]}
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-[13px] font-semibold leading-tight text-cream-gradient">
            {ingredient.name}
          </h3>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {ingredient.processingMethod.split("+")[0].trim()}
          </p>
        </div>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[oklch(0.78_0.13_75_/_0.12)] text-text-gold transition-transform group-hover:rotate-45">
          <IconArrowUpRight size={12} />
        </span>
      </div>
    </motion.button>
  );
}

/**
 * Ingredient detail bottom sheet.
 */
export function IngredientSheet() {
  const { ingredientSheetId, setIngredientSheet } = useNav();
  const ingredient = INGREDIENTS.find((i) => i.id === ingredientSheetId);
  const isOpen = !!ingredient;

  return (
    <AnimatePresence>
      {isOpen && ingredient ? (
        <IngredientSheetContent
          key="is"
          ingredient={ingredient}
          onClose={() => setIngredientSheet(null)}
        />
      ) : null}
    </AnimatePresence>
  );
}

function IngredientSheetContent({
  ingredient,
  onClose,
}: {
  ingredient: BrandIngredient;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
    >
      <motion.div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="relative z-10 flex max-h-[88dvh] w-full max-w-[460px] flex-col overflow-hidden rounded-t-[28px] border-t border-[oklch(var(--glass-tint)/0.1)] bg-background"
      >
        <div className="mx-auto my-3 h-1 w-10 rounded-full bg-[oklch(var(--glass-tint)/0.2)]" />
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full glass"
        >
          <IconClose size={16} />
        </button>

        <div className="no-scrollbar flex-1 overflow-y-auto pb-8">
          {/* Hero image */}
          <div className="relative h-[200px] w-full overflow-hidden">
            <img
              src={ingredient.macroImage}
              alt={ingredient.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "0";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute bottom-3 left-5 right-5">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-text-gold">
                <IconLeaf size={11} />
                {ingredient.category.replace("-", " ")}
              </div>
              <h2 className="mt-1 font-display text-[24px] font-semibold text-cream-gradient">
                {ingredient.name}
              </h2>
              <div className="mt-1 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <IconLocation size={12} />
                {ingredient.origin}
              </div>
            </div>
          </div>

          <div className="space-y-4 px-5 pt-4">
            {/* Quality score */}
            <div className="flex items-center gap-4 rounded-2xl glass p-4">
              <ProteinRing
                value={ingredient.qualityScore}
                size={72}
                stroke={6}
                label="Quality"
              />
              <div className="flex-1">
                <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Quality Score
                </div>
                <div className="text-[15px] font-semibold text-cream-gradient">
                  {ingredient.qualityScore >= 95
                    ? "Pharmaceutical grade"
                    : ingredient.qualityScore >= 90
                    ? "Premium grade"
                    : "Standard grade"}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  Verified by independent NABL lab
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="rounded-2xl glass p-4">
              <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Benefits
              </div>
              <div className="space-y-2">
                {ingredient.benefits.map((b) => (
                  <div key={b} className="flex items-start gap-2 text-[13px]">
                    <span className="mt-0.5 grid h-4 w-4 place-items-center rounded-full bg-[oklch(0.62_0.10_160_/_0.18)]">
                      <IconCheck size={10} />
                    </span>
                    <span className="text-foreground/85">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Processing + nutritional */}
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-2xl glass p-4">
                <div className="mb-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Processing Method
                </div>
                <div className="text-[13px] text-foreground/90">
                  {ingredient.processingMethod}
                </div>
              </div>
              <div className="rounded-2xl glass p-4">
                <div className="mb-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Nutritional Contribution
                </div>
                <div className="text-[13px] text-foreground/90">
                  {ingredient.nutritionalContribution}
                </div>
              </div>
            </div>

            {/* Source map (stylized) */}
            <SourceMap
              lat={ingredient.originLat}
              lng={ingredient.originLng}
              name={ingredient.origin}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SourceMap({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  // Project India-centric lat/lng into a stylized SVG
  // India approx bounds: lng 68-97, lat 8-37
  const x = ((lng - 68) / (97 - 68)) * 300;
  const y = ((37 - lat) / (37 - 8)) * 200;

  return (
    <div className="overflow-hidden rounded-2xl glass p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Source Origin
        </span>
        <span className="text-[11px] text-muted-foreground">{name}</span>
      </div>
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-[oklch(0.10_0.005_50)]">
        <svg viewBox="0 0 300 200" className="h-full w-full">
          {/* Grid */}
          <defs>
            <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="oklch(0.96 0.012 80 / 0.05)" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="map-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="oklch(0.78 0.13 75 / 0.6)" />
              <stop offset="1" stopColor="oklch(0.78 0.13 75 / 0)" />
            </radialGradient>
          </defs>
          <rect width="300" height="200" fill="url(#map-grid)" />
          {/* Stylized India outline */}
          <path
            d="M 80 30 Q 110 20 140 35 Q 170 50 180 80 Q 195 110 175 145 Q 150 175 120 170 Q 90 165 75 140 Q 60 110 65 80 Q 70 50 80 30 Z"
            fill="oklch(0.78 0.13 75 / 0.06)"
            stroke="oklch(0.78 0.13 75 / 0.4)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          {/* Glow */}
          <circle cx={x} cy={y} r="30" fill="url(#map-glow)" />
          {/* Pin */}
          <motion.circle
            cx={x}
            cy={y}
            r="5"
            fill="oklch(0.92 0.10 85)"
            stroke="oklch(0.14 0.01 50)"
            strokeWidth="1.5"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Pulse */}
          <motion.circle
            cx={x}
            cy={y}
            r="5"
            fill="none"
            stroke="oklch(0.92 0.10 85)"
            strokeWidth="1.5"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        </svg>
      </div>
    </div>
  );
}
