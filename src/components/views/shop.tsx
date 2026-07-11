"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { PRODUCTS, formatINR, discountPercent } from "@/lib/catalog";
import {
  IconFilter,
  IconSearch,
  IconHeart,
  IconPlus,
  IconEye,
  IconCompare,
  IconStar,
  IconGrid,
  ICON_MAP,
} from "@/components/icons";
import { HuxonButton } from "@/components/huxon-button";
import { StarRating, Pill, Reveal } from "@/components/primitives";
import { useCart, useNav, useSearch, useWishlist } from "@/lib/store";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All", icon: "grid", accent: "oklch(0.78 0.13 75)", gradient: "from-[oklch(0.78_0.13_75/0.15)] to-[oklch(0.62_0.10_55/0.04)]" },
  { id: "protein", label: "Protein", icon: "dumbbell", accent: "oklch(0.78 0.13 75)", gradient: "from-[oklch(0.78_0.13_75/0.15)] to-[oklch(0.62_0.10_55/0.04)]" },
  { id: "performance", label: "Performance", icon: "bolt", accent: "oklch(0.65 0.15 30)", gradient: "from-[oklch(0.65_0.15_30/0.15)] to-[oklch(0.55_0.12_25/0.04)]" },
  { id: "supplement", label: "Supplements", icon: "leaf", accent: "oklch(0.62 0.10 160)", gradient: "from-[oklch(0.62_0.10_160/0.15)] to-[oklch(0.50_0.09_160/0.04)]" },
  { id: "snack", label: "Snacks", icon: "flask", accent: "oklch(0.72 0.10 65)", gradient: "from-[oklch(0.72_0.10_65/0.15)] to-[oklch(0.60_0.08_55/0.04)]" },
];


// Helper to add alpha to an oklch color
const soften = (color: string, alpha: string) => color.replace(')', ` / ${alpha})`);

const SORTS = [
  { id: "popular", label: "Popular" },
  { id: "price-low", label: "Price ↑" },
  { id: "price-high", label: "Price ↓" },
  { id: "rating", label: "Top rated" },
];

/**
 * Shop view — premium product gallery with filters.
 */
export function ShopView() {
  const [cat, setCat] = React.useState("all");
  const [sort, setSort] = React.useState("popular");
  const { open: openSearch } = useSearch();

  const products = React.useMemo(() => {
    let list = PRODUCTS.filter((p) => (cat === "all" ? true : p.category === cat));
    list = [...list].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });
    return list;
  }, [cat, sort]);

  return (
    <div className="px-4 pb-8 pt-4">
      {/* Header */}
      <Reveal>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-[28px] font-semibold text-cream-gradient">
              Shop
            </h1>
            <p className="text-[12px] text-muted-foreground">
              {products.length} products · lab-tested
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={openSearch}
              className="grid h-10 w-10 place-items-center rounded-full glass"
              aria-label="Search"
            >
              <IconSearch size={18} />
            </button>
            <button
              className="grid h-10 w-10 place-items-center rounded-full glass"
              aria-label="Filter"
            >
              <IconFilter size={18} />
            </button>
          </div>
        </div>
      </Reveal>

      {/* Visual category cards */}
      <div className="no-scrollbar mt-4 flex gap-2.5 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => {
          const count = c.id === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c.id).length;
          const Icon = ICON_MAP[c.icon] ?? IconGrid;
          const active = cat === c.id;
          return (
            <motion.button
              key={c.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCat(c.id)}
              className={cn(
                "group relative flex h-[72px] w-[120px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border p-2.5 text-left transition-all",
                active
                  ? "border-transparent"
                  : "border-border glass"
              )}
              style={active ? { background: `linear-gradient(135deg, ${soften(c.accent, "0.22")}, ${soften(c.accent, "0.06")})` } : undefined}
            >
              {/* Glow on active */}
              {active && (
                <div
                  className="absolute -right-4 -top-4 h-16 w-16 rounded-full blur-xl"
                  style={{ background: soften(c.accent, "0.4") }}
                />
              )}
              {/* Icon */}
              <div
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-lg transition-colors",
                  active ? "text-cream-gradient" : "text-muted-foreground"
                )}
                style={active ? { background: soften(c.accent, "0.2") } : undefined}
              >
                <Icon size={16} active={active} />
              </div>
              {/* Label + count */}
              <div className="relative">
                <div className={cn("text-[11px] font-semibold leading-tight", active ? "text-cream-gradient" : "text-foreground/90")}>
                  {c.label}
                </div>
                <div className="text-[9px] text-muted-foreground tabular">
                  {count} product{count !== 1 ? "s" : ""}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Sort */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
          Sort
        </span>
        {SORTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSort(s.id)}
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-[11px] transition-colors",
              sort === s.id
                ? "bg-[oklch(var(--glass-tint)/0.1)] text-foreground"
                : "text-muted-foreground"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {products.map((p, i) => (
          <ShopCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
}

function ShopCard({
  product,
  index,
}: {
  product: (typeof PRODUCTS)[number];
  index: number;
}) {
  const { addItem } = useCart();
  const { setQuickView, openProduct, toggleCompare, compareIds } = useNav();
  const inCompare = compareIds.includes(product.id);
  const wishlist = useWishlist();
  const fav = wishlist.ids.includes(product.id);
  const discount = discountPercent(product.price, product.mrp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-2xl glass p-3"
    >
      {/* Image */}
      <div
        onClick={() => openProduct(product.id)}
        className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-[oklch(var(--charcoal))]"
        role="button"
        tabIndex={0}
        aria-label={`View ${product.name}`}
      >
        <div
          className="absolute inset-0 blur-2xl"
          style={{ background: `${product.accent.replace(")", " / 0.25)")}` }}
        />
        {/* Subtle gradient overlay for depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(var(--charcoal)/0.4)] via-transparent to-transparent" />
        <img
          src={product.heroImage}
          alt={product.name}
          className="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0";
          }}
        />
        {/* Top badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.badge ? <Pill tone="gold">{product.badge}</Pill> : null}
          {discount > 0 ? <Pill tone="green">−{discount}%</Pill> : null}
          {product.stockCount !== undefined && product.stockCount < 15 && (
            <Pill tone="red">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.72_0.18_25)]" />
              Only {product.stockCount} left
            </Pill>
          )}
        </div>
        {/* Favorite */}
        <button
          onClick={() => {
            const wasFav = fav;
            wishlist.toggle(product.id);
            toast(wasFav ? "Removed from wishlist" : "Added to wishlist ❤️", {
              description: product.name,
            });
          }}
          className={cn(
            "absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full backdrop-blur-md transition-colors",
            fav ? "bg-[oklch(0.78_0.13_75_/_0.25)] text-text-gold" : "bg-black/30 text-cream/80"
          )}
          aria-label="Wishlist"
        >
          <IconHeart size={14} active={fav} />
        </button>
        {/* Quick view */}
        <span
          onClick={(e) => { e.stopPropagation(); setQuickView(product.id); }}
          className="absolute bottom-2 right-2 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-black/40 text-cream/80 backdrop-blur-md"
          aria-label="Quick view"
          role="button"
        >
          <IconEye size={14} />
        </span>
        {/* Compare */}
        <span
          onClick={(e) => { e.stopPropagation(); toggleCompare(product.id); }}
          className={
            "absolute bottom-2 left-2 grid h-8 w-8 cursor-pointer place-items-center rounded-full backdrop-blur-md " +
            (inCompare
              ? "bg-[oklch(var(--gold)/0.3)] text-gold-gradient"
              : "bg-black/40 text-cream/80")
          }
          aria-label="Compare"
          role="button"
        >
          <IconCompare size={14} active={inCompare} />
        </span>
      </div>

      {/* Info */}
      <div className="mt-2.5">
        <h3
          onClick={() => openProduct(product.id)}
          className="truncate cursor-pointer text-[13px] font-semibold text-cream-gradient"
        >
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-1.5">
          <IconStar size={10} active />
          <span className="text-[10px] text-muted-foreground tabular">
            {product.rating.toFixed(1)} · {product.proteinGrams}g
          </span>
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-[14px] font-semibold text-cream-gradient tabular">
              {formatINR(product.price)}
            </span>
            {discount > 0 ? (
              <span className="text-[9px] text-muted-foreground line-through tabular">
                {formatINR(product.mrp)}
              </span>
            ) : null}
          </div>
          <button
            onClick={() => {
              addItem(product);
              toast.success("Added to cart", {
                description: `${product.name} · ${formatINR(product.price)}`,
              });
            }}
            className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.92_0.10_85)] to-[oklch(0.62_0.10_55)] text-[oklch(0.14_0.01_50)] shadow-gold"
            aria-label="Add to cart"
          >
            <IconPlus size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
