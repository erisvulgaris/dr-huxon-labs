"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReward } from "@/lib/store";
import { IconCheck, IconSpark } from "@/components/icons";

/**
 * Reward toasts — celebratory micro-notifications when user earns points.
 */
export function RewardToasts() {
  const { toasts, removeToast } = useReward();

  return (
    <div className="pointer-events-none fixed left-1/2 top-20 z-[60] flex w-full max-w-[420px] -translate-x-1/2 flex-col items-center gap-2 px-4 pt-safe">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            onClick={() => removeToast(t.id)}
            className="pointer-events-auto flex w-full items-center gap-2.5 overflow-hidden rounded-2xl border border-[oklch(0.78_0.13_75_/_0.3)] bg-[oklch(0.17_0.012_55_/_0.95)] p-3 backdrop-blur-xl shadow-gold"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.92_0.10_85)] to-[oklch(0.62_0.10_55)]">
              <IconSpark size={16} className="text-[oklch(0.14_0.01_50)]" />
            </div>
            <div className="flex-1">
              <div className="text-[12px] font-semibold text-cream-gradient">
                {t.title}
              </div>
              {t.description ? (
                <div className="text-[10px] text-muted-foreground">
                  {t.description}
                </div>
              ) : null}
            </div>
            <IconCheck size={14} className="text-[oklch(0.62_0.10_160)]" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
