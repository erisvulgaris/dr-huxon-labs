"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  IconDrop,
  IconTarget,
  IconFlame,
  IconBolt,
  IconTrophy,
  IconRefresh,
  IconArrowRight,
  IconPlus,
  IconMinus,
} from "@/components/icons";
import {
  SectionHeader,
  Reveal,
  ProteinRing,
  AnimatedNumber,
  Stagger,
  StaggerItem,
} from "@/components/primitives";
import { HuxonButton } from "@/components/huxon-button";
import { useReward } from "@/lib/store";

/**
 * Explore view — a premium dashboard of interactive nutrition widgets.
 */
export function ExploreView() {
  return (
    <div className="px-4 pb-8 pt-4">
      <Reveal>
        <h1 className="font-display text-[28px] font-semibold text-cream-gradient">
          Explore
        </h1>
        <p className="text-[12px] text-muted-foreground">
          Your personal nutrition command center.
        </p>
      </Reveal>

      <Stagger className="mt-5 space-y-4" staggerChildren={0.07}>
        <StaggerItem>
          <DailyProteinTracker />
        </StaggerItem>
        <StaggerItem>
          <WaterIntakeTracker />
        </StaggerItem>
        <StaggerItem>
          <div className="grid grid-cols-2 gap-3">
            <MealProgressRing />
            <GoalProgressCard />
          </div>
        </StaggerItem>
        <StaggerItem>
          <BMICalculator />
        </StaggerItem>
        <StaggerItem>
          <ProteinTimeline />
        </StaggerItem>
        <StaggerItem>
          <FitnessGoalTimeline />
        </StaggerItem>
      </Stagger>
    </div>
  );
}

function DailyProteinTracker() {
  const goal = 140;
  const [consumed, setConsumed] = React.useState(92);
  const pct = Math.min(100, Math.round((consumed / goal) * 100));
  const remaining = Math.max(0, goal - consumed);

  return (
    <div className="overflow-hidden rounded-3xl glass p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[oklch(0.78_0.13_75)]">
            <IconBolt size={11} />
            Daily Protein Tracker
          </div>
          <h3 className="mt-1 font-display text-[18px] font-semibold">
            {pct}% of daily goal
          </h3>
        </div>
        <ProteinRing value={pct} size={72} stroke={6}>
          <div className="flex flex-col items-center leading-none">
            <span className="text-[13px] font-bold text-cream-gradient">{consumed}g</span>
            <span className="text-[8px] text-muted-foreground">/ {goal}g</span>
          </div>
        </ProteinRing>
      </div>

      {/* Bar */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[oklch(0.96_0.012_80_/_0.06)]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[oklch(0.92_0.10_85)] to-[oklch(0.62_0.10_55)]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{remaining}g to go</span>
        <span>4 meals logged</span>
      </div>

      {/* Quick add */}
      <div className="mt-3 flex flex-wrap gap-2">
        {[
          { label: "Scoop +27g", v: 27 },
          { label: "Bar +20g", v: 20 },
          { label: "Meal +30g", v: 30 },
        ].map((q) => (
          <button
            key={q.label}
            onClick={() => setConsumed((c) => Math.min(goal + 40, c + q.v))}
            className="flex items-center gap-1 rounded-full bg-[oklch(0.96_0.012_80_/_0.06)] px-2.5 py-1 text-[11px] font-medium text-foreground/80"
          >
            <IconPlus size={10} />
            {q.label}
          </button>
        ))}
        <button
          onClick={() => setConsumed((c) => Math.max(0, c - 10))}
          className="flex items-center gap-1 rounded-full bg-[oklch(0.96_0.012_80_/_0.06)] px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
        >
          <IconMinus size={10} />
          Undo
        </button>
      </div>
    </div>
  );
}

function WaterIntakeTracker() {
  const goal = 8;
  const [glasses, setGlasses] = React.useState(5);

  return (
    <div className="overflow-hidden rounded-3xl glass p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[oklch(0.62_0.10_160)]">
            <IconDrop size={11} />
            Water Intake
          </div>
          <h3 className="mt-1 font-display text-[18px] font-semibold">
            {glasses} / {goal} glasses
          </h3>
          <p className="text-[11px] text-muted-foreground">
            ≈ {(glasses * 0.25).toFixed(2)}L · {Math.round((glasses / goal) * 100)}% hydrated
          </p>
        </div>
        <button
          onClick={() => setGlasses((g) => Math.min(goal + 2, g + 1))}
          className="grid h-14 w-14 place-items-center rounded-2xl bg-[oklch(0.62_0.10_160_/_0.18)] text-[oklch(0.72_0.10_160)]"
          aria-label="Add glass"
        >
          <IconDrop size={26} />
        </button>
      </div>

      {/* Glasses row */}
      <div className="mt-4 flex gap-1.5">
        {Array.from({ length: goal }).map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setGlasses(i + 1)}
            whileTap={{ scale: 0.85 }}
            className="relative h-12 flex-1 overflow-hidden rounded-lg border border-[oklch(0.62_0.10_160_/_0.3)]"
          >
            {i < glasses ? (
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[oklch(0.62_0.10_160)] to-[oklch(0.72_0.10_160_/_0.6)]"
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              />
            ) : null}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function MealProgressRing() {
  const meals = [
    { name: "Breakfast", done: true, protein: 32 },
    { name: "Lunch", done: true, protein: 38 },
    { name: "Snack", done: true, protein: 20 },
    { name: "Dinner", done: false, protein: 0 },
  ];
  const pct = Math.round((meals.filter((m) => m.done).length / meals.length) * 100);

  return (
    <div className="overflow-hidden rounded-3xl glass p-4">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Meals
        </div>
        <ProteinRing value={pct} size={44} stroke={4} />
      </div>
      <div className="mt-3 space-y-1.5">
        {meals.map((m) => (
          <div key={m.name} className="flex items-center justify-between text-[11px]">
            <span className={m.done ? "text-foreground" : "text-muted-foreground"}>
              {m.name}
            </span>
            <span className={m.done ? "font-semibold text-cream-gradient" : "text-muted-foreground"}>
              {m.protein}g
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalProgressCard() {
  return (
    <div className="overflow-hidden rounded-3xl glass p-4">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-[oklch(0.78_0.13_75)]">
        <IconTarget size={11} />
        Goal
      </div>
      <h3 className="mt-1 font-display text-[15px] font-semibold leading-tight text-cream-gradient">
        Build 5kg lean mass
      </h3>
      <div className="mt-3">
        <div className="flex items-baseline gap-1">
          <AnimatedNumber value={62} suffix="%" className="text-[22px] font-bold text-gold-gradient" />
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[oklch(0.96_0.012_80_/_0.06)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[oklch(0.78_0.13_75)] to-[oklch(0.92_0.10_85)]"
            initial={{ width: 0 }}
            whileInView={{ width: "62%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <p className="mt-1.5 text-[10px] text-muted-foreground">3.1kg of 5kg target</p>
      </div>
    </div>
  );
}

function BMICalculator() {
  const [w, setW] = React.useState(72);
  const [h, setH] = React.useState(175);
  const bmi = (w / Math.pow(h / 100, 2)).toFixed(1);
  const bmiNum = parseFloat(bmi);
  const cat = bmiNum < 18.5 ? "Underweight" : bmiNum < 25 ? "Healthy" : bmiNum < 30 ? "Overweight" : "Obese";
  const catColor =
    cat === "Healthy" ? "oklch(0.62 0.10 160)" : cat === "Underweight" ? "oklch(0.72 0.15 60)" : "oklch(0.72 0.18 25)";

  // Position on scale (15-35 → 0-100%)
  const pos = Math.max(0, Math.min(100, ((bmiNum - 15) / 20) * 100));

  return (
    <div className="overflow-hidden rounded-3xl glass p-5">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[oklch(0.78_0.13_75)]">
        BMI Calculator
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-display text-[36px] font-semibold text-cream-gradient tabular">
          {bmi}
        </span>
        <span className="text-[12px] font-semibold" style={{ color: catColor }}>
          {cat}
        </span>
      </div>

      {/* Scale */}
      <div className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-gradient-to-r from-[oklch(0.72_0.15_60)] via-[oklch(0.62_0.10_160)] to-[oklch(0.72_0.18_25)]">
        <motion.div
          className="absolute -top-1 h-4 w-1 rounded-full bg-cream shadow-lg"
          style={{ left: `${pos}%` }}
          initial={{ left: 0 }}
          animate={{ left: `${pos}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
        <span>15</span><span>18.5</span><span>25</span><span>30</span><span>35</span>
      </div>

      {/* Sliders */}
      <div className="mt-3 space-y-2">
        <div>
          <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
            <span>Weight</span><span className="tabular">{w}kg</span>
          </div>
          <input type="range" min={35} max={150} value={w} onChange={(e) => setW(Number(e.target.value))} className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[oklch(0.96_0.012_80_/_0.1)] accent-[oklch(0.78_0.13_75)]" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
            <span>Height</span><span className="tabular">{h}cm</span>
          </div>
          <input type="range" min={120} max={220} value={h} onChange={(e) => setH(Number(e.target.value))} className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[oklch(0.96_0.012_80_/_0.1)] accent-[oklch(0.78_0.13_75)]" />
        </div>
      </div>
    </div>
  );
}

function ProteinTimeline() {
  const data = [
    { day: "Mon", v: 120 },
    { day: "Tue", v: 138 },
    { day: "Wed", v: 142 },
    { day: "Thu", v: 128 },
    { day: "Fri", v: 145 },
    { day: "Sat", v: 152 },
    { day: "Sun", v: 92 },
  ];
  const max = 160;
  return (
    <div className="overflow-hidden rounded-3xl glass p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[oklch(0.78_0.13_75)]">
            Protein Intake · 7 days
          </div>
          <h3 className="mt-1 font-display text-[18px] font-semibold">
            Avg <AnimatedNumber value={131} suffix="g" /> / day
          </h3>
        </div>
        <IconFlame size={20} className="text-[oklch(0.72_0.18_25)]" />
      </div>

      <div className="mt-4 flex h-[100px] items-end justify-between gap-2">
        {data.map((d, i) => (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
            <motion.div
              className="w-full rounded-t-md bg-gradient-to-t from-[oklch(0.62_0.10_55)] to-[oklch(0.92_0.10_85)]"
              initial={{ height: 0 }}
              whileInView={{ height: `${(d.v / max) * 80}px` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ minHeight: 4 }}
            />
            <span className="text-[9px] text-muted-foreground">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FitnessGoalTimeline() {
  const milestones = [
    { week: "W1", label: "Started", done: true },
    { week: "W4", label: "First PR", done: true },
    { week: "W8", label: "5kg gain", done: true },
    { week: "W12", label: "Cut phase", done: false, active: true },
    { week: "W16", label: "Goal", done: false },
  ];
  return (
    <div className="overflow-hidden rounded-3xl glass p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[oklch(0.78_0.13_75)]">
            Fitness Goal Timeline
          </div>
          <h3 className="mt-1 font-display text-[18px] font-semibold">16-week program</h3>
        </div>
        <IconTrophy size={20} className="text-[oklch(0.78_0.13_75)]" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        {milestones.map((m, i) => (
          <div key={m.week} className="flex flex-1 flex-col items-center text-center">
            <div className="relative flex w-full items-center">
              {i > 0 ? (
                <div className={"h-0.5 flex-1 " + (m.done ? "bg-[oklch(0.78_0.13_75)]" : "bg-[oklch(0.96_0.012_80_/_0.1)]")} />
              ) : <div className="h-0.5 flex-1" />}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={
                  "h-3 w-3 rounded-full " +
                  (m.done
                    ? "bg-[oklch(0.78_0.13_75)] shadow-gold"
                    : m.active
                    ? "bg-[oklch(0.78_0.13_75_/_0.5)] ring-2 ring-[oklch(0.78_0.13_75)]"
                    : "bg-[oklch(0.96_0.012_80_/_0.15)]")
                }
              />
              {i < milestones.length - 1 ? (
                <div className={"h-0.5 flex-1 " + (m.done ? "bg-[oklch(0.78_0.13_75)]" : "bg-[oklch(0.96_0.012_80_/_0.1)]")} />
              ) : <div className="h-0.5 flex-1" />}
            </div>
            <span className="mt-1.5 text-[9px] font-semibold text-cream-gradient">{m.week}</span>
            <span className="text-[8px] text-muted-foreground">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
