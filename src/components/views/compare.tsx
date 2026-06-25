"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, formatINR, discountPercent } from "@/lib/catalog";
import { useNav, useCart } from "@/lib/store";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconArrowLeft,
  IconArrowRight,
  IconClose,
  IconCheck,
  IconStar,
  IconBolt,
  IconPlus,
  IconCompare,
} from "@/components/icons";
import { ProteinRing, Reveal, Pill, StarRating } from "@/components/primitives";
import { cn } from "@/lib/utils";

const COMPARE_ROWS: {
  label: string;
  get: (p: (typeof PRODUCTS)[number]) => string | number;
  better: "high" | "low";
}[] = [
  { label: "Protein / serving", get: (p) => `${p.proteinGrams}g`, better: "high" },
  { label: "Servings", get: (p) => p.servings, better: "high" },
  { label: "Rating", get: (p) => p.rating.toFixed(1), better: "high" },
  { label: "Reviews", get: (p) => p.reviewCount.toLocaleString("en-IN"), better: "high" },
  { label: "Price", get: (p) => formatINR(p.price), better: "low" },
  { label: "Cost / serving", get: (p) => formatINR(Math.round(p.price / p.servings)), better: "low" },
  { label: "Calories", get: (p) => p.nutritionFacts.find((n) => n.label === "Calories")?.value ?? "—", better: "low" },
];

/**
 * Compare view — side-by-side product comparison with radar chart.
 */
export function CompareView() {
  const { compareIds, toggleCompare, clearCompare, setRoute } = useNav();
  const products = PRODUCTS.filter((p) => compareIds.includes(p.id));

  return (
    <div className="px-4 pb-8 pt-4">
      <Reveal>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRoute("shop")}
              aria-label="Back"
              className="grid h-9 w-9 place-items-center rounded-full glass"
            >
              <IconArrowLeft size={16} />
            </button>
            <div>
              <h1 className="font-display text-[24px] font-semibold text-cream-gradient">
                Compare
              </h1>
              <p className="text-[11px] text-muted-foreground">
                {products.length} product{products.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          </div>
          {products.length > 0 ? (
            <button
              onClick={clearCompare}
              className="flex items-center gap-1 rounded-full glass px-3 py-2 text-[11px] font-medium text-muted-foreground"
            >
              <IconClose size={12} />
              Clear
            </button>
          ) : null}
        </div>
      </Reveal>

      {products.length < 2 ? (
        <EmptyCompare selectedCount={products.length} />
      ) : (
        <CompareContent products={products} onRemove={toggleCompare} />
      )}
    </div>
  );
}

function EmptyCompare({ selectedCount }: { selectedCount: number }) {
  const { setRoute } = useNav();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="relative grid h-24 w-24 place-items-center"
      >
        <div className="absolute inset-0 rounded-full bg-[oklch(var(--gold)/0.12)] blur-2xl" />
        <div className="relative grid h-20 w-20 place-items-center rounded-full glass">
          <IconCompare size={32} className="text-muted-foreground" />
        </div>
      </motion.div>
      <h3 className="mt-6 font-display text-[18px] font-semibold text-cream-gradient">
        {selectedCount === 0
          ? "No products to compare"
          : "Add one more to compare"}
      </h3>
      <p className="mt-1 max-w-[280px] text-[13px] text-muted-foreground">
        Select 2–3 products from the shop or wishlist to see them side-by-side
        with a radar chart and full spec table.
      </p>
      <HuxonButton size="md" glow className="mt-5" onClick={() => setRoute("shop")}>
        Browse products
        <IconArrowRight size={14} />
      </HuxonButton>

      {/* Hint: tap compare icon */}
      <div className="mt-8 flex items-center gap-2 rounded-2xl glass p-3 text-[11px] text-muted-foreground">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(var(--gold)/0.14)]">
          <IconCompare size={14} className="text-gold-gradient" />
        </div>
        Tap the compare icon on any product to add it here.
      </div>
    </div>
  );
}

function CompareContent({
  products,
  onRemove,
}: {
  products: (typeof PRODUCTS)[number][];
  onRemove: (id: string) => void;
}) {
  const { addItem } = useCart();
  const { openProduct } = useNav();

  // Determine best value per row
  const bestMap = COMPARE_ROWS.map((row) => {
    const values = products.map((p) => row.get(p));
    const nums = values.map((v) => parseFloat(String(v).replace(/[^\d.]/g, "")));
    const bestIdx =
      row.better === "high"
        ? nums.indexOf(Math.max(...nums))
        : nums.indexOf(Math.min(...nums));
    return bestIdx;
  });

  return (
    <div className="mt-5 space-y-4">
      {/* Product headers */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${products.length}, 1fr)` }}
      >
        {products.map((p) => (
          <div key={p.id} className="flex flex-col items-center">
            <div className="relative h-[90px] w-full">
              <button
                onClick={() => onRemove(p.id)}
                className="absolute -right-1 -top-1 z-10 grid h-6 w-6 place-items-center rounded-full bg-[oklch(var(--glass-tint)/0.15)] text-muted-foreground backdrop-blur-md"
                aria-label="Remove from compare"
              >
                <IconClose size={11} />
              </button>
              <div
                className="absolute inset-0 rounded-full blur-xl"
                style={{ background: `${p.accent.replace(")", " / 0.3)")}` }}
              />
              <img
                src={p.heroImage}
                alt={p.name}
                className="relative h-full w-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0";
                }}
              />
            </div>
            <button
              onClick={() => openProduct(p.id)}
              className="mt-2 line-clamp-2 text-center text-[11px] font-semibold leading-tight text-cream-gradient"
            >
              {p.name}
            </button>
            <div className="mt-0.5 flex items-center gap-0.5">
              <IconStar size={8} active />
              <span className="text-[9px] text-muted-foreground tabular">
                {p.rating.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Radar chart */}
      <CompareRadar products={products} />

      {/* Spec table */}
      <div className="overflow-hidden rounded-2xl glass">
        {COMPARE_ROWS.map((row, ri) => (
          <div
            key={row.label}
            className={cn(
              "grid items-center gap-2 px-3 py-2.5",
              ri % 2 === 0 ? "bg-[oklch(var(--glass-tint)/0.03)]" : "",
              ri < COMPARE_ROWS.length - 1 && "border-b border-border/40"
            )}
            style={{ gridTemplateColumns: `repeat(${products.length}, 1fr)` }}
          >
            {products.map((p, pi) => {
              const isBest = pi === bestMap[ri];
              return (
                <div key={p.id} className="text-center">
                  <div
                    className={cn(
                      "text-[12px] font-semibold tabular",
                      isBest ? "text-gold-gradient" : "text-foreground/80"
                    )}
                  >
                    {row.get(p)}
                  </div>
                  {isBest ? (
                    <div className="mx-auto mt-0.5 h-1 w-4 rounded-full bg-[oklch(var(--gold))]" />
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Row labels (left side) */}
      <div className="space-y-1">
        {COMPARE_ROWS.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-center rounded-lg bg-[oklch(var(--glass-tint)/0.04)] py-1 text-[9px] uppercase tracking-wide text-muted-foreground"
          >
            {row.label}
          </div>
        ))}
      </div>

      {/* Add to cart row */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${products.length}, 1fr)` }}
      >
        {products.map((p) => (
          <HuxonButton
            key={p.id}
            size="sm"
            variant="secondary"
            className="w-full"
            onClick={() => addItem(p)}
          >
            <IconBolt size={12} />
            Add
          </HuxonButton>
        ))}
      </div>

      {/* Value scores */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${products.length}, 1fr)` }}
      >
        {products.map((p) => {
          const valueScore = Math.round(
            ((p.proteinGrams * p.servings) / p.price) * 60 + (p.rating / 5) * 40
          );
          return (
            <div
              key={p.id}
              className="flex flex-col items-center rounded-2xl glass p-3"
            >
              <ProteinRing
                value={valueScore}
                size={56}
                stroke={5}
                color={p.accent}
              >
                <span className="text-[12px] font-bold text-cream-gradient">
                  {valueScore}
                </span>
              </ProteinRing>
              <span className="mt-1 text-[9px] uppercase tracking-wide text-muted-foreground">
                Value
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CompareRadar({
  products,
}: {
  products: (typeof PRODUCTS)[number][];
}) {
  const axes = [
    { label: "Protein", max: 30, get: (p: any) => p.proteinGrams },
    { label: "Rating", max: 5, get: (p: any) => p.rating },
    { label: "Reviews", max: 3500, get: (p: any) => p.reviewCount },
    { label: "Servings", max: 30, get: (p: any) => p.servings },
    { label: "Value", max: 100, get: (p: any) => (p.proteinGrams * p.servings) / (p.price / 100) },
    { label: "Trust", max: 100, get: () => 92 },
  ];

  return (
    <div className="overflow-hidden rounded-2xl glass p-4">
      <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        Performance radar
      </div>
      <div className="relative mx-auto h-[220px] w-[220px]">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          {/* Grid */}
          {[0.25, 0.5, 0.75, 1].map((r) => (
            <circle
              key={r}
              cx="100"
              cy="100"
              r={70 * r}
              fill="none"
              stroke="oklch(var(--glass-border)/0.1)"
              strokeWidth="1"
            />
          ))}
          {axes.map((_, i) => {
            const a = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <line
                key={i}
                x1="100"
                y1="100"
                x2={100 + Math.cos(a) * 70}
                y2={100 + Math.sin(a) * 70}
                stroke="oklch(var(--glass-border)/0.08)"
                strokeWidth="1"
              />
            );
          })}
          {/* Product polygons */}
          {products.map((p, pi) => (
            <motion.polygon
              key={p.id}
              points={axes
                .map((ax, i) => {
                  const a = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
                  const r = Math.min(1, ax.get(p) / ax.max) * 70;
                  return `${100 + Math.cos(a) * r},${100 + Math.sin(a) * r}`;
                })
                .join(" ")}
              fill={`${p.accent.replace(")", " / 0.18)")}`}
              stroke={p.accent}
              strokeWidth="2"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: pi * 0.15 }}
              style={{ transformOrigin: "center" }}
            />
          ))}
          {/* Axis labels */}
          {axes.map((ax, i) => {
            const a = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
            const r = 86;
            return (
              <text
                key={ax.label}
                x={100 + Math.cos(a) * r}
                y={100 + Math.sin(a) * r}
                fill="oklch(var(--muted-foreground))"
                fontSize="8"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {ax.label}
              </text>
            );
          })}
        </svg>
      </div>
      {/* Legend */}
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: p.accent }}
            />
            <span className="text-[10px] text-muted-foreground">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
