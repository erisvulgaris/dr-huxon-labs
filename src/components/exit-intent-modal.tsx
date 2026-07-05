"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/store";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconClose,
  IconArrowRight,
  IconBolt,
  IconCheck,
  IconClock,
  IconGift,
} from "@/components/icons";
import { formatINR } from "@/lib/catalog";

/**
 * ExitIntentModal — CRO feature that shows when user attempts to leave
 * with items in cart. Offers a discount code to prevent abandonment.
 */
export function ExitIntentModal() {
  const { lines, subtotal, isOpen } = useCart();
  const [visible, setVisible] = React.useState(false);
  const [shown, setShown] = React.useState(false);
  const [codeCopied, setCodeCopied] = React.useState(false);

  // Show on mouseleave (desktop) or after 30s of inactivity (mobile)
  React.useEffect(() => {
    if (shown || lines.length === 0 || isOpen) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && lines.length > 0 && !shown) {
        setVisible(true);
        setShown(true);
      }
    };

    // Mobile fallback: show after 45s if cart has items
    const timer = setTimeout(() => {
      if (lines.length > 0 && !shown) {
        setVisible(true);
        setShown(true);
      }
    }, 45000);

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timer);
    };
  }, [lines.length, isOpen, shown]);

  const discount = Math.round(subtotal() * 0.1);
  const close = () => setVisible(false);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-lg p-4"
        >
          <motion.div
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[400px] overflow-hidden rounded-3xl border border-[oklch(var(--gold)/0.3)] bg-background p-6 text-center"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full glass"
            >
              <IconClose size={16} />
            </button>

            {/* Hero icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.1 }}
              className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[oklch(var(--gold))] to-[oklch(var(--bronze))] shadow-gold"
            >
              <IconGift size={32} className="text-[oklch(var(--charcoal))]" />
            </motion.div>

            <h2 className="mt-5 font-display text-[24px] font-semibold text-cream-gradient">
              Wait! Here's 10% off
            </h2>
            <p className="mt-2 text-[13px] text-muted-foreground text-pretty">
              We noticed you have items in your cart. Complete your order now
              and save <span className="font-bold text-text-gold">{formatINR(discount)}</span> instantly.
            </p>

            {/* Coupon code */}
            <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[oklch(var(--gold)/0.4)] bg-[oklch(var(--gold)/0.06)] p-3">
              <span className="font-mono text-[18px] font-bold tracking-wider text-text-gold">
                STAY10
              </span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText("STAY10");
                  setCodeCopied(true);
                  setTimeout(() => setCodeCopied(false), 2000);
                }}
                className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(var(--gold)/0.18)]"
                aria-label="Copy code"
              >
                {codeCopied ? (
                  <IconCheck size={14} className="text-[oklch(var(--jade))]" />
                ) : (
                  <IconArrowRight size={14} className="text-text-gold" />
                )}
              </button>
            </div>

            {/* Cart summary */}
            <div className="mt-4 rounded-2xl glass p-3 text-left">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">
                  {lines.length} item{lines.length > 1 ? "s" : ""} in cart
                </span>
                <span className="font-semibold text-cream-gradient tabular">
                  {formatINR(subtotal())}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">10% discount</span>
                <span className="font-semibold text-[oklch(var(--jade))] tabular">
                  −{formatINR(discount)}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between border-t border-border/50 pt-1.5">
                <span className="text-[13px] font-semibold">You pay</span>
                <span className="font-display text-[18px] font-semibold text-text-gold tabular">
                  {formatINR(subtotal() - discount)}
                </span>
              </div>
            </div>

            {/* Urgency */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-[oklch(0.72_0.18_25)]">
              <IconClock size={11} />
              <span>Code expires in 15 minutes</span>
            </div>

            {/* CTA */}
            <HuxonButton
              size="lg"
              glow
              className="mt-4 w-full"
              onClick={() => {
                useCart.getState().openCart();
                close();
              }}
            >
              <IconBolt size={16} />
              Claim discount & checkout
              <IconArrowRight size={14} />
            </HuxonButton>

            <button
              onClick={close}
              className="mt-3 text-[11px] text-muted-foreground"
            >
              No thanks, I'll pay full price
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
