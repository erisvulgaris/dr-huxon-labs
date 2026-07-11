"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HuxonButton } from "@/components/huxon-button";
import { IconClose, IconCheck, IconShield } from "@/components/icons";

/**
 * CookieConsent — GDPR-compliant cookie consent banner.
 * Shows on first visit, persists choice in localStorage.
 */
export function CookieConsent() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const consent = localStorage.getItem("huxon-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("huxon-cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("huxon-cookie-consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed bottom-0 left-1/2 z-[60] w-full max-w-[460px] -translate-x-1/2 p-3 pb-[calc(env(safe-area-inset-bottom)+8px)]"
        >
          <div className="glass-dark rounded-2xl border border-[oklch(var(--gold)/0.2)] p-4 shadow-premium">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[oklch(var(--gold)/0.14)]">
                <IconShield size={18} className="text-text-gold" />
              </div>
              <div className="flex-1">
                <h3 className="text-[13px] font-semibold text-cream-gradient">
                  We value your privacy
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  We use cookies to enhance your experience, analyze traffic, and
                  personalize content. By clicking "Accept", you consent to our use
                  of cookies. Read our{" "}
                  <a href="#" className="text-text-gold underline">Privacy Policy</a>.
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <HuxonButton size="sm" glow className="flex-1" onClick={accept}>
                <IconCheck size={13} />
                Accept
              </HuxonButton>
              <button
                onClick={decline}
                className="flex-1 rounded-full glass py-2.5 text-[12px] font-medium text-muted-foreground"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
