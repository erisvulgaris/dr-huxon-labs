"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  PRODUCTS,
  formatINR,
  discountPercent,
  getRecommendations,
  type Recommendation,
} from "@/lib/catalog";
import { useRecent, useWishlist, useNav } from "@/lib/store";
import {
  IconArrowRight,
  IconStar,
  IconSpark,
  IconBolt,
  IconCheck,
} from "@/components/icons";
import { Reveal, Stagger, StaggerItem, Pill, ProteinRing } from "@/components/primitives";

const CATEGORY_LABELS: Record<Recommendation["category"], string> = {
  goal: "Goal match",
  history: "Based on history",
  trending: "Trending now",
  complementary: "Pairs well",
};

const CATEGORY_COLORS: Record<Recommendation["category"], string> = {
  goal: "oklch(0.78 0.13 75)",
  history: "oklch(0.62 0.10 160)",
  trending: "oklch(0.65 0.15 30)",
  complementary: "oklch(0.72 0.10 65)",
};

/**
 * SmartRecommendations — AI-powered "For You" section.
 * Uses quiz goal (if taken) + recent views + wishlist to recommend products.
 */
export function SmartRecommendations() {
  const recentIds = useRecent((s) => s.ids);
  const wishlistIds = useWishlist((s) => s.ids);
  const { openProduct } = useNav();

  // Get recommendations (quiz goal simulated — in production would read from store)
  const [quizGoal] = React.useState<string | undefined>(undefined);
  const recommendations = React.useMemo(
    () => getRecommendations({ quizGoal, recentIds, wishlistIds }),
    [quizGoal, recentIds, wishlistIds]
  );

  if (recommendations.length === 0) return null;

  return (
    <section className="relative px-4 py-12">
      <Reveal>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-px w-4 bg-gradient-to-r from-transparent to-[oklch(var(--gold)/60%)]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-gradient">
                For you
              </span>
            </div>
            <h2 className="mt-1 font-display text-[24px] font-semibold text-cream-gradient">
              Picked for your goals
            </h2>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Based on your activity & preferences
            </p>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[oklch(var(--gold)/0.14)]">
            <IconSpark size={18} active />
          </div>
        </div>
      </Reveal>

      <Stagger className="space-y-2.5" staggerChildren={0.06}>
        {recommendations.map((rec) => {
          const product = PRODUCTS.find((p) => p.id === rec.productId);
          if (!product) return null;
          const accent = CATEGORY_COLORS[rec.category];
          return (
            <StaggerItem key={rec.productId}>
              <RecommendationCard
                product={product}
                recommendation={rec}
                accent={accent}
                onClick={() => openProduct(product.id)}
              />
            </StaggerItem>
          );
        })}
      </Stagger>

      <Reveal className="mt-4">
        <button className="flex w-full items-center justify-center gap-1.5 rounded-full glass py-3 text-[12px] font-medium text-muted-foreground">
          <IconBolt size={13} className="text-gold-gradient" />
          Take the quiz for better picks
          <IconArrowRight size={13} />
        </button>
      </Reveal>
    </section>
  );
}

function RecommendationCard({
  product,
  recommendation,
  accent,
  onClick,
}: {
  product: (typeof PRODUCTS)[number];
  recommendation: Recommendation;
  accent: string;
  onClick: () => void;
}) {
  const discount = discountPercent(product.price, product.mrp);

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl glass p-3 text-left"
    >
      {/* Accent left border */}
      <div
        className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
        style={{ background: accent }}
      />

      {/* Product image */}
      <div className="relative h-16 w-16 shrink-0">
        <div
          className="absolute inset-0 rounded-full blur-md"
          style={{ background: `${product.accent.replace(")", " / 0.3)")}` }}
        />
        <img
          src={product.heroImage}
          alt={product.name}
          className="relative h-full w-full object-contain transition-transform group-hover:scale-110"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0";
          }}
        />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className="rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide"
            style={{ background: `${accent.replace(")", " / 0.18)")}`, color: accent }}
          >
            {recommendation.reasonTag}
          </span>
          {discount > 0 && (
            <span className="text-[8px] text-[oklch(var(--jade))]">−{discount}%</span>
          )}
        </div>
        <h3 className="mt-0.5 truncate text-[13px] font-semibold text-cream-gradient">
          {product.name}
        </h3>
        <p className="truncate text-[10px] text-muted-foreground">
          {recommendation.reason}
        </p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="text-[12px] font-semibold text-gold-gradient tabular">
            {formatINR(product.price)}
          </span>
          <span className="flex items-center gap-0.5">
            <IconStar size={8} active />
            <span className="text-[9px] text-muted-foreground tabular">
              {product.rating.toFixed(1)}
            </span>
          </span>
        </div>
      </div>

      {/* Match score ring */}
      <div className="shrink-0">
        <ProteinRing
          value={recommendation.matchScore}
          size={44}
          stroke={4}
          color={accent}
        >
          <div className="flex flex-col items-center leading-none">
            <span className="text-[9px] font-bold text-cream-gradient">
              {recommendation.matchScore}
            </span>
            <span className="text-[6px] uppercase tracking-wide text-muted-foreground">
              match
            </span>
          </div>
        </ProteinRing>
      </div>
    </motion.button>
  );
}
