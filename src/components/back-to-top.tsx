"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrowRight } from "@/components/icons";

/**
 * BackToTop — floating button that appears after scrolling down.
 * Smooth-scrolls to top when clicked.
 */
export function BackToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const container = document.querySelector(".app-scroll") as HTMLElement | null;
    if (!container) return;

    const handler = () => {
      setVisible(container.scrollTop > 600);
    };
    container.addEventListener("scroll", handler, { passive: true });
    return () => container.removeEventListener("scroll", handler);
  }, []);

  const scrollToTop = () => {
    const container = document.querySelector(".app-scroll") as HTMLElement | null;
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 0.85 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+100px)] right-4 z-30 grid h-10 w-10 place-items-center rounded-full glass-dark border border-[oklch(var(--gold)/0.3)] shadow-premium"
        >
          <motion.span
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <IconArrowRight size={16} className="rotate-[-90deg] text-text-gold" />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
