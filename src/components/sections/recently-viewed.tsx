"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { PRODUCTS, formatINR } from "@/lib/catalog";
import { useRecent, useNav } from "@/lib/store";
import { Reveal } from "@/components/primitives";
import { IconStar, IconArrowRight } from "@/components/icons";

/**
 * Recently Viewed — horizontal strip of products the user has browsed.
 * Placed on home after the hero/trust, before product explorer.
 */
export function RecentlyViewed() {
  const recentIds = useRecent((s) => s.ids);
  const { openProduct } = useNav();

  // Filter to valid products and exclude if empty
  const recent = recentIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is (typeof PRODUCTS)[number] => !!p)
    .slice(0, 6);

  if (recent.length < 2) return null; // don't show until at least 2 viewed

  return (
    <section className="relative px-4 py-6">
      <Reveal>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-px w-4 bg-gradient-to-r from-transparent to-[oklch(var(--gold)/60%)]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-gradient">
                Pick up where you left off
              </span>
            </div>
            <h2 className="mt-1 font-display text-[18px] font-semibold text-cream-gradient">
              Recently viewed
            </h2>
          </div>
          <button
            onClick={() => useNav.getState().setRoute("shop")}
            className="flex items-center gap-0.5 text-[11px] text-muted-foreground"
          >
            View all <IconArrowRight size={11} />
          </button>
        </div>
      </Reveal>

      <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">
        {recent.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => openProduct(p.id)}
            className="group relative w-32 shrink-0 overflow-hidden rounded-2xl glass p-2.5 text-left"
          >
            <div className="relative h-16 w-full">
              <div
                className="absolute inset-0 rounded-full blur-md"
                style={{ background: `${p.accent.replace(")", " / 0.28)")}` }}
              />
              <img
                src={p.heroImage}
                alt={p.name}
                className="relative h-full w-full object-contain transition-transform group-hover:scale-110"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0";
                }}
              />
            </div>
            <div className="mt-1.5 truncate text-[11px] font-semibold text-cream-gradient">
              {p.name}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-gold-gradient tabular">
                {formatINR(p.price)}
              </span>
              <div className="flex items-center gap-0.5">
                <IconStar size={8} active />
                <span className="text-[8px] text-muted-foreground tabular">
                  {p.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
