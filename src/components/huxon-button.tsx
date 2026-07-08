"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "gold" | "danger";
type Size = "sm" | "md" | "lg" | "xl";

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  magnetic?: boolean;
  ripple?: boolean;
  glow?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px] gap-1.5 rounded-xl",
  md: "h-11 px-5 text-sm gap-2 rounded-2xl",
  lg: "h-14 px-7 text-[15px] gap-2.5 rounded-2xl",
  xl: "h-16 px-8 text-base gap-3 rounded-[20px]",
};

/**
 * Magnetic button — primary brand button.
 * - Soft elevation + animated gradient reflections
 * - Magnetic hover + liquid press + elastic spring release
 * - Ripple interaction + micro particle glow
 */
export function HuxonButton({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  magnetic = true,
  ripple = true,
  glow = false,
  className,
  children,
  onClick,
  type = "button",
  ...rest
}: ButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = React.useState<
    { x: number; y: number; id: number }[]
  >([]);
  const [pressing, setPressing] = React.useState(false);

  // Magnetic motion values
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || disabled || loading) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mx.set(x * 0.25);
    my.set(y * 0.25);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    if (ripple) {
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const id = Date.now();
        setRipples((r) => [
          ...r,
          { x: e.clientX - rect.left, y: e.clientY - rect.top, id },
        ]);
        setTimeout(() => {
          setRipples((r) => r.filter((rp) => rp.id !== id));
        }, 700);
      }
    }
    onClick?.(e);
  };

  const variantClass: Record<Variant, string> = {
    primary:
      "bg-gradient-to-br from-[oklch(0.88_0.10_85)] via-[oklch(0.78_0.13_75)] to-[oklch(0.62_0.10_55)] text-[oklch(0.14_0.01_50)] shadow-gold hover:shadow-[0_8px_32px_-4px_oklch(0.78_0.13_75_/_0.5)]",
    gold:
      "bg-gradient-to-br from-[oklch(0.92_0.10_85)] to-[oklch(0.72_0.13_70)] text-[oklch(0.14_0.01_50)] shadow-gold",
    secondary:
      "glass text-foreground hover:glass-strong border border-[oklch(var(--glass-tint)/0.12)]",
    ghost:
      "bg-transparent text-foreground/80 hover:text-foreground hover:bg-[oklch(var(--glass-tint)/0.06)]",
    danger:
      "bg-gradient-to-br from-[oklch(0.62_0.20_25)] to-[oklch(0.52_0.20_25)] text-white shadow-[0_8px_24px_-6px_oklch(0.62_0.20_25_/_0.5)]",
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      aria-label={rest["aria-label"]}
      disabled={disabled || loading}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onPointerDown={() => setPressing(true)}
      onPointerUp={() => setPressing(false)}
      onPointerLeave={() => setPressing(false)}
      onClick={handleClick}
      style={{
        x: sx,
        y: sy,
        scale: pressing ? 0.97 : 1,
      }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "relative inline-flex items-center justify-center font-medium overflow-hidden select-none",
        "transition-[box-shadow,background-color] duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.78_0.13_75_/_60%)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        sizes[size],
        variantClass[variant],
        disabled && "opacity-50 cursor-not-allowed saturate-50",
        className
      )}
    >
      {/* Animated gradient reflection sweep */}
      {variant === "primary" || variant === "gold" ? (
        <span
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "linear-gradient(115deg, transparent 30%, oklch(0.99 0 0 / 0.35) 50%, transparent 70%)",
            backgroundSize: "200% 200%",
            animation: "shimmer 3.5s ease-in-out infinite",
          }}
        />
      ) : null}

      {/* Micro particle glow */}
      {glow && (variant === "primary" || variant === "gold") ? (
        <span className="pointer-events-none absolute -inset-2 -z-10 rounded-[inherit] bg-[oklch(0.78_0.13_75_/_0.25)] blur-xl animate-glow-pulse" />
      ) : null}

      {/* Ripples */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="pointer-events-none absolute rounded-full bg-current"
          style={{
            left: r.x - 12,
            top: r.y - 12,
            width: 24,
            height: 24,
          }}
        />
      ))}

      {/* Content */}
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {loading ? (
          <>
            <svg
              className="animate-spin"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="2.5"
              />
              <path
                d="M21 12a9 9 0 0 0-9-9"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <span>Please wait</span>
          </>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
}

/**
 * Icon button — round, premium, for top nav and small actions.
 */
export function HuxonIconButton({
  children,
  onClick,
  active,
  className,
  badge,
  "aria-label": ariaLabel,
  size = 44,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  badge?: number;
  "aria-label"?: string;
  size?: number;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "relative grid place-items-center rounded-full",
        "glass hover:glass-strong transition-all duration-300",
        "border border-[oklch(var(--glass-tint)/0.08)]",
        active && "border-[oklch(0.78_0.13_75_/_40%)]",
        className
      )}
      style={{ width: size, height: size }}
    >
      {children}
      {badge ? (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-gradient-to-br from-[oklch(0.78_0.13_75)] to-[oklch(0.62_0.10_55)] text-[10px] font-bold text-[oklch(0.14_0.01_50)] shadow-gold">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </motion.button>
  );
}
