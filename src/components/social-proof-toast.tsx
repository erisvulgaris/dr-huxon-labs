"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconClose, IconCheck, IconLocation } from "@/components/icons";

const NOTIFICATIONS = [
  { name: "Priya from Mumbai", product: "Huxon Gold Isolate", time: "2 min ago" },
  { name: "Rohan from Delhi", product: "Protein Bars (12-pack)", time: "5 min ago" },
  { name: "Sneha from Pune", product: "Recovery Matrix", time: "8 min ago" },
  { name: "Vikram from Bengaluru", product: "Daily Greens+", time: "12 min ago" },
  { name: "Ananya from Hyderabad", product: "Huxon Gold Isolate", time: "15 min ago" },
  { name: "Karthik from Chennai", product: "Plant Pre-Workout", time: "18 min ago" },
  { name: "Meera from Kolkata", product: "Protein Bars (12-pack)", time: "22 min ago" },
  { name: "Arjun from Jaipur", product: "Omega Plant 3-6-9", time: "25 min ago" },
];

import { useSettings, useNav } from "@/lib/store";

/**
 * SocialProofToast — rotating "someone just bought" notifications.
 * Appears at bottom of screen, rotates every configurable interval, dismissible.
 */
export function SocialProofToast() {
  const { socialProofInterval, socialProofEnabled } = useSettings();
  const { route } = useNav();
  const [index, setIndex] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    if (dismissed || !socialProofEnabled) {
      return;
    }

    // Show first notification after 5 seconds
    const initialTimer = setTimeout(() => setVisible(true), 5000);

    // Rotate every socialProofInterval seconds
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % NOTIFICATIONS.length);
        setVisible(true);
      }, 500);
    }, socialProofInterval * 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [dismissed, socialProofEnabled, socialProofInterval]);

  const current = NOTIFICATIONS[index];
  const show = visible && !dismissed && socialProofEnabled;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className={`fixed left-1/2 z-30 w-full max-w-[420px] -translate-x-1/2 px-4 transition-all duration-300 ${
            route === "product"
              ? "bottom-[calc(env(safe-area-inset-bottom)+180px)]"
              : "bottom-[calc(env(safe-area-inset-bottom)+100px)]"
          }`}
        >
          <div className="glass-dark flex items-center gap-2.5 rounded-2xl border border-[oklch(var(--gold)/0.2)] p-2.5 shadow-premium">
            {/* Check icon */}
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[oklch(var(--jade)/0.18)]">
              <IconCheck size={14} className="text-text-accent-jade" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="truncate text-[11px] font-semibold text-cream-gradient">
                {current.name}
              </div>
              <div className="truncate text-[10px] text-muted-foreground">
                purchased <span className="font-medium text-text-gold">{current.product}</span>
              </div>
              <div className="flex items-center gap-0.5 text-[8px] text-muted-foreground">
                <IconLocation size={7} />
                {current.time} · Verified
              </div>
            </div>

            {/* Dismiss */}
            <button
              onClick={() => { setVisible(false); setDismissed(true); }}
              aria-label="Dismiss"
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted-foreground hover:text-foreground"
            >
              <IconClose size={11} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
