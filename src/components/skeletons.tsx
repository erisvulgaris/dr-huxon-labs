"use client";

import { motion } from "framer-motion";

/**
 * Skeleton loaders for premium loading states.
 */

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl glass p-3">
      <div className="shimmer aspect-square w-full rounded-xl bg-[oklch(var(--glass-tint)/0.06)]" />
      <div className="mt-2.5 space-y-2">
        <div className="shimmer h-3 w-3/4 rounded-full bg-[oklch(var(--glass-tint)/0.06)]" />
        <div className="shimmer h-2.5 w-1/2 rounded-full bg-[oklch(var(--glass-tint)/0.04)]" />
        <div className="flex items-center justify-between pt-1">
          <div className="shimmer h-4 w-16 rounded-full bg-[oklch(var(--glass-tint)/0.06)]" />
          <div className="shimmer h-8 w-8 rounded-full bg-[oklch(var(--glass-tint)/0.06)]" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PDPSkeleton() {
  return (
    <div className="pb-[120px]">
      <div className="shimmer h-[380px] w-full bg-[oklch(var(--glass-tint)/0.04)]" />
      <div className="px-4 pt-4 space-y-4">
        <div className="space-y-2">
          <div className="shimmer h-6 w-3/4 rounded-full bg-[oklch(var(--glass-tint)/0.06)]" />
          <div className="shimmer h-4 w-1/2 rounded-full bg-[oklch(var(--glass-tint)/0.04)]" />
          <div className="shimmer h-8 w-1/3 rounded-full bg-[oklch(var(--glass-tint)/0.06)]" />
        </div>
        <div className="shimmer h-32 w-full rounded-2xl bg-[oklch(var(--glass-tint)/0.04)]" />
        <div className="shimmer h-48 w-full rounded-2xl bg-[oklch(var(--glass-tint)/0.04)]" />
        <div className="shimmer h-64 w-full rounded-2xl bg-[oklch(var(--glass-tint)/0.04)]" />
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="space-y-3 p-5">
      <div className="shimmer h-6 w-1/3 rounded-full bg-[oklch(var(--glass-tint)/0.06)]" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-3 rounded-2xl glass p-3">
          <div className="shimmer h-16 w-16 rounded-xl bg-[oklch(var(--glass-tint)/0.06)]" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="shimmer h-3 w-3/4 rounded-full bg-[oklch(var(--glass-tint)/0.06)]" />
            <div className="shimmer h-2.5 w-1/2 rounded-full bg-[oklch(var(--glass-tint)/0.04)]" />
            <div className="shimmer h-4 w-1/4 rounded-full bg-[oklch(var(--glass-tint)/0.06)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 p-5">
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="shimmer h-24 rounded-2xl bg-[oklch(var(--glass-tint)/0.04)]" />
        ))}
      </div>
      <div className="shimmer h-48 rounded-2xl bg-[oklch(var(--glass-tint)/0.04)]" />
      <div className="shimmer h-32 rounded-2xl bg-[oklch(var(--glass-tint)/0.04)]" />
    </div>
  );
}

/**
 * Premium spinner for inline loading states.
 */
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="oklch(var(--gold)/0.2)"
        strokeWidth="2.5"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="oklch(var(--gold))"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}
