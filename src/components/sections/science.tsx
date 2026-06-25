"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  SectionHeader,
  Reveal,
  ProteinRing,
  AnimatedNumber,
  Stagger,
  StaggerItem,
} from "@/components/primitives";

/**
 * Section 4 — Nutrition science.
 * Interactive animated infographics instead of paragraphs.
 */
export function NutritionScience() {
  return (
    <section className="relative px-4 py-12">
      <SectionHeader
        kicker="The Science"
        title={
          <>
            Numbers that <span className="text-gold-gradient">actually move.</span>
          </>
        }
        subtitle="Real clinical data, presented the way a nutritionist would. Tap any chart to explore."
      />

      <div className="mt-7 space-y-4">
        <ProteinAbsorptionCard />
        <MuscleRecoveryCard />
        <PlantComparisonCard />
        <AminoAcidCard />
      </div>
    </section>
  );
}

function ProteinAbsorptionCard() {
  const [hours, setHours] = React.useState(0);
  const data = [
    { t: 0, v: 0 },
    { t: 1, v: 18 },
    { t: 2, v: 42 },
    { t: 3, v: 68 },
    { t: 4, v: 84 },
    { t: 5, v: 92 },
    { t: 6, v: 96 },
  ];
  const v = data[Math.min(hours, 6)].v;

  return (
    <Reveal>
      <div className="overflow-hidden rounded-3xl glass p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[oklch(0.78_0.13_75)]">
              Protein Absorption
            </div>
            <h3 className="mt-1 font-display text-[18px] font-semibold">
              How fast your body uses it
            </h3>
          </div>
          <ProteinRing value={v} size={64} stroke={6} label="% absorbed" />
        </div>

        {/* Curve */}
        <div className="mt-4 h-[110px] w-full">
          <svg viewBox="0 0 300 110" className="h-full w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="abs-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="oklch(0.78 0.13 75 / 0.5)" />
                <stop offset="1" stopColor="oklch(0.78 0.13 75 / 0)" />
              </linearGradient>
            </defs>
            {/* Grid */}
            {[20, 40, 60, 80, 100].map((y) => (
              <line
                key={y}
                x1="0"
                x2="300"
                y1={100 - y}
                y2={100 - y}
                stroke="oklch(0.96 0.012 80 / 0.05)"
                strokeWidth="1"
              />
            ))}
            {/* Area */}
            <motion.path
              d={`M 0 100 ${data
                .map((d, i) => `L ${(i / 6) * 300} ${100 - d.v}`)
                .join(" ")} L 300 100 Z`}
              fill="url(#abs-fill)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            {/* Line */}
            <motion.path
              d={`M 0 100 ${data
                .map((d, i) => `L ${(i / 6) * 300} ${100 - d.v}`)
                .join(" ")}`}
              fill="none"
              stroke="oklch(0.92 0.10 85)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ filter: "drop-shadow(0 0 6px oklch(0.78 0.13 75 / 0.6))" }}
            />
            {/* Active point */}
            <circle
              cx={(hours / 6) * 300}
              cy={100 - v}
              r="4"
              fill="oklch(0.92 0.10 85)"
              stroke="oklch(0.14 0.01 50)"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Slider */}
        <div className="mt-3">
          <input
            type="range"
            min={0}
            max={6}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full accent-[oklch(0.78_0.13_75)]"
            aria-label="Hours after consumption"
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>0h</span>
            <span className="font-semibold text-[oklch(0.92_0.10_85)]">
              {hours}h · {v}% absorbed
            </span>
            <span>6h</span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function MuscleRecoveryCard() {
  const data = [
    { day: "D1", huxon: 78, control: 62 },
    { day: "D2", huxon: 88, control: 70 },
    { day: "D3", huxon: 94, control: 78 },
    { day: "D4", huxon: 98, control: 84 },
  ];
  return (
    <Reveal>
      <div className="overflow-hidden rounded-3xl glass p-5">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[oklch(0.78_0.13_75)]">
          Muscle Recovery
        </div>
        <h3 className="mt-1 font-display text-[18px] font-semibold">
          24% faster recovery vs control
        </h3>

        <div className="mt-4 space-y-2.5">
          {data.map((d, i) => (
            <div key={d.day} className="flex items-center gap-3">
              <span className="w-7 text-[11px] text-muted-foreground">{d.day}</span>
              <div className="relative flex-1">
                {/* Huxon bar */}
                <motion.div
                  className="h-3 rounded-full bg-gradient-to-r from-[oklch(0.92_0.10_85)] to-[oklch(0.62_0.10_55)]"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${d.huxon}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{ filter: "drop-shadow(0 0 6px oklch(0.78 0.13 75 / 0.5))" }}
                />
                {/* Control bar (below, thinner) */}
                <motion.div
                  className="absolute left-0 top-3.5 h-1.5 rounded-full bg-[oklch(0.96_0.012_80_/_0.18)]"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${d.control}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1 + 0.15, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className="w-9 text-right text-[11px] font-semibold text-[oklch(0.92_0.10_85)] tabular">
                {d.huxon}%
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[oklch(0.78_0.13_75)]" /> Huxon
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[oklch(0.96_0.012_80_/_0.3)]" /> Whey control
          </span>
        </div>
      </div>
    </Reveal>
  );
}

function PlantComparisonCard() {
  const sources = [
    { name: "Huxon Blend", protein: 90, color: "oklch(0.78 0.13 75)" },
    { name: "Pea alone", protein: 82, color: "oklch(0.62 0.10 160)" },
    { name: "Soy", protein: 80, color: "oklch(0.55 0.06 90)" },
    { name: "Hemp", protein: 50, color: "oklch(0.50 0.10 140)" },
  ];
  return (
    <Reveal>
      <div className="overflow-hidden rounded-3xl glass p-5">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[oklch(0.78_0.13_75)]">
          Plant Protein Comparison
        </div>
        <h3 className="mt-1 font-display text-[18px] font-semibold">
          Protein density by source
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {sources.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="relative overflow-hidden rounded-2xl bg-[oklch(0.96_0.012_80_/_0.04)] p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-foreground/85">
                  {s.name}
                </span>
                <span className="text-[11px] font-semibold text-cream-gradient tabular">
                  {s.protein}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[oklch(0.96_0.012_80_/_0.06)]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: s.color }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.protein}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function AminoAcidCard() {
  const aminos = [
    { name: "Leucine", value: 96 },
    { name: "Isoleucine", value: 88 },
    { name: "Valine", value: 92 },
    { name: "Lysine", value: 84 },
    { name: "Methionine", value: 78 },
    { name: "Phenylalanine", value: 90 },
    { name: "Threonine", value: 86 },
    { name: "Tryptophan", value: 82 },
  ];
  return (
    <Reveal>
      <div className="overflow-hidden rounded-3xl glass p-5">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[oklch(0.78_0.13_75)]">
          Amino Acid Profile
        </div>
        <h3 className="mt-1 font-display text-[18px] font-semibold">
          Complete EAAs vs WHO reference
        </h3>

        <div className="mt-4">
          {/* Radar / spider chart */}
          <div className="relative mx-auto grid h-[180px] w-[180px] place-items-center">
            <svg viewBox="0 0 180 180" className="h-full w-full">
              <defs>
                <linearGradient id="amino-fill" x1="0" y1="0" x2="180" y2="180">
                  <stop offset="0" stopColor="oklch(0.78 0.13 75 / 0.45)" />
                  <stop offset="1" stopColor="oklch(0.62 0.10 55 / 0.25)" />
                </linearGradient>
              </defs>
              {/* Concentric grid */}
              {[0.25, 0.5, 0.75, 1].map((r) => (
                <circle
                  key={r}
                  cx="90"
                  cy="90"
                  r={70 * r}
                  fill="none"
                  stroke="oklch(0.96 0.012 80 / 0.06)"
                  strokeWidth="1"
                />
              ))}
              {/* Axes */}
              {aminos.map((_, i) => {
                const a = (i / aminos.length) * Math.PI * 2 - Math.PI / 2;
                return (
                  <line
                    key={i}
                    x1="90"
                    y1="90"
                    x2={90 + Math.cos(a) * 70}
                    y2={90 + Math.sin(a) * 70}
                    stroke="oklch(0.96 0.012 80 / 0.05)"
                    strokeWidth="1"
                  />
                );
              })}
              {/* Data polygon */}
              <motion.polygon
                points={aminos
                  .map((am, i) => {
                    const a = (i / aminos.length) * Math.PI * 2 - Math.PI / 2;
                    const r = (am.value / 100) * 70;
                    return `${90 + Math.cos(a) * r},${90 + Math.sin(a) * r}`;
                  })
                  .join(" ")}
                fill="url(#amino-fill)"
                stroke="oklch(0.92 0.10 85)"
                strokeWidth="2"
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "center" }}
              />
              {/* Dots */}
              {aminos.map((am, i) => {
                const a = (i / aminos.length) * Math.PI * 2 - Math.PI / 2;
                const r = (am.value / 100) * 70;
                return (
                  <circle
                    key={i}
                    cx={90 + Math.cos(a) * r}
                    cy={90 + Math.sin(a) * r}
                    r="2.5"
                    fill="oklch(0.92 0.10 85)"
                  />
                );
              })}
            </svg>
          </div>

          <Stagger className="mt-4 grid grid-cols-4 gap-2" staggerChildren={0.04}>
            {aminos.map((am) => (
              <StaggerItem
                key={am.name}
                className="rounded-lg bg-[oklch(0.96_0.012_80_/_0.04)] px-2 py-1.5 text-center"
              >
                <div className="text-[9px] text-muted-foreground">{am.name}</div>
                <div className="text-[12px] font-semibold text-cream-gradient tabular">
                  <AnimatedNumber value={am.value} suffix="%" />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Reveal>
  );
}
