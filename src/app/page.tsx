"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/app-shell";
import { HomeView } from "@/components/views/home";
import { ShopView } from "@/components/views/shop";
import { ExploreView } from "@/components/views/explore";
import { RewardsView } from "@/components/views/rewards";
import { CartView } from "@/components/views/cart";
import { ProfileView } from "@/components/views/profile";
import { QuickView } from "@/components/quick-view";
import { IngredientSheet } from "@/components/sections/ingredients";
import { CartDrawer } from "@/components/cart-drawer";
import { SearchOverlay } from "@/components/search-overlay";
import { RewardToasts } from "@/components/reward-toasts";
import { useNav } from "@/lib/store";

export default function Home() {
  const { route } = useNav();

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.div
          key={route}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {route === "home" && <HomeView />}
          {route === "shop" && <ShopView />}
          {route === "explore" && <ExploreView />}
          {route === "rewards" && <RewardsView />}
          {route === "cart" && <CartView />}
          {route === "profile" && <ProfileView />}
        </motion.div>
      </AnimatePresence>

      {/* Overlays */}
      <QuickView />
      <IngredientSheet />
      <CartDrawer />
      <SearchOverlay />
      <RewardToasts />
    </AppShell>
  );
}
