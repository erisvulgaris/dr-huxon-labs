"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useNav } from "@/lib/store";
import { HuxonButton } from "@/components/huxon-button";
import { IconBolt, IconArrowRight, IconSpark } from "@/components/icons";
import { Reveal } from "@/components/primitives";

/**
 * BundleCTA — promotional section on home for the Bundle Builder.
 */
export function BundleCTA() {
  const { setRoute } = useNav();
  return (
    <section className="relative px-4 py-12">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-[oklch(var(--gold)/0.25)] bg-gradient-to-br from-[oklch(var(--espresso))] via-[oklch(var(--cocoa)/0.6)] to-[oklch(var(--charcoal)/0.8)] p-5">
          {/* Ambient */}
          <motion.div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[oklch(var(--gold)/0.25)] blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="bg-molecular absolute inset-0 opacity-40" />

          <div className="relative">
            <div className="flex items-center gap-1.5">
              <IconSpark size={14} className="text-gold-gradient" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-gradient">
                Build your own bundle
              </span>
            </div>
            <h2 className="mt-2 font-display text-[24px] font-semibold leading-tight text-cream-gradient text-balance">
              Mix & match. Save up to 20%.
            </h2>
            <p className="mt-2 text-[13px] text-muted-foreground text-pretty">
              Pick your favorite products, choose quantities, and unlock tiered
              savings automatically. The more you add, the more you save.
            </p>

            {/* Tier preview */}
            <div className="mt-4 flex items-center justify-between gap-2">
              {[
                { items: "2+", off: "10%" },
                { items: "3+", off: "15%" },
                { items: "4+", off: "20%" },
              ].map((tier, i) => (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-[oklch(var(--glass-tint)/0.08)] py-2.5"
                >
                  <span className="text-[10px] font-bold text-gold-gradient">{tier.items}</span>
                  <span className="text-[9px] uppercase tracking-wide text-muted-foreground">
                    items
                  </span>
                  <span className="text-[14px] font-bold text-cream-gradient">{tier.off}</span>
                  <span className="text-[8px] uppercase tracking-wide text-muted-foreground">
                    off
                  </span>
                </div>
              ))}
            </div>

            <HuxonButton
              size="lg"
              glow
              className="mt-4 w-full"
              onClick={() => setRoute("bundle")}
            >
              <IconBolt size={16} />
              Start building
              <IconArrowRight size={14} />
            </HuxonButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
