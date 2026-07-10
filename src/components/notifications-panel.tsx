"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNav } from "@/lib/store";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconClose,
  IconBell,
  IconCheck,
  IconBolt,
  IconFlame,
  IconTrophy,
  IconTruck,
  IconSpark,
  IconGift,
  IconArrowRight,
} from "@/components/icons";
import { Pill } from "@/components/primitives";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  type: "order" | "reward" | "challenge" | "offer" | "system";
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: React.FC<any>;
  accent: string;
};

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "order",
    title: "Order out for delivery",
    body: "Your order #HUX-48291 is out for delivery. Arriving today by 7 PM.",
    time: "2 min ago",
    read: false,
    icon: IconTruck,
    accent: "oklch(0.78 0.13 75)",
  },
  {
    id: "n2",
    type: "challenge",
    title: "Day 1 of your challenge",
    body: "Log your protein intake today to start your 30-Day Challenge strong!",
    time: "1 hour ago",
    read: false,
    icon: IconFlame,
    accent: "oklch(0.72 0.18 25)",
  },
  {
    id: "n3",
    type: "offer",
    title: "Flash sale — 22% off Gold Isolate",
    body: "Limited stock at this price. Offer ends in 5 hours.",
    time: "3 hours ago",
    read: false,
    icon: IconBolt,
    accent: "oklch(0.65 0.15 30)",
  },
  {
    id: "n4",
    type: "reward",
    title: "+250 reward points earned",
    body: "You earned 250 points for completing your first order. Total: 4,530 pts.",
    time: "5 hours ago",
    read: true,
    icon: IconSpark,
    accent: "oklch(0.78 0.13 75)",
  },
  {
    id: "n5",
    type: "challenge",
    title: "Milestone unlocked: Week 1 Warrior",
    body: "You completed 7 days! +100 reward points added to your account.",
    time: "Yesterday",
    read: true,
    icon: IconTrophy,
    accent: "oklch(0.72 0.10 65)",
  },
  {
    id: "n6",
    type: "offer",
    title: "Subscribe & Save 15%",
    body: "Set up a subscription for your favorite product and save on every order.",
    time: "2 days ago",
    read: true,
    icon: IconGift,
    accent: "oklch(0.62 0.10 160)",
  },
];

/**
 * NotificationsPanel — premium bottom sheet for notifications.
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

export function NotificationsPanel() {
  const { notificationsOpen, setNotificationsOpen } = useNav();
  useEscapeClose(notificationsOpen, () => setNotificationsOpen(false));
  const [notifications, setNotifications] = React.useState(SEED_NOTIFICATIONS);
  const [filter, setFilter] = React.useState<"all" | "unread">("all");

  const visible = filter === "all" ? notifications : notifications.filter((n) => !n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <AnimatePresence>
      {notificationsOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setNotificationsOpen(false)}
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
              onClick={() => setNotificationsOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full glass"
            >
              <IconClose size={16} />
            </button>

            {/* Header */}
            <div className="px-5 pb-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-text-gold">
                <IconBell size={11} />
                Notifications
              </div>
              <div className="mt-1 flex items-center justify-between">
                <h2 className="font-display text-[22px] font-semibold text-cream-gradient">
                  {unreadCount > 0 ? `${unreadCount} new` : "All caught up"}
                </h2>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-[11px] text-text-gold"
                  >
                    <IconCheck size={11} />
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 px-5 pb-2">
              {(["all", "unread"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-medium capitalize transition-colors",
                    filter === f
                      ? "bg-[oklch(var(--gold)/0.18)] text-text-gold"
                      : "text-muted-foreground"
                  )}
                >
                  {f === "all" ? `All (${notifications.length})` : `Unread (${unreadCount})`}
                </button>
              ))}
            </div>

            {/* Notifications list */}
            <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-8">
              {visible.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full glass">
                    <IconBell size={24} className="text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-[13px] font-medium">No notifications</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {visible.map((n, i) => (
                    <motion.button
                      key={n.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => markRead(n.id)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-colors",
                        n.read
                          ? "border-border glass"
                          : "border-[oklch(var(--gold)/0.25)] bg-[oklch(var(--gold)/0.04)]"
                      )}
                    >
                      {/* Icon */}
                      <div
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                        style={{ background: `${n.accent.replace(")", " / 0.18)")}` }}
                      >
                        <n.icon size={16} active />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="truncate text-[13px] font-semibold text-cream-gradient">
                            {n.title}
                          </h3>
                          {!n.read && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-[oklch(var(--gold))]" />
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                          {n.body}
                        </p>
                        <span className="mt-1 block text-[9px] text-muted-foreground/70">
                          {n.time}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border/50 px-5 py-3 pb-safe">
              <HuxonButton
                size="sm"
                variant="secondary"
                className="w-full"
                onClick={() => setNotificationsOpen(false)}
              >
                <IconArrowRight size={13} />
                View all in profile
              </HuxonButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
