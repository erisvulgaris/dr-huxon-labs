"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, formatINR, discountPercent } from "@/lib/catalog";
import { useCart, useNav, useReward } from "@/lib/store";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconArrowLeft,
  IconArrowRight,
  IconPlus,
  IconMinus,
  IconCheck,
  IconBolt,
  IconStar,
  IconSpark,
  IconClose,
} from "@/components/icons";
import { Reveal, Stagger, StaggerItem, Pill, StarRating } from "@/components/primitives";
import { cn } from "@/lib/utils";

const BUNDLE_TIERS = [
  { minItems: 2, discount: 0.10, label: "10% off", color: "oklch(0.62 0.10 160)" },
  { minItems: 3, discount: 0.15, label: "15% off", color: "oklch(0.78 0.13 75)" },
  { minItems: 4, discount: 0.20, label: "20% off", color: "oklch(0.82 0.14 80)" },
];

/**
 * Bundle Builder view — mix-and-match products with live savings calculator.
 */
export function BundleView() {
  const { setRoute } = useNav();
  const { addItem } = useCart();
  const { addPoints, pushToast } = useReward();
  const [selections, setSelections] = React.useState<Record<string, number>>({
    [PRODUCTS[0].id]: 1,
    [PRODUCTS[1].id]: 1,
  });

  const selectedProducts = Object.entries(selections)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === id)!, qty }))
    .filter((s) => s.product);

  const totalItems = selectedProducts.reduce((n, s) => n + s.qty, 0);
  const originalTotal = selectedProducts.reduce(
    (n, s) => n + s.product.price * s.qty,
    0
  );

  const currentTier = [...BUNDLE_TIERS]
    .reverse()
    .find((t) => totalItems >= t.minItems);
  const discountRate = currentTier?.discount ?? 0;
  const discountAmount = Math.round(originalTotal * discountRate);
  const finalTotal = originalTotal - discountAmount;

  const nextTier = BUNDLE_TIERS.find((t) => t.minItems > totalItems);
  const itemsToNextTier = nextTier ? nextTier.minItems - totalItems : 0;

  const updateQty = (id: string, delta: number) => {
    setSelections((s) => {
      const current = s[id] ?? 0;
      const next = Math.max(0, Math.min(5, current + delta));
      return { ...s, [id]: next };
    });
  };

  const handleAddBundle = () => {
    selectedProducts.forEach(({ product, qty }) => {
      addItem(product, product.flavor, qty);
    });
    addPoints(Math.round(finalTotal / 10));
    pushToast({
      title: `+${Math.round(finalTotal / 10)} reward points`,
      description: `Bundle added to cart — you saved ${formatINR(discountAmount)}`,
    });
    setRoute("cart");
  };

  return (
    <div className="px-4 pb-[140px] pt-4">
      <Reveal>
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
              Build Your Bundle
            </h1>
            <p className="text-[11px] text-muted-foreground">
              Mix & match · save up to 20%
            </p>
          </div>
        </div>
      </Reveal>

      {/* Savings progress banner */}
      <Reveal className="mt-4">
        <div className="relative overflow-hidden rounded-2xl border border-[oklch(var(--gold)/0.25)] bg-gradient-to-br from-[oklch(var(--gold)/0.1)] to-[oklch(var(--gold)/0.02)] p-4">
          <div className="bg-molecular absolute inset-0 opacity-30" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <IconSpark size={14} className="text-gold-gradient" />
                <span className="text-[11px] uppercase tracking-[0.16em] text-gold-gradient">
                  Bundle savings
                </span>
              </div>
              {currentTier ? (
                <Pill tone="gold">{currentTier.label}</Pill>
              ) : (
                <Pill>Add 1 more for 10% off</Pill>
              )}
            </div>

            {/* Tier progress */}
            <div className="mt-3 flex items-center justify-between gap-1">
              {BUNDLE_TIERS.map((tier, i) => {
                const reached = totalItems >= tier.minItems;
                return (
                  <React.Fragment key={i}>
                    <motion.div
                      animate={{ scale: reached ? 1.05 : 1 }}
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-full border-2 text-[10px] font-bold transition-colors",
                        reached
                          ? "border-transparent text-[oklch(var(--charcoal))]"
                          : "border-border text-muted-foreground"
                      )}
                      style={reached ? { background: tier.color } : undefined}
                    >
                      {tier.minItems}+
                    </motion.div>
                    {i < BUNDLE_TIERS.length - 1 && (
                      <div
                        className={cn(
                          "h-0.5 flex-1 rounded-full transition-colors",
                          totalItems > tier.minItems ? "bg-[oklch(var(--gold))]" : "bg-[oklch(var(--glass-border)/0.15)]"
                        )}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Next tier hint */}
            {nextTier ? (
              <div className="mt-2 text-center text-[11px] text-muted-foreground">
                Add <span className="font-semibold text-gold-gradient">{itemsToNextTier}</span> more item{itemsToNextTier > 1 ? "s" : ""} to unlock{" "}
                <span className="font-semibold text-gold-gradient">{nextTier.label}</span>
              </div>
            ) : (
              <div className="mt-2 text-center text-[11px] text-[oklch(var(--jade))]">
                Maximum savings unlocked! 🎉
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {/* Product selection grid */}
      <Stagger className="mt-4 space-y-2.5" staggerChildren={0.05}>
        {PRODUCTS.map((p) => {
          const qty = selections[p.id] ?? 0;
          const selected = qty > 0;
          return (
            <StaggerItem key={p.id}>
              <motion.div
                layout
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-3 transition-colors",
                  selected
                    ? "border-[oklch(var(--gold)/0.4)] bg-[oklch(var(--gold)/0.04)]"
                    : "border-border glass"
                )}
              >
                {/* Image */}
                <div className="relative h-16 w-16 shrink-0">
                  <div
                    className="absolute inset-0 rounded-full blur-md"
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
                  {selected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[oklch(var(--jade))]"
                    >
                      <IconCheck size={11} className="text-background" />
                    </motion.div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[13px] font-semibold text-cream-gradient">
                    {p.name}
                  </h3>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">
                      {p.proteinGrams}g protein
                    </span>
                    <span className="text-[9px] text-muted-foreground">·</span>
                    <span className="text-[10px] text-muted-foreground">{p.flavor}</span>
                  </div>
                  <div className="mt-0.5 text-[13px] font-semibold text-gold-gradient tabular">
                    {formatINR(p.price)}
                  </div>
                </div>

                {/* Quantity stepper */}
                <div className="flex items-center gap-1 rounded-full bg-[oklch(var(--glass-tint)/0.08)] p-0.5">
                  <button
                    onClick={() => updateQty(p.id, -1)}
                    disabled={qty === 0}
                    className="grid h-8 w-8 place-items-center rounded-full disabled:opacity-30 hover:bg-[oklch(var(--glass-tint)/0.1)]"
                    aria-label="Decrease"
                  >
                    <IconMinus size={12} />
                  </button>
                  <motion.span
                    key={qty}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className="w-6 text-center text-[13px] font-semibold tabular"
                  >
                    {qty}
                  </motion.span>
                  <button
                    onClick={() => updateQty(p.id, 1)}
                    disabled={qty >= 5}
                    className="grid h-8 w-8 place-items-center rounded-full disabled:opacity-30 hover:bg-[oklch(var(--glass-tint)/0.1)]"
                    aria-label="Increase"
                  >
                    <IconPlus size={12} />
                  </button>
                </div>
              </motion.div>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* Price summary */}
      {selectedProducts.length > 0 ? (
        <Reveal className="mt-4">
          <div className="rounded-2xl glass p-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">
                  Subtotal ({totalItems} item{totalItems > 1 ? "s" : ""})
                </span>
                <span className="tabular text-muted-foreground line-through">
                  {formatINR(originalTotal)}
                </span>
              </div>
              {discountAmount > 0 ? (
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground">Bundle discount ({currentTier?.label})</span>
                  <span className="tabular text-[oklch(var(--jade))]">−{formatINR(discountAmount)}</span>
                </div>
              ) : null}
              <div className="my-1.5 h-px bg-border/50" />
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold">You pay</span>
                <span className="font-display text-[22px] font-semibold text-gold-gradient tabular">
                  {formatINR(finalTotal)}
                </span>
              </div>
              {discountAmount > 0 ? (
                <div className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-[oklch(var(--jade)/0.1)] py-1.5 text-[11px]">
                  <IconBolt size={12} className="text-[oklch(var(--jade))]" />
                  <span className="text-foreground/85">
                    You save <span className="font-bold text-[oklch(var(--jade))]">{formatINR(discountAmount)}</span>
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </Reveal>
      ) : (
        <Reveal className="mt-4">
          <div className="rounded-2xl border border-dashed border-border p-6 text-center">
            <p className="text-[13px] text-muted-foreground">
              Select at least 2 products to unlock bundle savings
            </p>
          </div>
        </Reveal>
      )}

      {/* Sticky add to cart */}
      {selectedProducts.length > 0 ? (
        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[460px] -translate-x-1/2 border-t border-border bg-background/95 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+90px)] backdrop-blur-xl">
          <HuxonButton size="lg" glow className="w-full" onClick={handleAddBundle}>
            <IconBolt size={16} />
            Add bundle to cart · {formatINR(finalTotal)}
            <IconArrowRight size={14} />
          </HuxonButton>
        </div>
      ) : null}
    </div>
  );
}
