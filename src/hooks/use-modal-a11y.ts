"use client";

import * as React from "react";

/**
 * useEscapeKey — closes a modal/drawer when Escape is pressed.
 * Also traps focus within the container for accessibility.
 */
export function useEscapeKey(
  isOpen: boolean,
  onClose: () => void,
  containerRef?: React.RefObject<HTMLElement>
) {
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }

      // Focus trap: keep Tab within the container
      if (e.key === "Tab" && containerRef?.current) {
        const container = containerRef.current;
        const focusable = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, containerRef]);
}

/**
 * useFocusOnOpen — focuses the first focusable element when a modal opens.
 * Restores focus to the trigger when it closes.
 */
export function useFocusManagement(
  isOpen: boolean,
  containerRef?: React.RefObject<HTMLElement>
) {
  const previousFocus = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocus.current = document.activeElement as HTMLElement;

      // Focus the first focusable element in the container
      if (containerRef?.current) {
        const focusable = containerRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement | null;
        if (focusable) {
          setTimeout(() => focusable.focus(), 100);
        }
      }
    } else {
      // Restore focus to the trigger
      if (previousFocus.current) {
        setTimeout(() => previousFocus.current?.focus(), 100);
      }
    }
  }, [isOpen, containerRef]);
}

/**
 * useBodyScrollLock — prevents body scroll when a modal/drawer is open.
 */
export function useBodyScrollLock(isOpen: boolean) {
  React.useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);
}
