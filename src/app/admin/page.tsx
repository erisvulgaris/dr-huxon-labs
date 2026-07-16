"use client";

/* ============================================================
   Dr. Huxon Labs — Admin Panel
   Enterprise-grade control center for the D2C nutrition brand.
   Single-file, client-side, mock data, dark premium theme.
   ============================================================ */

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import {
  IconGrid,
  IconShop,
  IconTruck,
  IconUsers,
  IconPackage,
  IconGift,
  IconSettings,
  IconArrowLeft,
  IconArrowUpRight,
  IconSearch,
  IconBell,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconTrending,
  IconCrown,
  IconSpark,
  IconFlame,
  IconBolt,
  IconTarget,
  IconStar,
  IconCheck,
  IconClock,
  IconChevronDown,
  IconRefresh,
  IconChartBar,
  IconTag,
  IconLogout,
  IconDots,
  IconRupee,
  IconMenu,
  IconClose,
  IconFilter,
  IconFlask,
  IconLeaf,
  IconShield,
  IconArrowRight,
} from "@/components/icons";
import { AnimatedNumber, Reveal } from "@/components/primitives";
import { PRODUCTS, formatINR } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { useSettings } from "@/lib/store";

/* ============================================================
   Types
   ============================================================ */
type Section =
  | "dashboard"
  | "products"
  | "orders"
  | "customers"
  | "inventory"
  | "marketing"
  | "analytics"
  | "returns"
  | "shipping"
  | "tax"
  | "reviews"
  | "audit"
  | "settings";

type OrderStatus =
  | "placed"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

/* ============================================================
   Mock Data — realistic Indian e-commerce context (INR)
   ============================================================ */
const REVENUE_7D = [
  { day: "Mon", revenue: 184500, orders: 42 },
  { day: "Tue", revenue: 212300, orders: 51 },
  { day: "Wed", revenue: 198700, orders: 47 },
  { day: "Thu", revenue: 247800, orders: 58 },
  { day: "Fri", revenue: 289400, orders: 67 },
  { day: "Sat", revenue: 342100, orders: 78 },
  { day: "Sun", revenue: 312700, orders: 71 },
];

const ORDER_STATUS_DIST: { status: OrderStatus; count: number; color: string }[] = [
  { status: "placed", count: 14, color: "oklch(0.70 0.08 30)" },
  { status: "packed", count: 9, color: "oklch(0.72 0.10 65)" },
  { status: "shipped", count: 17, color: "oklch(0.62 0.10 160)" },
  { status: "out_for_delivery", count: 6, color: "oklch(0.55 0.09 200)" },
  { status: "delivered", count: 184, color: "oklch(0.78 0.13 75)" },
  { status: "cancelled", count: 3, color: "oklch(0.62 0.20 25)" },
];

const TOP_PRODUCTS = [
  { id: "p1", name: "Huxon Gold Isolate", units: 412, revenue: 1029588 },
  { id: "p5", name: "Huxon Protein Bars", units: 689, revenue: 895211 },
  { id: "p2", name: "Recovery Matrix", units: 198, revenue: 435402 },
  { id: "p4", name: "Daily Greens+", units: 247, revenue: 394953 },
  { id: "p3", name: "Plant Pre-Workout", units: 156, revenue: 296244 },
];

const CUSTOMER_ACQUISITION_7D = [
  { day: "Mon", new: 18 },
  { day: "Tue", new: 24 },
  { day: "Wed", new: 21 },
  { day: "Thu", new: 29 },
  { day: "Fri", new: 34 },
  { day: "Sat", new: 41 },
  { day: "Sun", new: 38 },
];

const TIER_DIST = [
  { tier: "Bronze", count: 2847, pct: 58, color: "oklch(0.55 0.06 50)" },
  { tier: "Silver", count: 1247, pct: 25, color: "oklch(0.70 0.02 80)" },
  { tier: "Gold", count: 612, pct: 12, color: "oklch(0.82 0.14 80)" },
  { tier: "Platinum", count: 244, pct: 5, color: "oklch(0.72 0.18 200)" },
];

const TOP_CUSTOMERS = [
  { name: "Vikram Reddy", email: "vikram.r@example.com", city: "Bengaluru", orders: 47, ltv: 184600, tier: "platinum" },
  { name: "Ananya Krishnan", email: "ananya.k@example.com", city: "Chennai", orders: 39, ltv: 152300, tier: "platinum" },
  { name: "Rahul Sharma", email: "rahul.s@example.com", city: "Mumbai", orders: 31, ltv: 121800, tier: "gold" },
  { name: "Priya Nair", email: "priya.n@example.com", city: "Kochi", orders: 28, ltv: 98400, tier: "gold" },
  { name: "Karthik Venkat", email: "karthik.v@example.com", city: "Hyderabad", orders: 22, ltv: 76200, tier: "gold" },
  { name: "Sneha Patel", email: "sneha.p@example.com", city: "Ahmedabad", orders: 18, ltv: 54100, tier: "silver" },
];

const MOCK_ORDERS = [
  { id: "HUX-48291", customer: "Vikram Reddy", city: "Bengaluru", items: 2, total: 3798, status: "out_for_delivery" as OrderStatus, date: "Today, 14:32", channel: "Web" },
  { id: "HUX-48290", customer: "Ananya Krishnan", city: "Chennai", items: 1, total: 2499, status: "shipped" as OrderStatus, date: "Today, 12:18", channel: "App" },
  { id: "HUX-48289", customer: "Rahul Sharma", city: "Mumbai", items: 3, total: 5997, status: "packed" as OrderStatus, date: "Today, 11:04", channel: "Web" },
  { id: "HUX-48288", customer: "Priya Nair", city: "Kochi", items: 1, total: 2199, status: "placed" as OrderStatus, date: "Today, 10:42", channel: "App" },
  { id: "HUX-48287", customer: "Karthik Venkat", city: "Hyderabad", items: 2, total: 3798, status: "delivered" as OrderStatus, date: "Yesterday, 18:21", channel: "Web" },
  { id: "HUX-48286", customer: "Sneha Patel", city: "Ahmedabad", items: 1, total: 1299, status: "delivered" as OrderStatus, date: "Yesterday, 16:50", channel: "App" },
  { id: "HUX-48285", customer: "Arjun Mehta", city: "Pune", items: 4, total: 7196, status: "delivered" as OrderStatus, date: "Yesterday, 14:12", channel: "Web" },
  { id: "HUX-48284", customer: "Meera Iyer", city: "Bengaluru", items: 1, total: 1599, status: "cancelled" as OrderStatus, date: "Yesterday, 11:38", channel: "App" },
  { id: "HUX-48283", customer: "Rohan Gupta", city: "Delhi", items: 2, total: 3798, status: "delivered" as OrderStatus, date: "2 days ago", channel: "Web" },
  { id: "HUX-48282", customer: "Divya Rao", city: "Mysuru", items: 1, total: 999, status: "delivered" as OrderStatus, date: "2 days ago", channel: "App" },
  { id: "HUX-48281", customer: "Aditya Verma", city: "Jaipur", items: 3, total: 5997, status: "delivered" as OrderStatus, date: "3 days ago", channel: "Web" },
  { id: "HUX-48280", customer: "Kavya Shetty", city: "Mangaluru", items: 1, total: 2499, status: "delivered" as OrderStatus, date: "3 days ago", channel: "Web" },
];

const STOCK_LEVELS = PRODUCTS.map((p, i) => ({
  ...p,
  stock: [42, 18, 8, 64, 127, 5][i],
  reorderAt: 25,
  warehouse: "Bengaluru DC-1",
}));

const COUPONS = [
  { code: "HUXON10", type: "percent", value: 10, used: 1842, limit: 5000, revenue: 1284000, status: "active" },
  { code: "WELCOME500", type: "flat", value: 500, used: 612, limit: 1000, revenue: 892000, status: "active" },
  { code: "PLANT15", type: "percent", value: 15, used: 318, limit: 1000, revenue: 614000, status: "active" },
  { code: "FLASH25", type: "percent", value: 25, used: 894, limit: 1000, revenue: 1842000, status: "ending_soon" },
  { code: "FREESHIP", type: "free_ship", value: 0, used: 2417, limit: 9999, revenue: 0, status: "active" },
];

const FLASH_SALES = [
  { name: "Gold Isolate Flash", product: "Huxon Gold Isolate", discount: 22, endsIn: "5h 42m", sold: 178, target: 250, active: true },
  { name: "Bars Bonanza", product: "Huxon Protein Bars", discount: 18, endsIn: "1d 3h", sold: 312, target: 400, active: true },
  { name: "Greens Drop", product: "Daily Greens+", discount: 15, endsIn: "Ended", sold: 244, target: 300, active: false },
];

const CAMPAIGNS = [
  { name: "New Year Reset", channel: "Email + WhatsApp", reach: 48200, conversions: 1842, revenue: 1284000, status: "completed" },
  { name: "Protein Awareness Week", channel: "Instagram + Meta Ads", reach: 128400, conversions: 3217, revenue: 2148000, status: "active" },
  { name: "First-Order Push", channel: "Google Ads", reach: 32100, conversions: 612, revenue: 892000, status: "active" },
  { name: "Festive Bundle", channel: "Email + SMS", reach: 24800, conversions: 489, revenue: 743000, status: "scheduled" },
];

const KPI = {
  revenueToday: 312700,
  revenueWeek: 1787500,
  revenueMonth: 6842000,
  ordersToday: 71,
  ordersWeek: 414,
  ordersMonth: 1683,
  conversion: 3.42,
  aov: 4064,
  customers: 4950,
  newThisWeek: 205,
  retention: 68.4,
  avgLtv: 24800,
};

/* ============================================================
   Status Helpers
   ============================================================ */
const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  placed: { label: "Placed", color: "oklch(0.78 0.10 30)", bg: "oklch(0.70 0.10 30 / 0.14)" },
  packed: { label: "Packed", color: "oklch(0.82 0.10 65)", bg: "oklch(0.72 0.10 65 / 0.14)" },
  shipped: { label: "Shipped", color: "oklch(0.72 0.10 160)", bg: "oklch(0.62 0.10 160 / 0.14)" },
  out_for_delivery: { label: "Out for Delivery", color: "oklch(0.65 0.10 200)", bg: "oklch(0.55 0.09 200 / 0.14)" },
  delivered: { label: "Delivered", color: "oklch(0.82 0.12 75)", bg: "oklch(0.78 0.13 75 / 0.14)" },
  cancelled: { label: "Cancelled", color: "oklch(0.72 0.18 25)", bg: "oklch(0.62 0.20 25 / 0.14)" },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide"
      style={{
        color: meta.color,
        backgroundColor: meta.bg,
        borderColor: meta.color.replace(")", " / 25%)").replace("oklch(", "oklch("),
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
      {meta.label}
    </span>
  );
}

function Trend({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const up = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[11px] font-semibold tabular",
        up ? "text-text-accent-jade" : "text-[oklch(0.72_0.18_25)]"
      )}
    >
      <IconTrending size={11} className={up ? "" : "rotate-90"} />
      {up ? "+" : ""}
      {value}
      {suffix}
    </span>
  );
}

/* ============================================================
   Layout helpers
   ============================================================ */
function SectionHeader({
  title,
  subtitle,
  kicker,
  action,
}: {
  title: string;
  subtitle?: string;
  kicker?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        {kicker ? (
          <div className="flex items-center gap-2">
            <span className="h-px w-5 bg-gradient-to-r from-transparent to-[oklch(0.78_0.13_75_/_60%)]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-gold">
              {kicker}
            </span>
          </div>
        ) : null}
        <h1 className="font-display text-2xl font-semibold tracking-[-0.02em] sm:text-[28px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
  );
}

function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl border border-border/60 p-5 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ============================================================
   StatCard
   ============================================================ */
function StatCard({
  label,
  value,
  prefix = "",
  suffix = "",
  trend,
  sub,
  icon,
  decimals = 0,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: number;
  sub?: string;
  icon?: React.ReactNode;
  decimals?: number;
}) {
  return (
    <GlassCard className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[oklch(0.78_0.13_75_/_0.06)] blur-2xl" />
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        {icon ? (
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[oklch(0.78_0.13_75_/_0.1)] text-text-gold">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mt-3 font-display text-2xl font-semibold tracking-[-0.02em] sm:text-[28px]">
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </div>
      <div className="mt-2 flex items-center gap-2">
        {trend !== undefined ? <Trend value={trend} /> : null}
        {sub ? <span className="text-[11px] text-muted-foreground">{sub}</span> : null}
      </div>
    </GlassCard>
  );
}

/* ============================================================
   Bar Chart (7-day revenue)
   ============================================================ */
function RevenueBarChart() {
  const max = Math.max(...REVENUE_7D.map((d) => d.revenue));
  return (
    <GlassCard>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-text-gold">
            Last 7 Days
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold">Revenue Trend</h3>
        </div>
        <div className="text-right">
          <div className="font-display text-xl font-semibold text-gold-gradient">
            {formatINR(REVENUE_7D.reduce((s, d) => s + d.revenue, 0))}
          </div>
          <div className="text-[11px] text-muted-foreground">Total · 7d</div>
        </div>
      </div>

      <div className="flex h-48 items-end justify-between gap-2 sm:gap-3">
        {REVENUE_7D.map((d, i) => {
          const h = (d.revenue / max) * 100;
          return (
            <div key={d.day} className="group flex flex-1 flex-col items-center gap-2">
              <div className="relative flex w-full flex-1 items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full overflow-hidden rounded-t-md bg-gradient-to-t from-[oklch(0.62_0.10_55)] via-[oklch(0.78_0.13_75)] to-[oklch(0.92_0.10_85)]"
                  style={{ filter: "drop-shadow(0 0 8px oklch(0.78 0.13 75 / 0.3))" }}
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="absolute inset-0 bg-white/10" />
                  </div>
                </motion.div>
                <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border/60 bg-popover px-2 py-1 text-[10px] font-medium opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                  {formatINR(d.revenue)}
                </div>
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">{d.day}</span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

/* ============================================================
   Acquisition Chart (mini bars)
   ============================================================ */
function AcquisitionChart() {
  const max = Math.max(...CUSTOMER_ACQUISITION_7D.map((d) => d.new));
  return (
    <div className="flex h-32 items-end justify-between gap-2">
      {CUSTOMER_ACQUISITION_7D.map((d, i) => {
        const h = (d.new / max) * 100;
        return (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full flex-1 items-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-t bg-gradient-to-t from-[oklch(0.45_0.08_50)] to-[oklch(0.78_0.13_75)]"
              />
            </div>
            <span className="text-[9px] text-muted-foreground">{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   Donut chart (order status distribution)
   ============================================================ */
function StatusDonut() {
  const total = ORDER_STATUS_DIST.reduce((s, d) => s + d.count, 0);
  const size = 180;
  const stroke = 22;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  // Precompute cumulative offsets purely (no mutation during render)
  const segments = ORDER_STATUS_DIST.reduce<
    { status: OrderStatus; color: string; dash: number; offset: number }[]
  >((acc, d) => {
    const frac = d.count / total;
    const offset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
    return [...acc, { status: d.status, color: d.color, dash: frac * c, offset }];
  }, []);
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-7">
      <div className="relative grid place-items-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="oklch(0.96 0.012 80 / 0.06)"
            strokeWidth={stroke}
            fill="none"
          />
          {segments.map((seg, i) => (
            <motion.circle
              key={seg.status}
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={seg.color}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${seg.dash} ${c - seg.dash}`}
              strokeDashoffset={-seg.offset}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{ filter: `drop-shadow(0 0 4px ${seg.color} / 0.5)` }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="font-display text-2xl font-semibold text-cream-gradient">
              <AnimatedNumber value={total} />
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Total Orders
            </div>
          </div>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-2.5">
        {ORDER_STATUS_DIST.map((d) => (
          <div key={d.status} className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-[oklch(var(--glass-tint)/0.03)] px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-[11px] text-muted-foreground">
                {STATUS_META[d.status].label}
              </span>
            </div>
            <span className="text-[12px] font-semibold tabular">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Dashboard Section
   ============================================================ */
function DashboardSection() {
  return (
    <div>
      <SectionHeader
        kicker="Overview"
        title="Executive Dashboard"
        subtitle="Real-time pulse of the Huxon Labs commerce engine · last sync 2 min ago"
        action={
          <Button variant="outline" size="sm" onClick={() => toast.success("Dashboard refreshed", { description: "Latest metrics loaded." })}>
            <IconRefresh size={14} />
            Refresh
          </Button>
        }
      />

      {/* Top KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Revenue Today"
          value={KPI.revenueToday}
          prefix="₹"
          trend={12.4}
          sub="vs yesterday"
          icon={<IconRupee size={16} />}
        />
        <StatCard
          label="Orders Today"
          value={KPI.ordersToday}
          trend={8.1}
          sub="vs yesterday"
          icon={<IconPackage size={16} />}
        />
        <StatCard
          label="Conversion Rate"
          value={KPI.conversion}
          trend={0.6}
          suffix="%"
          decimals={2}
          sub="sessions → orders"
          icon={<IconTarget size={16} />}
        />
        <StatCard
          label="Avg Order Value"
          value={KPI.aov}
          prefix="₹"
          trend={-2.3}
          sub="vs last week"
          icon={<IconChartBar size={16} />}
        />
      </div>

      {/* Second KPI row */}
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          label="Revenue This Week"
          value={KPI.revenueWeek}
          prefix="₹"
          trend={14.2}
          sub="vs prev week"
        />
        <StatCard
          label="Revenue This Month"
          value={KPI.revenueMonth}
          prefix="₹"
          trend={9.8}
          sub="vs last month"
        />
        <StatCard
          label="Orders This Month"
          value={KPI.ordersMonth}
          trend={11.5}
          sub="vs last month"
        />
      </div>

      {/* Charts row */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueBarChart />
        </div>
        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-text-gold">
                Distribution
              </div>
              <h3 className="mt-1 font-display text-lg font-semibold">Order Status</h3>
            </div>
            <IconTruck size={18} className="text-text-gold" />
          </div>
          <StatusDonut />
        </GlassCard>
      </div>

      {/* Top products row */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <GlassCard className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-text-gold">
                Best Sellers
              </div>
              <h3 className="mt-1 font-display text-lg font-semibold">Top 5 by Revenue</h3>
            </div>
            <Badge variant="outline" className="border-border/60 text-muted-foreground">
              Last 30d
            </Badge>
          </div>
          <div className="space-y-3">
            {TOP_PRODUCTS.map((p, i) => {
              const max = TOP_PRODUCTS[0].revenue;
              const pct = (p.revenue / max) * 100;
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[oklch(0.78_0.13_75_/_0.12)] text-[12px] font-semibold text-text-gold">
                    {i + 1}
                  </span>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{p.name}</span>
                      <span className="shrink-0 text-sm font-semibold tabular text-text-gold">
                        {formatINR(p.revenue)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[oklch(var(--glass-tint)/0.08)]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[oklch(0.62_0.10_55)] to-[oklch(0.92_0.10_85)]"
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground tabular">
                        {p.units} units
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-gold">
              Live Signals
            </div>
            <h3 className="mt-1 font-display text-lg font-semibold">Right Now</h3>
          </div>
          <div className="space-y-3">
            <SignalRow icon={<IconUsers size={14} />} label="Active sessions" value="247" tone="gold" />
            <SignalRow icon={<IconPackage size={14} />} label="Orders pending pack" value="9" tone="amber" />
            <SignalRow icon={<IconTruck size={14} />} label="Out for delivery" value="6" tone="jade" />
            <SignalRow icon={<IconFlame size={14} />} label="Flash sale burning" value="178 / 250" tone="red" />
            <SignalRow icon={<IconGift size={14} />} label="Coupons redeemed today" value="84" tone="gold" />
          </div>
          <div className="mt-5 rounded-xl border border-border/50 bg-[oklch(0.78_0.13_75_/_0.06)] p-3">
            <div className="flex items-center gap-2 text-[11px] text-text-gold">
              <IconSpark size={12} />
              <span className="font-medium uppercase tracking-[0.16em]">Insight</span>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-foreground/80">
              Saturday revenue peaked at <strong className="text-text-gold">{formatINR(342100)}</strong> — 17% above the trailing 6-day average. Consider boosting ad spend on weekends.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function SignalRow({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "gold" | "amber" | "jade" | "red";
}) {
  const tones = {
    gold: "text-text-gold bg-[oklch(0.78_0.13_75_/_0.1)]",
    amber: "text-text-accent-amber bg-[oklch(0.72_0.10_55_/_0.1)]",
    jade: "text-text-accent-jade bg-[oklch(0.62_0.10_160_/_0.1)]",
    red: "text-[oklch(0.72_0.18_25)] bg-[oklch(0.62_0.20_25_/_0.1)]",
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className={cn("grid h-7 w-7 place-items-center rounded-md", tones[tone])}>
          {icon}
        </span>
        <span className="text-[12px] text-muted-foreground">{label}</span>
      </div>
      <span className="text-[13px] font-semibold tabular">{value}</span>
    </div>
  );
}

/* ============================================================
   Products Section
   ============================================================ */
function ProductsSection() {
  const [query, setQuery] = React.useState("");
  const [cat, setCat] = React.useState<"all" | "protein" | "supplement" | "snack" | "performance">("all");

  const cats = [
    { id: "all" as const, label: "All" },
    { id: "protein" as const, label: "Protein" },
    { id: "supplement" as const, label: "Supplements" },
    { id: "snack" as const, label: "Snacks" },
    { id: "performance" as const, label: "Performance" },
  ];

  const filtered = PRODUCTS.filter((p) => {
    const matchesCat = cat === "all" || p.category === cat;
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.tagline.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div>
      <SectionHeader
        kicker="Catalog"
        title="Product Management"
        subtitle={`${PRODUCTS.length} products · ${PRODUCTS.filter((p) => p.inStock).length} in stock`}
        action={
          <Button size="sm" onClick={() => toast.success("New product draft created", { description: "Opening the product editor…" })}>
            <IconPlus size={14} />
            Add Product
          </Button>
        }
      />

      <GlassCard className="mb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {cats.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors",
                  cat === c.id
                    ? "border-[oklch(0.78_0.13_75_/_0.4)] bg-[oklch(0.78_0.13_75_/_0.12)] text-text-gold"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Bulk actions bar */}
      {filtered.length > 0 && (
        <div className="mb-3 flex items-center justify-between rounded-xl border border-border/40 px-3 py-2">
          <span className="text-[11px] text-muted-foreground">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} shown
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px]"
              onClick={() => {
                const csv = ["Name,Category,Price,Rating,Stock"];
                filtered.forEach((p) => {
                  csv.push(`"${p.name}","${p.category}",${p.price},${p.rating},${p.inStock ? "In Stock" : "Out"}`);
                });
                const blob = new Blob([csv.join("\n")], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "huxon-products.csv";
                a.click();
                toast.success("Products exported", { description: `${filtered.length} products downloaded as CSV` });
              }}
            >
              <IconArrowRight size={12} className="mr-1" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => toast.info("Bulk edit mode", { description: "Select products to edit in bulk" })}>
              Bulk Edit
            </Button>
          </div>
        </div>
      )}

      <GlassCard className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="pl-5 w-8">
                <input type="checkbox" className="h-4 w-4 rounded border-border accent-[oklch(var(--gold))]" onChange={(e) => toast.info(e.target.checked ? "All selected" : "Selection cleared")} />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right pr-5">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id} className="border-border/40 group">
                <TableCell className="pl-5 w-8">
                  <input type="checkbox" className="h-4 w-4 rounded border-border accent-[oklch(var(--gold))]" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 py-2">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-[oklch(var(--glass-tint)/0.04)]">
                      <img
                        src={p.heroImage}
                        alt={p.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.opacity = "0";
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{p.name}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{p.flavor}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-border/60 capitalize text-muted-foreground">
                    {p.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-semibold tabular">{formatINR(p.price)}</div>
                  <div className="text-[10px] text-muted-foreground line-through tabular">{formatINR(p.mrp)}</div>
                </TableCell>
                <TableCell>
                  {p.inStock ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-text-accent-jade">
                      <span className="h-1.5 w-1.5 rounded-full bg-text-accent-jade" />
                      In stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[oklch(0.72_0.18_25)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.18_25)]" />
                      Out
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <IconStar size={12} active />
                    <span className="text-[12px] font-medium tabular">{p.rating.toFixed(1)}</span>
                    <span className="text-[11px] text-muted-foreground tabular">
                      ({p.reviewCount.toLocaleString("en-IN")})
                    </span>
                  </div>
                </TableCell>
                <TableCell className="pr-5">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toast.info(`Viewing ${p.name}`, { description: "Product analytics opened." })}
                    >
                      <IconEye size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toast.info(`Editing ${p.name}`, { description: "Product editor opened." })}
                    >
                      <IconEdit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-[oklch(0.72_0.18_25)]"
                      onClick={() => toast.error(`Delete ${p.name}?`, { description: "This action requires confirmation." })}
                    >
                      <IconTrash size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                  No products match your filters.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </GlassCard>
    </div>
  );
}

/* ============================================================
   Orders Section
   ============================================================ */
function OrdersSection() {
  const [filter, setFilter] = React.useState<"all" | OrderStatus>("all");
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const filters: { id: "all" | OrderStatus; label: string }[] = [
    { id: "all", label: "All" },
    { id: "placed", label: "Placed" },
    { id: "packed", label: "Packed" },
    { id: "shipped", label: "Shipped" },
    { id: "out_for_delivery", label: "Out for Delivery" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const filtered = filter === "all" ? MOCK_ORDERS : MOCK_ORDERS.filter((o) => o.status === filter);

  return (
    <div>
      <SectionHeader
        kicker="Fulfilment"
        title="Order Management"
        subtitle={`${MOCK_ORDERS.length} orders · ${MOCK_ORDERS.filter((o) => o.status !== "delivered" && o.status !== "cancelled").length} active`}
        action={
          <Button variant="outline" size="sm" onClick={() => toast.success("Orders exported", { description: "CSV download started." })}>
            <IconArrowUpRight size={14} />
            Export
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {filters.map((f) => {
          const count = f.id === "all" ? MOCK_ORDERS.length : MOCK_ORDERS.filter((o) => o.status === f.id).length;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors",
                filter === f.id
                  ? "border-[oklch(0.78_0.13_75_/_0.4)] bg-[oklch(0.78_0.13_75_/_0.12)] text-text-gold"
                  : "border-border/60 text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
              <span className="rounded-full bg-[oklch(var(--glass-tint)/0.1)] px-1.5 text-[10px] tabular">{count}</span>
            </button>
          );
        })}
      </div>

      <GlassCard className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="pl-5">Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="pr-5" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((o) => (
              <React.Fragment key={o.id}>
                <TableRow
                  className="cursor-pointer border-border/40"
                  onClick={() => setExpanded((p) => (p === o.id ? null : o.id))}
                >
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-2">
                      <IconChevronDown
                        size={14}
                        className={cn(
                          "text-muted-foreground transition-transform",
                          expanded === o.id && "rotate-180 text-text-gold"
                        )}
                      />
                      <span className="font-mono text-[12px] font-semibold text-text-gold">{o.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{o.customer}</div>
                    <div className="text-[11px] text-muted-foreground">{o.city} · {o.channel}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm tabular">{o.items}</span>
                    <span className="text-[11px] text-muted-foreground"> item{o.items > 1 ? "s" : ""}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold tabular">{formatINR(o.total)}</span>
                  </TableCell>
                  <TableCell><StatusBadge status={o.status} /></TableCell>
                  <TableCell>
                    <span className="text-[12px] text-muted-foreground">{o.date}</span>
                  </TableCell>
                  <TableCell className="pr-5">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <IconDots size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
                {expanded === o.id ? (
                  <TableRow className="border-border/40 bg-[oklch(var(--glass-tint)/0.02)]">
                    <TableCell colSpan={7} className="py-5 pl-5 pr-5">
                      <OrderDetail order={o} />
                    </TableCell>
                  </TableRow>
                ) : null}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </GlassCard>
    </div>
  );
}

function OrderDetail({ order }: { order: (typeof MOCK_ORDERS)[number] }) {
  const items = PRODUCTS.slice(0, order.items).map((p) => ({ name: p.name, qty: 1, price: p.price, image: p.heroImage, flavor: p.flavor }));
  const stages: OrderStatus[] = ["placed", "packed", "shipped", "out_for_delivery", "delivered"];
  const currentIdx = stages.indexOf(order.status);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="grid grid-cols-1 gap-5 lg:grid-cols-3"
    >
      <div className="lg:col-span-2">
        <div className="mb-3 text-[10px] uppercase tracking-[0.2em] text-text-gold">Items</div>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 bg-[oklch(var(--glass-tint)/0.03)] p-2.5">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border/60 bg-[oklch(var(--glass-tint)/0.04)]">
                <img src={it.image} alt={it.name} className="h-full w-full object-cover" onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0")} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{it.name}</div>
                <div className="text-[11px] text-muted-foreground">{it.flavor} · Qty {it.qty}</div>
              </div>
              <span className="text-sm font-semibold tabular">{formatINR(it.price)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between rounded-lg border border-border/50 px-3 py-2.5">
          <span className="text-[12px] text-muted-foreground">Order Total</span>
          <span className="font-display text-lg font-semibold text-text-gold">{formatINR(order.total)}</span>
        </div>
      </div>

      <div>
        <div className="mb-3 text-[10px] uppercase tracking-[0.2em] text-text-gold">Fulfilment Timeline</div>
        <div className="space-y-0">
          {stages.map((s, i) => {
            const done = i <= currentIdx && order.status !== "cancelled";
            return (
              <div key={s} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "grid h-6 w-6 place-items-center rounded-full border-2 transition-colors",
                      done
                        ? "border-[oklch(0.78_0.13_75)] bg-[oklch(0.78_0.13_75_/_0.15)] text-text-gold"
                        : "border-border/60 text-muted-foreground"
                    )}
                  >
                    {done ? <IconCheck size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />}
                  </div>
                  {i < stages.length - 1 ? (
                    <div className={cn("h-8 w-0.5", done ? "bg-[oklch(0.78_0.13_75_/_0.4)]" : "bg-border/60")} />
                  ) : null}
                </div>
                <div className="pt-0.5">
                  <div className={cn("text-[12px] font-medium", done ? "text-foreground" : "text-muted-foreground")}>
                    {STATUS_META[s].label}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {done ? "Marked complete" : "Pending"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Tracking link copied", { description: order.id })}>
            <IconTruck size={12} />
            Track
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.info("Refund flow opened")}>
            Refund
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   Customers Section
   ============================================================ */
function CustomersSection() {
  return (
    <div>
      <SectionHeader
        kicker="CRM"
        title="Customer Analytics"
        subtitle="Acquisition, retention and lifetime value across the Huxon member base"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Customers" value={KPI.customers} trend={6.4} sub="all time" icon={<IconUsers size={16} />} />
        <StatCard label="New This Week" value={KPI.newThisWeek} trend={18.2} sub="vs last week" icon={<IconSpark size={16} />} />
        <StatCard label="Retention Rate" value={KPI.retention} suffix="%" decimals={1} trend={2.1} sub="90-day" icon={<IconRefresh size={16} />} />
        <StatCard label="Avg LTV" value={KPI.avgLtv} prefix="₹" trend={4.7} sub="per customer" icon={<IconCrown size={16} />} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <GlassCard className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-text-gold">Acquisition</div>
              <h3 className="mt-1 font-display text-lg font-semibold">New Customers · 7 Days</h3>
            </div>
            <div className="text-right">
              <div className="font-display text-xl font-semibold text-gold-gradient">
                <AnimatedNumber value={CUSTOMER_ACQUISITION_7D.reduce((s, d) => s + d.new, 0)} />
              </div>
              <div className="text-[11px] text-muted-foreground">Total · 7d</div>
            </div>
          </div>
          <AcquisitionChart />
        </GlassCard>

        <GlassCard>
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-gold">Tier Distribution</div>
            <h3 className="mt-1 font-display text-lg font-semibold">Loyalty Program</h3>
          </div>
          <div className="space-y-3">
            {TIER_DIST.map((t) => (
              <div key={t.tier}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                    <span className="text-[12px] font-medium">{t.tier}</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[12px] font-semibold tabular">{t.count.toLocaleString("en-IN")}</span>
                    <span className="text-[10px] text-muted-foreground tabular">{t.pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[oklch(var(--glass-tint)/0.08)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${t.pct}%` }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: t.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mt-4 p-0">
        <div className="flex items-center justify-between p-5 pb-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-gold">Top Spenders</div>
            <h3 className="mt-1 font-display text-lg font-semibold">Customers by Lifetime Value</h3>
          </div>
          <Badge variant="outline" className="border-border/60 text-muted-foreground">All time</Badge>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="pl-5">Customer</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead className="text-right pr-5">Lifetime Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TOP_CUSTOMERS.map((c) => (
              <TableRow key={c.email} className="border-border/40">
                <TableCell className="pl-5">
                  <div className="flex items-center gap-3 py-1">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[oklch(0.78_0.13_75_/_0.12)] text-[12px] font-semibold text-text-gold">
                      {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                    <div>
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-[11px] text-muted-foreground">{c.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell><span className="text-[12px] text-muted-foreground">{c.city}</span></TableCell>
                <TableCell><span className="text-sm tabular">{c.orders}</span></TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      c.tier === "platinum" && "border-[oklch(0.72_0.18_200_/_0.4)] text-[oklch(0.72_0.18_200)]",
                      c.tier === "gold" && "border-[oklch(0.78_0.13_75_/_0.4)] text-text-gold",
                      c.tier === "silver" && "border-[oklch(0.70_0.02_80_/_0.4)] text-[oklch(0.70_0.02_80)]",
                      c.tier === "bronze" && "border-[oklch(0.55_0.06_50_/_0.4)] text-[oklch(0.55_0.06_50)]"
                    )}
                  >
                    {c.tier}
                  </Badge>
                </TableCell>
                <TableCell className="pr-5 text-right">
                  <span className="text-sm font-semibold tabular text-text-gold">{formatINR(c.ltv)}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GlassCard>
    </div>
  );
}

/* ============================================================
   Inventory Section
   ============================================================ */
function InventorySection() {
  const totalUnits = STOCK_LEVELS.reduce((s, p) => s + p.stock, 0);
  const stockValue = STOCK_LEVELS.reduce((s, p) => s + p.stock * p.price, 0);
  const lowStock = STOCK_LEVELS.filter((p) => p.stock <= p.reorderAt);

  return (
    <div>
      <SectionHeader
        kicker="Warehouse"
        title="Inventory Dashboard"
        subtitle="Stock levels, valuation and reorder signals across the Bengaluru DC-1 warehouse"
        action={
          <Button variant="outline" size="sm" onClick={() => toast.success("Reorder list generated", { description: `${lowStock.length} SKIs flagged for reorder.` })}>
            <IconPackage size={14} />
            Generate PO
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Units" value={totalUnits} sub="across SKUs" icon={<IconPackage size={16} />} />
        <StatCard label="Stock Value" value={stockValue} prefix="₹" sub="at cost" icon={<IconRupee size={16} />} />
        <StatCard label="Low Stock SKUs" value={lowStock.length} sub="need reorder" icon={<IconBolt size={16} />} />
        <StatCard label="Active SKUs" value={STOCK_LEVELS.length} sub="all in stock" icon={<IconFlask size={16} />} />
      </div>

      {lowStock.length > 0 ? (
        <GlassCard className="mt-4 border-[oklch(0.72_0.10_55_/_0.3)] bg-[oklch(0.72_0.10_55_/_0.05)]">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[oklch(0.62_0.20_25_/_0.15)] text-[oklch(0.72_0.18_25)]">
              <IconBolt size={16} />
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-semibold">Low-stock alerts</h3>
                <Badge className="bg-[oklch(0.62_0.20_25_/_0.2)] text-[oklch(0.72_0.18_25)] border-transparent">
                  {lowStock.length} SKUs
                </Badge>
              </div>
              <p className="mt-1 text-[12px] text-muted-foreground">
                These products have stock at or below their reorder threshold. Generate a purchase order to avoid stockouts.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {lowStock.map((p) => (
                  <span key={p.id} className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.62_0.20_25_/_0.3)] bg-[oklch(0.62_0.20_25_/_0.08)] px-2.5 py-1 text-[11px] text-[oklch(0.72_0.18_25)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.18_25)]" />
                    {p.name} · {p.stock} left
                  </span>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      ) : null}

      <GlassCard className="mt-4 p-0">
        <div className="flex items-center justify-between p-5 pb-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-gold">Stock Levels</div>
            <h3 className="mt-1 font-display text-lg font-semibold">Per-SKU Inventory</h3>
          </div>
          <Badge variant="outline" className="border-border/60 text-muted-foreground">Bengaluru DC-1</Badge>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="pl-5">Product</TableHead>
              <TableHead>In Stock</TableHead>
              <TableHead className="w-[280px]">Level</TableHead>
              <TableHead>Reorder At</TableHead>
              <TableHead>Suggested Order</TableHead>
              <TableHead className="pr-5 text-right">Stock Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {STOCK_LEVELS.map((p) => {
              const pct = Math.min(100, (p.stock / 100) * 100);
              const low = p.stock <= p.reorderAt;
              const critical = p.stock <= 10;
              const reorder = Math.max(50, p.reorderAt * 2 - p.stock);
              return (
                <TableRow key={p.id} className="border-border/40">
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3 py-1">
                      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md border border-border/60 bg-[oklch(var(--glass-tint)/0.04)]">
                        <img src={p.heroImage} alt={p.name} className="h-full w-full object-cover" onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0")} />
                      </div>
                      <div className="text-sm font-medium">{p.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn("text-sm font-semibold tabular", critical ? "text-[oklch(0.72_0.18_25)]" : low ? "text-text-accent-amber" : "text-foreground")}>
                      {p.stock}
                    </span>
                    <span className="text-[11px] text-muted-foreground"> units</span>
                  </TableCell>
                  <TableCell>
                    <div className="h-2 overflow-hidden rounded-full bg-[oklch(var(--glass-tint)/0.08)]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          "h-full rounded-full",
                          critical
                            ? "bg-gradient-to-r from-[oklch(0.62_0.20_25)] to-[oklch(0.72_0.18_25)]"
                            : low
                            ? "bg-gradient-to-r from-[oklch(0.70_0.10_55)] to-[oklch(0.82_0.10_65)]"
                            : "bg-gradient-to-r from-[oklch(0.62_0.10_55)] to-[oklch(0.92_0.10_85)]"
                        )}
                      />
                    </div>
                  </TableCell>
                  <TableCell><span className="text-[12px] tabular text-muted-foreground">{p.reorderAt}</span></TableCell>
                  <TableCell>
                    {low ? (
                      <span className="inline-flex items-center gap-1 rounded-md border border-[oklch(0.78_0.13_75_/_0.3)] bg-[oklch(0.78_0.13_75_/_0.08)] px-2 py-0.5 text-[11px] font-medium text-text-gold">
                        <IconArrowUpRight size={11} />
                        {reorder} units
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <span className="text-sm font-semibold tabular">{formatINR(p.stock * p.price)}</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </GlassCard>
    </div>
  );
}

/* ============================================================
   Marketing Section
   ============================================================ */
function MarketingSection() {
  return (
    <div>
      <SectionHeader
        kicker="Growth"
        title="Marketing & Coupons"
        subtitle="Coupon performance, flash sale burn-down and campaign ROI"
        action={
          <Button size="sm" onClick={() => toast.success("Coupon draft created", { description: "Configure discount and limits to publish." })}>
            <IconPlus size={14} />
            New Coupon
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active Coupons" value={COUPONS.filter((c) => c.status === "active").length} sub="redeemable now" icon={<IconTag size={16} />} />
        <StatCard label="Redemptions" value={COUPONS.reduce((s, c) => s + c.used, 0)} trend={14.8} sub="all time" icon={<IconGift size={16} />} />
        <StatCard label="Coupon Revenue" value={COUPONS.reduce((s, c) => s + c.revenue, 0)} prefix="₹" trend={9.2} sub="attributed" icon={<IconRupee size={16} />} />
        <StatCard label="Active Flash Sales" value={FLASH_SALES.filter((f) => f.active).length} sub="running now" icon={<IconFlame size={16} />} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Coupons table */}
        <GlassCard className="p-0 xl:col-span-2">
          <div className="flex items-center justify-between p-5 pb-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-text-gold">Promo Codes</div>
              <h3 className="mt-1 font-display text-lg font-semibold">Active Coupons</h3>
            </div>
            <IconTag size={18} className="text-text-gold" />
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="pl-5">Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Revenue Impact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {COUPONS.map((c) => {
                const pct = Math.min(100, (c.used / c.limit) * 100);
                return (
                  <TableRow key={c.code} className="border-border/40">
                    <TableCell className="pl-5">
                      <span className="rounded-md border border-dashed border-[oklch(0.78_0.13_75_/_0.4)] bg-[oklch(0.78_0.13_75_/_0.06)] px-2 py-1 font-mono text-[12px] font-semibold text-text-gold">
                        {c.code}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {c.type === "percent" ? `${c.value}% off` : c.type === "flat" ? `${formatINR(c.value)} off` : "Free shipping"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[12px] font-semibold tabular">{c.used.toLocaleString("en-IN")}</span>
                          <span className="text-[10px] text-muted-foreground tabular">/ {c.limit.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="h-1 w-24 overflow-hidden rounded-full bg-[oklch(var(--glass-tint)/0.08)]">
                          <div className="h-full rounded-full bg-gradient-to-r from-[oklch(0.62_0.10_55)] to-[oklch(0.92_0.10_85)]" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {c.revenue > 0 ? (
                        <span className="text-sm font-semibold tabular text-text-gold">{formatINR(c.revenue)}</span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {c.status === "active" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.62_0.10_160_/_0.14)] px-2.5 py-1 text-[11px] font-medium text-text-accent-jade">
                          <span className="h-1.5 w-1.5 rounded-full bg-text-accent-jade" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.72_0.10_55_/_0.14)] px-2.5 py-1 text-[11px] font-medium text-text-accent-amber">
                          <span className="h-1.5 w-1.5 rounded-full bg-text-accent-amber" /> Ending Soon
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="pr-5">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`Editing ${c.code}`)}>
                        <IconEdit size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </GlassCard>

        {/* Flash Sales */}
        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-text-gold">Live Promotions</div>
              <h3 className="mt-1 font-display text-lg font-semibold">Flash Sales</h3>
            </div>
            <IconFlame size={18} className="text-[oklch(0.72_0.18_25)]" />
          </div>
          <div className="space-y-3">
            {FLASH_SALES.map((f) => {
              const pct = Math.min(100, (f.sold / f.target) * 100);
              return (
                <div key={f.name} className="rounded-xl border border-border/50 bg-[oklch(var(--glass-tint)/0.03)] p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{f.name}</span>
                        {f.active ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.62_0.20_25_/_0.15)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[oklch(0.72_0.18_25)]">
                            <span className="h-1 w-1 animate-pulse rounded-full bg-[oklch(0.72_0.18_25)]" />
                            Live
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{f.product}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg font-semibold text-text-gold">-{f.discount}%</div>
                      <div className={cn("text-[10px] font-medium tabular", f.active ? "text-[oklch(0.72_0.18_25)]" : "text-muted-foreground")}>
                        <IconClock size={9} className="mr-0.5 inline" />
                        {f.endsIn}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{f.sold} sold</span>
                      <span>{f.target} target</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[oklch(var(--glass-tint)/0.08)]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          "h-full rounded-full",
                          f.active
                            ? "bg-gradient-to-r from-[oklch(0.62_0.20_25)] to-[oklch(0.82_0.10_65)]"
                            : "bg-[oklch(var(--glass-tint)/0.18)]"
                        )}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Campaign Performance */}
        <GlassCard className="p-0">
          <div className="flex items-center justify-between p-5 pb-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-text-gold">Marketing</div>
              <h3 className="mt-1 font-display text-lg font-semibold">Campaign Performance</h3>
            </div>
            <IconTarget size={18} className="text-text-gold" />
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="pl-5">Campaign</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Reach</TableHead>
                <TableHead>Conv.</TableHead>
                <TableHead className="text-right pr-5">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CAMPAIGNS.map((c) => (
                <TableRow key={c.name} className="border-border/40">
                  <TableCell className="pl-5">
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="mt-0.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                          c.status === "active" && "bg-[oklch(0.62_0.10_160_/_0.14)] text-text-accent-jade",
                          c.status === "completed" && "bg-[oklch(var(--glass-tint)/0.08)] text-muted-foreground",
                          c.status === "scheduled" && "bg-[oklch(0.78_0.13_75_/_0.14)] text-text-gold"
                        )}
                      >
                        {c.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-[11px] text-muted-foreground">{c.channel}</span></TableCell>
                  <TableCell><span className="text-[12px] tabular">{c.reach.toLocaleString("en-IN")}</span></TableCell>
                  <TableCell><span className="text-[12px] tabular">{c.conversions.toLocaleString("en-IN")}</span></TableCell>
                  <TableCell className="pr-5 text-right"><span className="text-sm font-semibold tabular text-text-gold">{formatINR(c.revenue)}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GlassCard>
      </div>
    </div>
  );
}

/* ============================================================
   Settings Section
   ============================================================ */
function SettingsSection() {
  const { socialProofInterval, setSocialProofInterval, socialProofEnabled, setSocialProofEnabled } = useSettings();

  return (
    <div>
      <SectionHeader
        kicker="Configuration"
        title="Admin Settings"
        subtitle="Workspace preferences, security and integrations"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-gold">Workspace</div>
            <h3 className="mt-1 font-display text-lg font-semibold">Store Profile</h3>
          </div>
          <div className="space-y-3">
            <SettingRow label="Store name" value="Dr. Huxon Labs" />
            <SettingRow label="Default currency" value="INR (₹)" />
            <SettingRow label="Timezone" value="Asia/Kolkata (IST)" />
            <SettingRow label="Primary warehouse" value="Bengaluru DC-1" />
            <SettingRow label="Tax mode" value="GST inclusive · 18%" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-gold">Security</div>
            <h3 className="mt-1 font-display text-lg font-semibold">Access Control</h3>
          </div>
          <div className="space-y-3">
            <SettingRow label="Two-factor auth" value="Enabled · TOTP" tone="jade" />
            <SettingRow label="Session timeout" value="30 minutes" />
            <SettingRow label="Last login" value="Today · 09:14 IST" />
            <SettingRow label="Active sessions" value="2 devices" />
            <SettingRow label="API key rotation" value="14 days ago" tone="amber" />
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => toast.info("Security audit opened")}>
            <IconCheck size={14} />
            Run security audit
          </Button>
        </GlassCard>

        <GlassCard>
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-gold">Notifications</div>
            <h3 className="mt-1 font-display text-lg font-semibold">Alerts</h3>
          </div>
          <div className="space-y-3">
            <ToggleRow label="Low-stock alerts" enabled />
            <ToggleRow label="New order notifications" enabled />
            <ToggleRow label="Daily revenue digest" enabled />
            <ToggleRow label="Coupon usage thresholds" enabled={false} />
            <ToggleRow label="Review velocity alerts" enabled />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-gold">Integrations</div>
            <h3 className="mt-1 font-display text-lg font-semibold">Connected Services</h3>
          </div>
          <div className="space-y-3">
            <IntegrationRow name="Delhivery" desc="Shipping & fulfilment" status="connected" />
            <IntegrationRow name="Razorpay" desc="Payments & refunds" status="connected" />
            <IntegrationRow name="Appwrite" desc="Backend data layer" status="connected" />
            <IntegrationRow name="Meta Ads" desc="Marketing attribution" status="disconnected" />
            <IntegrationRow name="WhatsApp Business" desc="Transactional messaging" status="connected" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-gold">CRO & Popups</div>
            <h3 className="mt-1 font-display text-lg font-semibold">Social Proof Popups</h3>
          </div>
          <div className="space-y-4">
            <ToggleRow
              label="Enable Social Proof Toast"
              enabled={socialProofEnabled}
              onChange={setSocialProofEnabled}
            />
            <div>
              <div className="mb-1.5 flex justify-between text-[12px] text-muted-foreground">
                <span>Display Interval</span>
                <span className="font-semibold text-text-gold">{socialProofInterval} seconds</span>
              </div>
              <input
                type="range"
                min={5}
                max={120}
                step={5}
                value={socialProofInterval}
                onChange={(e) => setSocialProofInterval(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[oklch(var(--glass-tint)/0.1)] accent-[oklch(0.78_0.13_75)]"
              />
              <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
                <span>5s</span>
                <span>30s</span>
                <span>60s</span>
                <span>120s</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function SettingRow({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "jade" | "amber" }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-[oklch(var(--glass-tint)/0.03)] px-3 py-2.5">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-[12px] font-medium",
          tone === "jade" && "text-text-accent-jade",
          tone === "amber" && "text-text-accent-amber",
          tone === "default" && "text-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
}

function ToggleRow({
  label,
  enabled: propEnabled,
  onChange,
}: {
  label: string;
  enabled: boolean;
  onChange?: (v: boolean) => void;
}) {
  const [localOn, setLocalOn] = React.useState(propEnabled);
  const isControlled = onChange !== undefined;
  const on = isControlled ? propEnabled : localOn;

  const handleToggle = () => {
    if (isControlled) {
      onChange(!propEnabled);
    } else {
      setLocalOn(!localOn);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-[oklch(var(--glass-tint)/0.03)] px-3 py-2.5">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <button
        onClick={handleToggle}
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors",
          on ? "bg-[oklch(0.78_0.13_75)]" : "bg-[oklch(var(--glass-tint)/0.18)]"
        )}
        role="switch"
        aria-checked={on}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm",
            on ? "left-[18px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}

function IntegrationRow({ name, desc, status }: { name: string; desc: string; status: "connected" | "disconnected" }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-[oklch(var(--glass-tint)/0.03)] px-3 py-2.5">
      <div>
        <div className="text-[12px] font-medium">{name}</div>
        <div className="text-[10px] text-muted-foreground">{desc}</div>
      </div>
      {status === "connected" ? (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-text-accent-jade">
          <span className="h-1.5 w-1.5 rounded-full bg-text-accent-jade" />
          Connected
        </span>
      ) : (
        <Button size="sm" variant="outline" className="h-7 px-2.5 text-[11px]" onClick={() => toast.info(`Connecting ${name}…`)}>
          Connect
        </Button>
      )}
    </div>
  );
}

/* ============================================================
   Shared helpers for new admin sections
   ============================================================ */
function KpiCard({ label, value, trend, up }: { label: string; value: string; trend?: string; up?: boolean }) {
  return (
    <GlassCard>
      <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1.5 font-display text-[22px] font-bold text-cream-gradient tabular">
        {value}
      </div>
      {trend ? (
        <div className={`mt-1 flex items-center gap-1 text-[10px] font-semibold ${up ? "text-text-accent-jade" : "text-[oklch(0.72_0.18_25)]"}`}>
          <span>{up ? "↑" : "↓"}</span>
          {trend}
        </div>
      ) : null}
    </GlassCard>
  );
}

function AdminCardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h3 className="font-display text-[16px] font-semibold text-cream-gradient">{title}</h3>
      {subtitle ? <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}

function AdminCardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

/* ============================================================
   Analytics Section — Traffic, conversion funnels, sources
   ============================================================ */
function AnalyticsSection() {
  const trafficSources = [
    { source: "Direct", visitors: 4820, pct: 32, color: "oklch(0.78 0.13 75)" },
    { source: "Google Organic", visitors: 3640, pct: 24, color: "oklch(0.62 0.10 160)" },
    { source: "Instagram", visitors: 2180, pct: 14, color: "oklch(0.62 0.20 350)" },
    { source: "WhatsApp", visitors: 1950, pct: 13, color: "oklch(0.62 0.18 145)" },
    { source: "Referral", visitors: 1240, pct: 8, color: "oklch(0.65 0.15 30)" },
    { source: "Paid Ads", visitors: 1290, pct: 9, color: "oklch(0.55 0.08 280)" },
  ];

  const funnel = [
    { stage: "Visitors", count: 15120, pct: 100 },
    { stage: "Product views", count: 8940, pct: 59 },
    { stage: "Added to cart", count: 3210, pct: 21 },
    { stage: "Checkout started", count: 1820, pct: 12 },
    { stage: "Order placed", count: 1240, pct: 8.2 },
  ];

  return (
    <div>
      <SectionHeader title="Analytics" subtitle="Traffic, conversion funnel & visitor insights" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total visitors", value: "15,120", trend: "+12.4%", up: true },
          { label: "Page views", value: "48,320", trend: "+8.1%", up: true },
          { label: "Bounce rate", value: "32.4%", trend: "-2.1%", up: true },
          { label: "Avg session", value: "4m 12s", trend: "+0.8%", up: true },
        ].map((kpi) => (
          <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} trend={kpi.trend} up={kpi.up} />
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {/* Traffic sources */}
        <Card>
          <AdminCardHeader title="Traffic Sources" subtitle="Last 30 days" />
          <AdminCardContent>
            <div className="space-y-3">
              {trafficSources.map((src) => (
                <div key={src.source} className="flex items-center gap-3">
                  <span className="w-28 text-[12px] text-muted-foreground">{src.source}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[oklch(var(--glass-tint)/0.06)]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: src.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${src.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <span className="w-16 text-right text-[11px] font-semibold tabular">{src.visitors.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </AdminCardContent>
        </Card>

        {/* Conversion funnel */}
        <Card>
          <AdminCardHeader title="Conversion Funnel" subtitle="Visitor → Order" />
          <AdminCardContent>
            <div className="space-y-2">
              {funnel.map((f, i) => (
                <div key={f.stage} className="flex items-center gap-3">
                  <span className="w-24 text-[11px] text-muted-foreground">{f.stage}</span>
                  <div className="flex-1">
                    <div className="h-7 overflow-hidden rounded-lg bg-[oklch(var(--glass-tint)/0.04)]">
                      <motion.div
                        className="flex h-full items-center justify-end rounded-lg px-2"
                        style={{
                          background: `linear-gradient(90deg, oklch(var(--gold)/0.3), oklch(var(--gold)/0.1))`,
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${f.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      >
                        <span className="text-[10px] font-bold text-text-gold">{f.pct}%</span>
                      </motion.div>
                    </div>
                  </div>
                  <span className="w-16 text-right text-[11px] font-semibold tabular">{f.count.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-[oklch(var(--gold)/0.06)] p-2.5 text-[11px]">
              <span className="font-semibold text-text-gold">Overall conversion:</span>{" "}
              <span className="font-bold">8.2%</span>
              <span className="ml-2 text-[oklch(var(--jade))]">+0.6% vs last month</span>
            </div>
          </AdminCardContent>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   Returns Section — Return/refund management
   ============================================================ */
function ReturnsSection() {
  const returns = [
    { id: "RET-001", order: "HUX-48291", customer: "Arjun Mehta", reason: "Wrong flavor", status: "pending", amount: 2499, date: "2h ago" },
    { id: "RET-002", order: "HUX-47820", customer: "Priya Sharma", reason: "Damaged packaging", status: "approved", amount: 2199, date: "5h ago" },
    { id: "RET-003", order: "HUX-47012", customer: "Rohan Kapoor", reason: "Not satisfied", status: "refunded", amount: 1299, date: "1d ago" },
    { id: "RET-004", order: "HUX-46890", customer: "Sneha Iyer", reason: "Expired product", status: "rejected", amount: 999, date: "2d ago" },
  ];

  const statusColors: Record<string, string> = {
    pending: "oklch(0.72 0.15 65)",
    approved: "oklch(0.62 0.10 160)",
    refunded: "oklch(0.55 0.08 280)",
    rejected: "oklch(0.72 0.18 25)",
  };

  return (
    <div>
      <SectionHeader title="Returns & Refunds" subtitle="Manage return requests and refunds" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Pending returns" value="3" trend="2 new" up={false} />
        <KpiCard label="Approved today" value="5" trend="+2" up={true} />
        <KpiCard label="Refunded (₹)" value="12,497" trend="+8.2%" up={false} />
        <KpiCard label="Return rate" value="2.4%" trend="-0.3%" up={true} />
      </div>
      <Card className="mt-5">
        <AdminCardHeader title="Return Requests" subtitle={`${returns.length} total`} />
        <AdminCardContent>
          <div className="space-y-2">
            {returns.map((ret) => (
              <div key={ret.id} className="flex items-center gap-3 rounded-xl border border-border/40 p-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold">{ret.id}</span>
                    <span className="text-[10px] text-muted-foreground">· {ret.order}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">{ret.customer} — {ret.reason}</div>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                  style={{ background: `${statusColors[ret.status].replace(")", " / 0.18)")}`, color: statusColors[ret.status] }}
                >
                  {ret.status}
                </span>
                <span className="text-[12px] font-semibold tabular text-text-gold">₹{ret.amount.toLocaleString("en-IN")}</span>
                <Button variant="outline" size="sm">Review</Button>
              </div>
            ))}
          </div>
        </AdminCardContent>
      </Card>
    </div>
  );
}

/* ============================================================
   Shipping Section — Shipping providers & zones
   ============================================================ */
function ShippingSection() {
  const providers = [
    { name: "Delhivery", status: "active", rate: 45, avgTime: "2.1 days", zones: 28, color: "oklch(0.62 0.10 160)" },
    { name: "BlueDart", status: "active", rate: 38, avgTime: "1.8 days", zones: 22, color: "oklch(0.78 0.13 75)" },
    { name: "Ekart", status: "active", rate: 52, avgTime: "2.5 days", zones: 19, color: "oklch(0.65 0.15 30)" },
    { name: "India Post", status: "inactive", rate: 28, avgTime: "5.2 days", zones: 35, color: "oklch(0.55 0.08 280)" },
  ];

  return (
    <div>
      <SectionHeader title="Shipping" subtitle="Providers, zones & delivery rates" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Active providers" value="3" trend="All operational" up={true} />
        <KpiCard label="Avg delivery" value="2.1 days" trend="-0.3 days" up={true} />
        <KpiCard label="On-time rate" value="94.2%" trend="+1.2%" up={true} />
        <KpiCard label="Avg cost/ship" value="₹45" trend="-₹2" up={true} />
      </div>
      <Card className="mt-5">
        <AdminCardHeader title="Shipping Providers" />
        <AdminCardContent>
          <div className="space-y-2">
            {providers.map((p) => (
              <div key={p.name} className="flex items-center gap-3 rounded-xl border border-border/40 p-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${p.color.replace(")", " / 0.18)")}` }}>
                  <IconTruck size={16} active />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold">{p.name}</div>
                  <div className="text-[10px] text-muted-foreground">{p.zones} zones · {p.avgTime} avg</div>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-bold text-text-gold tabular">₹{p.rate}</div>
                  <div className="text-[9px] text-muted-foreground">per shipment</div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${p.status === "active" ? "bg-[oklch(var(--jade)/0.18)] text-text-accent-jade" : "bg-[oklch(var(--glass-tint)/0.06)] text-muted-foreground"}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </AdminCardContent>
      </Card>
    </div>
  );
}

/* ============================================================
   Tax Section — GST & tax compliance
   ============================================================ */
function TaxSection() {
  return (
    <div>
      <SectionHeader title="Tax & GST" subtitle="GST compliance, HSN codes & tax reports" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="GST collected (₹)" value="2,84,500" trend="+12.4%" up={true} />
        <KpiCard label="GST paid (₹)" value="1,12,300" trend="+8.1%" up={false} />
        <KpiCard label="Net liability" value="1,72,200" trend="Due Jul 20" up={false} />
        <KpiCard label="GST rate" value="18%" trend="Food supplement" up={true} />
      </div>
      <Card className="mt-5">
        <AdminCardHeader title="GST Summary" subtitle="Current quarter (Apr–Jun 2025)" />
        <AdminCardContent>
          <div className="space-y-3">
            {[
              { component: "CGST (9%)", collected: 142250, paid: 56150 },
              { component: "SGST (9%)", collected: 142250, paid: 56150 },
              { component: "IGST (18%)", collected: 0, paid: 0 },
            ].map((row) => (
              <div key={row.component} className="flex items-center justify-between rounded-xl border border-border/40 p-3">
                <span className="text-[13px] font-medium">{row.component}</span>
                <div className="flex gap-6 text-[12px]">
                  <div>
                    <span className="text-muted-foreground">Collected: </span>
                    <span className="font-semibold text-text-gold tabular">₹{row.collected.toLocaleString("en-IN")}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Paid: </span>
                    <span className="font-semibold tabular">₹{row.paid.toLocaleString("en-IN")}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Net: </span>
                    <span className="font-semibold text-text-accent-jade tabular">₹{(row.collected - row.paid).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full" variant="outline">
            <IconArrowRight size={14} className="mr-2" />
            Download GSTR-1 (JSON)
          </Button>
        </AdminCardContent>
      </Card>
    </div>
  );
}

/* ============================================================
   Reviews Section — Product review moderation
   ============================================================ */
function ReviewsSection() {
  const reviews = [
    { id: "r1", product: "Huxon Gold Isolate", author: "Arjun M.", rating: 5, title: "Best plant protein", status: "published", date: "2h ago" },
    { id: "r2", product: "Huxon Protein Bars", author: "Priya S.", rating: 5, title: "Finally clean label", status: "published", date: "5h ago" },
    { id: "r3", product: "Recovery Matrix", author: "Rohan K.", rating: 4, title: "Great recovery boost", status: "pending", date: "1d ago" },
    { id: "r4", product: "Daily Greens+", author: "Sneha I.", rating: 3, title: "Taste needs work", status: "pending", date: "2d ago" },
    { id: "r5", product: "Huxon Gold Isolate", author: "Vikram R.", rating: 1, title: "Spam review", status: "flagged", date: "3d ago" },
  ];

  return (
    <div>
      <SectionHeader title="Reviews" subtitle="Moderate customer reviews & ratings" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total reviews" value="12,148" trend="+248" up={true} />
        <KpiCard label="Avg rating" value="4.8" trend="+0.1" up={true} />
        <KpiCard label="Pending" value="8" trend="Needs review" up={false} />
        <KpiCard label="Flagged" value="2" trend="Spam/inappropriate" up={false} />
      </div>
      <Card className="mt-5">
        <AdminCardHeader title="Recent Reviews" subtitle={`${reviews.length} shown`} />
        <AdminCardContent>
          <div className="space-y-2">
            {reviews.map((rev) => (
              <div key={rev.id} className="flex items-start gap-3 rounded-xl border border-border/40 p-3">
                <div className="flex">
                  {[1,2,3,4,5].map((i) => (
                    <IconStar key={i} size={11} active={i <= rev.rating} />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold">{rev.title}</span>
                    <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase ${
                      rev.status === "published" ? "bg-[oklch(var(--jade)/0.18)] text-text-accent-jade" :
                      rev.status === "pending" ? "bg-[oklch(0.72_0.15_65/0.18)] text-[oklch(0.72_0.15_65)]" :
                      "bg-[oklch(0.72_0.18_25/0.18)] text-[oklch(0.72_0.18_25)]"
                    }`}>{rev.status}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">{rev.product} · by {rev.author} · {rev.date}</div>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm">Approve</Button>
                  <Button variant="ghost" size="sm">Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </AdminCardContent>
      </Card>
    </div>
  );
}

/* ============================================================
   Audit Section — Audit logs & system events
   ============================================================ */
function AuditSection() {
  const logs = [
    { action: "Product updated", user: "admin@drhuxon.com", target: "Huxon Gold Isolate", ip: "103.21.x.x", time: "2 min ago", type: "update" },
    { action: "Order refunded", user: "admin@drhuxon.com", target: "HUX-47820", ip: "103.21.x.x", time: "15 min ago", type: "refund" },
    { action: "Coupon created", user: "admin@drhuxon.com", target: "FLASH25", ip: "103.21.x.x", time: "1h ago", type: "create" },
    { action: "Customer banned", user: "system", target: "spam@bot.com", ip: "auto", time: "2h ago", type: "security" },
    { action: "Inventory adjusted", user: "warehouse@drhuxon.com", target: "Protein Bars", ip: "103.21.x.x", time: "3h ago", type: "update" },
    { action: "Admin login", user: "admin@drhuxon.com", target: "—", ip: "103.21.x.x", time: "4h ago", type: "auth" },
    { action: "Price changed", user: "admin@drhuxon.com", target: "Recovery Matrix", ip: "103.21.x.x", time: "5h ago", type: "update" },
    { action: "Feature flag toggled", user: "system", target: "new_checkout_flow", ip: "auto", time: "6h ago", type: "system" },
  ];

  const typeColors: Record<string, string> = {
    update: "oklch(0.78 0.13 75)",
    refund: "oklch(0.72 0.18 25)",
    create: "oklch(0.62 0.10 160)",
    security: "oklch(0.72 0.18 25)",
    auth: "oklch(0.55 0.08 280)",
    system: "oklch(0.66 0.015 70)",
  };

  return (
    <div>
      <SectionHeader title="Audit Logs" subtitle="System activity & security events" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Events today" value="248" trend="+12%" up={true} />
        <KpiCard label="Security events" value="3" trend="2 blocked" up={false} />
        <KpiCard label="Active sessions" value="5" trend="3 admins" up={true} />
        <KpiCard label="Failed logins" value="2" trend="-5" up={true} />
      </div>
      <Card className="mt-5">
        <AdminCardHeader title="Activity Log" subtitle="Last 24 hours" />
        <AdminCardContent>
          <div className="space-y-1">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[oklch(var(--glass-tint)/0.03)]"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: typeColors[log.type] }}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] font-medium">{log.action}</span>
                  <span className="ml-2 text-[10px] text-muted-foreground">{log.target}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{log.user}</span>
                <span className="text-[9px] text-muted-foreground tabular">{log.ip}</span>
                <span className="w-16 text-right text-[9px] text-muted-foreground">{log.time}</span>
              </motion.div>
            ))}
          </div>
        </AdminCardContent>
      </Card>
    </div>
  );
}

/* ============================================================
   Sidebar
   ============================================================ */
const NAV_ITEMS: { id: Section; label: string; Icon: React.FC<{ size?: number; active?: boolean }>; badge?: string }[] = [
  { id: "dashboard", label: "Dashboard", Icon: IconGrid },
  { id: "analytics", label: "Analytics", Icon: IconChartBar },
  { id: "products", label: "Products", Icon: IconShop },
  { id: "orders", label: "Orders", Icon: IconTruck, badge: "23" },
  { id: "returns", label: "Returns", Icon: IconRefresh, badge: "3" },
  { id: "customers", label: "Customers", Icon: IconUsers },
  { id: "inventory", label: "Inventory", Icon: IconPackage },
  { id: "marketing", label: "Marketing", Icon: IconGift },
  { id: "shipping", label: "Shipping", Icon: IconTruck },
  { id: "tax", label: "Tax & GST", Icon: IconRupee },
  { id: "reviews", label: "Reviews", Icon: IconStar },
  { id: "audit", label: "Audit Logs", Icon: IconShield },
  { id: "settings", label: "Settings", Icon: IconSettings },
];

function Sidebar({ active, onSelect }: { active: Section; onSelect: (s: Section) => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[oklch(0.92_0.10_85)] to-[oklch(0.62_0.10_55)] font-display text-lg font-bold text-[oklch(0.14_0.01_50)] shadow-md">
          H
        </div>
        <div>
          <div className="font-display text-[15px] font-semibold leading-tight">Huxon Admin</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-text-gold">Control Center</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        <div className="px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/60">
          Operations
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-all",
                isActive
                  ? "bg-[oklch(0.78_0.13_75_/_0.12)] text-text-gold"
                  : "text-muted-foreground hover:bg-[oklch(var(--glass-tint)/0.05)] hover:text-foreground"
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="admin-nav-active"
                  className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[oklch(0.92_0.10_85)] to-[oklch(0.62_0.10_55)]"
                  transition={{ type: "spring", stiffness: 500, damping: 36 }}
                />
              ) : null}
              <item.Icon size={18} active={isActive} />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular",
                  isActive ? "bg-[oklch(0.78_0.13_75_/_0.25)] text-text-gold" : "bg-[oklch(var(--glass-tint)/0.1)] text-muted-foreground"
                )}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Admin card */}
      <div className="px-3 pb-3">
        <div className="rounded-xl border border-border/60 bg-[oklch(var(--glass-tint)/0.04)] p-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.92_0.10_85)] to-[oklch(0.62_0.10_55)] text-[12px] font-bold text-[oklch(0.14_0.01_50)]">
              AM
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-semibold">Arjun Mehta</div>
              <div className="truncate text-[10px] text-text-gold">Super Admin</div>
            </div>
            <button
              onClick={() => toast.info("Signed out", { description: "Redirecting to store…" })}
              className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-[oklch(var(--glass-tint)/0.08)] hover:text-foreground"
              aria-label="Sign out"
            >
              <IconLogout size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Top Bar
   ============================================================ */
function TopBar({ onMenu }: { onMenu: () => void }) {
  const [query, setQuery] = React.useState("");
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 glass-dark px-4 sm:px-6">
      <button
        onClick={onMenu}
        className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-[oklch(var(--glass-tint)/0.06)] hover:text-foreground lg:hidden"
        aria-label="Open navigation"
      >
        <IconMenu size={18} />
      </button>

      <div className="hidden items-center gap-2 text-[11px] text-muted-foreground sm:flex">
        <span>Huxon Labs</span>
        <IconChevronDown size={11} className="-rotate-90" />
        <span className="text-foreground">Admin</span>
      </div>

      <div className="relative ml-auto hidden w-full max-w-md md:block">
        <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search orders, customers, products…"
          className="h-9 pl-9 pr-12"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border/60 bg-[oklch(var(--glass-tint)/0.06)] px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1.5 md:ml-0">
        <button
          onClick={() => toast.info("You're all caught up", { description: "No new notifications." })}
          className="relative grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-[oklch(var(--glass-tint)/0.06)] hover:text-foreground"
          aria-label="Notifications"
        >
          <IconBell size={17} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.18_25)]" />
        </button>

        <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
          <Link href="/">
            <IconArrowLeft size={13} />
            Back to Store
          </Link>
        </Button>

        <button className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.92_0.10_85)] to-[oklch(0.62_0.10_55)] text-[12px] font-bold text-[oklch(0.14_0.01_50)] sm:hidden">
          AM
        </button>
      </div>
    </header>
  );
}

/* ============================================================
   Main Admin Page
   ============================================================ */
export default function AdminPage() {
  const [section, setSection] = React.useState<Section>("dashboard");
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleSelect = (s: Section) => {
    setSection(s);
    setDrawerOpen(false);
  };

  return (
    <div className="dark min-h-[100dvh] bg-background text-foreground">
      <div className="flex min-h-[100dvh] w-full">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-[100dvh] w-64 shrink-0 border-r border-border/60 glass-dark lg:block">
          <Sidebar active={section} onSelect={handleSelect} />
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {drawerOpen ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawerOpen(false)}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                className="fixed left-0 top-0 z-50 h-[100dvh] w-72 border-r border-border/60 glass-dark lg:hidden"
              >
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="absolute right-3 top-4 grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-[oklch(var(--glass-tint)/0.08)] hover:text-foreground"
                  aria-label="Close navigation"
                >
                  <IconClose size={16} />
                </button>
                <Sidebar active={section} onSelect={handleSelect} />
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onMenu={() => setDrawerOpen(true)} />
          <main className="flex-1 overflow-x-hidden">
            <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {section === "dashboard" && <DashboardSection />}
                  {section === "analytics" && <AnalyticsSection />}
                  {section === "products" && <ProductsSection />}
                  {section === "orders" && <OrdersSection />}
                  {section === "returns" && <ReturnsSection />}
                  {section === "customers" && <CustomersSection />}
                  {section === "inventory" && <InventorySection />}
                  {section === "marketing" && <MarketingSection />}
                  {section === "shipping" && <ShippingSection />}
                  {section === "tax" && <TaxSection />}
                  {section === "reviews" && <ReviewsSection />}
                  {section === "audit" && <AuditSection />}
                  {section === "settings" && <SettingsSection />}
                </motion.div>
              </AnimatePresence>

              <footer className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border/40 pt-5 text-[11px] text-muted-foreground sm:flex-row">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-text-accent-jade animate-pulse" />
                  All systems operational · v2.4.1
                </div>
                <div>© Dr. Huxon Labs · Admin Console</div>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
