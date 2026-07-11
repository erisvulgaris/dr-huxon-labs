"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQS } from "@/lib/catalog";
import { SectionHeader, Reveal } from "@/components/primitives";
import { IconChevronDown, IconSearch } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Section 10 — FAQ.
 * Beautiful expanding accordion cards with smooth animations + search.
 */
export function FAQSection() {
  const [open, setOpen] = React.useState<string | null>("f1");
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!query.trim()) return FAQS;
    const q = query.toLowerCase();
    return FAQS.filter(
      (f) =>
        f.q.toLowerCase().includes(q) ||
        f.a.toLowerCase().includes(q)
    );
  }, [query]);

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

      {/* Search */}
      <div className="mt-5 mb-4">
        <div className="relative">
          <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full rounded-full bg-[oklch(var(--glass-tint)/0.06)] py-2.5 pl-9 pr-4 text-[13px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-[oklch(var(--gold)/40%)]"
          />
        </div>
      </div>

      <Reveal className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-[13px] text-muted-foreground">
            No questions match "{query}". Try different keywords.
          </div>
        ) : null}
        {filtered.map((faq) => {
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
                      ? "bg-[oklch(0.78_0.13_75_/_0.18)] text-text-gold"
                      : "bg-[oklch(var(--glass-tint)/0.06)] text-muted-foreground"
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
