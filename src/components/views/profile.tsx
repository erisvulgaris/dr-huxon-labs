"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  IconCrown,
  IconArrowRight,
  IconLocation,
  IconLock,
  IconRefresh,
  IconBell,
  IconCheck,
  IconStar,
  IconTruck,
  IconChevronRight,
  IconHeart,
  IconGift,
} from "@/components/icons";
import {
  Reveal,
  AnimatedNumber,
  Stagger,
  StaggerItem,
  StarRating,
  Pill,
} from "@/components/primitives";
import { useNav, useReward } from "@/lib/store";
import { PRODUCTS, formatINR } from "@/lib/catalog";

/**
 * Profile view — premium dashboard.
 */
export function ProfileView() {
  const { points, tier, streak } = useReward();
  const { setRoute, setQuickView } = useNav();

  return (
    <div className="px-4 pb-8 pt-4">
      {/* Header card */}
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-[oklch(0.78_0.13_75_/_0.2)] bg-gradient-to-br from-[oklch(0.22_0.02_55)] to-[oklch(0.13_0.008_50)] p-5">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[oklch(0.78_0.13_75_/_0.25)] blur-3xl" />
          <div className="bg-molecular absolute inset-0 opacity-30" />

          <div className="relative flex items-center gap-3">
            <div className="relative">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.92_0.10_85)] to-[oklch(0.62_0.10_55)] font-display text-[22px] font-bold text-[oklch(0.14_0.01_50)]">
                AM
              </div>
              <div className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-[oklch(0.30_0.04_55)] border border-[oklch(0.78_0.13_75_/_0.4)]">
                <IconCrown size={12} className="text-[oklch(0.92_0.10_85)]" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="font-display text-[20px] font-semibold text-cream-gradient">
                Arjun Mehta
              </h1>
              <p className="text-[12px] text-muted-foreground">arjun.mehta@email.com</p>
              <div className="mt-1 flex items-center gap-1.5">
                <Pill tone="gold">{tier} member</Pill>
                <Pill>{streak}d streak</Pill>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="relative mt-4 grid grid-cols-3 gap-2">
            <StatTile label="Points" value={points} />
            <StatTile label="Orders" value={14} />
            <StatTile label="Saved" value={3240} prefix="₹" />
          </div>
        </div>
      </Reveal>

      {/* Nutritional goals */}
      <Reveal className="mt-4">
        <Section title="My goals" onAction={() => setRoute("explore")}>
          <div className="grid grid-cols-2 gap-2.5">
            <GoalChip label="Daily protein" value="140g" pct={66} />
            <GoalChip label="Water" value="8 glasses" pct={62} />
            <GoalChip label="Lean mass" value="5kg" pct={62} />
            <GoalChip label="Weekly workouts" value="5" pct={80} />
          </div>
        </Section>
      </Reveal>

      {/* Order history */}
      <Reveal className="mt-4">
        <Section title="Order history" onAction={() => setRoute("cart")}>
          <div className="space-y-2">
            <OrderRow
              id="HUX48291"
              date="3 days ago"
              status="out_for_delivery"
              total={4998}
              eta="Tomorrow, by 7 PM"
            />
            <OrderRow
              id="HUX47820"
              date="2 weeks ago"
              status="delivered"
              total={2499}
            />
            <OrderRow
              id="HUX47012"
              date="1 month ago"
              status="delivered"
              total={3298}
            />
          </div>
        </Section>
      </Reveal>

      {/* Subscriptions */}
      <Reveal className="mt-4">
        <Section title="Subscriptions">
          <div className="rounded-2xl glass p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[oklch(0.78_0.13_75_/_0.14)]">
                <IconRefresh size={18} className="text-[oklch(0.92_0.10_85)]" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold">Huxon Gold Isolate</div>
                <div className="text-[11px] text-muted-foreground">
                  Every 30 days · Belgian Cocoa · 2 tubs
                </div>
              </div>
              <Pill tone="green">Save 15%</Pill>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Next delivery</span>
              <span className="font-semibold text-cream-gradient">Jul 18, 2025</span>
            </div>
            <div className="mt-2 flex gap-2">
              <button className="flex-1 rounded-full bg-[oklch(0.96_0.012_80_/_0.06)] py-1.5 text-[11px] font-medium">
                Pause
              </button>
              <button className="flex-1 rounded-full bg-[oklch(0.96_0.012_80_/_0.06)] py-1.5 text-[11px] font-medium">
                Skip
              </button>
              <button className="flex-1 rounded-full bg-[oklch(0.96_0.012_80_/_0.06)] py-1.5 text-[11px] font-medium">
                Swap flavor
              </button>
            </div>
          </div>
        </Section>
      </Reveal>

      {/* Addresses + payment */}
      <Reveal className="mt-4">
        <div className="grid grid-cols-1 gap-3">
          <Section title="Saved addresses">
            <div className="rounded-2xl glass p-4">
              <div className="flex items-start gap-2">
                <IconLocation size={16} className="mt-0.5 text-[oklch(0.78_0.13_75)]" />
                <div className="flex-1">
                  <div className="text-[13px] font-semibold">Home</div>
                  <div className="text-[11px] text-muted-foreground">
                    12 Indiranagar, 2nd Stage, Bengaluru, KA 560038
                  </div>
                </div>
                <Pill tone="gold">Default</Pill>
              </div>
            </div>
          </Section>

          <Section title="Saved payment">
            <div className="rounded-2xl glass p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-12 place-items-center rounded-md bg-gradient-to-br from-[oklch(0.30_0.04_55)] to-[oklch(0.20_0.02_55)]">
                  <IconLock size={14} className="text-[oklch(0.92_0.10_85)]" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold">UPI · arjun@oksbi</div>
                  <div className="text-[11px] text-muted-foreground">Primary</div>
                </div>
                <Pill>Verified</Pill>
              </div>
            </div>
          </Section>
        </div>
      </Reveal>

      {/* Recently viewed */}
      <Reveal className="mt-4">
        <Section title="Recently viewed">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {PRODUCTS.slice(0, 4).map((p) => (
              <button
                key={p.id}
                onClick={() => setQuickView(p.id)}
                className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[oklch(0.13_0.008_50)]"
              >
                <div
                  className="absolute inset-0 blur-xl"
                  style={{ background: `${p.accent.replace(")", " / 0.3)")}` }}
                />
                <img
                  src={p.heroImage}
                  alt={p.name}
                  className="relative h-full w-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "0";
                  }}
                />
              </button>
            ))}
          </div>
        </Section>
      </Reveal>

      {/* Recommended for you */}
      <Reveal className="mt-4">
        <Section title="Recommended for you">
          <Stagger className="space-y-2" staggerChildren={0.06}>
            {PRODUCTS.slice(1, 4).map((p) => (
              <StaggerItem key={p.id}>
                <RecRow product={p} onOpen={() => setQuickView(p.id)} />
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      </Reveal>

      {/* Quick actions */}
      <Reveal className="mt-4 grid grid-cols-2 gap-2">
        <ActionTile icon={<IconBell size={16} />} label="Notifications" badge={3} />
        <ActionTile icon={<IconHeart size={16} />} label="Wishlist" badge={2} />
        <ActionTile icon={<IconGift size={16} />} label="Coupons" badge={1} />
        <ActionTile icon={<IconArrowRight size={16} />} label="Settings" />
      </Reveal>
    </div>
  );
}

function Section({
  title,
  children,
  onAction,
}: {
  title: string;
  children: React.ReactNode;
  onAction?: () => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-foreground/90">{title}</h2>
        {onAction ? (
          <button
            onClick={onAction}
            className="flex items-center gap-0.5 text-[11px] text-[oklch(0.78_0.13_75)]"
          >
            View all
            <IconChevronRight size={12} />
          </button>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function StatTile({
  label,
  value,
  prefix = "",
}: {
  label: string;
  value: number;
  prefix?: string;
}) {
  return (
    <div className="rounded-2xl bg-[oklch(0.96_0.012_80_/_0.04)] p-3 text-center">
      <div className="font-display text-[18px] font-semibold text-cream-gradient tabular">
        <AnimatedNumber value={value} prefix={prefix} />
      </div>
      <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function GoalChip({
  label,
  value,
  pct,
}: {
  label: string;
  value: string;
  pct: number;
}) {
  return (
    <div className="rounded-2xl glass p-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span className="text-[11px] font-semibold text-cream-gradient">{value}</span>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[oklch(0.96_0.012_80_/_0.06)]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[oklch(0.78_0.13_75)] to-[oklch(0.92_0.10_85)]"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="mt-1 text-[9px] text-muted-foreground">{pct}% complete</div>
    </div>
  );
}

function OrderRow({
  id,
  date,
  status,
  total,
  eta,
}: {
  id: string;
  date: string;
  status: "delivered" | "out_for_delivery" | "shipped";
  total: number;
  eta?: string;
}) {
  const statusConfig = {
    delivered: { label: "Delivered", tone: "green" as const },
    out_for_delivery: { label: "Out for delivery", tone: "gold" as const },
    shipped: { label: "Shipped", tone: "default" as const },
  };
  const cfg = statusConfig[status];
  return (
    <div className="rounded-2xl glass p-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[12px] font-semibold">#{id}</div>
          <div className="text-[10px] text-muted-foreground">{date}</div>
        </div>
        <div className="text-right">
          <div className="text-[13px] font-semibold text-cream-gradient tabular">
            {formatINR(total)}
          </div>
          <Pill tone={cfg.tone}>{cfg.label}</Pill>
        </div>
      </div>
      {eta ? (
        <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-[oklch(0.78_0.13_75_/_0.06)] px-2 py-1.5 text-[11px]">
          <IconTruck size={12} className="text-[oklch(0.78_0.13_75)]" />
          <span className="text-muted-foreground">ETA:</span>
          <span className="font-semibold text-cream-gradient">{eta}</span>
        </div>
      ) : null}
    </div>
  );
}

function RecRow({
  product,
  onOpen,
}: {
  product: (typeof PRODUCTS)[number];
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-2xl glass p-2.5 text-left"
    >
      <div className="relative h-12 w-12 shrink-0">
        <div
          className="absolute inset-0 rounded-full blur-md"
          style={{ background: `${product.accent.replace(")", " / 0.3)")}` }}
        />
        <img
          src={product.heroImage}
          alt={product.name}
          className="relative h-full w-full object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0";
          }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold">{product.name}</div>
        <StarRating value={product.rating} size={9} />
      </div>
      <div className="text-right">
        <div className="text-[12px] font-semibold text-cream-gradient tabular">
          {formatINR(product.price)}
        </div>
        <IconChevronRight size={12} className="ml-auto text-muted-foreground" />
      </div>
    </button>
  );
}

function ActionTile({
  icon,
  label,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button className="relative flex items-center gap-2 rounded-2xl glass p-3 text-left">
      <span className="text-[oklch(0.78_0.13_75)]">{icon}</span>
      <span className="text-[12px] font-medium">{label}</span>
      {badge ? (
        <span className="absolute right-2 top-2 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.78_0.13_75)] to-[oklch(0.62_0.10_55)] px-1 text-[9px] font-bold text-[oklch(0.14_0.01_50)]">
          {badge}
        </span>
      ) : null}
    </button>
  );
}
