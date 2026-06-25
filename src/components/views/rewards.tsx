"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  REWARDS_TIERS,
  ACHIEVEMENTS,
} from "@/lib/catalog";
import { ICON_MAP } from "@/components/icons";
import {
  IconCrown,
  IconFlame,
  IconGift,
  IconUsers,
  IconCopy,
  IconArrowRight,
  IconSpark,
  IconCheck,
  IconTrophy,
  IconRefresh,
} from "@/components/icons";
import {
  Reveal,
  AnimatedNumber,
  Stagger,
  StaggerItem,
  ProteinRing,
} from "@/components/primitives";
import { HuxonButton } from "@/components/huxon-button";
import { useReward } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Rewards view — gamified loyalty experience.
 */
export function RewardsView() {
  const { points, tier, streak } = useReward();
  const currentTier = REWARDS_TIERS.find((t) => t.id === tier) ?? REWARDS_TIERS[0];
  const nextTier = REWARDS_TIERS.find((t) => t.min > points);
  const progress = nextTier
    ? Math.round(((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100)
    : 100;

  return (
    <div className="px-4 pb-8 pt-4">
      <Reveal>
        <h1 className="font-display text-[28px] font-semibold text-cream-gradient">
          Rewards
        </h1>
        <p className="text-[12px] text-muted-foreground">
          Earn points. Unlock tiers. Get rewarded.
        </p>
      </Reveal>

      {/* Hero points card */}
      <Reveal className="mt-5" y={20}>
        <div className="relative overflow-hidden rounded-3xl border border-[oklch(0.78_0.13_75_/_0.25)] bg-gradient-to-br from-[oklch(0.22_0.02_55)] via-[oklch(0.17_0.012_55)] to-[oklch(0.13_0.008_50)] p-5">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[oklch(0.78_0.13_75_/_0.3)] blur-3xl animate-glow-pulse" />
          <div className="bg-molecular absolute inset-0 opacity-40" />

          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[oklch(0.78_0.13_75)]">
                <IconSpark size={11} />
                Your balance
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <AnimatedNumber
                  value={points}
                  className="font-display text-[44px] font-semibold leading-none text-gold-gradient tabular"
                />
                <span className="text-[13px] text-muted-foreground">pts</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[oklch(0.78_0.13_75_/_0.2)]">
                <IconCrown size={26} className="text-[oklch(0.92_0.10_85)]" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[oklch(0.92_0.10_85)]">
                {currentTier.name}
              </span>
            </div>
          </div>

          {/* Tier progress */}
          <div className="relative mt-5">
            <div className="mb-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{currentTier.name} tier</span>
              <span>{nextTier ? `${nextTier.name} at ${nextTier.min.toLocaleString("en-IN")} pts` : "Max tier"}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[oklch(0.96_0.012_80_/_0.06)]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[oklch(0.78_0.13_75)] to-[oklch(0.92_0.10_85)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="mt-1.5 text-[11px] text-muted-foreground">
              {nextTier
                ? `${(nextTier.min - points).toLocaleString("en-IN")} pts to ${nextTier.name}`
                : "You're at the top tier 🏆"}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Daily streak */}
      <Reveal className="mt-4">
        <div className="flex items-center justify-between rounded-2xl glass p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[oklch(0.72_0.18_25_/_0.18)]">
              <IconFlame size={22} className="text-[oklch(0.72_0.18_25)]" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-cream-gradient">
                {streak}-day streak
              </div>
              <div className="text-[11px] text-muted-foreground">Log protein daily to extend</div>
            </div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  "h-7 w-3 rounded-full",
                  i < streak ? "bg-gradient-to-t from-[oklch(0.72_0.18_25)] to-[oklch(0.92_0.10_85)]" : "bg-[oklch(0.96_0.012_80_/_0.08)]"
                )}
              />
            ))}
          </div>
        </div>
      </Reveal>

      {/* Tier ladder */}
      <Reveal className="mt-6">
        <h2 className="mb-3 font-display text-[18px] font-semibold">Tiers</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {REWARDS_TIERS.map((t, i) => {
            const unlocked = points >= t.min;
            const isCurrent = t.id === tier;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  "relative overflow-hidden rounded-2xl border p-3",
                  isCurrent
                    ? "border-[oklch(0.78_0.13_75_/_0.5)] bg-[oklch(0.78_0.13_75_/_0.08)]"
                    : unlocked
                    ? "border-[oklch(0.78_0.13_75_/_0.2)] glass"
                    : "border-border bg-[oklch(0.96_0.012_80_/_0.02)] opacity-60"
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[12px] font-bold uppercase tracking-wide"
                    style={{ color: t.accent }}
                  >
                    {t.name}
                  </span>
                  {isCurrent ? (
                    <span className="rounded-full bg-[oklch(0.78_0.13_75_/_0.2)] px-2 py-0.5 text-[8px] font-semibold text-[oklch(0.92_0.10_85)]">
                      CURRENT
                    </span>
                  ) : unlocked ? (
                    <IconCheck size={12} className="text-[oklch(0.62_0.10_160)]" />
                  ) : null}
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">
                  {t.min.toLocaleString("en-IN")} pts
                </div>
                <div className="mt-1.5 text-[10px] text-foreground/80">{t.perk}</div>
              </motion.div>
            );
          })}
        </div>
      </Reveal>

      {/* Achievements */}
      <Reveal className="mt-6">
        <h2 className="mb-3 font-display text-[18px] font-semibold">Achievements</h2>
        <Stagger className="grid grid-cols-3 gap-2.5" staggerChildren={0.05}>
          {ACHIEVEMENTS.map((a) => {
            const Icon = ICON_MAP[a.icon] ?? IconSpark;
            return (
              <StaggerItem key={a.id}>
                <div
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center",
                    a.earned
                      ? "border-[oklch(0.78_0.13_75_/_0.3)] bg-[oklch(0.78_0.13_75_/_0.06)]"
                      : "border-border bg-[oklch(0.96_0.012_80_/_0.02)] opacity-50"
                  )}
                >
                  <div
                    className={cn(
                      "grid h-10 w-10 place-items-center rounded-full",
                      a.earned ? "bg-[oklch(0.78_0.13_75_/_0.2)] text-[oklch(0.92_0.10_85)]" : "bg-[oklch(0.96_0.012_80_/_0.06)] text-muted-foreground"
                    )}
                  >
                    <Icon size={18} active={a.earned} />
                  </div>
                  <span className="text-[9px] font-medium leading-tight text-foreground/80">
                    {a.name}
                  </span>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Reveal>

      {/* Challenges */}
      <Reveal className="mt-6">
        <h2 className="mb-3 font-display text-[18px] font-semibold">Active challenges</h2>
        <div className="space-y-2.5">
          <ChallengeCard
            title="Protein streak — 30 days"
            reward="+500 pts"
            progress={7}
            total={30}
          />
          <ChallengeCard
            title="Refer 3 friends"
            reward="+750 pts"
            progress={1}
            total={3}
          />
          <ChallengeCard
            title="Try 5 different products"
            reward="+300 pts"
            progress={4}
            total={5}
          />
        </div>
      </Reveal>

      {/* Referral */}
      <Reveal className="mt-6">
        <div className="overflow-hidden rounded-3xl glass p-5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[oklch(0.78_0.13_75)]">
            <IconUsers size={11} />
            Refer & earn
          </div>
          <h3 className="mt-1 font-display text-[18px] font-semibold">
            Give ₹200, get ₹200
          </h3>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Share your code. When your friend makes their first order, you both get ₹200 off.
          </p>

          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[oklch(0.96_0.012_80_/_0.06)] p-3">
            <div className="flex-1">
              <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
                Your code
              </div>
              <div className="font-mono text-[15px] font-bold tracking-wider text-gold-gradient">
                HUX-ARJUN4280
              </div>
            </div>
            <button
              onClick={() => navigator.clipboard?.writeText("HUX-ARJUN4280")}
              className="grid h-9 w-9 place-items-center rounded-full bg-[oklch(0.78_0.13_75_/_0.18)] text-[oklch(0.92_0.10_85)]"
              aria-label="Copy code"
            >
              <IconCopy size={14} />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl bg-[oklch(0.96_0.012_80_/_0.04)] p-2">
              <div className="text-[16px] font-bold text-cream-gradient">
                <AnimatedNumber value={3} />
              </div>
              <div className="text-[9px] text-muted-foreground">Friends referred</div>
            </div>
            <div className="rounded-xl bg-[oklch(0.96_0.012_80_/_0.04)] p-2">
              <div className="text-[16px] font-bold text-cream-gradient">
                <AnimatedNumber value={600} prefix="₹" />
              </div>
              <div className="text-[9px] text-muted-foreground">Total earned</div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function ChallengeCard({
  title,
  reward,
  progress,
  total,
}: {
  title: string;
  reward: string;
  progress: number;
  total: number;
}) {
  const pct = Math.round((progress / total) * 100);
  return (
    <div className="rounded-2xl glass p-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[oklch(0.78_0.13_75_/_0.14)]">
            <IconTrophy size={16} className="text-[oklch(0.92_0.10_85)]" />
          </div>
          <div>
            <div className="text-[13px] font-semibold leading-tight">{title}</div>
            <div className="text-[10px] text-muted-foreground">{reward}</div>
          </div>
        </div>
        <ProteinRing value={pct} size={36} stroke={3}>
          <span className="text-[9px] font-bold text-cream-gradient">{pct}%</span>
        </ProteinRing>
      </div>
      <div className="mt-2 flex gap-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full",
              i < progress ? "bg-[oklch(0.78_0.13_75)]" : "bg-[oklch(0.96_0.012_80_/_0.1)]"
            )}
          />
        ))}
      </div>
    </div>
  );
}
