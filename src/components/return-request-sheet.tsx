"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconClose,
  IconArrowRight,
  IconCheck,
  IconArrowLeft,
  IconRefresh,
  IconPackage,
} from "@/components/icons";
import { Pill } from "@/components/primitives";
import { formatINR } from "@/lib/catalog";
import type { TrackedOrder } from "@/lib/store";
import { cn } from "@/lib/utils";

const RETURN_REASONS = [
  "Wrong item received",
  "Damaged packaging",
  "Product expired",
  "Not as described",
  "Changed my mind",
  "Quality issues",
];

/**
 * ReturnRequestSheet — customer-facing return/refund request form.
 * Opens from the Orders page when user taps "Return" on a delivered order.
 */
export function ReturnRequestSheet({
  order,
  onClose,
}: {
  order: TrackedOrder | null;
  onClose: () => void;
}) {
  const [reason, setReason] = React.useState("");
  const [details, setDetails] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (order) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReason("");
      setDetails("");
      setSubmitted(false);
    }
  }, [order]);

  const isOpen = !!order;
  const canSubmit = reason.length > 0 && details.length >= 10;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && order && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 flex max-h-[92dvh] w-full max-w-[460px] flex-col overflow-hidden rounded-t-[28px] border-t border-border bg-background"
          >
            <div className="mx-auto my-3 h-1 w-10 rounded-full bg-[oklch(var(--glass-tint)/0.2)]" />
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full glass"
            >
              <IconClose size={16} />
            </button>

            <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 16 }}
                    className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[oklch(var(--jade))] to-[oklch(0.50_0.09_160)]"
                  >
                    <IconCheck size={32} className="text-background" strokeWidth={2.5} />
                  </motion.div>
                  <h3 className="mt-5 font-display text-[20px] font-semibold text-cream-gradient">
                    Return request submitted
                  </h3>
                  <p className="mt-2 max-w-[280px] text-[13px] text-muted-foreground">
                    Your return request for order #{order.orderNumber} has been
                    received. Our team will review it within 24 hours.
                  </p>
                  <div className="mt-4 rounded-xl bg-[oklch(var(--jade)/0.1)] px-4 py-2">
                    <span className="text-[12px] font-semibold text-[oklch(var(--jade))]">
                      Return ID: RET-{Date.now().toString().slice(-6)}
                    </span>
                  </div>
                  <HuxonButton size="md" variant="secondary" className="mt-5" onClick={onClose}>
                    Done
                  </HuxonButton>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-text-gold">
                    <IconRefresh size={11} />
                    Return / Refund Request
                  </div>
                  <h2 className="mt-1 font-display text-[20px] font-semibold text-cream-gradient">
                    Order #{order.orderNumber}
                  </h2>

                  {/* Order summary */}
                  <div className="mt-3 rounded-2xl glass p-3">
                    <div className="space-y-1.5">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-[12px]">
                          <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                          <span className="font-semibold tabular">{formatINR(item.price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="border-t border-border/50 pt-1.5 flex items-center justify-between">
                        <span className="text-[12px] font-semibold">Total</span>
                        <span className="font-semibold text-text-gold tabular">{formatINR(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Reason selector */}
                  <div className="mt-5">
                    <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Reason for return
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {RETURN_REASONS.map((r) => (
                        <button
                          key={r}
                          onClick={() => setReason(r)}
                          className={cn(
                            "rounded-xl border px-3 py-2.5 text-[11px] font-medium transition-all text-left",
                            reason === r
                              ? "border-[oklch(var(--gold)/0.5)] bg-[oklch(var(--gold)/0.14)] text-text-gold"
                              : "border-border bg-transparent text-muted-foreground"
                          )}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4">
                    <div className="mb-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Additional details
                    </div>
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Tell us more about the issue..."
                      rows={4}
                      maxLength={500}
                      className="w-full resize-none rounded-2xl bg-[oklch(var(--glass-tint)/0.06)] px-3 py-3 text-[13px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-[oklch(var(--gold)/40%)]"
                    />
                    <div className="mt-1 text-right text-[9px] text-muted-foreground tabular">
                      {details.length}/500
                    </div>
                  </div>

                  {/* Refund info */}
                  <div className="mt-3 rounded-xl bg-[oklch(var(--gold)/0.06)] p-3">
                    <div className="text-[10px] font-semibold text-text-gold">Refund policy</div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Refunds are processed within 5-7 business days to the original
                      payment method. You'll receive an email confirmation once approved.
                    </p>
                  </div>

                  <HuxonButton
                    size="lg"
                    glow
                    disabled={!canSubmit}
                    className="mt-5 w-full"
                    onClick={handleSubmit}
                  >
                    <IconCheck size={16} />
                    Submit return request
                  </HuxonButton>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
