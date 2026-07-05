"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/store";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconClose,
  IconArrowRight,
  IconClock,
  IconBolt,
} from "@/components/icons";
import { formatINR } from "@/lib/catalog";

/**
 * AbandonedCartRecovery — persistent banner shown when user returns
 * with items left in cart from a previous session.
 */
export function AbandonedCartRecovery() {
  const { lines, subtotal, openCart } = useCart();
  const [visible, setVisible] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  // Check if returning with items (after delay to not interrupt initial load)
  React.useEffect(() => {
    if (dismissed || lines.length === 0) return;

    const stored = sessionStorage.getItem("huxon-session-start");
    if (!stored) {
      // First visit this session — store timestamp
      sessionStorage.setItem("huxon-session-start", Date.now().toString());
    } else {
      const elapsed = Date.now() - parseInt(stored);
      // If returning after 2+ minutes with items in cart, show recovery
      if (elapsed > 120000 && lines.length > 0) {
        const timer = setTimeout(() => setVisible(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [lines.length, dismissed]);

  const close = () => {
    setVisible(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed top-0 left-1/2 z-[55] w-full max-w-[460px] -translate-x-1/2 pt-safe"
        >
          <div className="glass-dark m-3 flex items-center gap-3 rounded-2xl border border-[oklch(var(--gold)/0.3)] p-3 shadow-premium">
            {/* Icon */}
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[oklch(var(--gold)/0.18)]">
              <IconClock size={18} className="text-text-gold" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold text-cream-gradient">
                Welcome back! Your cart is waiting
              </div>
              <div className="text-[10px] text-muted-foreground">
                {lines.length} item{lines.length > 1 ? "s" : ""} · {formatINR(subtotal())}
              </div>
            </div>

            {/* CTA */}
            <HuxonButton
              size="sm"
              glow
              onClick={() => {
                openCart();
                close();
              }}
            >
              <IconBolt size={12} />
              Checkout
              <IconArrowRight size={11} />
            </HuxonButton>

            {/* Dismiss */}
            <button
              onClick={close}
              aria-label="Dismiss"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted-foreground hover:text-foreground"
            >
              <IconClose size={13} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
