"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSubscriptions } from "@/lib/store";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconArrowRight,
  IconCheck,
  IconFlask,
  IconLeaf,
  IconBolt,
  IconCrown,
  IconClose,
} from "@/components/icons";

const SLIDES = [
  {
    id: 0,
    icon: IconFlask,
    accent: "oklch(0.78 0.13 75)",
    title: "Pharmaceutical-grade nutrition",
    subtitle: "Every batch lab-tested",
    body: "Plant protein engineered like medicine. Heavy metals, microbial, and protein assay verified in our NABL-accredited lab — certificates published on every product page.",
    gradient: "from-[oklch(0.78_0.13_75/0.2)] to-[oklch(0.62_0.10_55/0.05)]",
  },
  {
    id: 1,
    icon: IconLeaf,
    accent: "oklch(0.62 0.10 160)",
    title: "100% plant-based, zero compromise",
    subtitle: "Clean label, real ingredients",
    body: "Pea + sprouted rice isolate with a PDCAAS of 1.0. No sucralose, no fillers, no artificial colors. Sweetened only with stevia and monk fruit.",
    gradient: "from-[oklch(0.62_0.10_160/0.2)] to-[oklch(0.50_0.09_160/0.05)]",
  },
  {
    id: 2,
    icon: IconCrown,
    accent: "oklch(0.82 0.13 75)",
    title: "Earn rewards, save more",
    subtitle: "Tier-based loyalty",
    body: "Every order earns points. Climb from Bronze to Platinum for up to 15% back, free shipping, and concierge nutritionist access. Subscribe & save 15% on every delivery.",
    gradient: "from-[oklch(0.82_0.13_75/0.2)] to-[oklch(0.70_0.10_60/0.05)]",
  },
];

/**
 * OnboardingTour — 3-slide welcome for first-time users.
 * Shows once (controlled by hasSeenOnboarding in subscriptions store).
 */
export function OnboardingTour() {
  const { hasSeenOnboarding, setHasSeenOnboarding } = useSubscriptions();
  const [slide, setSlide] = React.useState(0);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    // Show onboarding after a short delay if not seen
    if (!hasSeenOnboarding) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, [hasSeenOnboarding]);

  const dismiss = () => {
    setVisible(false);
    setHasSeenOnboarding(true);
  };

  const next = () => {
    if (slide < SLIDES.length - 1) setSlide((s) => s + 1);
    else dismiss();
  };

  const current = SLIDES[slide];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/80 backdrop-blur-lg"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            className="relative flex w-full max-w-[460px] flex-col overflow-hidden rounded-t-[32px] border-t border-border bg-background"
          >
            {/* Close */}
            <button
              onClick={dismiss}
              aria-label="Skip"
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full glass"
            >
              <IconClose size={16} />
            </button>

            {/* Slide content */}
            <div className={`relative overflow-hidden bg-gradient-to-br ${current.gradient} px-6 pt-12 pb-6`}>
              <div className="bg-molecular absolute inset-0 opacity-40" />
              {/* Ambient glow */}
              <motion.div
                key={`glow-${slide}`}
                className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
                style={{ background: `${current.accent.replace(")", " / 0.3)")}` }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Icon */}
              <motion.div
                key={`icon-${slide}`}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.1 }}
                className="relative mx-auto grid h-20 w-20 place-items-center rounded-3xl"
                style={{ background: `${current.accent.replace(")", " / 0.18)")}` }}
              >
                <current.icon size={36} active />
                <motion.div
                  className="absolute inset-0 -z-10 rounded-3xl blur-lg"
                  style={{ background: `${current.accent.replace(")", " / 0.4)")}` }}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>

              {/* Subtitle */}
              <motion.div
                key={`sub-${slide}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative mt-5 text-center text-[10px] font-semibold uppercase tracking-[0.24em]"
                style={{ color: current.accent }}
              >
                {current.subtitle}
              </motion.div>

              {/* Title */}
              <motion.h2
                key={`title-${slide}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative mt-2 text-center font-display text-[26px] font-semibold leading-tight text-cream-gradient text-balance"
              >
                {current.title}
              </motion.h2>

              {/* Body */}
              <motion.p
                key={`body-${slide}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative mt-3 text-center text-[13.5px] leading-relaxed text-muted-foreground text-pretty"
              >
                {current.body}
              </motion.p>
            </div>

            {/* Progress dots + CTA */}
            <div className="flex items-center justify-between px-6 py-5">
              {/* Dots */}
              <div className="flex gap-1.5">
                {SLIDES.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setSlide(i)}
                    className="h-1.5 rounded-full transition-all"
                    animate={{
                      width: i === slide ? 24 : 6,
                      backgroundColor:
                        i === slide ? current.accent : "oklch(var(--glass-border)/0.3)",
                    }}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* CTA */}
              <HuxonButton size="sm" glow onClick={next}>
                {slide < SLIDES.length - 1 ? (
                  <>
                    Next
                    <IconArrowRight size={13} />
                  </>
                ) : (
                  <>
                    <IconCheck size={13} />
                    Get started
                  </>
                )}
              </HuxonButton>
            </div>

            {/* Skip */}
            <button
              onClick={dismiss}
              className="pb-5 text-center text-[11px] text-muted-foreground"
            >
              Skip tour
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
