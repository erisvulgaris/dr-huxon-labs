"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader, Reveal, AnimatedNumber, ProteinRing } from "@/components/primitives";
import { HuxonButton } from "@/components/huxon-button";
import { IconArrowRight, IconBolt, IconTarget } from "@/components/icons";
import { useReward } from "@/lib/store";

/**
 * Section 7 — Protein calculator.
 * Highly interactive: age, gender, weight, height, activity, goal, diet.
 * Animates every value change.
 */
export function ProteinCalculator() {
  const [age, setAge] = React.useState(28);
  const [gender, setGender] = React.useState<"male" | "female">("male");
  const [weight, setWeight] = React.useState(72);
  const [height, setHeight] = React.useState(175);
  const [activity, setActivity] = React.useState(2); // index
  const [goal, setGoal] = React.useState(1); // index
  const [diet, setDiet] = React.useState(0); // 0 omnivore, 1 vegetarian, 2 vegan

  const activityFactors = [1.2, 1.4, 1.6, 1.8, 2.0];
  const activityLabels = ["Sedentary", "Light", "Moderate", "Active", "Athlete"];
  const goalMultipliers = [1.0, 1.4, 1.8];
  const goalLabels = ["Maintain", "Build muscle", "Cut fat"];
  const dietAdjust = [1.0, 1.05, 1.12];

  // Calculation: base 0.8g/kg → factor by activity, goal, diet
  const baseProtein = weight * 0.8;
  const protein = Math.round(
    baseProtein *
      activityFactors[activity] *
      goalMultipliers[goal] *
      dietAdjust[diet]
  );

  // BMI
  const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
  const bmiNum = parseFloat(bmi);
  const bmiCategory =
    bmiNum < 18.5
      ? "Underweight"
      : bmiNum < 25
      ? "Healthy"
      : bmiNum < 30
      ? "Overweight"
      : "Obese";

  // Per-meal target (4 meals)
  const perMeal = Math.round(protein / 4);

  const { addPoints, pushToast } = useReward();

  return (
    <section className="relative px-4 py-12">
      <SectionHeader
        kicker="Protein Calculator"
        title={
          <>
            Find your <span className="text-gold-gradient">daily number.</span>
          </>
        }
        subtitle="Engineered for Indian bodies, Indian diets, Indian goals."
      />

      <Reveal className="mt-7">
        <div className="overflow-hidden rounded-3xl glass p-5">
          {/* Inputs */}
          <div className="space-y-4">
            {/* Age + Gender */}
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label="Age"
                value={age}
                onChange={setAge}
                min={14}
                max={90}
                suffix="yrs"
              />
              <SegmentField
                label="Gender"
                value={gender}
                onChange={(v) => setGender(v as "male" | "female")}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ]}
              />
            </div>

            {/* Weight + Height sliders */}
            <SliderField
              label="Weight"
              value={weight}
              onChange={setWeight}
              min={35}
              max={150}
              suffix="kg"
            />
            <SliderField
              label="Height"
              value={height}
              onChange={setHeight}
              min={120}
              max={220}
              suffix="cm"
            />

            {/* Activity + Goal + Diet */}
            <SegmentGrid
              label="Activity"
              value={activity}
              onChange={setActivity}
              options={activityLabels}
            />
            <SegmentGrid
              label="Goal"
              value={goal}
              onChange={setGoal}
              options={goalLabels}
            />
            <SegmentGrid
              label="Diet"
              value={diet}
              onChange={setDiet}
              options={["Omnivore", "Vegetarian", "Vegan"]}
            />
          </div>

          {/* Result */}
          <AnimatePresence mode="wait">
            <motion.div
              key={protein}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6 overflow-hidden rounded-2xl border border-[oklch(0.78_0.13_75_/_0.2)] bg-gradient-to-br from-[oklch(0.78_0.13_75_/_0.1)] to-[oklch(0.62_0.10_55_/_0.04)] p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-text-gold">
                    Your Daily Target
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-display text-[44px] font-semibold leading-none text-gold-gradient tabular">
                      <AnimatedNumber value={protein} duration={0.6} />
                    </span>
                    <span className="text-[14px] text-muted-foreground">grams</span>
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    ≈ {perMeal}g per meal · 4 meals
                  </div>
                </div>
                <ProteinRing
                  value={Math.min(100, Math.round((protein / 200) * 100))}
                  size={84}
                  stroke={7}
                  label="of 200g"
                />
              </div>

              {/* BMI mini-card */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <MiniStat label="BMI" value={bmi} />
                <MiniStat label="Category" value={bmiCategory} />
                <MiniStat label="Per meal" value={`${perMeal}g`} />
              </div>

              <HuxonButton
                size="md"
                glow
                className="mt-4 w-full"
                onClick={() => {
                  addPoints(50);
                  pushToast({
                    title: "+50 reward points",
                    description: "You calculated your protein target.",
                  });
                }}
              >
                <IconBolt size={16} />
                Save my target · earn 50 pts
                <IconArrowRight size={14} />
              </HuxonButton>
            </motion.div>
          </AnimatePresence>

          {/* Recommendation */}
          <div className="mt-4 rounded-2xl bg-[oklch(var(--glass-tint)/0.04)] p-3">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <IconTarget size={12} />
              <span>Recommended to hit this with</span>
            </div>
            <div className="mt-1.5 text-[13px] text-foreground/90">
              <span className="font-semibold text-cream-gradient">2 scoops</span> of
              Huxon Gold Isolate + 1 protein bar / day
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl bg-[oklch(var(--glass-tint)/0.04)] p-3">
      <div className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(var(--glass-tint)/0.06)] text-foreground/80"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className="font-display text-[20px] font-semibold text-cream-gradient tabular">
          {value}
          {suffix ? (
            <span className="ml-1 text-[11px] text-muted-foreground">{suffix}</span>
          ) : null}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(var(--glass-tint)/0.06)] text-foreground/80"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl bg-[oklch(var(--glass-tint)/0.04)] p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        <span className="text-[13px] font-semibold text-cream-gradient tabular">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[oklch(var(--glass-tint)/0.1)] accent-[oklch(0.78_0.13_75)]"
        aria-label={label}
      />
    </div>
  );
}

function SegmentField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="rounded-2xl bg-[oklch(var(--glass-tint)/0.04)] p-3">
      <div className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="flex gap-1 rounded-full bg-[oklch(var(--glass-tint)/0.06)] p-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="relative flex-1 rounded-full px-2 py-1.5 text-[11px] font-medium"
          >
            {value === opt.value ? (
              <motion.span
                layoutId={`seg-${label}`}
                className="absolute inset-0 rounded-full bg-[oklch(0.78_0.13_75_/_0.2)]"
              />
            ) : null}
            <span
              className={
                "relative z-10 " +
                (value === opt.value ? "text-text-gold" : "text-muted-foreground")
              }
            >
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SegmentGrid({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  options: string[];
}) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {options.map((opt, i) => (
          <button
            key={opt}
            onClick={() => onChange(i)}
            className={
              "rounded-xl px-2 py-2 text-[11px] font-medium transition-all " +
              (value === i
                ? "bg-[oklch(0.78_0.13_75_/_0.18)] text-text-gold border border-[oklch(0.78_0.13_75_/_0.35)]"
                : "bg-[oklch(var(--glass-tint)/0.04)] text-muted-foreground border border-transparent")
            }
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[oklch(var(--glass-tint)/0.04)] px-2 py-1.5 text-center">
      <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="text-[12px] font-semibold text-cream-gradient">{value}</div>
    </div>
  );
}
