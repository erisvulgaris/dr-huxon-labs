"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSubscriptions, type Subscription } from "@/lib/store";
import { PRODUCTS, formatINR } from "@/lib/catalog";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconArrowLeft,
  IconArrowRight,
  IconRefresh,
  IconCheck,
  IconClock,
  IconBolt,
  IconClose,
  IconPlus,
  IconMinus,
  IconTruck,
  IconSpark,
} from "@/components/icons";
import {
  Reveal,
  Stagger,
  StaggerItem,
  Pill,
  AnimatedNumber,
  ProteinRing,
} from "@/components/primitives";
import { useNav } from "@/lib/store";
import { cn } from "@/lib/utils";

const FREQUENCIES = [
  { days: 15, label: "Every 2 weeks" },
  { days: 30, label: "Monthly" },
  { days: 45, label: "Every 6 weeks" },
  { days: 60, label: "Bi-monthly" },
];

const FLAVORS = [
  "Belgian Cocoa",
  "Chocolate",
  "Vanilla",
  "Mixed Berry",
  "Tart Cherry",
  "Blood Orange",
  "Salted Caramel",
];

/**
 * Subscriptions view — manage recurring deliveries.
 */
export function SubscriptionsView() {
  const { subscriptions, cancelSubscription } = useSubscriptions();
  const { setRoute } = useNav();

  const totalSavings = subscriptions.reduce((n, s) => n + s.totalSaved, 0);
  const activeCount = subscriptions.filter((s) => s.status === "active").length;
  const monthlySpend = subscriptions
    .filter((s) => s.status === "active")
    .reduce((n, s) => n + (s.pricePerDelivery * 30) / s.frequencyDays, 0);

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
              Subscriptions
          </h1>
            <p className="text-[11px] text-muted-foreground">
              {activeCount} active · save 15% on every delivery
            </p>
          </div>
        </div>
      </Reveal>

      {subscriptions.length === 0 ? (
        <EmptySubscriptions />
      ) : (
        <>
          {/* Savings summary card */}
          <Reveal className="mt-5">
            <div className="relative overflow-hidden rounded-3xl border border-[oklch(var(--gold)/0.25)] bg-gradient-to-br from-[oklch(var(--gold)/0.1)] to-[oklch(var(--gold)/0.02)] p-5">
              <div className="bg-molecular absolute inset-0 opacity-30" />
              <div className="relative">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-gold-gradient">
                  <IconBolt size={11} />
                  Total savings
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <AnimatedNumber
                    value={totalSavings}
                    prefix="₹"
                    className="font-display text-[36px] font-semibold leading-none text-gold-gradient tabular"
                  />
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  Across {subscriptions.reduce((n, s) => n + s.deliveriesCount, 0)} deliveries
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-[oklch(var(--glass-tint)/0.06)] p-2.5">
                    <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
                      Active subs
                    </div>
                    <div className="text-[16px] font-bold text-cream-gradient tabular">
                      {activeCount}
                    </div>
                  </div>
                  <div className="rounded-xl bg-[oklch(var(--glass-tint)/0.06)] p-2.5">
                    <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
                      Monthly spend
                    </div>
                    <div className="text-[16px] font-bold text-cream-gradient tabular">
                      {formatINR(Math.round(monthlySpend))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Subscription cards */}
          <Stagger className="mt-4 space-y-3" staggerChildren={0.06}>
            {subscriptions.map((sub) => (
              <StaggerItem key={sub.id}>
                <SubscriptionCard subscription={sub} onCancel={() => cancelSubscription(sub.id)} />
              </StaggerItem>
            ))}
          </Stagger>

          {/* Add subscription CTA */}
          <Reveal className="mt-4">
            <button
              onClick={() => setRoute("shop")}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-[13px] font-medium text-muted-foreground hover:border-[oklch(var(--gold)/0.4)] hover:text-gold-gradient transition-colors"
            >
              <IconPlus size={16} />
              Add a new subscription
            </button>
          </Reveal>
        </>
      )}
    </div>
  );
}

function SubscriptionCard({
  subscription,
  onCancel,
}: {
  subscription: Subscription;
  onCancel: () => void;
}) {
  const {
    pauseSubscription,
    resumeSubscription,
    skipNextDelivery,
    swapFlavor,
    changeFrequency,
  } = useSubscriptions();
  const [showManage, setShowManage] = React.useState(false);
  const [confirmCancel, setConfirmCancel] = React.useState(false);

  const isPaused = subscription.status === "paused";
  const daysUntilDelivery = Math.max(
    0,
    Math.ceil((subscription.nextDelivery - Date.now()) / (1000 * 60 * 60 * 24))
  );
  const deliveryDate = new Date(subscription.nextDelivery).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
  const perDeliverySavings =
    subscription.originalPricePerDelivery - subscription.pricePerDelivery;

  return (
    <motion.div
      layout
      className={cn(
        "overflow-hidden rounded-2xl border glass",
        isPaused
          ? "border-[oklch(0.72_0.15_60/0.3)] opacity-75"
          : "border-[oklch(var(--gold)/0.2)]"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-3.5">
        <div className="relative h-14 w-14 shrink-0">
          <div
            className="absolute inset-0 rounded-full blur-md"
            style={{ background: `${subscription.productAccent.replace(")", " / 0.3)")}` }}
          />
          <img
            src={subscription.productImage}
            alt={subscription.productName}
            className="relative h-full w-full object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = "0";
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-[14px] font-semibold text-cream-gradient">
              {subscription.productName}
            </h3>
            {isPaused ? (
              <Pill tone="default">
                <IconClock size={9} />
                Paused
              </Pill>
            ) : (
              <Pill tone="green">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(var(--jade))]" />
                Active
              </Pill>
            )}
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            {subscription.flavor} · Qty {subscription.quantity} ·{" "}
            {FREQUENCIES.find((f) => f.days === subscription.frequencyDays)?.label}
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-[14px] font-semibold text-gold-gradient tabular">
              {formatINR(subscription.pricePerDelivery)}
            </span>
            <span className="text-[10px] text-muted-foreground line-through tabular">
              {formatINR(subscription.originalPricePerDelivery)}
            </span>
            <span className="text-[10px] font-semibold text-[oklch(var(--jade))]">
              −{Math.round((perDeliverySavings / subscription.originalPricePerDelivery) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Next delivery banner */}
      {!isPaused ? (
        <div className="mx-3.5 mb-3.5 flex items-center gap-3 rounded-xl bg-[oklch(var(--gold)/0.06)] p-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[oklch(var(--gold)/0.18)]">
            <IconTruck size={16} className="text-gold-gradient" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] text-muted-foreground">Next delivery</div>
            <div className="text-[13px] font-semibold text-cream-gradient">
              {deliveryDate}
              <span className="ml-1.5 text-[11px] font-normal text-muted-foreground">
                · in {daysUntilDelivery} day{daysUntilDelivery !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-muted-foreground">Saved so far</div>
            <div className="text-[12px] font-bold text-[oklch(var(--jade))] tabular">
              {formatINR(subscription.totalSaved)}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-3.5 mb-3.5 flex items-center gap-3 rounded-xl bg-[oklch(0.72_0.15_60/0.08)] p-3">
          <IconClock size={16} className="text-[oklch(0.72_0.15_60)]" />
          <div className="text-[12px] text-muted-foreground">
            Resumes{" "}
            {subscription.pausedUntil
              ? new Date(subscription.pausedUntil).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })
              : "when you resume"}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-1.5 border-t border-border/50 p-3">
        {isPaused ? (
          <HuxonButton
            size="sm"
            glow
            className="flex-1"
            onClick={() => resumeSubscription(subscription.id)}
          >
            <IconRefresh size={12} />
            Resume
          </HuxonButton>
        ) : (
          <>
            <HuxonButton
              size="sm"
              variant="secondary"
              className="flex-1"
              onClick={() => pauseSubscription(subscription.id)}
            >
              Pause
            </HuxonButton>
            <HuxonButton
              size="sm"
              variant="secondary"
              className="flex-1"
              onClick={() => skipNextDelivery(subscription.id)}
            >
              Skip
            </HuxonButton>
          </>
        )}
        <HuxonButton
          size="sm"
          variant="secondary"
          className="flex-1"
          onClick={() => setShowManage((s) => !s)}
        >
          {showManage ? "Close" : "Manage"}
        </HuxonButton>
      </div>

      {/* Manage panel */}
      <AnimatePresence>
        {showManage && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border/50"
          >
            <div className="space-y-4 p-3.5">
              {/* Frequency */}
              <div>
                <div className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Frequency
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {FREQUENCIES.map((f) => (
                    <button
                      key={f.days}
                      onClick={() => changeFrequency(subscription.id, f.days)}
                      className={cn(
                        "rounded-xl border px-2 py-2 text-[11px] font-medium transition-all",
                        subscription.frequencyDays === f.days
                          ? "border-[oklch(var(--gold)/0.5)] bg-[oklch(var(--gold)/0.14)] text-gold-gradient"
                          : "border-border bg-transparent text-muted-foreground"
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flavor swap */}
              <div>
                <div className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Flavor
                </div>
                <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
                  {FLAVORS.map((flav) => (
                    <button
                      key={flav}
                      onClick={() => swapFlavor(subscription.id, flav)}
                      className={cn(
                        "shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all",
                        subscription.flavor === flav
                          ? "border-[oklch(var(--gold)/0.5)] bg-[oklch(var(--gold)/0.14)] text-gold-gradient"
                          : "border-border bg-transparent text-muted-foreground"
                      )}
                    >
                      {flav}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-[oklch(var(--glass-tint)/0.04)] p-2 text-center">
                  <div className="text-[14px] font-bold text-cream-gradient tabular">
                    {subscription.deliveriesCount}
                  </div>
                  <div className="text-[8px] uppercase tracking-wide text-muted-foreground">
                    Deliveries
                  </div>
                </div>
                <div className="rounded-xl bg-[oklch(var(--glass-tint)/0.04)] p-2 text-center">
                  <div className="text-[14px] font-bold text-[oklch(var(--jade))] tabular">
                    {formatINR(subscription.totalSaved)}
                  </div>
                  <div className="text-[8px] uppercase tracking-wide text-muted-foreground">
                    Saved
                  </div>
                </div>
                <div className="rounded-xl bg-[oklch(var(--glass-tint)/0.04)] p-2 text-center">
                  <div className="text-[14px] font-bold text-cream-gradient tabular">
                    {Math.round(
                      (Date.now() - subscription.createdAt) / (1000 * 60 * 60 * 24)
                    )}
                  </div>
                  <div className="text-[8px] uppercase tracking-wide text-muted-foreground">
                    Days active
                  </div>
                </div>
              </div>

              {/* Cancel */}
              {confirmCancel ? (
                <div className="rounded-xl border border-[oklch(0.62_0.20_25/0.3)] bg-[oklch(0.62_0.20_25/0.06)] p-3">
                  <div className="mb-2 text-[12px] font-medium">
                    Cancel this subscription?
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmCancel(false)}
                      className="flex-1 rounded-full glass py-2 text-[12px] font-medium"
                    >
                      Keep
                    </button>
                    <button
                      onClick={() => {
                        onCancel();
                        setConfirmCancel(false);
                      }}
                      className="flex-1 rounded-full bg-[oklch(0.62_0.20_25/0.2)] py-2 text-[12px] font-semibold text-[oklch(0.72_0.18_25)]"
                    >
                      Cancel sub
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmCancel(true)}
                  className="w-full text-center text-[11px] text-muted-foreground hover:text-[oklch(0.72_0.18_25)]"
                >
                  Cancel subscription
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EmptySubscriptions() {
  const { setRoute } = useNav();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="relative grid h-24 w-24 place-items-center"
      >
        <div className="absolute inset-0 rounded-full bg-[oklch(var(--gold)/0.12)] blur-2xl" />
        <div className="relative grid h-20 w-20 place-items-center rounded-full glass">
          <IconRefresh size={32} className="text-muted-foreground" />
        </div>
      </motion.div>
      <h3 className="mt-6 font-display text-[18px] font-semibold text-cream-gradient">
        No active subscriptions
      </h3>
      <p className="mt-1 max-w-[280px] text-[13px] text-muted-foreground">
        Subscribe to your favorite products and save 15% on every delivery. Pause,
        skip, or swap flavors anytime.
      </p>
      <HuxonButton size="md" glow className="mt-5" onClick={() => setRoute("shop")}>
        <IconPlus size={14} />
        Browse products
        <IconArrowRight size={14} />
      </HuxonButton>
    </div>
  );
}
