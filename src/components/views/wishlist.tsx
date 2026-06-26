"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, formatINR, discountPercent } from "@/lib/catalog";
import { useWishlist, useCart, useNav } from "@/lib/store";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconHeart,
  IconCart,
  IconArrowRight,
  IconTrash,
  IconArrowLeft,
  IconStar,
  IconBolt,
  IconCompare,
} from "@/components/icons";
import { Reveal, Stagger, StaggerItem, Pill, StarRating } from "@/components/primitives";

/**
 * Wishlist view — saved products with move-to-cart, compare, remove.
 */
export function WishlistView() {
  const wishlist = useWishlist();
  const { addItem } = useCart();
  const { setRoute, openProduct, toggleCompare, compareIds } = useNav();

  const items = PRODUCTS.filter((p) => wishlist.ids.includes(p.id));

  const addAllToCart = () => {
    items.forEach((p) => addItem(p));
  };

  return (
    <div className="px-4 pb-8 pt-4">
      {/* Header */}
      <Reveal>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRoute("profile")}
              aria-label="Back"
              className="grid h-9 w-9 place-items-center rounded-full glass"
            >
              <IconArrowLeft size={16} />
            </button>
            <div>
              <h1 className="font-display text-[24px] font-semibold text-cream-gradient">
                Wishlist
              </h1>
              <p className="text-[11px] text-muted-foreground">
                {items.length} saved item{items.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {items.length > 0 ? (
            <button
              onClick={addAllToCart}
              className="flex items-center gap-1 rounded-full glass px-3 py-2 text-[11px] font-medium text-gold-gradient"
            >
              <IconBolt size={12} />
              Add all
            </button>
          ) : null}
        </div>
      </Reveal>

      {items.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <Stagger className="mt-5 space-y-3" staggerChildren={0.06}>
          {items.map((p) => {
            const inCompare = compareIds.includes(p.id);
            const discount = discountPercent(p.price, p.mrp);
            return (
              <StaggerItem key={p.id}>
                <motion.div
                  layout
                  className="flex items-center gap-3 overflow-hidden rounded-2xl glass p-3"
                >
                  {/* Image */}
                  <button
                    onClick={() => openProduct(p.id)}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[oklch(var(--charcoal))]"
                    aria-label={`View ${p.name}`}
                  >
                    <div
                      className="absolute inset-0 blur-md"
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
                  </button>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <button
                      onClick={() => openProduct(p.id)}
                      className="block w-full text-left"
                    >
                      <h3 className="truncate text-[14px] font-semibold text-cream-gradient">
                        {p.name}
                      </h3>
                      <div className="mt-0.5 flex items-center gap-2">
                        <StarRating value={p.rating} size={10} />
                        <span className="text-[10px] text-muted-foreground">
                          {p.proteinGrams}g protein
                        </span>
                      </div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-[15px] font-semibold text-gold-gradient tabular">
                          {formatINR(p.price)}
                        </span>
                        {discount > 0 ? (
                          <>
                            <span className="text-[10px] text-muted-foreground line-through tabular">
                              {formatINR(p.mrp)}
                            </span>
                            <Pill tone="green">−{discount}%</Pill>
                          </>
                        ) : null}
                      </div>
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => addItem(p)}
                      className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[oklch(var(--gold))] to-[oklch(var(--bronze))] text-[oklch(var(--charcoal))] shadow-gold"
                      aria-label="Add to cart"
                    >
                      <IconCart size={15} />
                    </button>
                    <button
                      onClick={() => toggleCompare(p.id)}
                      className={
                        "grid h-9 w-9 place-items-center rounded-full " +
                        (inCompare
                          ? "bg-[oklch(var(--gold)/0.2)] text-gold-gradient"
                          : "glass text-muted-foreground")
                      }
                      aria-label="Compare"
                    >
                      <IconCompare size={14} />
                    </button>
                    <button
                      onClick={() => wishlist.remove(p.id)}
                      className="grid h-9 w-9 place-items-center rounded-full glass text-muted-foreground hover:text-[oklch(0.72_0.18_25)]"
                      aria-label="Remove"
                    >
                      <IconTrash size={14} />
                    </button>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}

      {/* Compare bar */}
      {compareIds.length >= 2 ? (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+90px)] left-1/2 z-30 w-full max-w-[420px] -translate-x-1/2 px-4"
        >
          <div className="glass-dark flex items-center gap-3 rounded-2xl border border-[oklch(var(--gold)/0.3)] p-3 shadow-premium">
            <div className="flex -space-x-2">
              {compareIds.slice(0, 3).map((id) => {
                const p = PRODUCTS.find((x) => x.id === id);
                if (!p) return null;
                return (
                  <div
                    key={id}
                    className="h-8 w-8 overflow-hidden rounded-full border-2 border-background bg-[oklch(var(--charcoal))]"
                  >
                    <img
                      src={p.heroImage}
                      alt={p.name}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.opacity = "0";
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex-1">
              <div className="text-[12px] font-semibold text-cream-gradient">
                {compareIds.length} products to compare
              </div>
              <div className="text-[10px] text-muted-foreground">
                Tap to view side-by-side
              </div>
            </div>
            <HuxonButton
              size="sm"
              glow
              onClick={() => setRoute("compare")}
            >
              Compare
              <IconArrowRight size={12} />
            </HuxonButton>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}

function EmptyWishlist() {
  const { setRoute } = useNav();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="relative grid h-24 w-24 place-items-center"
      >
        <div className="absolute inset-0 rounded-full bg-[oklch(var(--gold)/0.12)] blur-2xl" />
        <div className="relative grid h-20 w-20 place-items-center rounded-full glass">
          <IconHeart size={32} className="text-muted-foreground" />
        </div>
      </motion.div>
      <h3 className="mt-6 font-display text-[18px] font-semibold text-cream-gradient">
        No saved items yet
      </h3>
      <p className="mt-1 max-w-[260px] text-[13px] text-muted-foreground">
        Tap the heart on any product to save it here for later.
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
