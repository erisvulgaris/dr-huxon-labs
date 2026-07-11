"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNav, useReward } from "@/lib/store";
import { PRODUCTS } from "@/lib/catalog";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconClose,
  IconStar,
  IconCheck,
  IconArrowRight,
} from "@/components/icons";
import { Pill } from "@/components/primitives";
import { cn } from "@/lib/utils";

/**
 * ReviewSheet — premium bottom sheet for submitting product reviews.
 * Rating stars + title + body + photo upload (simulated) + submit.
 */
// Inline escape-to-close hook
function useEscapeClose(isOpen: boolean, onClose: () => void) {
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);
}

export function ReviewSheet() {
  const { reviewProductId, setReviewProductId } = useNav();
  const product = PRODUCTS.find((p) => p.id === reviewProductId);
  useEscapeClose(!!reviewProductId, () => setReviewProductId(null));
  const isOpen = !!product;

  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const { addPoints, pushToast } = useReward();

  // Reset on open
  React.useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRating(0);
      setHoverRating(0);
      setTitle("");
      setBody("");
      setSubmitted(false);
    }
  }, [isOpen, product?.id]);

  const handleSubmit = async () => {
    if (rating === 0 || !title.trim() || !body.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product?.id,
          author: "Arjun Mehta",
          rating,
          title: title.trim(),
          body: body.trim(),
        }),
      }).catch(() => {}); // graceful: ignore network errors
    } finally {
      setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
        addPoints(50);
        pushToast({
          title: "+50 reward points",
          description: "Thanks for your review!",
        });
      }, 600);
    }
  };

  const canSubmit = rating > 0 && title.trim().length >= 3 && body.trim().length >= 10;

  return (
    <AnimatePresence>
      {isOpen && product ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setReviewProductId(null)}
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
            <div className="mx-auto my-3 h-1 w-10 rounded-full bg-[oklch(var(--glass-border)/0.2)]" />
            <button
              onClick={() => setReviewProductId(null)}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full glass"
            >
              <IconClose size={16} />
            </button>

            <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-8">
              {submitted ? (
                <ReviewSuccess product={product} onClose={() => setReviewProductId(null)} />
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-gold-gradient">
                    <IconStar size={11} active />
                    Write a review
                  </div>
                  <h2 className="mt-1 font-display text-[22px] font-semibold text-cream-gradient">
                    {product.name}
                  </h2>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    Share your honest experience. Earn 50 points.
                  </p>

                  {/* Rating */}
                  <div className="mt-5">
                    <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Your rating
                    </div>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((i) => {
                        const active = i <= (hoverRating || rating);
                        return (
                          <motion.button
                            key={i}
                            whileTap={{ scale: 0.85 }}
                            whileHover={{ scale: 1.15, y: -2 }}
                            onClick={() => setRating(i)}
                            onMouseEnter={() => setHoverRating(i)}
                            onMouseLeave={() => setHoverRating(0)}
                            aria-label={`${i} star${i > 1 ? "s" : ""}`}
                            className="relative"
                          >
                            <IconStar size={32} active={active} />
                            {active && (
                              <motion.span
                                layoutId={`star-glow-${i}`}
                                className="absolute inset-0 -z-10 rounded-full bg-[oklch(var(--gold)/0.3)] blur-md"
                              />
                            )}
                          </motion.button>
                        );
                      })}
                      {rating > 0 ? (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="ml-2 text-[13px] font-semibold text-gold-gradient"
                        >
                          {RATING_LABELS[rating - 1]}
                        </motion.span>
                      ) : null}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mt-5">
                    <FloatingInput
                      label="Review title"
                      value={title}
                      onChange={setTitle}
                      placeholder="Summarize your experience"
                      maxLength={80}
                    />
                    <div className="mt-1 text-right text-[9px] text-muted-foreground tabular">
                      {title.length}/80
                    </div>
                  </div>

                  {/* Body */}
                  <div className="mt-3">
                    <div className="mb-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Your review
                    </div>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="What did you like? How did it perform? Would you recommend it?"
                      rows={5}
                      maxLength={500}
                      className="w-full resize-none rounded-2xl bg-[oklch(var(--glass-tint)/0.06)] px-3 py-3 text-[13px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-[oklch(var(--gold)/40%)]"
                    />
                    <div className="mt-1 text-right text-[9px] text-muted-foreground tabular">
                      {body.length}/500
                    </div>
                  </div>

                  {/* Photo upload (simulated) */}
                  <div className="mt-3">
                    <div className="mb-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Add photos (optional)
                    </div>
                    <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-[12px] text-muted-foreground">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(var(--glass-tint)/0.06)]">
                        +
                      </span>
                      Tap to upload
                    </button>
                  </div>

                  {/* Submit */}
                  <HuxonButton
                    size="lg"
                    glow
                    loading={submitting}
                    disabled={!canSubmit}
                    className="mt-5 w-full"
                    onClick={handleSubmit}
                  >
                    {canSubmit ? (
                      <>
                        Submit review · +50 pts
                        <IconArrowRight size={14} />
                      </>
                    ) : (
                      "Complete rating + review"
                    )}
                  </HuxonButton>

                  <p className="mt-2 text-center text-[10px] text-muted-foreground">
                    Reviews are moderated within 24h. Be honest and respectful.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ReviewSuccess({
  product,
  onClose,
}: {
  product: (typeof PRODUCTS)[number];
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="relative grid h-24 w-24 place-items-center"
      >
        <div className="absolute inset-0 rounded-full bg-[oklch(var(--jade)/0.2)] blur-2xl" />
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.15 }}
          className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[oklch(var(--jade))] to-[oklch(0.50_0.09_160)]"
        >
          <IconCheck size={28} className="text-background" strokeWidth={2.5} />
        </motion.div>
        {/* Confetti */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              background: ["oklch(var(--gold))", "oklch(var(--jade))", "oklch(var(--gold-soft))"][i % 3],
            }}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{
              scale: [0, 1, 0],
              x: Math.cos((i / 8) * Math.PI * 2) * 50,
              y: Math.sin((i / 8) * Math.PI * 2) * 50,
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          />
        ))}
      </motion.div>

      <h3 className="mt-6 font-display text-[20px] font-semibold text-cream-gradient">
        Review submitted!
      </h3>
      <p className="mt-2 max-w-[280px] text-[13px] text-muted-foreground">
        Thank you for reviewing {product.name}. You earned 50 reward points.
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-full bg-[oklch(var(--jade)/0.12)] px-4 py-2">
        <IconStar size={14} active />
        <span className="text-[12px] font-semibold text-[oklch(var(--jade))]">
          +50 points added
        </span>
      </div>

      <HuxonButton size="md" variant="secondary" className="mt-5" onClick={onClose}>
        Done
      </HuxonButton>
    </div>
  );
}

function FloatingInput({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  const [focused, setFocused] = React.useState(false);
  const float = focused || value.length > 0;
  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-[oklch(var(--glass-tint)/0.06)] px-3 pt-5 pb-2 transition-colors",
        focused ? "border-[oklch(var(--gold)/40%)]" : "border-border"
      )}
    >
      <label
        className={cn(
          "absolute left-3 transition-all pointer-events-none",
          float
            ? "top-1.5 text-[9px] uppercase tracking-wide text-muted-foreground"
            : "top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground/70"
        )}
      >
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={float ? placeholder : ""}
        maxLength={maxLength}
        className="w-full bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
      />
    </div>
  );
}

const RATING_LABELS = ["Poor", "Fair", "Good", "Very good", "Excellent"];
