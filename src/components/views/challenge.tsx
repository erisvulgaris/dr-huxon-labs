"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChallenge } from "@/lib/store";
import { useReward } from "@/lib/store";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconBolt,
  IconFlame,
  IconCrown,
  IconTrophy,
  IconSpark,
  IconClose,
  IconTarget,
  IconShare,
} from "@/components/icons";
import { Reveal, Stagger, StaggerItem, ProteinRing, Pill, AnimatedNumber } from "@/components/primitives";
import { useNav } from "@/lib/store";
import { cn } from "@/lib/utils";

const MILESTONES = [
  { day: 7, label: "Week 1 Warrior", reward: 100, icon: "flame" },
  { day: 14, label: "Fortnight Fighter", reward: 200, icon: "bolt" },
  { day: 21, label: "Habit Hero", reward: 300, icon: "spark" },
  { day: 30, label: "Protein Champion", reward: 1000, icon: "crown" },
];

/**
 * Challenge View — 30-Day Protein Challenge with daily tracking + rewards.
 */
export function ChallengeView() {
  const { enrolled, goalGrams, days, currentDay, enroll, logDay, unenroll } = useChallenge();
  const { setRoute } = useNav();

  return (
    <div className="px-4 pb-8 pt-4">
      <Reveal>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRoute("profile")}
            aria-label="Back"
            className="grid h-9 w-9 place-items-center rounded-full glass"
          >
            <IconArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-display text-[24px] font-semibold text-cream-gradient">
              30-Day Challenge
            </h1>
            <p className="text-[11px] text-muted-foreground">
              Build your protein habit · earn up to 1,600 pts
            </p>
          </div>
        </div>
      </Reveal>

      {!enrolled ? (
        <EnrollmentCard onEnroll={enroll} />
      ) : (
        <ActiveChallenge
          goalGrams={goalGrams}
          days={days}
          currentDay={currentDay}
          onLog={logDay}
          onUnenroll={unenroll}
        />
      )}
    </div>
  );
}

function EnrollmentCard({ onEnroll }: { onEnroll: (g: number) => void }) {
  const [goal, setGoal] = React.useState(140);

  return (
    <Reveal className="mt-5">
      <div className="relative overflow-hidden rounded-3xl border border-[oklch(var(--gold)/0.25)] bg-gradient-to-br from-[oklch(var(--espresso))] via-[oklch(var(--cocoa)/0.6)] to-[oklch(var(--charcoal)/0.8)] p-5">
        <motion.div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[oklch(var(--gold)/0.25)] blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <div className="bg-molecular absolute inset-0 opacity-40" />

        <div className="relative">
          {/* Hero icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-[oklch(var(--gold)/0.18)]"
          >
            <IconTrophy size={36} className="text-gold-gradient" />
          </motion.div>

          <h2 className="mt-4 text-center font-display text-[24px] font-semibold text-cream-gradient">
            The 30-Day Protein Challenge
          </h2>
          <p className="mt-2 text-center text-[13px] leading-relaxed text-muted-foreground text-pretty">
            Log your daily protein intake for 30 days. Hit your goal, earn rewards,
            and build a habit that transforms your nutrition.
          </p>

          {/* Milestones preview */}
          <div className="mt-5 grid grid-cols-4 gap-2">
            {MILESTONES.map((m) => (
              <div key={m.day} className="flex flex-col items-center gap-1 rounded-xl bg-[oklch(var(--glass-tint)/0.08)] p-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(var(--gold)/0.18)]">
                  <IconFlame size={14} className="text-gold-gradient" />
                </div>
                <span className="text-[9px] font-bold text-gold-gradient">Day {m.day}</span>
                <span className="text-[8px] text-center text-muted-foreground leading-tight">{m.label}</span>
                <span className="text-[9px] font-semibold text-[oklch(var(--jade))]">+{m.reward}</span>
              </div>
            ))}
          </div>

          {/* Goal selector */}
          <div className="mt-5">
            <div className="mb-1.5 text-center text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Your daily protein goal
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setGoal((g) => Math.max(80, g - 10))}
                className="grid h-10 w-10 place-items-center rounded-full glass"
                aria-label="Decrease goal"
              >
                −
              </button>
              <div className="text-center">
                <span className="font-display text-[36px] font-semibold text-gold-gradient tabular">
                  {goal}
                </span>
                <span className="ml-1 text-[13px] text-muted-foreground">g/day</span>
              </div>
              <button
                onClick={() => setGoal((g) => Math.min(220, g + 10))}
                className="grid h-10 w-10 place-items-center rounded-full glass"
                aria-label="Increase goal"
              >
                +
              </button>
            </div>
          </div>

          <HuxonButton size="lg" glow className="mt-5 w-full" onClick={() => onEnroll(goal)}>
            <IconBolt size={16} />
            Start the challenge
            <IconArrowRight size={14} />
          </HuxonButton>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Free to join · opt out anytime
          </p>
        </div>
      </div>
    </Reveal>
  );
}

function ActiveChallenge({
  goalGrams,
  days,
  currentDay,
  onLog,
  onUnenroll,
}: {
  goalGrams: number;
  days: { day: number; completed: boolean; proteinLogged: number }[];
  currentDay: number;
  onLog: (protein: number) => void;
  onUnenroll: () => void;
}) {
  const [logModal, setLogModal] = React.useState(false);
  const { addPoints, pushToast } = useReward();

  const completedDays = days.filter((d) => d.completed).length;
  const totalProtein = days.reduce((n, d) => n + d.proteinLogged, 0);
  const progressPct = Math.round((completedDays / 30) * 100);
  const isComplete = currentDay > 30;

  // Check for milestone unlocks
  const reachedMilestones = MILESTONES.filter((m) => completedDays >= m.day);

  const handleLog = (protein: number) => {
    onLog(protein);
    setLogModal(false);
    const newCompleted = completedDays + (protein >= goalGrams * 0.8 ? 1 : 0);
    const milestone = MILESTONES.find(
      (m) => m.day === newCompleted && !reachedMilestones.some((rm) => rm.day === m.day)
    );
    if (milestone) {
      addPoints(milestone.reward);
      pushToast({
        title: `+${milestone.reward} reward points!`,
        description: `Milestone unlocked: ${milestone.label}`,
      });
    } else {
      addPoints(25);
      pushToast({
        title: "+25 reward points",
        description: "Day logged — keep the streak going!",
      });
    }
  };

  return (
    <>
      {/* Progress hero card */}
      <Reveal className="mt-5">
        <div className="relative overflow-hidden rounded-3xl border border-[oklch(var(--gold)/0.25)] bg-gradient-to-br from-[oklch(var(--gold)/0.1)] to-[oklch(var(--gold)/0.02)] p-5">
          <div className="bg-molecular absolute inset-0 opacity-30" />
          <div className="relative flex items-center gap-4">
            <ProteinRing
              value={progressPct}
              size={90}
              stroke={8}
              label="complete"
            >
              <div className="flex flex-col items-center leading-none">
                <span className="text-[20px] font-bold text-gold-gradient tabular">
                  {completedDays}
                </span>
                <span className="text-[8px] uppercase tracking-wide text-muted-foreground">
                  / 30 days
                </span>
              </div>
            </ProteinRing>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <IconFlame size={14} className="text-[oklch(0.72_0.18_25)]" />
                <span className="text-[10px] uppercase tracking-[0.16em] text-gold-gradient">
                  {isComplete ? "Challenge complete!" : "In progress"}
                </span>
              </div>
              <h2 className="mt-1 font-display text-[20px] font-semibold text-cream-gradient">
                Day {Math.min(currentDay, 30)} of 30
              </h2>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
                    Total protein
                  </div>
                  <div className="text-[14px] font-bold text-cream-gradient tabular">
                    <AnimatedNumber value={totalProtein} suffix="g" />
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
                    Daily goal
                  </div>
                  <div className="text-[14px] font-bold text-gold-gradient tabular">
                    {goalGrams}g
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Milestones */}
      <Reveal className="mt-4">
        <h3 className="mb-2 text-[14px] font-semibold">Milestones</h3>
        <div className="grid grid-cols-4 gap-2">
          {MILESTONES.map((m) => {
            const reached = reachedMilestones.some((rm) => rm.day === m.day);
            return (
              <motion.div
                key={m.day}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl border p-2.5 text-center transition-all",
                  reached
                    ? "border-[oklch(var(--gold)/0.4)] bg-[oklch(var(--gold)/0.08)]"
                    : "border-border glass opacity-60"
                )}
              >
                <div
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full",
                    reached ? "bg-[oklch(var(--gold)/0.2)]" : "bg-[oklch(var(--glass-tint)/0.06)]"
                  )}
                >
                  {reached ? (
                    <IconCrown size={16} className="text-gold-gradient" />
                  ) : (
                    <IconTarget size={16} className="text-muted-foreground" />
                  )}
                </div>
                <span className="text-[9px] font-bold text-gold-gradient">Day {m.day}</span>
                <span className="text-[8px] text-muted-foreground leading-tight">{m.label}</span>
                <span className={cn("text-[9px] font-semibold", reached ? "text-[oklch(var(--jade))]" : "text-muted-foreground")}>
                  +{m.reward}
                </span>
              </motion.div>
            );
          })}
        </div>
      </Reveal>

      {/* Log today CTA */}
      {!isComplete && currentDay <= 30 && (
        <Reveal className="mt-4">
          <HuxonButton size="lg" glow className="w-full" onClick={() => setLogModal(true)}>
            <IconBolt size={16} />
            Log Day {currentDay}
            <IconArrowRight size={14} />
          </HuxonButton>
        </Reveal>
      )}

      {/* Calendar grid */}
      <Reveal className="mt-4">
        <h3 className="mb-2 text-[14px] font-semibold">Your journey</h3>
        <div className="grid grid-cols-6 gap-1.5">
          {days.map((d) => {
            const isToday = d.day === currentDay;
            return (
              <motion.div
                key={d.day}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: d.day * 0.01 }}
                className={cn(
                  "relative grid aspect-square place-items-center rounded-lg border text-[10px] font-semibold transition-all",
                  d.completed
                    ? "border-transparent bg-gradient-to-br from-[oklch(var(--gold))] to-[oklch(var(--bronze))] text-[oklch(var(--charcoal))]"
                    : d.proteinLogged > 0
                    ? "border-[oklch(var(--gold)/0.3)] bg-[oklch(var(--gold)/0.08)] text-gold-gradient"
                    : "border-border bg-[oklch(var(--glass-tint)/0.04)] text-muted-foreground"
                )}
              >
                {d.day}
                {isToday && (
                  <motion.span
                    className="absolute -inset-0.5 -z-10 rounded-lg"
                    style={{ boxShadow: "0 0 0 2px oklch(var(--gold))" }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                {d.completed && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-[oklch(var(--jade))]">
                    <IconCheck size={8} className="text-background" />
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </Reveal>

      {/* Share progress */}
      <Reveal className="mt-4">
        <ChallengeShareCard
          completedDays={completedDays}
          totalProtein={totalProtein}
          goalGrams={goalGrams}
          currentDay={currentDay}
        />
      </Reveal>

      {/* Opt out */}
      <Reveal className="mt-4">
        <button
          onClick={onUnenroll}
          className="w-full text-center text-[11px] text-muted-foreground hover:text-[oklch(0.72_0.18_25)]"
        >
          Leave challenge
        </button>
      </Reveal>

      {/* Log modal */}
      <AnimatePresence>
        {logModal && (
          <LogDayModal
            day={currentDay}
            goal={goalGrams}
            onClose={() => setLogModal(false)}
            onLog={handleLog}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ============================================================
   Challenge Share Card — shareable progress stats
   ============================================================ */
function ChallengeShareCard({
  completedDays,
  totalProtein,
  goalGrams,
  currentDay,
}: {
  completedDays: number;
  totalProtein: number;
  goalGrams: number;
  currentDay: number;
}) {
  const [copied, setCopied] = React.useState(false);

  const shareText = `🧬 I'm on Day ${Math.min(currentDay, 30)} of the Dr. Huxon Labs 30-Day Protein Challenge!\n\n✅ ${completedDays} days completed\n💪 ${totalProtein}g protein logged\n🎯 Daily goal: ${goalGrams}g\n\nJoin me: https://drhuxon.com/challenge`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My 30-Day Protein Challenge",
          text: shareText,
          url: "https://drhuxon.com/challenge",
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[oklch(var(--gold)/0.2)] bg-gradient-to-br from-[oklch(var(--espresso))] via-[oklch(var(--cocoa)/0.5)] to-[oklch(var(--charcoal)/0.8)] p-4">
      <div className="bg-molecular absolute inset-0 opacity-30" />
      <div className="relative">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-gold-gradient">
          <IconSpark size={11} />
          Share your progress
        </div>

        {/* Shareable stats card */}
        <div className="mt-3 rounded-2xl bg-[oklch(var(--glass-tint)/0.06)] p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-muted-foreground">Day</div>
              <div className="font-display text-[24px] font-bold text-gold-gradient tabular">
                {Math.min(currentDay, 30)}/30
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground">Completed</div>
              <div className="font-display text-[24px] font-bold text-cream-gradient tabular">
                {completedDays}
              </div>
            </div>
          </div>
          <div className="my-2 h-px bg-border/50" />
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Total protein</span>
            <span className="font-semibold text-gold-gradient tabular">{totalProtein}g</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Daily goal</span>
            <span className="font-semibold text-cream-gradient tabular">{goalGrams}g</span>
          </div>
        </div>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[oklch(var(--gold))] to-[oklch(var(--bronze))] py-2.5 text-[13px] font-semibold text-[oklch(var(--charcoal))] shadow-gold"
        >
          {copied ? (
            <>
              <IconCheck size={14} />
              Copied to clipboard!
            </>
          ) : (
            <>
              <IconShare size={14} />
              Share my progress
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function LogDayModal({
  day,
  goal,
  onClose,
  onLog,
}: {
  day: number;
  goal: number;
  onClose: () => void;
  onLog: (protein: number) => void;
}) {
  const [protein, setProtein] = React.useState(goal);

  const presets = [
    { label: "1 scoop", value: 27 },
    { label: "1 bar", value: 20 },
    { label: "1 meal", value: 30 },
    { label: "½ goal", value: Math.round(goal / 2) },
  ];

  const reached = protein >= goal * 0.8;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 flex w-full max-w-[460px] flex-col overflow-hidden rounded-t-[28px] border-t border-border bg-background"
      >
        <div className="mx-auto my-3 h-1 w-10 rounded-full bg-[oklch(var(--glass-border)/0.2)]" />
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full glass"
        >
          <IconClose size={16} />
        </button>

        <div className="px-5 pb-8">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-gold-gradient">
            <IconTarget size={11} />
            Log Day {day}
          </div>
          <h2 className="mt-1 font-display text-[22px] font-semibold text-cream-gradient">
            How much protein today?
          </h2>

          {/* Protein input */}
          <div className="mt-5 flex items-center justify-center gap-4">
            <button
              onClick={() => setProtein((p) => Math.max(0, p - 5))}
              className="grid h-12 w-12 place-items-center rounded-full glass text-[18px]"
              aria-label="Decrease"
            >
              −
            </button>
            <div className="text-center">
              <AnimatedNumber
                value={protein}
                className="font-display text-[48px] font-semibold text-gold-gradient tabular"
              />
              <span className="ml-1 text-[14px] text-muted-foreground">g</span>
            </div>
            <button
              onClick={() => setProtein((p) => p + 5)}
              className="grid h-12 w-12 place-items-center rounded-full glass text-[18px]"
              aria-label="Increase"
            >
              +
            </button>
          </div>

          {/* Goal indicator */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="h-2 w-32 overflow-hidden rounded-full bg-[oklch(var(--glass-tint)/0.08)]">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: reached
                    ? "linear-gradient(90deg, oklch(var(--jade)), oklch(0.72 0.10 160))"
                    : "linear-gradient(90deg, oklch(var(--gold)), oklch(var(--bronze)))",
                }}
                animate={{ width: `${Math.min(100, (protein / goal) * 100)}%` }}
              />
            </div>
            <span className={cn("text-[11px] font-semibold", reached ? "text-[oklch(var(--jade))]" : "text-muted-foreground")}>
              {reached ? "Goal reached! 🎉" : `${Math.round((protein / goal) * 100)}% of goal`}
            </span>
          </div>

          {/* Quick presets */}
          <div className="mt-5">
            <div className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Quick add
            </div>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setProtein((cur) => cur + p.value)}
                  className="rounded-full glass px-3 py-1.5 text-[11px] font-medium text-foreground/80"
                >
                  +{p.label} ({p.value}g)
                </button>
              ))}
            </div>
          </div>

          <HuxonButton
            size="lg"
            glow
            className="mt-5 w-full"
            onClick={() => onLog(protein)}
          >
            <IconCheck size={16} />
            Log {protein}g for Day {day}
          </HuxonButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
