"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, formatINR, discountPercent } from "@/lib/catalog";
import { SectionHeader, Reveal, ProteinRing } from "@/components/primitives";
import { IconCheck, IconClose, IconPlus, IconArrowRight } from "@/components/icons";
import { HuxonButton } from "@/components/huxon-button";
import { useCart } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Section 8 — Comparison widget.
 * Compare multiple Huxon products side by side with radar chart + table.
 */
export function ComparisonWidget() {
  const all = PRODUCTS.slice(0, 4);
  const [selected, setSelected] = React.useState<string[]>([
    all[0].id,
    all[1].id,
  ]);

  const prods = all.filter((p) => selected.includes(p.id));

  const toggle = (id: string) => {
    setSelected((s) =>
      s.includes(id)
        ? s.filter((x) => x !== id)
        : s.length >= 3
        ? [s[1], s[2], id]
        : [...s, id]
    );
  };

  const rows: {
    label: string;
    get: (p: (typeof PRODUCTS)[number]) => string | number;
    better: "high" | "low";
  }[] = [
    { label: "Protein / serving", get: (p) => `${p.proteinGrams}g`, better: "high" },
    { label: "Servings", get: (p) => p.servings, better: "high" },
    { label: "Rating", get: (p) => p.rating.toFixed(1), better: "high" },
    { label: "Reviews", get: (p) => p.reviewCount.toLocaleString("en-IN"), better: "high" },
    { label: "Price", get: (p) => formatINR(p.price), better: "low" },
    { label: "Per serving", get: (p) => formatINR(Math.round(p.price / p.servings)), better: "low" },
  ];

  // Value score (0-100) — composite
  const valueScore = (p: (typeof PRODUCTS)[number]) => {
    const proteinPerRupee = (p.proteinGrams * p.servings) / p.price;
    const maxPPR = Math.max(...all.map((x) => (x.proteinGrams * x.servings) / x.price));
    const ratingScore = (p.rating / 5) * 100;
    return Math.round((proteinPerRupee / maxPPR) * 60 + ratingScore * 0.4);
  };

  return (
    <section className="relative px-4 py-12">
      <SectionHeader
        kicker="Compare"
        title={
          <>
            Pick two. <span className="text-gold-gradient">See the truth.</span>
          </>
        }
        subtitle="Compare protein, price, ratings and value scores side by side."
      />

      {/* Selector chips */}
      <Reveal className="mt-6">
        <div className="flex flex-wrap gap-2">
          {all.map((p) => {
            const active = selected.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all",
                  active
                    ? "border-[oklch(0.78_0.13_75_/_50%)] bg-[oklch(0.78_0.13_75_/_0.14)] text-[oklch(0.92_0.10_85)]"
                    : "border-border bg-transparent text-muted-foreground"
                )}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: p.accent }}
                />
                {p.name}
                {active ? <IconCheck size={11} /> : <IconPlus size={11} />}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Comparison view */}
      <Reveal className="mt-5">
        <div className="overflow-hidden rounded-3xl glass p-4">
          {/* Product headers */}
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `90px repeat(${prods.length}, 1fr)` }}
          >
            <div />
            {prods.map((p) => (
              <div key={p.id} className="flex flex-col items-center">
                <div className="relative h-[80px] w-[80px]">
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
                <div className="mt-2 text-center text-[10px] font-semibold leading-tight text-cream-gradient">
                  {p.name}
                </div>
                <div className="text-[9px] text-muted-foreground">{p.flavor}</div>
              </div>
            ))}
          </div>

          {/* Radar comparison */}
          <ComparisonRadar products={prods} />

          {/* Rows */}
          <div className="mt-4 space-y-1.5">
            {rows.map((row, ri) => {
              // Determine best
              const values = prods.map(row.get);
              let bestIdx = -1;
              if (typeof values[0] === "string") {
                // numeric strings like "27g" — extract number
                const nums = values.map((v) =>
                  parseFloat(String(v).replace(/[^\d.]/g, ""))
                );
                bestIdx =
                  row.better === "high"
                    ? nums.indexOf(Math.max(...nums))
                    : nums.indexOf(Math.min(...nums));
              }
              return (
                <div
                  key={row.label}
                  className="grid items-center gap-3 rounded-xl bg-[oklch(0.96_0.012_80_/_0.025)] px-2 py-2"
                  style={{ gridTemplateColumns: `90px repeat(${prods.length}, 1fr)` }}
                >
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {row.label}
                  </span>
                  {prods.map((p, pi) => (
                    <div
                      key={p.id}
                      className={cn(
                        "text-center text-[12px] font-semibold tabular",
                        pi === bestIdx ? "text-[oklch(0.92_0.10_85)]" : "text-foreground/80"
                      )}
                    >
                      {row.get(p)}
                      {pi === bestIdx ? (
                        <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.13_75)] align-middle" />
                      ) : null}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Value score */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {prods.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-2xl bg-[oklch(0.96_0.012_80_/_0.04)] p-3"
              >
                <ProteinRing
                  value={valueScore(p)}
                  size={56}
                  stroke={5}
                  color={p.accent}
                >
                  <span className="text-[12px] font-bold text-cream-gradient">
                    {valueScore(p)}
                  </span>
                </ProteinRing>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Value score
                  </span>
                  <span className="text-[12px] font-semibold">{p.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {discountPercent(p.price, p.mrp)}% off · {p.servings} servings
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <HuxonButton
            variant="secondary"
            size="md"
            className="mt-4 w-full"
            onClick={() => useCart.getState().addItem(prods[0])}
          >
            Add {prods[0]?.name} to cart
            <IconArrowRight size={14} />
          </HuxonButton>
        </div>
      </Reveal>
    </section>
  );
}

function ComparisonRadar({
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
    <div className="mt-4 grid place-items-center">
      <div className="relative h-[200px] w-[200px]">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          {/* Grid */}
          {[0.25, 0.5, 0.75, 1].map((r) => (
            <circle
              key={r}
              cx="100"
              cy="100"
              r={70 * r}
              fill="none"
              stroke="oklch(0.96 0.012 80 / 0.06)"
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
                stroke="oklch(0.96 0.012 80 / 0.05)"
                strokeWidth="1"
              />
            );
          })}
          {/* Each product polygon */}
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
            const r = 84;
            return (
              <text
                key={ax.label}
                x={100 + Math.cos(a) * r}
                y={100 + Math.sin(a) * r}
                fill="oklch(0.66 0.015 70)"
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
    </div>
  );
}
