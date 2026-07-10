"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders, type TrackedOrder, type OrderStage } from "@/lib/store";
import {
  IconClose,
  IconLocation,
  IconTruck,
  IconPackage,
  IconCheck,
  IconClock,
} from "@/components/icons";
import { Pill } from "@/components/primitives";
import { cn } from "@/lib/utils";

const STAGE_POSITIONS: Record<OrderStage, { progress: number; label: string; icon: string }> = {
  placed: { progress: 0.1, label: "Order placed", icon: "📍" },
  packed: { progress: 0.3, label: "Packed at facility", icon: "📦" },
  shipped: { progress: 0.5, label: "In transit", icon: "🚚" },
  out_for_delivery: { progress: 0.85, label: "Out for delivery", icon: "🛵" },
  delivered: { progress: 1, label: "Delivered", icon: "✅" },
};

/**
 * TrackMapModal — interactive delivery map with route + live courier position.
 */
// Inline escape-to-close hook
function useEscapeClose(isOpen: boolean, onClose: () => void) {
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);
}

export function TrackMapModal({
  order,
  onClose,
}: {
  order: TrackedOrder;
  onClose: () => void;
}) {
  useEscapeClose(true, onClose);
  const stageInfo = STAGE_POSITIONS[order.status];
  const isActive = order.status !== "delivered";

  // Calculate ETA
  const hoursLeft = Math.max(0, Math.round((order.eta - Date.now()) / (1000 * 60 * 60)));
  const etaDate = new Date(order.eta).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Route path points (Bengaluru facility → user location)
  const routePath = "M 30 200 Q 80 160 120 150 T 220 100 T 300 60";

  // Courier position along the path based on progress
  const courierX = 30 + stageInfo.progress * 270;
  const courierY = 200 - stageInfo.progress * 140;

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
        className="relative z-10 flex max-h-[92dvh] w-full max-w-[460px] flex-col overflow-hidden rounded-t-[28px] border-t border-border bg-background"
      >
        <div className="mx-auto my-3 h-1 w-10 rounded-full bg-[oklch(var(--glass-border)/0.2)]" />
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full glass"
        >
          <IconClose size={16} />
        </button>

        <div className="no-scrollbar flex-1 overflow-y-auto pb-8">
          {/* Header */}
          <div className="px-5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-gold-gradient">
              <IconLocation size={11} />
              Live tracking
            </div>
            <h2 className="mt-1 font-display text-[20px] font-semibold text-cream-gradient">
              Order #{order.orderNumber}
            </h2>
          </div>

          {/* Map */}
          <div className="relative mx-5 mt-4 h-[240px] overflow-hidden rounded-2xl border border-border bg-[oklch(0.10_0.005_50)]">
            {/* Grid background */}
            <svg viewBox="0 0 330 220" className="absolute inset-0 h-full w-full">
              <defs>
                <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="oklch(var(--glass-border)/0.08)" strokeWidth="0.5" />
                </pattern>
                <linearGradient id="route-grad" x1="0" y1="0" x2="330" y2="0">
                  <stop offset="0" stopColor="oklch(var(--gold))" stopOpacity="0.3" />
                  <stop offset="0.5" stopColor="oklch(var(--gold))" stopOpacity="0.8" />
                  <stop offset="1" stopColor="oklch(var(--gold))" stopOpacity="0.3" />
                </linearGradient>
                <radialGradient id="map-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="oklch(var(--gold)/0.15)" />
                  <stop offset="1" stopColor="oklch(var(--gold)/0)" />
                </radialGradient>
              </defs>

              <rect width="330" height="220" fill="url(#map-grid)" />
              <rect width="330" height="220" fill="url(#map-glow)" />

              {/* Stylized city blocks */}
              <rect x="40" y="40" width="30" height="20" rx="2" fill="oklch(var(--glass-border)/0.06)" />
              <rect x="90" y="30" width="25" height="15" rx="2" fill="oklch(var(--glass-border)/0.06)" />
              <rect x="150" y="60" width="35" height="25" rx="2" fill="oklch(var(--glass-border)/0.06)" />
              <rect x="220" y="40" width="30" height="20" rx="2" fill="oklch(var(--glass-border)/0.06)" />
              <rect x="60" y="120" width="40" height="30" rx="2" fill="oklch(var(--glass-border)/0.06)" />
              <rect x="180" y="130" width="30" height="20" rx="2" fill="oklch(var(--glass-border)/0.06)" />

              {/* Roads */}
              <line x1="0" y1="100" x2="330" y2="100" stroke="oklch(var(--glass-border)/0.1)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="165" y1="0" x2="165" y2="220" stroke="oklch(var(--glass-border)/0.1)" strokeWidth="2" strokeDasharray="4 4" />

              {/* Route path */}
              <motion.path
                d={routePath}
                fill="none"
                stroke="url(#route-grad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="6 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Origin: Bengaluru facility */}
              <g>
                <circle cx="30" cy="200" r="6" fill="oklch(var(--jade))" />
                <circle cx="30" cy="200" r="10" fill="none" stroke="oklch(var(--jade)/0.4)" strokeWidth="1.5" />
                <text x="30" y="190" fill="oklch(var(--muted-foreground))" fontSize="7" textAnchor="middle" fontWeight="600">
                  Facility
                </text>
              </g>

              {/* Destination: Your location */}
              <g>
                <circle cx="300" cy="60" r="6" fill="oklch(var(--gold))" />
                <motion.circle
                  cx="300"
                  cy="60"
                  r="10"
                  fill="none"
                  stroke="oklch(var(--gold))"
                  strokeWidth="1.5"
                  animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <text x="300" y="50" fill="oklch(var(--gold))" fontSize="7" textAnchor="middle" fontWeight="600">
                  You
                </text>
              </g>

              {/* Courier vehicle (animated) */}
              {isActive && (
                <motion.g
                  initial={{ x: 0, y: 0 }}
                  animate={{ x: courierX - 30, y: courierY - 200 }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <circle cx="30" cy="200" r="12" fill="oklch(var(--gold))" />
                  <circle cx="30" cy="200" r="16" fill="none" stroke="oklch(var(--gold)/0.4)" strokeWidth="2">
                    <animate attributeName="r" values="16;22;16" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <text x="30" y="204" fontSize="12" textAnchor="middle">
                    {order.status === "out_for_delivery" ? "🛵" : "🚚"}
                  </text>
                </motion.g>
              )}
            </svg>

            {/* Map overlay info */}
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(var(--jade))]" />
              <span className="text-[9px] font-medium text-cream/90">
                {isActive ? "Live · updating" : "Delivered"}
              </span>
            </div>
          </div>

          {/* ETA banner */}
          {isActive ? (
            <div className="mx-5 mt-4 flex items-center gap-3 rounded-2xl border border-[oklch(var(--gold)/0.25)] bg-[oklch(var(--gold)/0.06)] p-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[oklch(var(--gold)/0.18)]">
                <IconClock size={18} className="text-gold-gradient" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-muted-foreground">Estimated arrival</div>
                <div className="text-[14px] font-semibold text-cream-gradient">{etaDate}</div>
              </div>
              <div className="text-right">
                <div className="text-[20px] font-bold text-gold-gradient tabular">{hoursLeft}h</div>
                <div className="text-[8px] uppercase tracking-wide text-muted-foreground">left</div>
              </div>
            </div>
          ) : null}

          {/* Status timeline (horizontal) */}
          <div className="mx-5 mt-4">
            <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Delivery journey
            </div>
            <div className="relative flex items-center justify-between">
              {/* Progress line */}
              <div className="absolute left-4 right-4 top-4 h-0.5 bg-[oklch(var(--glass-tint)/0.1)]" />
              <motion.div
                className="absolute left-4 top-4 h-0.5 rounded-full bg-gradient-to-r from-[oklch(var(--gold))] to-[oklch(var(--bronze))]"
                initial={{ width: 0 }}
                animate={{ width: `calc(${stageInfo.progress * 100}% - ${stageInfo.progress * 32}px)` }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Stage nodes */}
              {(Object.keys(STAGE_POSITIONS) as OrderStage[]).map((stage, i) => {
                const passed = order.timeline.some((t) => t.stage === stage);
                const isCurrent = stage === order.status;
                return (
                  <div key={stage} className="relative z-10 flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        "grid h-8 w-8 place-items-center rounded-full border-2 transition-all",
                        passed
                          ? "border-transparent bg-gradient-to-br from-[oklch(var(--gold))] to-[oklch(var(--bronze))] text-[oklch(var(--charcoal))]"
                          : "border-border bg-background text-muted-foreground"
                      )}
                    >
                      {passed ? (
                        <IconCheck size={14} strokeWidth={2.5} />
                      ) : (
                        <span className="text-[10px] font-bold">{i + 1}</span>
                      )}
                    </div>
                    {isCurrent && (
                      <motion.span
                        className="absolute -bottom-1 h-1 w-1 rounded-full bg-[oklch(var(--gold))]"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex justify-between text-[8px] text-muted-foreground">
              <span>Placed</span>
              <span>Packed</span>
              <span>Shipped</span>
              <span>Out</span>
              <span>Delivered</span>
            </div>
          </div>

          {/* Current status detail */}
          <div className="mx-5 mt-4 rounded-2xl glass p-3">
            <div className="flex items-center gap-2">
              <span className="text-[20px]">{stageInfo.icon}</span>
              <div className="flex-1">
                <div className="text-[12px] font-semibold text-cream-gradient">
                  {stageInfo.label}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {isActive
                    ? "Your order is on the way"
                    : "Order successfully delivered"}
                </div>
              </div>
              <Pill tone={isActive ? "gold" : "green"}>
                {isActive ? (
                  <>
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(var(--gold))]" />
                    Live
                  </>
                ) : (
                  <>
                    <IconCheck size={9} />
                    Done
                  </>
                )}
              </Pill>
            </div>
          </div>

          {/* Courier info (if active) */}
          {isActive && order.status !== "placed" && order.status !== "packed" && (
            <div className="mx-5 mt-3 rounded-2xl glass p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[oklch(var(--gold)/0.14)]">
                  <IconTruck size={18} className="text-gold-gradient" />
                </div>
                <div className="flex-1">
                  <div className="text-[12px] font-semibold">Delhivery Express</div>
                  <div className="text-[10px] text-muted-foreground">
                    AWB: DLV{order.orderNumber.slice(-6)} · +91 80 4567 8900
                  </div>
                </div>
                <button className="rounded-full glass px-3 py-1.5 text-[10px] font-medium">
                  Call
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
