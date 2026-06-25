"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BrandProduct } from "@/lib/catalog";

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  mrp: number;
  flavor: string;
  image: string;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  addItem: (product: BrandProduct, flavor?: string, qty?: number) => void;
  removeItem: (productId: string, flavor: string) => void;
  updateQty: (productId: string, flavor: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      addItem: (product, flavor, qty = 1) =>
        set((state) => {
          const f = flavor ?? product.flavor;
          const existing = state.lines.find(
            (l) => l.productId === product.id && l.flavor === f
          );
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === product.id && l.flavor === f
                  ? { ...l, quantity: l.quantity + qty }
                  : l
              ),
              isOpen: true,
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                mrp: product.mrp,
                flavor: f,
                image: product.heroImage,
                quantity: qty,
              },
            ],
            isOpen: true,
          };
        }),
      removeItem: (productId, flavor) =>
        set((state) => ({
          lines: state.lines.filter(
            (l) => !(l.productId === productId && l.flavor === flavor)
          ),
        })),
      updateQty: (productId, flavor, qty) =>
        set((state) => ({
          lines: state.lines
            .map((l) =>
              l.productId === productId && l.flavor === flavor
                ? { ...l, quantity: Math.max(0, qty) }
                : l
            )
            .filter((l) => l.quantity > 0),
        })),
      clear: () => set({ lines: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      count: () => get().lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: () =>
        get().lines.reduce((n, l) => n + l.price * l.quantity, 0),
    }),
    {
      name: "huxon-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

type WishlistState = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  remove: (id: string) => void;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: ["p1", "p5"],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id)
            ? s.ids.filter((x) => x !== id)
            : [...s.ids, id],
        })),
      has: (id) => get().ids.includes(id),
      remove: (id) =>
        set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
    }),
    {
      name: "huxon-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

type RecentState = {
  ids: string[];
  push: (id: string) => void;
};

export const useRecent = create<RecentState>()(
  persist(
    (set) => ({
      ids: ["p1", "p2", "p5"],
      push: (id) =>
        set((s) => ({
          ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, 8),
        })),
    }),
    {
      name: "huxon-recent",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

type SearchState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useSearch = create<SearchState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));

export type Route =
  | "home"
  | "shop"
  | "explore"
  | "rewards"
  | "cart"
  | "profile"
  | "product"
  | "wishlist"
  | "orders"
  | "compare"
  | "subscriptions";

type NavState = {
  route: Route;
  setRoute: (r: Route) => void;
  quickViewProductId: string | null;
  setQuickView: (id: string | null) => void;
  ingredientSheetId: string | null;
  setIngredientSheet: (id: string | null) => void;
  activeProductId: string | null;
  openProduct: (id: string) => void;
  compareIds: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  compareOpen: boolean;
  setCompareOpen: (v: boolean) => void;
  shareProductId: string | null;
  setShareProductId: (id: string | null) => void;
  reviewProductId: string | null;
  setReviewProductId: (id: string | null) => void;
  quizOpen: boolean;
  setQuizOpen: (v: boolean) => void;
};

export const useNav = create<NavState>((set) => ({
  route: "home",
  setRoute: (r) => set({ route: r }),
  quickViewProductId: null,
  setQuickView: (id) => set({ quickViewProductId: id }),
  ingredientSheetId: null,
  setIngredientSheet: (id) => set({ ingredientSheetId: id }),
  activeProductId: null,
  openProduct: (id) => set({ route: "product", activeProductId: id }),
  compareIds: [],
  toggleCompare: (id) =>
    set((s) => ({
      compareIds: s.compareIds.includes(id)
        ? s.compareIds.filter((x) => x !== id)
        : s.compareIds.length >= 3
        ? [s.compareIds[1], s.compareIds[2], id]
        : [...s.compareIds, id],
    })),
  clearCompare: () => set({ compareIds: [] }),
  compareOpen: false,
  setCompareOpen: (v) => set({ compareOpen: v }),
  shareProductId: null,
  setShareProductId: (id) => set({ shareProductId: id }),
  reviewProductId: null,
  setReviewProductId: (id) => set({ reviewProductId: id }),
  quizOpen: false,
  setQuizOpen: (v) => set({ quizOpen: v }),
}));

type Toast = { id: string; title: string; description?: string };

type RewardState = {
  points: number;
  tier: string;
  streak: number;
  addPoints: (n: number) => void;
  toasts: Toast[];
  pushToast: (t: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
};

export const useReward = create<RewardState>()(
  persist(
    (set) => ({
      points: 4280,
      tier: "silver",
      streak: 7,
      addPoints: (n) =>
        set((s) => {
          const next = s.points + n;
          let tier = s.tier;
          if (next >= 15000) tier = "platinum";
          else if (next >= 7500) tier = "gold";
          else if (next >= 2500) tier = "silver";
          else tier = "bronze";
          return { points: next, tier };
        }),
      toasts: [],
      pushToast: (t) =>
        set((s) => {
          const id = Math.random().toString(36).slice(2);
          const toast = { ...t, id };
          setTimeout(() => {
            set((st) => ({ toasts: st.toasts.filter((x) => x.id !== id) }));
          }, 3000);
          return { toasts: [...s.toasts, toast] };
        }),
      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: "huxon-reward",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ points: s.points, tier: s.tier, streak: s.streak }),
    }
  )
);

/* ============================================================
   Orders store — persisted order history with live tracking
   ============================================================ */
export type OrderStage =
  | "placed"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered";

export type TrackedOrder = {
  id: string;
  orderNumber: string;
  items: { name: string; price: number; quantity: number; flavor?: string; image?: string }[];
  total: number;
  status: OrderStage;
  placedAt: number; // epoch ms
  eta: number; // epoch ms
  timeline: { stage: OrderStage; timestamp: number; note: string }[];
};

type OrdersState = {
  orders: TrackedOrder[];
  addOrder: (order: TrackedOrder) => void;
  advanceStage: (orderId: string) => void;
  removeOrder: (orderId: string) => void;
};

export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [
        {
          id: "seed-1",
          orderNumber: "HUX-48291",
          items: [
            { name: "Huxon Gold Isolate", price: 2499, quantity: 1, flavor: "Belgian Cocoa", image: "/products/gold-isolate.png" },
            { name: "Huxon Protein Bars", price: 1299, quantity: 1, flavor: "Salted Caramel", image: "/products/protein-bars.png" },
          ],
          total: 3798,
          status: "out_for_delivery",
          placedAt: Date.now() - 1000 * 60 * 60 * 26,
          eta: Date.now() + 1000 * 60 * 60 * 4,
          timeline: [
            { stage: "placed", timestamp: Date.now() - 1000 * 60 * 60 * 26, note: "Order received" },
            { stage: "packed", timestamp: Date.now() - 1000 * 60 * 60 * 24, note: "Packed at Bengaluru facility" },
            { stage: "shipped", timestamp: Date.now() - 1000 * 60 * 60 * 12, note: "Handed to Delhivery" },
            { stage: "out_for_delivery", timestamp: Date.now() - 1000 * 60 * 60 * 2, note: "Out for delivery · Bengaluru 560038" },
          ],
        },
        {
          id: "seed-2",
          orderNumber: "HUX-47820",
          items: [
            { name: "Recovery Matrix", price: 2199, quantity: 1, flavor: "Tart Cherry", image: "/products/recovery-matrix.png" },
          ],
          total: 2199,
          status: "delivered",
          placedAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
          eta: Date.now() - 1000 * 60 * 60 * 24 * 12,
          timeline: [
            { stage: "placed", timestamp: Date.now() - 1000 * 60 * 60 * 24 * 14, note: "Order received" },
            { stage: "packed", timestamp: Date.now() - 1000 * 60 * 60 * 24 * 14 + 1000 * 60 * 60 * 2, note: "Packed" },
            { stage: "shipped", timestamp: Date.now() - 1000 * 60 * 60 * 24 * 13, note: "Shipped" },
            { stage: "out_for_delivery", timestamp: Date.now() - 1000 * 60 * 60 * 24 * 12, note: "Out for delivery" },
            { stage: "delivered", timestamp: Date.now() - 1000 * 60 * 60 * 24 * 12 + 1000 * 60 * 60 * 3, note: "Delivered · Bengaluru 560038" },
          ],
        },
      ],
      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
      advanceStage: (orderId) =>
        set((s) => ({
          orders: s.orders.map((o) => {
            if (o.id !== orderId) return o;
            const stages: OrderStage[] = ["placed", "packed", "shipped", "out_for_delivery", "delivered"];
            const idx = stages.indexOf(o.status);
            if (idx >= stages.length - 1) return o;
            const next = stages[idx + 1];
            return {
              ...o,
              status: next,
              timeline: [
                ...o.timeline,
                {
                  stage: next,
                  timestamp: Date.now(),
                  note:
                    next === "packed"
                      ? "Packed at Bengaluru facility"
                      : next === "shipped"
                      ? "Handed to Delhivery"
                      : next === "out_for_delivery"
                      ? "Out for delivery"
                      : "Delivered",
                },
              ],
            };
          }),
        })),
      removeOrder: (orderId) =>
        set((s) => ({ orders: s.orders.filter((o) => o.id !== orderId) })),
    }),
    {
      name: "huxon-orders",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/* ============================================================
   Subscriptions store — persisted recurring deliveries
   ============================================================ */
export type Subscription = {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productAccent: string;
  flavor: string;
  quantity: number;
  frequencyDays: number;
  nextDelivery: number; // epoch ms
  pricePerDelivery: number;
  originalPricePerDelivery: number;
  status: "active" | "paused";
  pausedUntil?: number;
  totalSaved: number;
  deliveriesCount: number;
  createdAt: number;
};

type SubscriptionsState = {
  subscriptions: Subscription[];
  addSubscription: (sub: Subscription) => void;
  pauseSubscription: (id: string, days?: number) => void;
  resumeSubscription: (id: string) => void;
  skipNextDelivery: (id: string) => void;
  swapFlavor: (id: string, flavor: string) => void;
  changeFrequency: (id: string, days: number) => void;
  cancelSubscription: (id: string) => void;
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (v: boolean) => void;
};

export const useSubscriptions = create<SubscriptionsState>()(
  persist(
    (set) => ({
      subscriptions: [
        {
          id: "sub-seed-1",
          productId: "p1",
          productName: "Huxon Gold Isolate",
          productImage: "/products/gold-isolate.png",
          productAccent: "oklch(0.78 0.13 75)",
          flavor: "Belgian Cocoa",
          quantity: 2,
          frequencyDays: 30,
          nextDelivery: Date.now() + 1000 * 60 * 60 * 24 * 12,
          pricePerDelivery: 4248,
          originalPricePerDelivery: 4998,
          status: "active",
          totalSaved: 2250,
          deliveriesCount: 4,
          createdAt: Date.now() - 1000 * 60 * 60 * 24 * 90,
        },
      ],
      addSubscription: (sub) =>
        set((s) => ({ subscriptions: [sub, ...s.subscriptions] })),
      pauseSubscription: (id, days = 30) =>
        set((s) => ({
          subscriptions: s.subscriptions.map((sub) =>
            sub.id === id
              ? { ...sub, status: "paused", pausedUntil: Date.now() + 1000 * 60 * 60 * 24 * days }
              : sub
          ),
        })),
      resumeSubscription: (id) =>
        set((s) => ({
          subscriptions: s.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, status: "active", pausedUntil: undefined } : sub
          ),
        })),
      skipNextDelivery: (id) =>
        set((s) => ({
          subscriptions: s.subscriptions.map((sub) =>
            sub.id === id
              ? { ...sub, nextDelivery: sub.nextDelivery + sub.frequencyDays * 24 * 60 * 60 * 1000 }
              : sub
          ),
        })),
      swapFlavor: (id, flavor) =>
        set((s) => ({
          subscriptions: s.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, flavor } : sub
          ),
        })),
      changeFrequency: (id, days) =>
        set((s) => ({
          subscriptions: s.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, frequencyDays: days } : sub
          ),
        })),
      cancelSubscription: (id) =>
        set((s) => ({
          subscriptions: s.subscriptions.filter((sub) => sub.id !== id),
        })),
      hasSeenOnboarding: false,
      setHasSeenOnboarding: (v) => set({ hasSeenOnboarding: v }),
    }),
    {
      name: "huxon-subs",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
