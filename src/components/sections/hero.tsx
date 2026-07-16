"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconArrowRight,
  IconFlask,
  IconLotus,
  IconStar,
  IconBolt,
} from "@/components/icons";
import { AnimatedNumber, StarRating, Pill } from "@/components/primitives";
import { useCart, useNav } from "@/lib/store";
import { PRODUCTS } from "@/lib/catalog";

/**
 * Section 1 — Cinematic hero.
 * Premium product showcase floating in space, ingredient particles,
 * gyroscope-driven subtle rotation, ambient lighting shift.
 */
export function HeroSection() {
  const product = PRODUCTS[0]; // Gold Isolate
  const { setRoute } = useNav();
  const { addItem } = useCart();

  // Gyroscope-driven rotation (graceful fallback to pointer)
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sx = useSpring(rotX, { stiffness: 120, damping: 18 });
  const sy = useSpring(rotY, { stiffness: 120, damping: 18 });
  const prodY = useTransform(sy, [-1, 1], [6, -6]);
  const prodX = useTransform(sx, [-1, 1], [-6, 6]);

  React.useEffect(() => {
    let active = true;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (!active) return;
      const g = (e.gamma ?? 0) / 45;
      const b = ((e.beta ?? 0) - 45) / 45;
      rotX.set(Math.max(-1, Math.min(1, b)));
      rotY.set(Math.max(-1, Math.min(1, g)));
    };
    window.addEventListener("deviceorientation", onOrient);
    return () => {
      active = false;
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, [rotX, rotY]);

  const onPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotX.set(y * 2);
    rotY.set(x * 2);
  };
  const resetPointer = () => {
    rotX.set(0);
    rotY.set(0);
  };

  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-2">
      <AmbientBackground />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-5 flex flex-wrap items-center justify-center gap-2"
        >
          <Pill tone="gold">
            <IconFlask size={11} />
            <span>Lab Tested</span>
          </Pill>
          <Pill tone="green">
            <IconLotus size={11} />
            <span>Made in India</span>
          </Pill>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[42px] font-semibold leading-[1.05] tracking-[-0.025em] text-balance"
        >
          <span className="text-cream-gradient">Plant protein,</span>
          <br />
          <span className="text-gold-gradient">engineered like medicine.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="mt-4 max-w-[340px] text-[14.5px] leading-relaxed text-muted-foreground text-pretty"
        >
          Pharmaceutical-grade pea &amp; sprouted rice isolate, micro-filtered
          to 90% protein density. Every batch verified in our NABL-accredited
          lab.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          onPointerMove={onPointer}
          onPointerLeave={resetPointer}
          className="relative my-8 h-[320px] w-full touch-pan-y select-none"
        >
          <ProductShowcase
            image={product.heroImage}
            rotX={prodX}
            rotY={prodY}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="mb-6 flex w-full items-center justify-between gap-3"
        >
          <ProteinQualityCard />
          <RatingWidget />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="flex w-full flex-col gap-3"
        >
          <HuxonButton
            size="lg"
            glow
            className="w-full"
            onClick={() => {
              addItem(product);
            }}
          >
            <IconBolt size={18} />
            <span>Shop Now — ₹{product.price.toLocaleString("en-IN")}</span>
            <IconArrowRight size={16} />
          </HuxonButton>
          <HuxonButton
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => setRoute("shop")}
          >
            Explore Products
          </HuxonButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-7 flex w-full items-center justify-center gap-5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground/80"
        >
          <span className="flex items-center gap-1.5">
            <IconStar size={11} active />
            <span>4.9 · 12K+</span>
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-1.5">
            <IconFlask size={11} />
            <span>NABL Lab</span>
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-1.5">
            <IconLotus size={11} />
            <span>FSSAI</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}

function ProductShowcase({
  image,
  rotX,
  rotY,
}: {
  image: string;
  rotX: any;
  rotY: any;
}) {
  return (
    <div className="relative h-full w-full">
      <div
        className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.13 75 / 0.28), oklch(0.40 0.06 50 / 0.12) 50%, transparent 70%)",
        }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 300 300" className="h-full w-full">
          <defs>
            <linearGradient id="ring-stroke" x1="0" y1="0" x2="300" y2="300">
              <stop stopColor="oklch(0.78 0.13 75 / 0.0)" />
              <stop offset="0.5" stopColor="oklch(0.78 0.13 75 / 0.5)" />
              <stop offset="1" stopColor="oklch(0.78 0.13 75 / 0.0)" />
            </linearGradient>
          </defs>
          <circle
            cx="150"
            cy="150"
            r="140"
            stroke="url(#ring-stroke)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="4 8"
          />
          <circle
            cx="150"
            cy="150"
            r="110"
            stroke="oklch(0.78 0.13 75 / 0.12)"
            strokeWidth="1"
            fill="none"
          />
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const r = 140;
            return (
              <circle
                key={i}
                cx={150 + Math.cos(angle) * r}
                cy={150 + Math.sin(angle) * r}
                r={i % 2 === 0 ? 2.5 : 1.5}
                fill="oklch(0.92 0.10 85)"
              />
            );
          })}
        </svg>
      </motion.div>

      <Particles />

      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 800 }}
        className="absolute left-1/2 top-1/2 h-[280px] w-[200px] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.img
          src={image}
          alt="Huxon Gold Isolate protein tub"
          className="h-full w-full object-contain drop-shadow-[0_30px_60px_oklch(0.05_0.01_50_/_0.7)]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0";
          }}
        />
        <div
          className="absolute -bottom-2 left-1/2 h-3 w-[140px] -translate-x-1/2 rounded-full blur-md"
          style={{ background: "oklch(0.78 0.13 75 / 0.25)" }}
        />
      </motion.div>

      <div className="absolute left-0 top-2 flex items-center gap-1.5 rounded-full glass px-2.5 py-1 text-[9px] font-medium tracking-wide text-text-gold">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.62_0.10_160)]" />
        90% PROTEIN
      </div>
      <div className="absolute right-0 top-12 rounded-full glass px-2.5 py-1 text-[9px] font-medium text-foreground/80">
        27g / scoop
      </div>
      <div className="absolute bottom-4 left-0 rounded-full glass px-2.5 py-1 text-[9px] font-medium text-foreground/80">
        PDCAAS 1.0
      </div>
    </div>
  );
}

function Particles() {
  const particles = React.useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        dur: 6 + Math.random() * 6,
        delay: Math.random() * 4,
        gold: Math.random() > 0.4,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.gold
              ? "oklch(0.92 0.10 85)"
              : "oklch(0.96 0.012 80 / 0.6)",
            boxShadow: p.gold
              ? "0 0 8px oklch(0.78 0.13 75 / 0.8)"
              : "0 0 4px oklch(0.96 0.012 80 / 0.4)",
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      <motion.div
        className="absolute -left-20 -top-10 h-72 w-72 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.13 75 / 0.18), transparent 70%)",
        }}
        animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-24 top-32 h-80 w-80 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.40 0.06 50 / 0.4), transparent 70%)",
        }}
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="bg-molecular absolute inset-0 opacity-50" />
    </div>
  );
}

function ProteinQualityCard() {
  return (
    <div className="glass relative flex flex-1 items-center gap-3 overflow-hidden rounded-2xl p-3">
      <div className="relative grid h-12 w-12 place-items-center">
        <svg viewBox="0 0 48 48" className="h-12 w-12 -rotate-90">
          <circle cx="24" cy="24" r="20" stroke="oklch(0.96 0.012 80 / 0.08)" strokeWidth="4" fill="none" />
          <motion.circle
            cx="24"
            cy="24"
            r="20"
            stroke="oklch(0.78 0.13 75)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 20}
            initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - 0.96) }}
            transition={{ duration: 1.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: "drop-shadow(0 0 4px oklch(0.78 0.13 75 / 0.6))" }}
          />
        </svg>
        <span className="absolute text-[11px] font-bold text-gold-gradient">
          96
        </span>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Protein Quality
        </span>
        <span className="text-sm font-semibold text-cream-gradient">
          Excellent
        </span>
        <span className="text-[10px] text-muted-foreground/70">DIAAS score</span>
      </div>
    </div>
  );
}

function RatingWidget() {
  return (
    <div className="glass relative flex flex-1 items-center gap-3 overflow-hidden rounded-2xl p-3">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[oklch(0.78_0.13_75_/_0.14)]">
        <IconStar size={22} active />
      </div>
      <div className="flex flex-col leading-tight">
        <div className="flex items-baseline gap-1">
          <AnimatedNumber
            value={4.9}
            decimals={1}
            className="text-lg font-semibold text-cream-gradient"
          />
          <span className="text-[10px] text-muted-foreground">/5</span>
        </div>
        <StarRating value={4.9} size={9} />
        <span className="text-[10px] text-muted-foreground/70">
          <AnimatedNumber value={2148} /> reviews
        </span>
      </div>
    </div>
  );
}
