"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNav as useNavHook, useReward } from "@/lib/store";
import { PRODUCTS, formatINR } from "@/lib/catalog";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconClose,
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
  IconBolt,
  IconStar,
  IconSpark,
  IconTarget,
  IconFlame,
  IconLeaf,
  IconDumbbell,
} from "@/components/icons";
import { Pill, ProteinRing } from "@/components/primitives";
import { cn } from "@/lib/utils";

type Question = {
  id: string;
  icon: React.FC<any>;
  label: string;
  options: { id: string; label: string; emoji?: string; weight: Partial<Record<string, number>> }[];
};

const QUESTIONS: Question[] = [
  {
    id: "goal",
    icon: IconTarget,
    label: "What's your primary goal?",
    options: [
      { id: "muscle", label: "Build muscle", weight: { p1: 3, p2: 2, p5: 1 } },
      { id: "recover", label: "Faster recovery", weight: { p2: 3, p1: 1 } },
      { id: "energy", label: "More energy", weight: { p3: 3, p4: 1 } },
      { id: "health", label: "Overall health", weight: { p4: 3, p6: 2 } },
    ],
  },
  {
    id: "activity",
    icon: IconDumbbell,
    label: "How active are you?",
    options: [
      { id: "athlete", label: "Daily athlete", weight: { p1: 2, p2: 2, p3: 1 } },
      { id: "regular", label: "3-4x / week", weight: { p1: 1, p5: 2, p4: 1 } },
      { id: "casual", label: "1-2x / week", weight: { p4: 2, p6: 2 } },
      { id: "starter", label: "Just starting", weight: { p4: 2, p5: 1 } },
    ],
  },
  {
    id: "diet",
    icon: IconLeaf,
    label: "Your dietary preference?",
    options: [
      { id: "vegan", label: "Vegan", weight: { p1: 1, p4: 1, p6: 1 } },
      { id: "vegetarian", label: "Vegetarian", weight: { p1: 1, p5: 1 } },
      { id: "eggetarian", label: "Eggetarian", weight: { p1: 1, p2: 1 } },
      { id: "omnivore", label: "No restrictions", weight: { p1: 1, p2: 1 } },
    ],
  },
  {
    id: "timing",
    icon: IconFlame,
    label: "When do you need it most?",
    options: [
      { id: "post", label: "Post-workout", weight: { p1: 2, p2: 2 } },
      { id: "pre", label: "Pre-workout", weight: { p3: 3 } },
      { id: "morning", label: "Morning boost", weight: { p4: 2, p6: 1 } },
      { id: "snack", label: "On-the-go snack", weight: { p5: 3 } },
    ],
  },
  {
    id: "concern",
    icon: IconSpark,
    label: "What matters most to you?",
    options: [
      { id: "protein", label: "Max protein", weight: { p1: 3 } },
      { id: "clean", label: "Clean label", weight: { p4: 2, p1: 1 } },
      { id: "taste", label: "Great taste", weight: { p5: 2, p1: 1 } },
      { id: "value", label: "Best value", weight: { p5: 2, p6: 1 } },
    ],
  },
];

/**
 * NutritionQuiz — gamified 5-question quiz that recommends products.
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

export function NutritionQuiz() {
  const { quizOpen, setQuizOpen } = useNavHook();
  useEscapeClose(quizOpen, () => setQuizOpen(false));
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [showResults, setShowResults] = React.useState(false);
  const { addPoints, pushToast } = useReward();

  React.useEffect(() => {
    if (quizOpen) {
      setStep(0);
      setAnswers({});
      setShowResults(false);
    }
  }, [quizOpen]);

  const current = QUESTIONS[step];
  const progress = ((step + (showResults ? 1 : 0)) / QUESTIONS.length) * 100;

  const selectAnswer = (qid: string, oid: string) => {
    setAnswers((a) => ({ ...a, [qid]: oid }));
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) setStep((s) => s + 1);
      else setShowResults(true);
    }, 300);
  };

  // Calculate recommendations
  const scores = React.useMemo(() => {
    if (!showResults) return {};
    const s: Record<string, number> = {};
    QUESTIONS.forEach((q) => {
      const aid = answers[q.id];
      if (!aid) return;
      const opt = q.options.find((o) => o.id === aid);
      if (opt?.weight) {
        Object.entries(opt.weight).forEach(([pid, w]) => {
          s[pid] = (s[pid] || 0) + w;
        });
      }
    });
    return s;
  }, [showResults, answers]);

  const recommendations = React.useMemo(() => {
    if (!showResults) return [];
    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([pid, score]) => ({
        product: PRODUCTS.find((p) => p.id === pid)!,
        score,
        matchPct: Math.min(98, 60 + score * 4),
      }))
      .filter((r) => r.product);
  }, [showResults, scores]);

  const close = () => {
    setQuizOpen(false);
    if (showResults) {
      addPoints(75);
      pushToast({
        title: "+75 reward points",
        description: "Thanks for completing the nutrition quiz!",
      });
    }
  };

  return (
    <AnimatePresence>
      {quizOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-lg"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            className="relative flex max-h-[94dvh] w-full max-w-[460px] flex-col overflow-hidden rounded-t-[28px] border-t border-border bg-background"
          >
            {/* Header with progress */}
            <div className="flex items-center gap-3 px-5 py-4">
              <button
                onClick={close}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full glass"
              >
                <IconClose size={16} />
              </button>
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between text-[9px] uppercase tracking-wide text-muted-foreground">
                  <span>{showResults ? "Your matches" : "Nutrition quiz"}</span>
                  <span className="tabular">
                    {showResults ? "Done" : `${step + 1} / ${QUESTIONS.length}`}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[oklch(var(--glass-tint)/0.08)]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[oklch(var(--gold))] to-[oklch(var(--bronze))]"
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 200, damping: 24 }}
                    style={{ filter: "drop-shadow(0 0 4px oklch(var(--gold)/0.5))" }}
                  />
                </div>
              </div>
            </div>

            <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-8">
              <AnimatePresence mode="wait">
                {!showResults ? (
                  <motion.div
                    key={`q-${step}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Question icon */}
                    <motion.div
                      initial={{ scale: 0, rotate: -15 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.1 }}
                      className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[oklch(var(--gold)/0.14)]"
                    >
                      <current.icon size={28} active />
                    </motion.div>

                    {/* Question */}
                    <h2 className="mt-4 text-center font-display text-[22px] font-semibold leading-tight text-cream-gradient text-balance">
                      {current.label}
                    </h2>

                    {/* Options */}
                    <div className="mt-5 space-y-2.5">
                      {current.options.map((opt, i) => {
                        const selected = answers[current.id] === opt.id;
                        return (
                          <motion.button
                            key={opt.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + i * 0.06 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => selectAnswer(current.id, opt.id)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all",
                              selected
                                ? "border-[oklch(var(--gold)/0.5)] bg-[oklch(var(--gold)/0.12)]"
                                : "border-border glass"
                            )}
                          >
                            <div
                              className={cn(
                                "grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all",
                                selected
                                  ? "border-[oklch(var(--gold))] bg-[oklch(var(--gold))]"
                                  : "border-[oklch(var(--glass-border)/0.3)]"
                              )}
                            >
                              {selected && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <IconCheck size={12} className="text-[oklch(var(--charcoal))]" />
                                </motion.span>
                              )}
                            </div>
                            <span
                              className={cn(
                                "text-[14px] font-medium",
                                selected ? "text-gold-gradient" : "text-foreground/90"
                              )}
                            >
                              {opt.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Back button (if not first) */}
                    {step > 0 && (
                      <button
                        onClick={() => setStep((s) => s - 1)}
                        className="mx-auto mt-4 flex items-center gap-1 text-[12px] text-muted-foreground"
                      >
                        <IconArrowLeft size={13} />
                        Previous question
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Results header */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 16 }}
                      className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[oklch(var(--gold))] to-[oklch(var(--bronze))]"
                    >
                      <IconSpark size={28} className="text-[oklch(var(--charcoal))]" />
                    </motion.div>
                    <h2 className="mt-3 text-center font-display text-[24px] font-semibold text-cream-gradient">
                      Your matches
                    </h2>
                    <p className="mt-1 text-center text-[12px] text-muted-foreground">
                      Based on your answers, we recommend {recommendations.length} products.
                    </p>

                    {/* Recommendations */}
                    <div className="mt-5 space-y-3">
                      {recommendations.map((rec, i) => (
                        <motion.div
                          key={rec.product.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className={cn(
                            "relative overflow-hidden rounded-2xl border glass p-3.5",
                            i === 0 && "border-[oklch(var(--gold)/0.4)]"
                          )}
                        >
                          {i === 0 && (
                            <div className="absolute right-3 top-3">
                              <Pill tone="gold">
                                <IconStar size={9} active />
                                Best match
                              </Pill>
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <div className="relative h-16 w-16 shrink-0">
                              <div
                                className="absolute inset-0 rounded-full blur-md"
                                style={{ background: `${rec.product.accent.replace(")", " / 0.3)")}` }}
                              />
                              <img
                                src={rec.product.heroImage}
                                alt={rec.product.name}
                                className="relative h-full w-full object-contain"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.opacity = "0";
                                }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-[14px] font-semibold text-cream-gradient">
                                {rec.product.name}
                              </h3>
                              <p className="truncate text-[11px] text-muted-foreground">
                                {rec.product.tagline}
                              </p>
                              <div className="mt-1 flex items-center gap-2">
                                <span className="text-[13px] font-semibold text-gold-gradient tabular">
                                  {formatINR(rec.product.price)}
                                </span>
                                <span className="text-[10px] text-[oklch(var(--jade))]">
                                  {rec.matchPct}% match
                                </span>
                              </div>
                            </div>
                            <ProteinRing
                              value={rec.matchPct}
                              size={48}
                              stroke={4}
                              color={rec.product.accent}
                            >
                              <span className="text-[10px] font-bold text-cream-gradient">
                                {rec.matchPct}%
                              </span>
                            </ProteinRing>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA */}
                    <HuxonButton
                      size="lg"
                      glow
                      className="mt-5 w-full"
                      onClick={() => {
                        if (recommendations[0]) {
                          useNavHook.getState().openProduct(recommendations[0].product.id);
                        }
                        close();
                      }}
                    >
                      <IconBolt size={16} />
                      View top match
                      <IconArrowRight size={14} />
                    </HuxonButton>
                    <button
                      onClick={close}
                      className="mx-auto mt-3 block text-[12px] text-muted-foreground"
                    >
                      Done · earn 75 points
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
