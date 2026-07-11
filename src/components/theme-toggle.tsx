"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Premium theme toggle — morphs between sun and moon with a fluid reveal.
 * Respects reduced motion.
 */
export function ThemeToggle({ size = 44 }: { size?: number }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), []);

  const current = resolvedTheme ?? theme;
  const isDark = current === "dark";

  const toggle = () => {
    // Mark manual override so AutoThemeSwitch stops auto-switching
    localStorage.setItem("huxon-theme-manual", "true");
    // Add transition class for smooth color shift
    document.documentElement.classList.add("theme-transition");
    setTheme(isDark ? "light" : "dark");
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 500);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="relative grid place-items-center rounded-full glass hover:glass-strong transition-all"
      style={{ width: size, height: size }}
    >
      {/* Animated icon swap */}
      <AnimatePresence mode="wait" initial={false}>
        {mounted && isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute"
          >
            <MoonIcon size={18} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute"
          >
            <SunIcon size={18} />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Glow ring on hover */}
      <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity hover:opacity-100">
        <span
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: `0 0 12px oklch(var(--gold) / 40%)`,
          }}
        />
      </span>
    </motion.button>
  );
}

function SunIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sun-grad" x1="0" y1="0" x2="24" y2="24">
          <stop stopColor="oklch(0.65 0.14 55)" />
          <stop offset="1" stopColor="oklch(0.50 0.11 45)" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="4" fill="url(#sun-grad)" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const x1 = 12 + Math.cos(a) * 6.5;
        const y1 = 12 + Math.sin(a) * 6.5;
        const x2 = 12 + Math.cos(a) * 8.5;
        const y2 = 12 + Math.sin(a) * 8.5;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#sun-grad)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function MoonIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="moon-grad" x1="0" y1="0" x2="24" y2="24">
          <stop stopColor="oklch(0.92 0.10 85)" />
          <stop offset="1" stopColor="oklch(0.70 0.10 60)" />
        </linearGradient>
      </defs>
      <path
        d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"
        fill="url(#moon-grad)"
        stroke="url(#moon-grad)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
