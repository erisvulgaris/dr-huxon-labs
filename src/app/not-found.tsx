"use client";

import { motion } from "framer-motion";
import { HuxonButton } from "@/components/huxon-button";
import { IconArrowRight, IconHome } from "@/components/icons";
import Link from "next/link";

/**
 * 404 Not Found — premium error page for missing routes.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background p-6 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="relative"
      >
        <h1 className="font-display text-[80px] font-bold leading-none text-gold-gradient">
          404
        </h1>
        <motion.div
          className="absolute inset-0 -z-10 rounded-full bg-[oklch(var(--gold)/0.15)] blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 font-display text-[22px] font-semibold text-cream-gradient"
      >
        Page not found
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-2 max-w-[300px] text-[13px] text-muted-foreground text-pretty"
      >
        The page you're looking for doesn't exist or has been moved. Let's get
        you back to premium nutrition.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <Link href="/">
          <HuxonButton size="md" glow>
            <IconHome size={14} />
            Back to home
            <IconArrowRight size={13} />
          </HuxonButton>
        </Link>
      </motion.div>
    </div>
  );
}
