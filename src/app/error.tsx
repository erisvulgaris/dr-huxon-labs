"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { HuxonButton } from "@/components/huxon-button";
import { IconArrowRight, IconClose } from "@/components/icons";

/**
 * Root Error Boundary — premium error page.
 * Catches unhandled errors in the app and shows a beautiful recovery screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log to console for dev (in production this would go to Sentry/Logflare)
    console.error("[error-boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background p-6 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="relative grid h-24 w-24 place-items-center"
      >
        <div className="absolute inset-0 rounded-full bg-[oklch(0.62_0.20_25/0.15)] blur-2xl" />
        <div className="relative grid h-20 w-20 place-items-center rounded-full glass">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v4m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3Z"
              stroke="oklch(0.72 0.18 25)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </motion.div>

      <h1 className="mt-6 font-display text-[24px] font-semibold text-cream-gradient">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-[320px] text-[13px] text-muted-foreground text-pretty">
        We encountered an unexpected error. Our team has been notified. Please
        try again — your cart and data are safe.
      </p>

      {process.env.NODE_ENV === "development" && (
        <details className="mt-4 max-w-[400px] rounded-xl glass p-3 text-left">
          <summary className="cursor-pointer text-[11px] font-medium text-muted-foreground">
            Error details (dev only)
          </summary>
          <pre className="mt-2 overflow-x-auto text-[10px] text-muted-foreground/80">
            {error.message}
            {error.digest ? `\nDigest: ${error.digest}` : ""}
          </pre>
        </details>
      )}

      <div className="mt-6 flex gap-2">
        <HuxonButton size="md" glow onClick={reset}>
          <IconArrowRight size={14} />
          Try again
        </HuxonButton>
        <HuxonButton
          size="md"
          variant="secondary"
          onClick={() => (window.location.href = "/")}
        >
          Go home
        </HuxonButton>
      </div>
    </div>
  );
}
