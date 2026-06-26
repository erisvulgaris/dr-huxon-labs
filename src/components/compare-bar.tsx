"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS } from "@/lib/catalog";
import { useNav } from "@/lib/store";
import { HuxonButton } from "@/components/huxon-button";
import { IconArrowRight, IconClose, IconCompare } from "@/components/icons";

/**
 * CompareBar — persistent floating bar shown when ≥2 products are selected
 * for comparison, on any route except the compare view itself.
 */
export function CompareBar() {
  const { compareIds, setRoute, clearCompare, route } = useNav();

  // Don't show on the compare view itself
  const visible = compareIds.length >= 2 && route !== "compare";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+92px)] left-1/2 z-30 w-full max-w-[420px] -translate-x-1/2 px-4"
        >
          <div className="glass-dark flex items-center gap-3 rounded-2xl border border-[oklch(var(--gold)/0.3)] p-2.5 shadow-premium">
            {/* Compare icon */}
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[oklch(var(--gold)/0.18)]">
              <IconCompare size={18} active />
            </div>

            {/* Thumbnails */}
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

            {/* Label */}
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-semibold text-cream-gradient">
                {compareIds.length} selected
              </div>
              <div className="text-[10px] text-muted-foreground">
                Compare side-by-side
              </div>
            </div>

            {/* Clear */}
            <button
              onClick={clearCompare}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:text-foreground"
              aria-label="Clear compare"
            >
              <IconClose size={13} />
            </button>

            {/* Compare button */}
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
      )}
    </AnimatePresence>
  );
}
