"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MANUFACTURING_STAGES } from "@/lib/catalog";
import { ICON_MAP } from "@/components/icons";
import { SectionHeader, Reveal } from "@/components/primitives";

/**
 * Section 6 — Manufacturing excellence.
 * Premium animated vertical timeline.
 */
export function ManufacturingTimeline() {
  return (
    <section className="relative px-4 py-12">
      <SectionHeader
        kicker="Manufacturing"
        title={
          <>
            From farm to <span className="text-gold-gradient">your scoop.</span>
          </>
        }
        subtitle="Seven stages of obsessive quality control. No batch ships without passing every one."
      />

      <div className="relative mt-8 pl-2">
        {/* Vertical line */}
        <div className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-[oklch(0.78_0.13_75_/_0.5)] via-[oklch(0.78_0.13_75_/_0.2)] to-transparent" />

        <div className="space-y-5">
          {MANUFACTURING_STAGES.map((stage, i) => {
            const Icon = ICON_MAP[stage.icon] ?? ICON_MAP.shield;
            return (
              <Reveal key={stage.id} delay={i * 0.05} y={20}>
                <TimelineStage
                  index={i + 1}
                  title={stage.title}
                  description={stage.description}
                  duration={stage.duration}
                  Icon={Icon}
                  isLast={i === MANUFACTURING_STAGES.length - 1}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TimelineStage({
  index,
  title,
  description,
  duration,
  Icon,
  isLast,
}: {
  index: number;
  title: string;
  description: string;
  duration: string;
  Icon: React.FC<{ size?: number; active?: boolean }>;
  isLast?: boolean;
}) {
  return (
    <div className="relative flex gap-4">
      {/* Node */}
      <div className="relative z-10 shrink-0">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.20_0.02_55)] to-[oklch(0.14_0.01_50)] border border-[oklch(0.78_0.13_75_/_0.25)] shadow-premium"
        >
          <Icon size={20} active />
        </motion.div>
        {/* Glow */}
        <div className="absolute inset-0 -z-10 rounded-2xl bg-[oklch(0.78_0.13_75_/_0.2)] blur-md" />
      </div>

      {/* Card */}
      <motion.div
        whileHover={{ x: 2 }}
        className="relative flex-1 overflow-hidden rounded-2xl glass p-4"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-text-gold tabular">
                {String(index).padStart(2, "0")}
              </span>
              <h3 className="font-display text-[15px] font-semibold text-cream-gradient">
                {title}
              </h3>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-[oklch(0.78_0.13_75_/_0.1)] px-2 py-0.5 text-[9px] font-medium text-text-gold">
            {duration}
          </span>
        </div>

        {/* Animated progress bar */}
        <motion.div
          className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-[oklch(0.96_0.012_80_/_0.06)]"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[oklch(0.78_0.13_75)] to-[oklch(0.92_0.10_85)]"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>

        {/* Sheen */}
        <span className="pointer-events-none absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.13_75_/_30%)] to-transparent" />
      </motion.div>
    </div>
  );
}
