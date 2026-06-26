"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CUSTOMER_STORIES } from "@/lib/catalog";
import { SectionHeader, Reveal, StarRating } from "@/components/primitives";
import { IconStar, IconArrowRight, IconQuote } from "@/components/icons";

/**
 * Section 9 — Real customer stories.
 * Interactive story cards with subtle video-like animation.
 */
export function CustomerStories() {
  const [active, setActive] = React.useState(0);
  const story = CUSTOMER_STORIES[active];

  return (
    <section className="relative px-4 py-12">
      <SectionHeader
        kicker="Real Results"
        title={
          <>
            Trusted by <span className="text-gold-gradient">12,000+</span> athletes
          </>
        }
        subtitle="Real customers, verified reviews, measurable outcomes."
      />

      <Reveal className="mt-7">
        <div className="relative overflow-hidden rounded-3xl glass p-5">
          {/* Animated ambient glow that shifts with active story */}
          <motion.div
            key={`glow-${story.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
            style={{ background: `${story.accent.replace(")", " / 0.28)")}` }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Quote mark */}
              <IconQuote size={28} />

              {/* Quote */}
              <p className="mt-2 font-display text-[18px] font-medium leading-snug text-cream-gradient text-balance">
                {story.quote}
              </p>

              {/* Metric */}
              <div className="mt-4 flex items-center gap-3">
                <div
                  className="rounded-2xl px-3 py-2"
                  style={{
                    background: `${story.accent.replace(")", " / 0.16)")}`,
                  }}
                >
                  <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
                    Outcome
                  </div>
                  <div
                    className="text-[15px] font-bold"
                    style={{ color: story.accent }}
                  >
                    {story.metric}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
                    Duration
                  </div>
                  <div className="text-[13px] font-semibold text-cream-gradient">
                    {story.duration}
                  </div>
                </div>
              </div>

              {/* Author */}
              <div className="mt-4 flex items-center gap-3">
                <div
                  className="grid h-11 w-11 place-items-center rounded-full font-bold"
                  style={{
                    background: `${story.accent.replace(")", " / 0.2)")}`,
                    color: story.accent,
                  }}
                >
                  {story.avatar}
                </div>
                <div>
                  <div className="text-[13px] font-semibold">{story.name}</div>
                  <div className="text-[11px] text-muted-foreground">{story.role}</div>
                </div>
                <div className="ml-auto flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <IconStar key={i} size={12} active />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Story dots / selector */}
          <div className="mt-5 flex items-center justify-between">
            <div className="flex gap-1.5">
              {CUSTOMER_STORIES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  aria-label={`Story ${i + 1}`}
                  className="group relative h-9"
                >
                  <span
                    className={
                      "block h-1.5 rounded-full transition-all " +
                      (i === active ? "w-8 bg-[oklch(0.78_0.13_75)]" : "w-1.5 bg-[oklch(0.96_0.012_80_/_0.18)]")
                    }
                  />
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 text-[9px] font-medium text-background opacity-0 transition-opacity group-hover:opacity-100">
                    {s.name}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setActive((a) => (a + 1) % CUSTOMER_STORIES.length)}
              className="grid h-9 w-9 place-items-center rounded-full glass text-foreground/80 hover:text-foreground"
              aria-label="Next story"
            >
              <IconArrowRight size={14} />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
