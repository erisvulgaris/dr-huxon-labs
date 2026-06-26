"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, useNav } from "@/lib/store";
import { PRODUCTS, formatINR } from "@/lib/catalog";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconPlus,
  IconMinus,
  IconTrash,
  IconArrowRight,
  IconTruck,
  IconShield,
  IconLock,
  IconGift,
  IconCheck,
} from "@/components/icons";
import { Pill, Reveal } from "@/components/primitives";

/**
 * Cart view — full-page cart with recommended pairings.
 */
export function CartView() {
  const { lines, updateQty, removeItem, subtotal, openCart } = useCart();
  const { setQuickView } = useNav();

  const shipping = subtotal() > 1499 || subtotal() === 0 ? 0 : 79;
  const total = subtotal() + shipping;
  const freeShipRemaining = Math.max(0, 1499 - subtotal());

  // Pairing recommendations based on what's in cart
  const inCartIds = lines.map((l) => l.productId);
  const pairings = PRODUCTS.filter(
    (p) => !inCartIds.includes(p.id)
  ).slice(0, 3);

  return (
    <div className="px-4 pb-[140px] pt-4">
      <Reveal>
        <h1 className="font-display text-[28px] font-semibold text-cream-gradient">
          Cart
        </h1>
        <p className="text-[12px] text-muted-foreground">
          {lines.length} item{lines.length !== 1 ? "s" : ""} · {formatINR(subtotal())}
        </p>
      </Reveal>

      {/* Free shipping progress */}
      {lines.length > 0 && freeShipRemaining > 0 ? (
        <Reveal className="mt-4">
          <div className="rounded-2xl glass p-3">
            <div className="flex items-center gap-2 text-[11px]">
              <IconTruck size={14} className="text-text-gold" />
              <span className="text-muted-foreground">
                Add <span className="font-semibold text-cream-gradient">{formatINR(freeShipRemaining)}</span> for free shipping
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[oklch(0.96_0.012_80_/_0.06)]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[oklch(0.78_0.13_75)] to-[oklch(0.92_0.10_85)]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (subtotal() / 1499) * 100)}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </Reveal>
      ) : null}

      {/* Lines */}
      {lines.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-4 space-y-2.5">
          <AnimatePresence>
            {lines.map((line) => (
              <motion.div
                key={`${line.productId}-${line.flavor}`}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -60 }}
                className="flex items-center gap-3 rounded-2xl glass p-3"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[oklch(0.96_0.012_80_/_0.04)]">
                  <img
                    src={line.image}
                    alt={line.name}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = "0";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold">{line.name}</div>
                  <div className="text-[10px] text-muted-foreground">{line.flavor}</div>
                  <div className="mt-1 text-[13px] font-semibold text-cream-gradient tabular">
                    {formatINR(line.price)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeItem(line.productId, line.flavor)}
                    className="text-muted-foreground hover:text-[oklch(0.72_0.18_25)]"
                    aria-label="Remove"
                  >
                    <IconTrash size={14} />
                  </button>
                  <div className="flex items-center gap-1 rounded-full bg-[oklch(0.96_0.012_80_/_0.06)] p-0.5">
                    <button
                      onClick={() => updateQty(line.productId, line.flavor, line.quantity - 1)}
                      className="grid h-7 w-7 place-items-center rounded-full"
                      aria-label="Decrease"
                    >
                      <IconMinus size={12} />
                    </button>
                    <span className="w-5 text-center text-[12px] font-semibold tabular">
                      {line.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(line.productId, line.flavor, line.quantity + 1)}
                      className="grid h-7 w-7 place-items-center rounded-full"
                      aria-label="Increase"
                    >
                      <IconPlus size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pairings */}
      {lines.length > 0 && pairings.length ? (
        <Reveal className="mt-6">
          <h2 className="mb-2 text-[14px] font-semibold">Pairs well with</h2>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {pairings.map((p) => (
              <button
                key={p.id}
                onClick={() => setQuickView(p.id)}
                className="group relative w-32 shrink-0 overflow-hidden rounded-2xl glass p-3 text-left"
              >
                <div className="relative h-16 w-full">
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
                </div>
                <div className="mt-2 truncate text-[11px] font-semibold">{p.name}</div>
                <div className="text-[10px] text-muted-foreground tabular">
                  {formatINR(p.price)}
                </div>
              </button>
            ))}
          </div>
        </Reveal>
      ) : null}

      {/* Trust strip */}
      {lines.length > 0 ? (
        <Reveal className="mt-6 grid grid-cols-3 gap-2">
          <TrustChip icon={<IconShield size={14} />} label="Secure pay" />
          <TrustChip icon={<IconLock size={14} />} label="OTP login" />
          <TrustChip icon={<IconTruck size={14} />} label="24h dispatch" />
        </Reveal>
      ) : null}

      {/* Sticky checkout */}
      {lines.length > 0 ? (
        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[460px] -translate-x-1/2 border-t border-[oklch(0.96_0.012_80_/_0.08)] bg-background/95 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+90px)] backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px] text-muted-foreground">Total</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[22px] font-semibold text-gold-gradient tabular">
                {formatINR(total)}
              </span>
              {shipping > 0 ? (
                <span className="text-[10px] text-muted-foreground">
                  +{formatINR(shipping)} shipping
                </span>
              ) : (
                <Pill tone="green">Free ship</Pill>
              )}
            </div>
          </div>
          <HuxonButton size="lg" glow className="w-full" onClick={openCart}>
            Checkout
            <IconArrowRight size={16} />
          </HuxonButton>
        </div>
      ) : null}
    </div>
  );
}

function EmptyState() {
  const { setRoute } = useNav();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="relative grid h-24 w-24 place-items-center"
      >
        <div className="absolute inset-0 rounded-full bg-[oklch(0.78_0.13_75_/_0.12)] blur-2xl" />
        <div className="relative grid h-20 w-20 place-items-center rounded-full glass">
          <IconGift size={32} className="text-muted-foreground" />
        </div>
      </motion.div>
      <h3 className="mt-6 font-display text-[18px] font-semibold text-cream-gradient">
        Your cart is empty
      </h3>
      <p className="mt-1 max-w-[260px] text-[13px] text-muted-foreground">
        Discover our premium range of plant-based nutrition.
      </p>
      <HuxonButton
        size="md"
        glow
        className="mt-5"
        onClick={() => setRoute("shop")}
      >
        Browse products
        <IconArrowRight size={14} />
      </HuxonButton>
    </div>
  );
}

function TrustChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-[oklch(0.96_0.012_80_/_0.04)] py-2 text-[10px] text-muted-foreground">
      <span className="text-text-gold">{icon}</span>
      {label}
    </div>
  );
}
