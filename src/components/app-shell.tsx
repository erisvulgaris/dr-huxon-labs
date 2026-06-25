"use client";

import * as React from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { BrandedLogo } from "@/components/branded-logo";
import {
  IconHome,
  IconShop,
  IconExplore,
  IconRewards,
  IconCart,
  IconProfile,
  IconSearch,
  IconHeart,
  IconBell,
} from "@/components/icons";
import { useCart, useNav, useSearch, useWishlist, type Route } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS: { id: Route; label: string; Icon: React.FC<any> }[] = [
  { id: "home", label: "Home", Icon: IconHome },
  { id: "shop", label: "Shop", Icon: IconShop },
  { id: "explore", label: "Explore", Icon: IconExplore },
  { id: "rewards", label: "Rewards", Icon: IconRewards },
  { id: "cart", label: "Cart", Icon: IconCart },
  { id: "profile", label: "Profile", Icon: IconProfile },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollY } = useScroll({ container: scrollRef });

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 80);
  });

  return (
    <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[460px] flex-col bg-background">
      {/* Top nav — sticky, logo morphs to compact icon as user scrolls */}
      <TopNav scrolled={scrolled} />

      {/* Main scroll container */}
      <main
        ref={scrollRef}
        className="app-scroll relative flex-1 overflow-y-auto pb-safe-nav"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating glass bottom nav */}
      <BottomNav />
    </div>
  );
}

function TopNav({ scrolled }: { scrolled: boolean }) {
  const { open: openSearch } = useSearch();
  const { openCart } = useCart();
  const cartCount = useCart((s) => s.count());
  const wishCount = useWishlist((s) => s.ids.length);
  const { setRoute } = useNav();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-40 w-full pt-safe",
        scrolled
          ? "glass-dark border-b border-[oklch(0.96_0.012_80_/_0.06)]"
          : "bg-transparent"
      )}
    >
      <div className="flex items-center justify-between px-4 h-14">
        <button
          onClick={() => useNav.getState().setRoute("home")}
          aria-label="Dr. Huxon Labs home"
          className="pressable"
        >
          <BrandedLogo compact={scrolled} size={scrolled ? 30 : 34} />
        </button>

        <div className="flex items-center gap-1.5">
          <NavAction onClick={openSearch} label="Search">
            <IconSearch size={20} />
          </NavAction>
          <NavAction
            onClick={() => setRoute("profile")}
            label="Wishlist"
            badge={wishCount}
          >
            <IconHeart size={20} />
          </NavAction>
          <NavAction onClick={() => {}} label="Notifications" badge={3}>
            <IconBell size={20} />
          </NavAction>
          <NavAction onClick={openCart} label="Cart" badge={cartCount}>
            <IconCart size={20} />
          </NavAction>
        </div>
      </div>
    </motion.header>
  );
}

function NavAction({
  children,
  onClick,
  label,
  badge,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  badge?: number;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      onClick={onClick}
      aria-label={label}
      className={cn(
        "relative grid h-10 w-10 place-items-center rounded-full text-foreground/85",
        "hover:text-foreground hover:bg-[oklch(0.96_0.012_80_/_0.08)] transition-colors"
      )}
    >
      {children}
      {badge ? (
        <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.78_0.13_75)] to-[oklch(0.62_0.10_55)] px-1 text-[9px] font-bold text-[oklch(0.14_0.01_50)] shadow-gold">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </motion.button>
  );
}

function BottomNav() {
  const { route, setRoute } = useNav();
  const cartCount = useCart((s) => s.count());

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed bottom-0 left-1/2 z-40 w-full max-w-[460px] -translate-x-1/2 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-2"
      aria-label="Primary"
    >
      <div className="glass-dark pointer-events-auto relative flex items-center justify-around rounded-[28px] border border-[oklch(0.96_0.012_80_/_0.08)] px-2 py-2 shadow-premium">
        {/* Top sheen */}
        <span className="pointer-events-none absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.13_75_/_40%)] to-transparent" />

        {TABS.map((tab) => {
          const isActive = route === tab.id;
          const badge = tab.id === "cart" ? cartCount : undefined;
          return (
            <TabButton
              key={tab.id}
              active={isActive}
              label={tab.label}
              badge={badge}
              onClick={() => setRoute(tab.id)}
            >
              <tab.Icon size={22} active={isActive} />
            </TabButton>
          );
        })}
      </div>
    </motion.nav>
  );
}

function TabButton({
  children,
  active,
  label,
  onClick,
  badge,
}: {
  children: React.ReactNode;
  active: boolean;
  label: string;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className="relative flex h-12 w-12 flex-col items-center justify-center gap-0.5 rounded-2xl"
    >
      {active && (
        <motion.span
          layoutId="tab-active-bg"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="absolute inset-0 rounded-2xl bg-[oklch(0.78_0.13_75_/_0.14)] border border-[oklch(0.78_0.13_75_/_0.25)]"
        />
      )}
      {active && (
        <motion.span
          layoutId="tab-active-dot"
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="absolute -top-0.5 h-1 w-1 rounded-full bg-[oklch(0.78_0.13_75)] shadow-gold"
        />
      )}
      <motion.span
        animate={{
          color: active ? "oklch(0.92 0.10 85)" : "oklch(0.66 0.015 70)",
          scale: active ? 1.05 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className="relative z-10"
      >
        {children}
      </motion.span>
      <motion.span
        animate={{
          opacity: active ? 1 : 0,
          height: active ? 10 : 0,
        }}
        className="relative z-10 overflow-hidden text-[9px] font-medium tracking-wide text-[oklch(0.92_0.10_85)]"
      >
        {label}
      </motion.span>
      {badge ? (
        <span className="absolute right-1 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.78_0.13_75)] to-[oklch(0.62_0.10_55)] px-1 text-[9px] font-bold text-[oklch(0.14_0.01_50)] shadow-gold">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </motion.button>
  );
}
