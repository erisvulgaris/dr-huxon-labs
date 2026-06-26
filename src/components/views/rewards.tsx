"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  REWARDS_TIERS,
  ACHIEVEMENTS,
  LEADERBOARD,
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
  IconShare,
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
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-text-gold">
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
                <IconCrown size={26} className="text-text-gold" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-text-gold">
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
                    <span className="rounded-full bg-[oklch(0.78_0.13_75_/_0.2)] px-2 py-0.5 text-[8px] font-semibold text-text-gold">
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
                      a.earned ? "bg-[oklch(0.78_0.13_75_/_0.2)] text-text-gold" : "bg-[oklch(0.96_0.012_80_/_0.06)] text-muted-foreground"
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
        <div className="relative overflow-hidden rounded-3xl border border-[oklch(var(--gold)/0.2)] bg-gradient-to-br from-[oklch(var(--gold)/0.08)] to-[oklch(var(--gold)/0.02)] p-5">
          <div className="bg-molecular absolute inset-0 opacity-30" />
          <div className="relative">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-gold-gradient">
              <IconUsers size={11} />
              Refer & earn
            </div>
            <h3 className="mt-1 font-display text-[18px] font-semibold text-cream-gradient">
              Give ₹200, get ₹200
            </h3>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Share your code. When your friend makes their first order, you both get ₹200 off.
            </p>

            {/* Referral code with copy + share */}
            <ReferralCodeCard code="HUX-ARJUN4280" />

            {/* Share buttons */}
            <div className="mt-3 grid grid-cols-4 gap-2">
              {REFERRAL_CHANNELS.map((ch) => (
                <motion.button
                  key={ch.id}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleReferralShare(ch.id, "HUX-ARJUN4280")}
                  className="flex flex-col items-center gap-1.5 rounded-2xl glass p-2.5"
                >
                  <span
                    className="grid h-9 w-9 place-items-center rounded-full"
                    style={{ background: `${ch.color}20`, color: ch.color }}
                  >
                    <ch.Icon size={16} />
                  </span>
                  <span className="text-[9px] text-muted-foreground">{ch.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-[oklch(var(--glass-tint)/0.06)] p-2">
                <div className="text-[16px] font-bold text-cream-gradient">
                  <AnimatedNumber value={3} />
                </div>
                <div className="text-[9px] text-muted-foreground">Referred</div>
              </div>
              <div className="rounded-xl bg-[oklch(var(--glass-tint)/0.06)] p-2">
                <div className="text-[16px] font-bold text-[oklch(var(--jade))]">
                  <AnimatedNumber value={2} />
                </div>
                <div className="text-[9px] text-muted-foreground">Joined</div>
              </div>
              <div className="rounded-xl bg-[oklch(var(--glass-tint)/0.06)] p-2">
                <div className="text-[16px] font-bold text-gold-gradient">
                  <AnimatedNumber value={600} prefix="₹" />
                </div>
                <div className="text-[9px] text-muted-foreground">Earned</div>
              </div>
            </div>

            {/* How it works */}
            <div className="mt-4 space-y-2">
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                How it works
              </div>
              {[
                { step: "1", text: "Share your code with friends" },
                { step: "2", text: "They get ₹200 off their first order" },
                { step: "3", text: "You earn ₹200 + 250 reward points" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-2 text-[12px]">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[oklch(var(--gold)/0.18)] text-[10px] font-bold text-gold-gradient">
                    {item.step}
                  </span>
                  <span className="text-foreground/80">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Referral Leaderboard */}
      <Reveal className="mt-6">
        <LeaderboardSection />
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
            <IconTrophy size={16} className="text-text-gold" />
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

/* ============================================================
   Referral Leaderboard Section
   ============================================================ */
function LeaderboardSection() {
  const [period, setPeriod] = React.useState<"all" | "month">("all");

  const sorted = [...LEADERBOARD].sort((a, b) => b.referrals - a.referrals);
  const myRank = sorted.findIndex((e) => e.isCurrentUser) + 1;
  const topThree = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <IconCrown size={14} className="text-gold-gradient" />
          <h2 className="text-[15px] font-semibold">Referral Leaderboard</h2>
        </div>
        <div className="flex gap-1 rounded-full bg-[oklch(var(--glass-tint)/0.06)] p-0.5">
          {(["all", "month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors",
                period === p ? "bg-[oklch(var(--gold)/0.18)] text-gold-gradient" : "text-muted-foreground"
              )}
            >
              {p === "all" ? "All time" : "This month"}
            </button>
          ))}
        </div>
      </div>

      {/* My rank banner */}
      <div className="mb-3 flex items-center gap-3 rounded-2xl border border-[oklch(var(--gold)/0.25)] bg-[oklch(var(--gold)/0.06)] p-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[oklch(var(--gold)/0.18)]">
          <span className="text-[14px] font-bold text-gold-gradient">#{myRank}</span>
        </div>
        <div className="flex-1">
          <div className="text-[12px] font-semibold text-cream-gradient">Your rank</div>
          <div className="text-[10px] text-muted-foreground">
            {myRank <= 3 ? "Top 3! 🎉" : `${myRank - 3} referrers away from top 3`}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[14px] font-bold text-gold-gradient tabular">12</div>
          <div className="text-[8px] uppercase tracking-wide text-muted-foreground">referrals</div>
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        {topThree.map((entry, i) => {
          const podiumConfig = [
            { height: "h-20", icon: "👑", color: "oklch(0.82 0.14 80)", label: "1st" },
            { height: "h-16", icon: "🥈", color: "oklch(0.72 0.02 80)", label: "2nd" },
            { height: "h-14", icon: "🥉", color: "oklch(0.62 0.08 55)", label: "3rd" },
          ][i];
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              <div
                className="grid h-10 w-10 place-items-center rounded-full text-[11px] font-bold"
                style={{ background: `${podiumConfig.color.replace(")", " / 0.2)")}`, color: podiumConfig.color }}
              >
                {entry.avatar}
              </div>
              <div className="mt-1 max-w-full truncate text-[10px] font-semibold">
                {entry.name.split(" ")[0]}
              </div>
              <div className="text-[9px] text-muted-foreground tabular">
                {entry.referrals} refs
              </div>
              <div
                className={cn("mt-1.5 w-full rounded-t-lg", podiumConfig.height)}
                style={{
                  background: `linear-gradient(180deg, ${podiumConfig.color.replace(")", " / 0.25)")}, ${podiumConfig.color.replace(")", " / 0.05)")})`,
                }}
              >
                <div className="grid h-full place-items-center text-[18px]">
                  {podiumConfig.icon}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rest of leaderboard */}
      <div className="space-y-1.5">
        {rest.map((entry, i) => {
          const rank = i + 4;
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2",
                entry.isCurrentUser
                  ? "border border-[oklch(var(--gold)/0.3)] bg-[oklch(var(--gold)/0.06)]"
                  : "glass"
              )}
            >
              <span className="w-5 text-center text-[11px] font-bold text-muted-foreground tabular">
                {rank}
              </span>
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(var(--glass-tint)/0.08)] text-[10px] font-bold">
                {entry.avatar}
              </div>
              <div className="flex-1">
                <div className="text-[12px] font-semibold">
                  {entry.name}
                  {entry.isCurrentUser && (
                    <span className="ml-1.5 rounded-full bg-[oklch(var(--gold)/0.18)] px-1.5 py-0.5 text-[8px] font-bold text-gold-gradient">
                      YOU
                    </span>
                  )}
                </div>
                <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
                  {entry.tier} tier
                </div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-bold text-cream-gradient tabular">
                  {entry.referrals}
                </div>
                <div className="text-[8px] text-muted-foreground tabular">
                  ₹{entry.earnings.toLocaleString("en-IN")}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   Referral helpers
   ============================================================ */

function ReferralCodeCard({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://drhuxon.com/r/${code}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[oklch(var(--glass-tint)/0.08)] p-3">
      <div className="flex-1">
        <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
          Your referral link
        </div>
        <div className="font-mono text-[13px] font-bold tracking-wider text-gold-gradient">
          {code}
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleCopy}
        className={
          "grid h-9 w-9 place-items-center rounded-full transition-colors " +
          (copied
            ? "bg-[oklch(var(--jade)/0.2)] text-[oklch(var(--jade))]"
            : "bg-[oklch(var(--gold)/0.18)] text-gold-gradient")
        }
        aria-label="Copy referral link"
      >
        {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
      </motion.button>
    </div>
  );
}

const REFERRAL_CHANNELS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    color: "oklch(0.62 0.18 145)",
    Icon: ({ size = 16 }: { size?: number }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.1-.3.2-.5.1-.7-.3-1.4-.6-2-1.3-.4-.4-.7-.9-.9-1.4-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.3c0-.1-.5-1.3-.7-1.7-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 4 3.4.5.2 1 .4 1.3.4.5.1 1 .1 1.3 0 .4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    color: "oklch(0.62 0.20 350)",
    Icon: ({ size = 16 }: { size?: number }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "twitter",
    label: "X",
    color: "oklch(0.95 0 0)",
    Icon: ({ size = 16 }: { size?: number }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 3h3l-7 8 8 10h-6l-5-6-5 6H3l7-9L3 3h6l4 5 5-5Z" />
      </svg>
    ),
  },
  {
    id: "more",
    label: "More",
    color: "oklch(0.78 0.13 75)",
    Icon: IconShare,
  },
] as const;

function handleReferralShare(channel: string, code: string) {
  const url = `https://drhuxon.com/r/${code}`;
  const text = "Get ₹200 off your first Dr. Huxon Labs order with my referral code!";
  if (channel === "more" && typeof navigator !== "undefined" && navigator.share) {
    navigator.share({ title: "Dr. Huxon Labs", text, url }).catch(() => {});
  } else {
    try {
      navigator.clipboard.writeText(`${text} ${url}`);
    } catch {}
  }
}
