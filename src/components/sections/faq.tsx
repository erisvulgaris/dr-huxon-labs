"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQS } from "@/lib/catalog";
import { SectionHeader, Reveal } from "@/components/primitives";
import { IconChevronDown } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Section 10 — FAQ.
 * Beautiful expanding accordion cards with smooth animations.
 */
export function FAQSection() {
  const [open, setOpen] = React.useState<string | null>("f1");

  return (
    <section className="relative px-4 py-12">
      <SectionHeader
        kicker="Questions"
        title={
          <>
            Straight <span className="text-gold-gradient">answers.</span>
          </>
        }
        subtitle="No marketing fluff. The real questions, answered honestly."
      />

      <Reveal className="mt-7 space-y-3">
        {FAQS.map((faq) => {
          const isOpen = open === faq.id;
          return (
            <div
              key={faq.id}
              className={cn(
                "overflow-hidden rounded-2xl border transition-colors",
                isOpen
                  ? "border-[oklch(0.78_0.13_75_/_0.25)] bg-[oklch(0.78_0.13_75_/_0.04)]"
                  : "border-border glass"
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : faq.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                aria-expanded={isOpen}
              >
                <span
                  className={cn(
                    "text-[14px] font-medium leading-snug transition-colors",
                    isOpen ? "text-cream-gradient" : "text-foreground/90"
                  )}
                >
                  {faq.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors",
                    isOpen
                      ? "bg-[oklch(0.78_0.13_75_/_0.18)] text-[oklch(0.92_0.10_85)]"
                      : "bg-[oklch(0.96_0.012_80_/_0.06)] text-muted-foreground"
                  )}
                >
                  <IconChevronDown size={14} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-[13px] leading-relaxed text-muted-foreground text-pretty">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
