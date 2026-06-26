"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TRUST_BADGES } from "@/lib/catalog";
import { ICON_MAP } from "@/components/icons";
import { SectionHeader, Stagger, StaggerItem } from "@/components/primitives";

/**
 * Section 2 — Animated trust widgets (floating premium info capsules).
 */
export function TrustWidgets() {
  return (
    <section className="relative px-4 py-12">
      <SectionHeader
        kicker="Engineered Trust"
        title={
          <>
            Built to <span className="text-gold-gradient">pharmaceutical</span> standards
          </>
        }
        subtitle="Every batch is held to the same standard as human medicine. No exceptions, no shortcuts."
      />

      <Stagger className="mt-7 grid grid-cols-2 gap-3" staggerChildren={0.06}>
        {TRUST_BADGES.map((b) => {
          const Icon = ICON_MAP[b.icon] ?? ICON_MAP.shield;
          return (
            <StaggerItem key={b.id}>
              <TrustCapsule label={b.label} Icon={Icon} />
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}

function TrustCapsule({
  label,
  Icon,
}: {
  label: string;
  Icon: React.FC<{ size?: number; active?: boolean }>;
}) {
  const [active, setActive] = React.useState(false);
  return (
    <motion.button
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setActive(false)}
      onPointerLeave={() => setActive(false)}
      whileHover={{ y: -3 }}
      animate={{ y: active ? 0 : [0, -4, 0] }}
      transition={{
        y: active
          ? { duration: 0.2 }
          : { duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" },
      }}
      className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl glass p-3.5 text-left transition-shadow hover:shadow-gold"
    >
      {/* Gold sweep on hover */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[oklch(0.78_0.13_75_/_0.12)] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[oklch(0.78_0.13_75_/_0.12)]">
        <Icon size={18} active />
      </span>
      <span className="relative text-[12.5px] font-medium leading-tight text-foreground/90">
        {label}
      </span>
    </motion.button>
  );
}
