"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * Dr. Huxon Labs — branded logo lockup.
 * - Animated glow reflections + subtle metallic highlights
 * - Morphs to compact icon as user scrolls (height + wordmark fade)
 */
export function BrandedLogo({
  compact = false,
  size = 36,
}: {
  compact?: boolean;
  size?: number;
}) {
  const { scrollY } = useScroll();
  const shrink = useTransform(scrollY, [0, 120], [1, 0.85]);
  const wordOpacity = useTransform(scrollY, [0, 80, 120], [1, 0.8, 0]);
  const wordWidth = useTransform(scrollY, [0, 120], ["auto", "0px"]);
  const sShrink = useSpring(shrink, { stiffness: 200, damping: 26 });

  if (compact) {
    return (
      <div className="relative grid place-items-center" style={{ width: size, height: size }}>
        <LogoMark size={size} />
        <Glow />
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-2.5">
      <motion.div style={{ scale: sShrink }} className="relative grid place-items-center">
        <LogoMark size={size} />
        <Glow />
      </motion.div>
      <motion.div
        style={{ opacity: wordOpacity, width: wordWidth }}
        className="overflow-hidden whitespace-nowrap"
      >
        <div className="flex flex-col leading-none">
          <span className="font-display text-[15px] font-semibold tracking-[0.14em] text-cream-gradient">
            DR. HUXON
          </span>
          <span className="text-[9px] font-medium tracking-[0.34em] text-[oklch(0.66_0.04_70)] mt-0.5">
            LABS · INDIA
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Dr. Huxon Labs"
    >
      <defs>
        <linearGradient id="hl-gold" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="oklch(0.94 0.08 85)" />
          <stop offset="0.5" stopColor="oklch(0.78 0.13 75)" />
          <stop offset="1" stopColor="oklch(0.58 0.10 55)" />
        </linearGradient>
        <linearGradient id="hl-gold-soft" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="oklch(0.92 0.10 85)" stopOpacity="0.18" />
          <stop offset="1" stopColor="oklch(0.62 0.10 55)" stopOpacity="0.10" />
        </linearGradient>
        <linearGradient id="hl-metal" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="oklch(0.99 0 0)" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="oklch(0.99 0 0)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Hexagonal molecular frame */}
      <path
        d="M24 3l17 9.8v22.4L24 45 7 35.2V12.8L24 3Z"
        stroke="url(#hl-gold)"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="url(#hl-gold-soft)"
      />
      {/* Metallic highlight on top */}
      <path
        d="M24 3l17 9.8"
        stroke="url(#hl-metal)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* H monogram */}
      <path
        d="M16 16v16M32 16v16M16 24h16"
        stroke="url(#hl-gold)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* Center molecular dot */}
      <circle cx="24" cy="24" r="1.8" fill="url(#hl-gold)" />
      {/* Surrounding accent dots */}
      <circle cx="24" cy="8.5" r="0.9" fill="url(#hl-gold)" />
      <circle cx="39.5" cy="33" r="0.9" fill="url(#hl-gold)" />
      <circle cx="8.5" cy="33" r="0.9" fill="url(#hl-gold)" />
    </svg>
  );
}

function Glow() {
  return (
    <span
      className="pointer-events-none absolute -inset-2 -z-10 rounded-full opacity-60 blur-md"
      style={{
        background:
          "radial-gradient(circle, oklch(0.78 0.13 75 / 0.35), transparent 70%)",
        animation: "glow-pulse 4s ease-in-out infinite",
      }}
    />
  );
}
