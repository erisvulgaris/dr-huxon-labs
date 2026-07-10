"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PRODUCTS,
  formatINR,
  discountPercent,
} from "@/lib/catalog";
import { useCart, useNav, useWishlist } from "@/lib/store";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconClose,
  IconHeart,
  IconPlus,
  IconMinus,
  IconCheck,
  IconStar,
  IconArrowRight,
  IconFlask,
  IconLeaf,
} from "@/components/icons";
import { ProteinRing, StarRating, Pill } from "@/components/primitives";

/**
 * Quick View — full-screen premium product viewer.
 */
// Inline escape-to-close hook
function useEscapeClose(isOpen: boolean, onClose: () => void) {
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);
}

export function QuickView() {
  const { quickViewProductId, setQuickView } = useNav();
  useEscapeClose(!!quickViewProductId, () => setQuickView(null));
  const product = PRODUCTS.find((p) => p.id === quickViewProductId);
  const isOpen = !!product;

  return (
    <AnimatePresence>
      {isOpen && product ? (
        <QuickViewContent
          key="qv"
          product={product}
          onClose={() => setQuickView(null)}
        />
      ) : null}
    </AnimatePresence>
  );
}

function QuickViewContent({
  product,
  onClose,
}: {
  product: (typeof PRODUCTS)[number];
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const wishlist = useWishlist();
  const fav = wishlist.ids.includes(product.id);
  const [qty, setQty] = React.useState(1);
  const [flavor, setFlavor] = React.useState(product.flavor);
  const [tab, setTab] = React.useState<"overview" | "nutrition" | "reviews">(
    "overview"
  );

  const discount = discountPercent(product.price, product.mrp);
  const reviews = [
    {
      id: "1",
      author: "Arjun M.",
      rating: 5,
      title: "Best plant protein in India",
      body: "Mixes clean, tastes real. My recovery is on another level.",
      date: "2w ago",
    },
    {
      id: "2",
      author: "Priya S.",
      rating: 5,
      title: "Finally a clean label",
      body: "No sucralose, no fillers. Belgian cocoa is delicious.",
      date: "1mo ago",
    },
    {
      id: "3",
      author: "Rohan K.",
      rating: 4,
      title: "Great value",
      body: "Premium quality, fair price for what you get.",
      date: "5d ago",
    },
  ];

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
        className="relative z-10 flex max-h-[92dvh] w-full max-w-[460px] flex-col overflow-hidden rounded-t-[28px] border-t border-[oklch(var(--glass-tint)/0.1)] bg-background"
      >
        {/* Drag handle */}
        <div className="mx-auto my-3 h-1 w-10 rounded-full bg-[oklch(var(--glass-tint)/0.2)]" />

        {/* Close + favorite */}
        <div className="absolute right-4 top-4 z-20 flex gap-2">
          <button
            onClick={() => wishlist.toggle(product.id)}
            aria-label="Wishlist"
            className="grid h-9 w-9 place-items-center rounded-full glass"
          >
            <IconHeart size={16} active={fav} />
          </button>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full glass"
          >
            <IconClose size={16} />
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto pb-[120px]">
          {/* Hero image */}
          <div className="relative flex h-[280px] items-center justify-center overflow-hidden">
            <div
              className="absolute h-[220px] w-[220px] rounded-full blur-3xl"
              style={{
                background: `${product.accent.replace(")", " / 0.32)")}`,
              }}
            />
            <motion.img
              src={product.heroImage}
              alt={product.name}
              className="relative z-10 h-full w-auto object-contain drop-shadow-[0_20px_40px_oklch(0.05_0.01_50_/_0.7)]"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "0";
              }}
            />
            {/* 360 / zoom hints */}
            <div className="absolute bottom-3 left-3 flex gap-1.5">
              <Pill tone="gold">
                <IconLeaf size={10} />
                Plant Based
              </Pill>
              <Pill>
                <IconFlask size={10} />
                Lab Verified
              </Pill>
            </div>
            <div className="absolute bottom-3 right-3">
              <ProteinRing
                value={Math.min(100, Math.round((product.proteinGrams / 30) * 100))}
                size={56}
                stroke={5}
                color={product.accent}
              >
                <div className="flex flex-col items-center leading-none">
                  <span className="text-[11px] font-bold text-cream-gradient">
                    {product.proteinGrams}g
                  </span>
                  <span className="text-[7px] uppercase tracking-wide text-muted-foreground">
                    protein
                  </span>
                </div>
              </ProteinRing>
            </div>
          </div>

          {/* Content */}
          <div className="px-5 pt-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-[22px] font-semibold leading-tight text-cream-gradient">
                  {product.name}
                </h2>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  {product.tagline}
                </p>
              </div>
              {product.badge ? <Pill tone="gold">{product.badge}</Pill> : null}
            </div>

            <div className="mt-3 flex items-center gap-3">
              <StarRating value={product.rating} count={product.reviewCount} size={13} />
            </div>

            {/* Price */}
            <div className="mt-4 flex items-end gap-2">
              <span className="text-[26px] font-semibold text-cream-gradient tabular">
                {formatINR(product.price)}
              </span>
              {discount > 0 ? (
                <>
                  <span className="text-[14px] text-muted-foreground line-through tabular">
                    {formatINR(product.mrp)}
                  </span>
                  <Pill tone="green">{discount}% off</Pill>
                </>
              ) : null}
            </div>

            {/* Flavor selector */}
            <div className="mt-5">
              <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Flavor
              </div>
              <div className="flex flex-wrap gap-2">
                {[product.flavor, "Chocolate", "Vanilla", "Mixed Berry"].map(
                  (f, i) => {
                    const active = f === flavor;
                    return (
                      <button
                        key={f}
                        onClick={() => setFlavor(f)}
                        className={
                          "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all " +
                          (active
                            ? "border-[oklch(0.78_0.13_75_/_50%)] bg-[oklch(0.78_0.13_75_/_0.14)] text-text-gold"
                            : "border-border bg-transparent text-muted-foreground")
                        }
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            background: [
                              product.flavorColor,
                              "oklch(0.50 0.08 50)",
                              "oklch(0.85 0.05 80)",
                              "oklch(0.55 0.15 0)",
                            ][i],
                          }}
                        />
                        {f}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex gap-1 rounded-full glass p-1">
              {(["overview", "nutrition", "reviews"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="relative flex-1 rounded-full px-3 py-2 text-[12px] font-medium capitalize transition-colors"
                >
                  {tab === t ? (
                    <motion.span
                      layoutId="qv-tab"
                      className="absolute inset-0 rounded-full bg-[oklch(0.78_0.13_75_/_0.16)]"
                    />
                  ) : null}
                  <span
                    className={
                      "relative z-10 " +
                      (tab === t ? "text-text-gold" : "text-muted-foreground")
                    }
                  >
                    {t}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4">
              {tab === "overview" ? (
                <div className="space-y-3">
                  <p className="text-[13px] leading-relaxed text-foreground/80 text-pretty">
                    {product.description}
                  </p>
                  <div className="space-y-2">
                    {product.features.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-[13px]">
                        <span className="mt-0.5 grid h-4 w-4 place-items-center rounded-full bg-[oklch(0.62_0.10_160_/_0.18)]">
                          <IconCheck size={10} />
                        </span>
                        <span className="text-foreground/85">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {tab === "nutrition" ? (
                <div className="space-y-4">
                  <div className="rounded-2xl glass p-4">
                    <div className="mb-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Per {product.servingSize} serving
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {product.nutritionFacts.map((n) => (
                        <div
                          key={n.label}
                          className="flex items-center justify-between rounded-xl bg-[oklch(var(--glass-tint)/0.04)] px-3 py-2"
                        >
                          <span className="text-[12px] text-muted-foreground">
                            {n.label}
                          </span>
                          <span className="text-[13px] font-semibold text-cream-gradient tabular">
                            {n.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl glass p-4">
                    <div className="mb-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Ingredients
                    </div>
                    <div className="space-y-2">
                      {product.ingredients.map((ing) => (
                        <div
                          key={ing.name}
                          className="flex items-center justify-between border-b border-border/40 pb-2 text-[13px] last:border-0"
                        >
                          <span className="text-foreground/85">{ing.name}</span>
                          <span className="font-semibold text-text-gold tabular">
                            {ing.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {tab === "reviews" ? (
                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="rounded-2xl glass p-4">
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(0.78_0.13_75_/_0.18)] text-[11px] font-bold text-text-gold">
                          {r.author[0]}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-semibold">{r.author}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {r.date} · Verified
                          </span>
                        </div>
                        <div className="ml-auto flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <IconStar key={i} size={11} active={i <= r.rating} />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-[13px] font-medium">{r.title}</p>
                      <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                        {r.body}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Sticky purchase area */}
        <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-border bg-background/95 backdrop-blur-xl px-4 py-3 pb-safe">
          <button
            onClick={() => {
              useNav.getState().openProduct(product.id);
              onClose();
            }}
            className="mb-2 flex w-full items-center justify-center gap-1 text-[11px] font-medium text-gold-gradient"
          >
            View full details
            <IconArrowRight size={12} />
          </button>
          <div className="flex items-center gap-3">
            {/* Quantity selector */}
            <div className="flex items-center gap-1 rounded-full glass p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-[oklch(var(--glass-tint)/0.1)]"
                aria-label="Decrease"
              >
                <IconMinus size={14} />
              </button>
              <span className="w-6 text-center text-[14px] font-semibold tabular">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-[oklch(var(--glass-tint)/0.1)]"
                aria-label="Increase"
              >
                <IconPlus size={14} />
              </button>
            </div>

            <HuxonButton
              size="lg"
              glow
              className="flex-1"
              onClick={() => {
                addItem(product, flavor, qty);
                onClose();
              }}
            >
              Add to Cart · {formatINR(product.price * qty)}
              <IconArrowRight size={16} />
            </HuxonButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
