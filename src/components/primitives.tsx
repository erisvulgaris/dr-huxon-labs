"use client";

import * as React from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { IconStar } from "@/components/icons";

/* ============================================================
   AnimatedNumber — smooth count-up whenever value changes
   ============================================================ */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.2,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);
  const [display, setDisplay] = React.useState("0");

  React.useEffect(() => {
    const controls = animate(mv, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplay(
          latest.toLocaleString("en-IN", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        );
      },
    });
    return controls.stop;
  }, [value, decimals, duration]);

  return (
    <span ref={ref} className={cn("tabular", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ============================================================
   Reveal — scroll-triggered fade + rise
   ============================================================ */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  once = true,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   Stagger — container that staggers its children
   ============================================================ */
export function Stagger({
  children,
  className,
  delayChildren = 0,
  staggerChildren = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { delayChildren, staggerChildren },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 20,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   ProteinRing — animated circular progress (protein %, scores)
   ============================================================ */
export function ProteinRing({
  value,
  size = 80,
  stroke = 7,
  label,
  sublabel,
  color = "oklch(0.78 0.13 75)",
  trackColor = "oklch(0.96 0.012 80 / 0.08)",
  children,
}: {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
}) {
  const ref = React.useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [pct, setPct] = React.useState(0);

  React.useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setPct(Math.max(0, Math.min(100, value))), 80);
      return () => clearTimeout(t);
    }
  }, [inView, value]);

  const offset = c - (pct / 100) * c;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <defs>
          <linearGradient id={`ring-${color}`} x1="0" y1="0" x2={size} y2={size}>
            <stop offset="0" stopColor={color} />
            <stop offset="1" stopColor="oklch(0.92 0.10 85)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#ring-${color})`}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        {children ?? (
          <div className="flex flex-col items-center leading-none">
            <span className="font-display text-lg font-semibold text-cream-gradient">
              <AnimatedNumber value={value} suffix="%" />
            </span>
            {label ? (
              <span className="mt-1 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                {label}
              </span>
            ) : null}
            {sublabel ? (
              <span className="text-[9px] text-muted-foreground/70">{sublabel}</span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   StarRating — premium gold stars
   ============================================================ */
export function StarRating({
  value,
  size = 14,
  count,
  className,
}: {
  value: number;
  size?: number;
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <IconStar key={i} size={size} active={i <= Math.round(value)} />
        ))}
      </div>
      <span className="text-xs font-medium text-foreground/80 tabular">
        {value.toFixed(1)}
      </span>
      {count !== undefined ? (
        <span className="text-xs text-muted-foreground tabular">
          ({count.toLocaleString("en-IN")})
        </span>
      ) : null}
    </div>
  );
}

/* ============================================================
   SectionHeader — large elegant heading with kicker
   ============================================================ */
export function SectionHeader({
  kicker,
  title,
  subtitle,
  align = "left",
  className,
}: {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={cn("space-y-3", className)}>
      {kicker ? (
        <div
          className={cn(
            "flex items-center gap-2",
            align === "center" && "justify-center"
          )}
        >
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-[oklch(0.78_0.13_75_/_60%)]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-gold">
            {kicker}
          </span>
          <span className="h-px w-6 bg-gradient-to-l from-transparent to-[oklch(0.78_0.13_75_/_60%)]" />
        </div>
      ) : null}
      <h2
        className={cn(
          "font-display text-[28px] font-semibold leading-[1.12] tracking-[-0.02em] text-balance",
          align === "center" && "text-center"
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "text-[14px] leading-relaxed text-muted-foreground text-pretty",
            align === "center" && "text-center"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}

/* ============================================================
   ShimmerCard — skeleton placeholder
   ============================================================ */
export function ShimmerCard({
  className,
  height = 120,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <div
      className={cn("shimmer rounded-2xl bg-[oklch(0.96_0.012_80_/_0.04)]", className)}
      style={{ height }}
    />
  );
}

/* ============================================================
   Pill — small badge
   ============================================================ */
export function Pill({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "gold" | "green" | "red";
  className?: string;
}) {
  const tones: Record<string, string> = {
    default: "glass text-foreground/80",
    gold: "bg-[oklch(0.78_0.13_75_/_0.14)] text-text-gold border-[oklch(0.78_0.13_75_/_0.25)]",
    green: "bg-[oklch(0.62_0.10_160_/_0.14)] text-text-accent-jade border-[oklch(0.62_0.10_160_/_0.25)]",
    red: "bg-[oklch(0.62_0.20_25_/_0.14)] text-[oklch(0.72_0.18_25)] border-[oklch(0.62_0.20_25_/_0.25)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
