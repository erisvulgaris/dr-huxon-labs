"use client";

import * as React from "react";
import { useTheme } from "next-themes";

/**
 * AutoThemeSwitch — automatically sets dark/light theme based on time of day.
 * - 7 AM – 7 PM: light theme
 * - 7 PM – 7 AM: dark theme
 * 
 * Only auto-switches if the user hasn't manually overridden the theme.
 * The manual override is tracked in localStorage.
 */
export function AutoThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [hasManualOverride, setHasManualOverride] = React.useState(false);

  React.useEffect(() => {
    // Check if user has manually set a theme preference
    const stored = localStorage.getItem("huxon-theme-manual");
    if (stored === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasManualOverride(true);
      return;
    }

    const checkTime = () => {
      if (hasManualOverride) return;
      const hour = new Date().getHours();
      const shouldBeDark = hour < 7 || hour >= 19; // 7 PM to 7 AM = dark
      const targetTheme = shouldBeDark ? "dark" : "light";
      if (theme !== targetTheme) {
        setTheme(targetTheme);
      }
    };

    // Check immediately
    checkTime();

    // Check every 5 minutes
    const interval = setInterval(checkTime, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [theme, setTheme, hasManualOverride]);

  // Listen for manual theme changes via the toggle
  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      // The ThemeToggle sets a manual flag — detect theme changes
      // that happen outside of our auto-switch
    });
    return () => observer.disconnect();
  }, []);

  return null;
}

/**
 * Hook to mark that the user has manually changed the theme.
 * Call this from the ThemeToggle component.
 */
export function useMarkManualTheme() {
  return React.useCallback(() => {
    localStorage.setItem("huxon-theme-manual", "true");
  }, []);
}
