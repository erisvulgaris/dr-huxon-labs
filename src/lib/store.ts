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
  | "profile";

type NavState = {
  route: Route;
  setRoute: (r: Route) => void;
  quickViewProductId: string | null;
  setQuickView: (id: string | null) => void;
  ingredientSheetId: string | null;
  setIngredientSheet: (id: string | null) => void;
};

export const useNav = create<NavState>((set) => ({
  route: "home",
  setRoute: (r) => set({ route: r }),
  quickViewProductId: null,
  setQuickView: (id) => set({ quickViewProductId: id }),
  ingredientSheetId: null,
  setIngredientSheet: (id) => set({ ingredientSheetId: id }),
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
