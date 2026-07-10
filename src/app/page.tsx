"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/app-shell";
import { HomeView } from "@/components/views/home";
import { ShopView } from "@/components/views/shop";
import { CartDrawer } from "@/components/cart-drawer";
import { SearchOverlay } from "@/components/search-overlay";
import { RewardToasts } from "@/components/reward-toasts";
import { CompareBar } from "@/components/compare-bar";
import { useNav } from "@/lib/store";

// Lazy-load secondary views to reduce initial bundle
const ExploreView = React.lazy(() => import("@/components/views/explore").then(m => ({ default: m.ExploreView })));
const RewardsView = React.lazy(() => import("@/components/views/rewards").then(m => ({ default: m.RewardsView })));
const CartView = React.lazy(() => import("@/components/views/cart").then(m => ({ default: m.CartView })));
const ProfileView = React.lazy(() => import("@/components/views/profile").then(m => ({ default: m.ProfileView })));
const ProductView = React.lazy(() => import("@/components/views/product").then(m => ({ default: m.ProductView })));
const WishlistView = React.lazy(() => import("@/components/views/wishlist").then(m => ({ default: m.WishlistView })));
const OrdersView = React.lazy(() => import("@/components/views/orders").then(m => ({ default: m.OrdersView })));
const CompareView = React.lazy(() => import("@/components/views/compare").then(m => ({ default: m.CompareView })));
const SubscriptionsView = React.lazy(() => import("@/components/views/subscriptions").then(m => ({ default: m.SubscriptionsView })));
const BundleView = React.lazy(() => import("@/components/views/bundle").then(m => ({ default: m.BundleView })));
const ChallengeView = React.lazy(() => import("@/components/views/challenge").then(m => ({ default: m.ChallengeView })));

// Lazy-load overlays (only needed when triggered)
const QuickView = React.lazy(() => import("@/components/quick-view").then(m => ({ default: m.QuickView })));
const IngredientSheet = React.lazy(() => import("@/components/sections/ingredients").then(m => ({ default: m.IngredientSheet })));
const ShareSheet = React.lazy(() => import("@/components/share-sheet").then(m => ({ default: m.ShareSheet })));
const ReviewSheet = React.lazy(() => import("@/components/review-sheet").then(m => ({ default: m.ReviewSheet })));
const OnboardingTour = React.lazy(() => import("@/components/onboarding-tour").then(m => ({ default: m.OnboardingTour })));
const NutritionQuiz = React.lazy(() => import("@/components/nutrition-quiz").then(m => ({ default: m.NutritionQuiz })));
const ChatWidget = React.lazy(() => import("@/components/chat-widget").then(m => ({ default: m.ChatWidget })));
const PWAInstallPrompt = React.lazy(() => import("@/components/pwa-install-prompt").then(m => ({ default: m.PWAInstallPrompt })));
const AutoThemeSwitch = React.lazy(() => import("@/components/auto-theme-switch").then(m => ({ default: m.AutoThemeSwitch })));
const NotificationsPanel = React.lazy(() => import("@/components/notifications-panel").then(m => ({ default: m.NotificationsPanel })));
const ExitIntentModal = React.lazy(() => import("@/components/exit-intent-modal").then(m => ({ default: m.ExitIntentModal })));
const AbandonedCartRecovery = React.lazy(() => import("@/components/abandoned-cart-recovery").then(m => ({ default: m.AbandonedCartRecovery })));

const LazyFallback = () => (
  <div className="flex min-h-[60dvh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[oklch(var(--gold)/0.2)] border-t-[oklch(var(--gold))]" />
  </div>
);

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
          {route === "explore" && <React.Suspense fallback={<LazyFallback />}><ExploreView /></React.Suspense>}
          {route === "rewards" && <React.Suspense fallback={<LazyFallback />}><RewardsView /></React.Suspense>}
          {route === "cart" && <React.Suspense fallback={<LazyFallback />}><CartView /></React.Suspense>}
          {route === "profile" && <React.Suspense fallback={<LazyFallback />}><ProfileView /></React.Suspense>}
          {route === "product" && <React.Suspense fallback={<LazyFallback />}><ProductView /></React.Suspense>}
          {route === "wishlist" && <React.Suspense fallback={<LazyFallback />}><WishlistView /></React.Suspense>}
          {route === "orders" && <React.Suspense fallback={<LazyFallback />}><OrdersView /></React.Suspense>}
          {route === "compare" && <React.Suspense fallback={<LazyFallback />}><CompareView /></React.Suspense>}
          {route === "subscriptions" && <React.Suspense fallback={<LazyFallback />}><SubscriptionsView /></React.Suspense>}
          {route === "bundle" && <React.Suspense fallback={<LazyFallback />}><BundleView /></React.Suspense>}
          {route === "challenge" && <React.Suspense fallback={<LazyFallback />}><ChallengeView /></React.Suspense>}
        </motion.div>
      </AnimatePresence>

      {/* Overlays — lazy loaded */}
      <React.Suspense fallback={null}><QuickView /></React.Suspense>
      <React.Suspense fallback={null}><IngredientSheet /></React.Suspense>
      <CartDrawer />
      <SearchOverlay />
      <RewardToasts />
      <CompareBar />
      <React.Suspense fallback={null}><ShareSheet /></React.Suspense>
      <React.Suspense fallback={null}><ReviewSheet /></React.Suspense>
      <React.Suspense fallback={null}><OnboardingTour /></React.Suspense>
      <React.Suspense fallback={null}><NutritionQuiz /></React.Suspense>
      <React.Suspense fallback={null}><ChatWidget /></React.Suspense>
      <React.Suspense fallback={null}><PWAInstallPrompt /></React.Suspense>
      <React.Suspense fallback={null}><AutoThemeSwitch /></React.Suspense>
      <React.Suspense fallback={null}><NotificationsPanel /></React.Suspense>
      <React.Suspense fallback={null}><ExitIntentModal /></React.Suspense>
      <React.Suspense fallback={null}><AbandonedCartRecovery /></React.Suspense>
    </AppShell>
  );
}
