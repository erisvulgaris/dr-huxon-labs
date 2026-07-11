"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HuxonButton } from "@/components/huxon-button";
import { IconClose, IconCheck, IconArrowRight, IconBolt } from "@/components/icons";
import { useSubscriptions, useCart, useNav } from "@/lib/store";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const STORAGE_KEY = "huxon-pwa-install-dismissed";

/**
 * PWAInstallPrompt — premium add-to-home-screen banner.
 * Shows when: (a) beforeinstallprompt fires, OR (b) user hasn't dismissed
 * the manual prompt and isn't already in standalone mode.
 */
export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = React.useState(false);
  const [installed, setInstalled] = React.useState(false);
  const { hasSeenOnboarding } = useSubscriptions();
  const cartOpen = useCart((s) => s.isOpen);
  const route = useNav((s) => s.route);

  React.useEffect(() => {
    // Already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
      setInstalled(true);
      return;
    }

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show after onboarding + delay
      setTimeout(() => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          setVisible(true);
        }
      }, 6000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));

    // Fallback: show manual prompt after delay even without event
    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt && !localStorage.getItem(STORAGE_KEY) && hasSeenOnboarding) {
        setVisible(true);
      }
    }, 8000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(fallbackTimer);
    };
  }, [deferredPrompt, hasSeenOnboarding]);

  // CRITICAL: Never show PWA prompt when cart is open or user is in checkout flow
  React.useEffect(() => {
    if (cartOpen || route === "cart") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
    }
  }, [cartOpen, route]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
      }
      setDeferredPrompt(null);
      setVisible(false);
    } else {
      // Manual instructions for iOS
      setVisible(false);
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  if (installed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[65] flex items-end justify-center bg-black/70 backdrop-blur-md"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 flex w-full max-w-[460px] flex-col overflow-hidden rounded-t-[28px] border-t border-border bg-background"
          >
            <div className="mx-auto my-3 h-1 w-10 rounded-full bg-[oklch(var(--glass-border)/0.2)]" />
            <button
              onClick={handleDismiss}
              aria-label="Dismiss"
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full glass"
            >
              <IconClose size={16} />
            </button>

            <div className="px-5 pb-8">
              {/* Hero icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.1 }}
                className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-[oklch(var(--gold))] to-[oklch(var(--bronze))] shadow-gold"
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3v12m0-12l-4 4m4-4l4 4M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"
                    stroke="oklch(var(--charcoal))"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>

              <h2 className="mt-4 text-center font-display text-[22px] font-semibold text-cream-gradient">
                Add Huxon to Home Screen
              </h2>
              <p className="mt-2 text-center text-[13px] leading-relaxed text-muted-foreground text-pretty">
                Install the app for instant access, offline browsing, and a
                native full-screen experience.
              </p>

              {/* Benefits */}
              <div className="mt-5 space-y-2.5">
                {[
                  { icon: <IconBolt size={13} />, text: "Faster loading — works offline" },
                  { icon: <IconCheck size={13} />, text: "Full-screen premium experience" },
                  { icon: <IconArrowRight size={13} />, text: "Quick reorder from home screen" },
                ].map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-center gap-2.5 rounded-xl glass px-3 py-2.5"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[oklch(var(--gold)/0.18)] text-gold-gradient">
                      {b.icon}
                    </span>
                    <span className="text-[12px] text-foreground/85">{b.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Install button or iOS instructions */}
              {deferredPrompt ? (
                <HuxonButton size="lg" glow className="mt-5 w-full" onClick={handleInstall}>
                  <IconCheck size={16} />
                  Install now
                </HuxonButton>
              ) : (
                <div className="mt-5">
                  <div className="rounded-2xl border border-border bg-[oklch(var(--glass-tint)/0.04)] p-3">
                    <div className="mb-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                      How to install (iOS)
                    </div>
                    <div className="space-y-1.5 text-[12px] text-foreground/80">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-gold-gradient">1.</span>
                        Tap the Share icon in Safari
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-gold-gradient">2.</span>
                        Select "Add to Home Screen"
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-gold-gradient">3.</span>
                        Tap "Add" — done!
                      </div>
                    </div>
                  </div>
                  <HuxonButton size="lg" variant="secondary" className="mt-3 w-full" onClick={handleDismiss}>
                    Got it
                  </HuxonButton>
                </div>
              )}

              <button
                onClick={handleDismiss}
                className="mx-auto mt-3 block text-[11px] text-muted-foreground"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
