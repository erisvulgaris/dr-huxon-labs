"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WATER_SCHEDULE, SLEEP_FACTORS, RECOVERY_FACTORS } from "@/lib/catalog";
import {
  IconDrop,
  IconCheck,
  IconClock,
  IconBolt,
  IconSpark,
  IconTarget,
} from "@/components/icons";
import { ProteinRing, AnimatedNumber } from "@/components/primitives";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.FC<any>> = {
  clock: IconClock,
  moon: IconSpark,
  spark: IconSpark,
  bolt: IconBolt,
};

/* ============================================================
   Water Intake Reminder Widget
   ============================================================ */
export function WaterReminderWidget() {
  const [consumed, setConsumed] = React.useState<number[]>([0, 1, 0, 1, 0, 0, 0, 0]); // which slots filled
  const [activeSlot, setActiveSlot] = React.useState(2); // current time slot

  const totalConsumed = consumed.reduce((n, filled, i) => n + (filled ? WATER_SCHEDULE[i].amount : 0), 0);
  const totalGoal = WATER_SCHEDULE.reduce((n, s) => n + s.amount, 0);
  const pct = Math.round((totalConsumed / totalGoal) * 100);
  const remaining = totalGoal - totalConsumed;

  const toggleSlot = (i: number) => {
    setConsumed((c) => c.map((v, idx) => (idx === i ? (v ? 0 : 1) : v)));
  };

  return (
    <div className="overflow-hidden rounded-3xl glass p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[oklch(var(--jade))]">
            <IconDrop size={11} />
            Smart Hydration
          </div>
          <h3 className="mt-1 font-display text-[18px] font-semibold">
            {(totalConsumed / 1000).toFixed(2)}L / {(totalGoal / 1000).toFixed(1)}L
          </h3>
          <p className="text-[11px] text-muted-foreground">
            {remaining > 0 ? `${remaining}ml to go` : "Goal reached! 🎉"}
          </p>
        </div>
        <ProteinRing
          value={pct}
          size={64}
          stroke={6}
          color="oklch(0.62 0.10 160)"
        >
          <div className="flex flex-col items-center leading-none">
            <span className="text-[13px] font-bold text-[oklch(var(--jade))]">{pct}%</span>
            <span className="text-[7px] uppercase tracking-wide text-muted-foreground">hydrated</span>
          </div>
        </ProteinRing>
      </div>

      {/* Reminder banner */}
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-[oklch(var(--jade)/0.1)] p-2.5">
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="grid h-7 w-7 place-items-center rounded-full bg-[oklch(var(--jade)/0.2)]"
        >
          <IconClock size={13} className="text-[oklch(var(--jade))]" />
        </motion.span>
        <div className="flex-1">
          <div className="text-[11px] font-semibold text-cream-gradient">
            Next: {WATER_SCHEDULE[activeSlot]?.time} — {WATER_SCHEDULE[activeSlot]?.label}
          </div>
          <div className="text-[9px] text-muted-foreground">
            {WATER_SCHEDULE[activeSlot]?.tip}
          </div>
        </div>
        <span className="text-[10px] font-bold text-[oklch(var(--jade))] tabular">
          {WATER_SCHEDULE[activeSlot]?.amount}ml
        </span>
      </div>

      {/* Schedule timeline */}
      <div className="mt-4 space-y-1.5">
        <div className="mb-1 text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
          Today's schedule
        </div>
        {WATER_SCHEDULE.map((slot, i) => {
          const filled = consumed[i];
          const isCurrent = i === activeSlot;
          const isPast = i < activeSlot;
          return (
            <motion.button
              key={i}
              onClick={() => toggleSlot(i)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-all",
                filled
                  ? "border-[oklch(var(--jade)/0.3)] bg-[oklch(var(--jade)/0.06)]"
                  : isCurrent
                  ? "border-[oklch(var(--jade)/0.4)] bg-[oklch(var(--jade)/0.04)]"
                  : "border-border bg-transparent"
              )}
            >
              <div
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-all",
                  filled
                    ? "border-[oklch(var(--jade))] bg-[oklch(var(--jade))]"
                    : isCurrent
                    ? "border-[oklch(var(--jade))]"
                    : "border-[oklch(var(--glass-border)/0.3)]"
                )}
              >
                {filled ? (
                  <IconCheck size={12} className="text-background" strokeWidth={3} />
                ) : (
                  <IconDrop size={12} className={isCurrent ? "text-[oklch(var(--jade))]" : "text-muted-foreground"} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={cn("text-[11px] font-semibold", filled || isCurrent ? "text-cream-gradient" : "text-muted-foreground")}>
                    {slot.time}
                  </span>
                  {isCurrent && !filled && (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="rounded-full bg-[oklch(var(--jade)/0.2)] px-1.5 py-0.5 text-[7px] font-bold text-[oklch(var(--jade))]"
                    >
                      NOW
                    </motion.span>
                  )}
                </div>
                <div className="text-[9px] text-muted-foreground truncate">{slot.label} · {slot.tip}</div>
              </div>
              <span className={cn("text-[10px] font-semibold tabular", filled ? "text-[oklch(var(--jade))]" : "text-muted-foreground")}>
                {slot.amount}ml
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   Sleep & Recovery Widget
   ============================================================ */
export function SleepRecoveryWidget() {
  const [tab, setTab] = React.useState<"sleep" | "recovery">("sleep");
  const factors = tab === "sleep" ? SLEEP_FACTORS : RECOVERY_FACTORS;

  const overallScore = Math.round(
    factors.reduce((n, f) => {
      const score = f.invert
        ? Math.max(0, 100 - (f.value / f.target) * 100)
        : Math.min(100, (f.value / f.target) * 100);
      return n + score;
    }, 0) / factors.length
  );

  const scoreColor = overallScore >= 80 ? "oklch(0.62 0.10 160)" : overallScore >= 60 ? "oklch(0.78 0.13 75)" : "oklch(0.72 0.18 25)";
  const scoreLabel = overallScore >= 80 ? "Optimal" : overallScore >= 60 ? "Good" : "Needs rest";

  return (
    <div className="overflow-hidden rounded-3xl glass p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-gold-gradient">
          <IconTarget size={11} />
          Sleep & Recovery
        </div>
        {/* Tab toggle */}
        <div className="flex gap-1 rounded-full bg-[oklch(var(--glass-tint)/0.06)] p-0.5">
          {(["sleep", "recovery"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-medium capitalize transition-colors",
                tab === t ? "bg-[oklch(var(--gold)/0.18)] text-gold-gradient" : "text-muted-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Overall score */}
      <div className="mt-3 flex items-center gap-4">
        <ProteinRing
          value={overallScore}
          size={72}
          stroke={7}
          color={scoreColor}
        >
          <div className="flex flex-col items-center leading-none">
            <AnimatedNumber
              value={overallScore}
              className="text-[18px] font-bold"
            />
            <span className="text-[7px] uppercase tracking-wide text-muted-foreground">/ 100</span>
          </div>
        </ProteinRing>
        <div className="flex-1">
          <div className="text-[16px] font-semibold text-cream-gradient">
            {scoreLabel}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {tab === "sleep"
              ? "Last night: 7h 30m · 1h 48m deep"
              : "Recovery: 82% · Ready to train"}
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: scoreColor }}
            />
            <span className="text-[10px]" style={{ color: scoreColor }}>
              {tab === "sleep" ? "Well rested" : "Good recovery"}
            </span>
          </div>
        </div>
      </div>

      {/* Factor breakdown */}
      <div className="mt-4 space-y-2.5">
        {factors.map((f, i) => {
          const Icon = ICON_MAP[f.icon] ?? IconBolt;
          const pct = f.invert
            ? Math.max(0, 100 - (f.value / f.target) * 100)
            : Math.min(100, (f.value / f.target) * 100);
          return (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="mb-1 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-foreground/80">
                  <Icon size={11} />
                  {f.label}
                </span>
                <span className="font-semibold tabular text-cream-gradient">
                  {f.value}{f.unit}
                  <span className="ml-1 text-[9px] text-muted-foreground">/ {f.target}{f.unit}</span>
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[oklch(var(--glass-tint)/0.08)]">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: pct >= 80
                      ? "linear-gradient(90deg, oklch(var(--jade)), oklch(0.72 0.10 160))"
                      : pct >= 50
                      ? "linear-gradient(90deg, oklch(var(--gold)), oklch(var(--bronze)))"
                      : "linear-gradient(90deg, oklch(0.72 0.18 25), oklch(0.62 0.20 25))",
                  }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.05 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recommendation */}
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-[oklch(var(--gold)/0.06)] p-2.5">
        <IconSpark size={13} className="mt-0.5 shrink-0 text-gold-gradient" />
        <div>
          <div className="text-[10px] font-semibold text-gold-gradient">
            {tab === "sleep" ? "Sleep insight" : "Recovery tip"}
          </div>
          <div className="text-[10px] text-foreground/80">
            {tab === "sleep"
              ? "You slept 30 min less than optimal. Try a scoop of Recovery Matrix before bed tonight."
              : "Your recovery is 82% — good to train. Add 1 scoop Gold Isolate post-workout for muscle repair."}
          </div>
        </div>
      </div>
    </div>
  );
}
