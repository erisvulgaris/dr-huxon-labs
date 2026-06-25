"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders, type TrackedOrder, type OrderStage } from "@/lib/store";
import { formatINR } from "@/lib/catalog";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconClock,
  IconTruck,
  IconPackage,
  IconScan,
  IconSprout,
  IconLocation,
  IconBolt,
  IconRefresh,
} from "@/components/icons";
import { Reveal, Stagger, StaggerItem, Pill, AnimatedNumber } from "@/components/primitives";
import { useNav } from "@/lib/store";
import { cn } from "@/lib/utils";

const STAGE_CONFIG: Record<
  OrderStage,
  { label: string; icon: React.FC<any>; note: string }
> = {
  placed: { label: "Order Placed", icon: IconCheck, note: "Order received" },
  packed: { label: "Packed", icon: IconPackage, note: "Packed at facility" },
  shipped: { label: "Shipped", icon: IconTruck, note: "Handed to courier" },
  out_for_delivery: { label: "Out for Delivery", icon: IconTruck, note: "On the way" },
  delivered: { label: "Delivered", icon: IconCheck, note: "Delivered" },
};

const STAGE_ORDER: OrderStage[] = [
  "placed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

/**
 * Orders view — order history + live tracking with timeline.
 */
export function OrdersView() {
  const { orders, advanceStage } = useOrders();
  const { setRoute } = useNav();
  const [activeId, setActiveId] = React.useState<string | null>(
    orders[0]?.id ?? null
  );

  const active = orders.find((o) => o.id === activeId) ?? orders[0];

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
              My Orders
            </h1>
            <p className="text-[11px] text-muted-foreground">
              {orders.length} order{orders.length !== 1 ? "s" : ""} · live tracking
            </p>
          </div>
        </div>
      </Reveal>

      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="mt-5 space-y-4">
          {/* Order list */}
          <Stagger className="space-y-2" staggerChildren={0.05}>
            {orders.map((o) => (
              <StaggerItem key={o.id}>
                <OrderListItem
                  order={o}
                  active={o.id === active?.id}
                  onClick={() => setActiveId(o.id)}
                />
              </StaggerItem>
            ))}
          </Stagger>

          {/* Active order tracking */}
          {active ? (
            <Reveal className="mt-6">
              <OrderTracker order={active} onAdvance={() => advanceStage(active.id)} />
            </Reveal>
          ) : null}
        </div>
      )}
    </div>
  );
}

function OrderListItem({
  order,
  active,
  onClick,
}: {
  order: TrackedOrder;
  active: boolean;
  onClick: () => void;
}) {
  const cfg = STAGE_CONFIG[order.status];
  const isActive = order.status !== "delivered";
  const placedDate = new Date(order.placedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all",
        active
          ? "border-[oklch(var(--gold)/0.4)] bg-[oklch(var(--gold)/0.06)]"
          : "border-border glass"
      )}
    >
      {/* Thumbnails */}
      <div className="relative flex -space-x-2">
        {order.items.slice(0, 2).map((item, i) => (
          <div
            key={i}
            className="h-12 w-12 overflow-hidden rounded-xl border-2 border-background bg-[oklch(var(--charcoal))]"
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0";
                }}
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-muted-foreground">
                <IconPackage size={16} />
              </div>
            )}
          </div>
        ))}
        {order.items.length > 2 ? (
          <div className="grid h-12 w-12 place-items-center rounded-xl border-2 border-background bg-[oklch(var(--glass-tint)/0.1)] text-[10px] font-semibold text-muted-foreground">
            +{order.items.length - 2}
          </div>
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold text-cream-gradient">
            #{order.orderNumber}
          </span>
          {isActive ? (
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(var(--jade))]" />
          ) : null}
        </div>
        <div className="text-[10px] text-muted-foreground">
          {placedDate} · {order.items.length} item{order.items.length > 1 ? "s" : ""}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <Pill tone={isActive ? "gold" : "green"}>
            {isActive ? <IconClock size={9} /> : <IconCheck size={9} />}
            {cfg.label}
          </Pill>
        </div>
      </div>

      <div className="text-right">
        <div className="text-[13px] font-semibold text-gold-gradient tabular">
          {formatINR(order.total)}
        </div>
        <div className="text-[9px] text-muted-foreground">
          {active ? "Tracking" : "View"}
        </div>
      </div>
    </motion.button>
  );
}

function OrderTracker({
  order,
  onAdvance,
}: {
  order: TrackedOrder;
  onAdvance: () => void;
}) {
  const cfg = STAGE_CONFIG[order.status];
  const currentIdx = STAGE_ORDER.indexOf(order.status);
  const isActive = order.status !== "delivered";

  // ETA calculation
  const etaDate = new Date(order.eta);
  const etaText = isActive
    ? etaDate.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "Delivered";

  // Progress percent
  const progress = (currentIdx / (STAGE_ORDER.length - 1)) * 100;

  return (
    <div className="overflow-hidden rounded-3xl glass p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-gold-gradient">
            <IconBolt size={11} />
            Live tracking
          </div>
          <h3 className="mt-1 font-display text-[18px] font-semibold text-cream-gradient">
            #{order.orderNumber}
          </h3>
        </div>
        {isActive ? (
          <Pill tone="gold">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(var(--gold))]" />
            {cfg.label}
          </Pill>
        ) : (
          <Pill tone="green">
            <IconCheck size={10} />
            Delivered
          </Pill>
        )}
      </div>

      {/* ETA banner */}
      {isActive ? (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[oklch(var(--gold)/0.25)] bg-[oklch(var(--gold)/0.06)] p-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[oklch(var(--gold)/0.18)]">
            <IconTruck size={18} className="text-gold-gradient" />
          </div>
          <div className="flex-1">
            <div className="text-[11px] text-muted-foreground">Estimated delivery</div>
            <div className="text-[14px] font-semibold text-cream-gradient">
              {etaText}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-muted-foreground">In transit</div>
            <div className="text-[14px] font-bold text-[oklch(var(--jade))] tabular">
              <AnimatedNumber value={Math.max(0, Math.round((order.eta - Date.now()) / (1000 * 60 * 60)))} />
              <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">h left</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Progress bar */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Order progress</span>
          <span className="font-semibold text-gold-gradient tabular">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-[oklch(var(--glass-tint)/0.08)]">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[oklch(var(--gold))] to-[oklch(var(--bronze))]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: "drop-shadow(0 0 6px oklch(var(--gold)/0.5))" }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative mt-5 pl-2">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-[oklch(var(--gold)/0.5)] via-[oklch(var(--gold)/0.2)] to-transparent" />
        <div className="space-y-4">
          {STAGE_ORDER.map((stage, i) => {
            const stageCfg = STAGE_CONFIG[stage];
            const done = i <= currentIdx;
            const isCurrent = i === currentIdx;
            const tlEntry = order.timeline.find((t) => t.stage === stage);
            const Icon = stageCfg.icon;
            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative flex gap-4"
              >
                <div className="relative z-10 shrink-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.08 + 0.1, type: "spring", stiffness: 200 }}
                    className={cn(
                      "grid h-7 w-7 place-items-center rounded-full border",
                      done
                        ? "border-[oklch(var(--gold)/0.5)] bg-[oklch(var(--gold)/0.2)] text-gold-gradient"
                        : "border-border bg-[oklch(var(--glass-tint)/0.06)] text-muted-foreground"
                    )}
                  >
                    <Icon size={13} active={done} />
                  </motion.div>
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 -z-10 rounded-full"
                      style={{ boxShadow: "0 0 0 4px oklch(var(--gold)/0.2)" }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-[12px] font-semibold",
                        done ? "text-cream-gradient" : "text-muted-foreground"
                      )}
                    >
                      {stageCfg.label}
                    </span>
                    {tlEntry ? (
                      <span className="text-[9px] text-muted-foreground">
                        {new Date(tlEntry.timestamp).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    ) : null}
                  </div>
                  {tlEntry ? (
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {tlEntry.note}
                    </p>
                  ) : (
                    <p className="mt-0.5 text-[11px] text-muted-foreground/60">
                      Pending
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Items in order */}
      <div className="mt-5 border-t border-border pt-4">
        <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Items ({order.items.length})
        </div>
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              {item.image ? (
                <div className="h-9 w-9 overflow-hidden rounded-lg bg-[oklch(var(--charcoal))]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = "0";
                    }}
                  />
                </div>
              ) : null}
              <div className="flex-1">
                <div className="text-[12px] font-medium">{item.name}</div>
                {item.flavor ? (
                  <div className="text-[10px] text-muted-foreground">
                    {item.flavor} · Qty {item.quantity}
                  </div>
                ) : (
                  <div className="text-[10px] text-muted-foreground">
                    Qty {item.quantity}
                  </div>
                )}
              </div>
              <span className="text-[11px] font-semibold text-gold-gradient tabular">
                {formatINR(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2">
          <span className="text-[12px] text-muted-foreground">Total</span>
          <span className="font-display text-[16px] font-semibold text-gold-gradient tabular">
            {formatINR(order.total)}
          </span>
        </div>
      </div>

      {/* Actions */}
      {isActive ? (
        <div className="mt-4 flex gap-2">
          <HuxonButton size="sm" variant="secondary" className="flex-1" onClick={onAdvance}>
            <IconRefresh size={12} />
            Simulate next stage
          </HuxonButton>
          <HuxonButton size="sm" className="flex-1">
            <IconLocation size={12} />
            Track on map
          </HuxonButton>
        </div>
      ) : (
        <div className="mt-4 flex gap-2">
          <HuxonButton size="sm" variant="secondary" className="flex-1">
            Buy again
          </HuxonButton>
          <HuxonButton size="sm" variant="secondary" className="flex-1">
            Leave review
          </HuxonButton>
        </div>
      )}
    </div>
  );
}

function EmptyOrders() {
  const { setRoute } = useNav();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="relative grid h-24 w-24 place-items-center"
      >
        <div className="absolute inset-0 rounded-full bg-[oklch(var(--gold)/0.12)] blur-2xl" />
        <div className="relative grid h-20 w-20 place-items-center rounded-full glass">
          <IconPackage size={32} className="text-muted-foreground" />
        </div>
      </motion.div>
      <h3 className="mt-6 font-display text-[18px] font-semibold text-cream-gradient">
        No orders yet
      </h3>
      <p className="mt-1 max-w-[260px] text-[13px] text-muted-foreground">
        Your orders will appear here with live tracking.
      </p>
      <HuxonButton size="md" glow className="mt-5" onClick={() => setRoute("shop")}>
        Start shopping
        <IconArrowRight size={14} />
      </HuxonButton>
    </div>
  );
}
