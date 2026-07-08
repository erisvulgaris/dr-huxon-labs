"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  PRODUCTS,
  type BrandProduct,
  formatINR,
  discountPercent,
} from "@/lib/catalog";
import {
  IconHeart,
  IconPlus,
  IconStar,
  IconArrowRight,
  IconEye,
} from "@/components/icons";
import { HuxonButton } from "@/components/huxon-button";
import {
  SectionHeader,
  ProteinRing,
  StarRating,
  Pill,
} from "@/components/primitives";
import { useCart, useNav, useWishlist } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Section 3 — Interactive product explorer.
 * Horizontal swipeable premium product gallery.
 */
export function ProductExplorer() {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  return (
    <section className="relative py-12">
      <div className="px-4">
        <SectionHeader
          kicker="The Collection"
          title={
            <>
              Six formulas. <span className="text-gold-gradient">One standard.</span>
            </>
          }
          subtitle="Swipe through our precision-engineered range. Each one lab-tested, each one clean."
        />
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar mt-7 flex snap-x-mandatory gap-4 overflow-x-auto px-4 pb-2"
      >
        {PRODUCTS.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
        <div className="shrink-0 w-1" />
      </div>
    </section>
  );
}

function ProductCard({
  product,
  index,
}: {
  product: BrandProduct;
  index: number;
}) {
  const { addItem } = useCart();
  const { setQuickView, openProduct } = useNav();
  const wishlist = useWishlist();
  const fav = wishlist.ids.includes(product.id);
  const discount = discountPercent(product.price, product.mrp);
  const proteinPct = Math.min(
    100,
    Math.round((product.proteinGrams / 30) * 100)
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
      className="relative w-[260px] shrink-0 snap-start"
    >
      <div
        className="relative overflow-hidden rounded-[28px] glass p-4"
        style={
          {
            // Accent tinted by product
            background: `linear-gradient(160deg, ${product.accent.replace(")", " / 0.10)")}, oklch(0.17 0.012 55 / 0.6))`,
          } as React.CSSProperties
        }
      >
        {/* Top row: badge + favorite */}
        <div className="relative flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            {product.badge ? (
              <Pill tone="gold">{product.badge}</Pill>
            ) : (
              <Pill>{product.category}</Pill>
            )}
            <Pill tone="green">
              <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.62_0.10_160)]" />
              {product.inStock ? "In stock" : "Sold out"}
            </Pill>
          </div>
          <FavButton active={fav} onClick={() => wishlist.toggle(product.id)} />
        </div>

        {/* Product image with protein ring overlay */}
        <div className="relative my-4 flex h-[180px] items-center justify-center">
          <div
            className="absolute h-[160px] w-[160px] rounded-full blur-3xl"
            style={{ background: `${product.accent.replace(")", " / 0.28)")}` }}
          />
          <motion.img
            src={product.heroImage}
            alt={product.name}
            onClick={() => openProduct(product.id)}
            className="relative z-10 h-full w-auto cursor-pointer object-contain drop-shadow-[0_20px_40px_oklch(var(--shadow-color)/0.6)]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = "0";
            }}
          />
          {/* Protein ring */}
          <div className="absolute -bottom-1 -right-1">
            <ProteinRing
              value={proteinPct}
              size={58}
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

        {/* Flavor indicator */}
        <div className="mb-2 flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: product.flavorColor }}
          />
          <span className="text-[11px] font-medium text-muted-foreground">
            {product.flavor}
          </span>
          <span className="ml-auto text-[11px] text-muted-foreground tabular">
            {product.servings} servings
          </span>
        </div>

        {/* Name + rating */}
        <h3 className="font-display text-[17px] font-semibold leading-tight text-cream-gradient">
          {product.name}
        </h3>
        <p className="mt-1 text-[12px] leading-snug text-muted-foreground text-pretty">
          {product.tagline}
        </p>
        <div className="mt-2">
          <StarRating value={product.rating} count={product.reviewCount} size={11} />
        </div>

        {/* Price */}
        <div className="mt-3 flex items-end justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[20px] font-semibold text-cream-gradient tabular">
                {formatINR(product.price)}
              </span>
              {discount > 0 ? (
                <span className="text-[11px] text-muted-foreground line-through tabular">
                  {formatINR(product.mrp)}
                </span>
              ) : null}
            </div>
            {discount > 0 ? (
              <span className="text-[10px] font-semibold text-text-accent-jade">
                Save {discount}%
              </span>
            ) : null}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          <HuxonButton
            size="sm"
            className="flex-1"
            onClick={() => {
              addItem(product);
              toast.success("Added to cart", {
                description: `${product.name} · ${formatINR(product.price)}`,
              });
            }}
          >
            <IconPlus size={14} />
            Add
          </HuxonButton>
          <HuxonButton
            size="sm"
            variant="secondary"
            onClick={() => setQuickView(product.id)}
            aria-label="Quick view"
          >
            <IconEye size={14} />
          </HuxonButton>
        </div>

        {/* Ingredient preview */}
        <div className="mt-3 flex flex-wrap gap-1">
          {product.ingredients.slice(0, 3).map((ing) => (
            <span
              key={ing.name}
              className="rounded-full bg-[oklch(var(--glass-tint)/0.05)] px-2 py-0.5 text-[9px] text-muted-foreground"
            >
              {ing.name}
            </span>
          ))}
        </div>

        {/* Top sheen */}
        <span className="pointer-events-none absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.13_75_/_30%)] to-transparent" />
      </div>
    </motion.div>
  );
}

function FavButton({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={onClick}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full transition-colors",
        active
          ? "bg-[oklch(0.78_0.13_75_/_0.18)] text-text-gold"
          : "glass text-foreground/70 hover:text-foreground"
      )}
    >
      <motion.span
        animate={{ scale: active ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.4 }}
      >
        <IconHeart size={16} active={active} />
      </motion.span>
    </motion.button>
  );
}
