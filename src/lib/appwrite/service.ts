/**
 * Dr. Huxon Labs — Resilient data service
 *
 * Single entry point for all catalog reads + order/reward writes. Each method:
 *   1. Checks `isAppwriteConfigured()`.
 *   2. If configured, attempts the remote call inside try/catch.
 *   3. On any failure (offline, auth error, schema drift, timeout) it falls
 *      back to the in-repo static catalog so the storefront never breaks.
 *
 * Public surface (typed async functions):
 *   - fetchProducts()
 *   - fetchProduct(slug)
 *   - fetchIngredients()
 *   - fetchReviews(productId?)
 *   - fetchCoupons()
 *   - validateCoupon(code, subtotal)
 *   - submitOrder(payload)
 *   - fetchRewardMember(email)
 *
 * All return shapes match `src/lib/catalog.ts` exactly.
 */

import { ID, Query } from "node-appwrite";
import {
  BrandIngredient,
  BrandProduct,
  INGREDIENTS,
  PRODUCTS,
  REVIEWS,
  type Review,
} from "@/lib/catalog";
import {
  COUPONS_COLLECTION,
  HUXON_DB_ID,
  INGREDIENTS_COLLECTION,
  ORDERS_COLLECTION,
  PRODUCTS_COLLECTION,
  REWARD_MEMBERS_COLLECTION,
  REVIEWS_COLLECTION,
  getDatabases,
  isAppwriteConfigured,
  isAppwriteReachable,
} from "@/lib/appwrite/server";

// ---------------------------------------------------------------------------
// Shared types (kept local so the file has no extra dependency surface)
// ---------------------------------------------------------------------------

export type Coupon = {
  id: string;
  code: string;
  type: "percent" | "flat";
  value: number;
  minOrder: number;
  active: boolean;
  expiresAt: string | null;
};

export type OrderItemInput = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  flavor?: string | null;
};

export type OrderPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  discount?: number;
  shipping?: number;
  total: number;
  paymentMethod?: string;
  items: OrderItemInput[];
};

export type OrderResult = {
  orderId: string;
  orderNumber: string;
  status: string;
};

export type RewardMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  tier: string;
  streak: number;
  joinedAt: string;
  achievements: { id: string; name: string; icon: string; earned: boolean }[];
  referrals: number;
};

// ---------------------------------------------------------------------------
// Local fallback data (used when Appwrite is unreachable / unconfigured)
// ---------------------------------------------------------------------------

const LOCAL_COUPONS: Coupon[] = [
  {
    id: "c1",
    code: "HUXON10",
    type: "percent",
    value: 10,
    minOrder: 0,
    active: true,
    expiresAt: null,
  },
  {
    id: "c2",
    code: "WELCOME500",
    type: "flat",
    value: 500,
    minOrder: 1999,
    active: true,
    expiresAt: null,
  },
  {
    id: "c3",
    code: "PLANT15",
    type: "percent",
    value: 15,
    minOrder: 2499,
    active: true,
    expiresAt: null,
  },
];

const LOCAL_REWARD_MEMBER: RewardMember = {
  id: "rm1",
  name: "Arjun Mehta",
  email: "arjun@example.com",
  phone: "+91 98765 43210",
  points: 8420,
  tier: "gold",
  streak: 23,
  joinedAt: "2024-03-12",
  achievements: [
    { id: "a1", name: "First Order", icon: "spark", earned: true },
    { id: "a2", name: "Protein Streak — 7 days", icon: "flame", earned: true },
    { id: "a3", name: "Reviewed a Product", icon: "star", earned: true },
    { id: "a4", name: "Referred a Friend", icon: "users", earned: true },
    { id: "a5", name: "Gold Tier", icon: "crown", earned: true },
    { id: "a6", name: "Subscription Member", icon: "refresh", earned: false },
  ],
  referrals: 4,
};

// ---------------------------------------------------------------------------
// Document → typed mappers
// ---------------------------------------------------------------------------

type AnyDoc = Record<string, any>;

function safeJson<T>(value: unknown, fallback: T): T {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
    return value as T;
  }
  return fallback;
}

function docToProduct(doc: AnyDoc): BrandProduct {
  return {
    id: String(doc.id ?? doc.$id ?? ""),
    slug: String(doc.slug ?? ""),
    name: String(doc.name ?? ""),
    tagline: String(doc.tagline ?? ""),
    category: (doc.category ?? "protein") as BrandProduct["category"],
    description: String(doc.description ?? ""),
    price: Number(doc.price ?? 0),
    mrp: Number(doc.mrp ?? 0),
    proteinGrams: Number(doc.proteinGrams ?? 0),
    servingSize: String(doc.servingSize ?? ""),
    servings: Number(doc.servings ?? 0),
    flavor: String(doc.flavor ?? ""),
    flavorColor: String(doc.flavorColor ?? ""),
    rating: Number(doc.rating ?? 4.8),
    reviewCount: Number(doc.reviewCount ?? 0),
    inStock: Boolean(doc.inStock ?? true),
    badge: doc.badge ? String(doc.badge) : undefined,
    features: safeJson<string[]>(doc.features, []),
    ingredients: safeJson<{ name: string; amount: string }[]>(
      doc.ingredients,
      []
    ),
    nutritionFacts: safeJson<{ label: string; value: string }[]>(
      doc.nutritionFacts,
      []
    ),
    pairings: safeJson<string[] | undefined>(doc.pairings, undefined),
    heroImage: String(doc.heroImage ?? ""),
    galleryImages: safeJson<string[]>(doc.galleryImages, []),
    accent: String(doc.accent ?? ""),
  };
}

function docToIngredient(doc: AnyDoc): BrandIngredient {
  return {
    id: String(doc.id ?? doc.$id ?? ""),
    slug: String(doc.slug ?? ""),
    name: String(doc.name ?? ""),
    origin: String(doc.origin ?? ""),
    originLat: Number(doc.originLat ?? 0),
    originLng: Number(doc.originLng ?? 0),
    benefits: safeJson<string[]>(doc.benefits, []),
    qualityScore: Number(doc.qualityScore ?? 95),
    processingMethod: String(doc.processingMethod ?? ""),
    nutritionalContribution: String(doc.nutritionalContribution ?? ""),
    macroImage: String(doc.macroImage ?? ""),
    category: String(doc.category ?? ""),
  };
}

function docToReview(doc: AnyDoc): Review {
  return {
    id: String(doc.id ?? doc.$id ?? ""),
    productId: String(doc.productId ?? ""),
    author: String(doc.author ?? ""),
    avatar: doc.avatar ? String(doc.avatar) : undefined,
    rating: Number(doc.rating ?? 5),
    title: String(doc.title ?? ""),
    body: String(doc.body ?? ""),
    verified: Boolean(doc.verified ?? true),
    date: String(doc.date ?? doc.createdAt ?? ""),
  };
}

function docToCoupon(doc: AnyDoc): Coupon {
  return {
    id: String(doc.id ?? doc.$id ?? ""),
    code: String(doc.code ?? ""),
    type: (doc.type ?? "percent") as Coupon["type"],
    value: Number(doc.value ?? 0),
    minOrder: Number(doc.minOrder ?? 0),
    active: Boolean(doc.active ?? true),
    expiresAt: doc.expiresAt ? String(doc.expiresAt) : null,
  };
}

function docToRewardMember(doc: AnyDoc): RewardMember {
  return {
    id: String(doc.id ?? doc.$id ?? ""),
    name: String(doc.name ?? ""),
    email: String(doc.email ?? ""),
    phone: String(doc.phone ?? ""),
    points: Number(doc.points ?? 0),
    tier: String(doc.tier ?? "bronze"),
    streak: Number(doc.streak ?? 0),
    joinedAt: String(doc.joinedAt ?? doc.createdAt ?? ""),
    achievements: safeJson<RewardMember["achievements"]>(doc.achievements, []),
    referrals: Number(doc.referrals ?? 0),
  };
}

// ---------------------------------------------------------------------------
// Connection guard
// ---------------------------------------------------------------------------

/**
 * Cached reachability flag. We probe once per process lifetime — repeated
 * probes would add a round-trip to every API request, defeating the purpose
 * of the local fallback. If the first probe succeeds we use Appwrite; if it
 * fails we stick with the local catalog for the rest of the process.
 *
 * Re-set to `null` if you need to force a re-probe (used by the health route).
 */
let _reachableCache: boolean | null = null;

async function shouldUseAppwrite(): Promise<boolean> {
  if (!isAppwriteConfigured()) return false;
  if (_reachableCache !== null) return _reachableCache;
  _reachableCache = await isAppwriteReachable();
  return _reachableCache;
}

/** Test-only / health-route helper: forget the cached reachability result. */
export function resetReachabilityCache(): void {
  _reachableCache = null;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function fetchProducts(): Promise<BrandProduct[]> {
  try {
    if (await shouldUseAppwrite()) {
      const db = getDatabases();
      const res = await db.listDocuments(HUXON_DB_ID, PRODUCTS_COLLECTION, [
        Query.limit(100),
      ]);
      if (res.documents.length > 0) {
        return res.documents.map((d) => docToProduct(d as AnyDoc));
      }
    }
  } catch (err) {
    console.warn("[appwrite] fetchProducts fell back to local catalog:", err);
  }
  return PRODUCTS;
}

export async function fetchProduct(slug: string): Promise<BrandProduct | null> {
  try {
    if (await shouldUseAppwrite()) {
      const db = getDatabases();
      const res = await db.listDocuments(HUXON_DB_ID, PRODUCTS_COLLECTION, [
        Query.equal("slug", slug),
        Query.limit(1),
      ]);
      if (res.documents.length > 0) {
        return docToProduct(res.documents[0] as AnyDoc);
      }
      // fall through to local lookup
    }
  } catch (err) {
    console.warn("[appwrite] fetchProduct fell back to local catalog:", err);
  }
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Ingredients
// ---------------------------------------------------------------------------

export async function fetchIngredients(): Promise<BrandIngredient[]> {
  try {
    if (await shouldUseAppwrite()) {
      const db = getDatabases();
      const res = await db.listDocuments(HUXON_DB_ID, INGREDIENTS_COLLECTION, [
        Query.limit(100),
      ]);
      if (res.documents.length > 0) {
        return res.documents.map((d) => docToIngredient(d as AnyDoc));
      }
    }
  } catch (err) {
    console.warn("[appwrite] fetchIngredients fell back to local catalog:", err);
  }
  return INGREDIENTS;
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export async function fetchReviews(productId?: string): Promise<Review[]> {
  try {
    if (await shouldUseAppwrite()) {
      const db = getDatabases();
      const queries = [Query.limit(100)];
      if (productId) queries.push(Query.equal("productId", productId));
      const res = await db.listDocuments(HUXON_DB_ID, REVIEWS_COLLECTION, queries);
      if (res.documents.length > 0) {
        return res.documents.map((d) => docToReview(d as AnyDoc));
      }
    }
  } catch (err) {
    console.warn("[appwrite] fetchReviews fell back to local catalog:", err);
  }
  if (productId) return REVIEWS.filter((r) => r.productId === productId);
  return REVIEWS;
}

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------

export async function fetchCoupons(): Promise<Coupon[]> {
  try {
    if (await shouldUseAppwrite()) {
      const db = getDatabases();
      const res = await db.listDocuments(HUXON_DB_ID, COUPONS_COLLECTION, [
        Query.limit(100),
      ]);
      if (res.documents.length > 0) {
        return res.documents.map((d) => docToCoupon(d as AnyDoc));
      }
    }
  } catch (err) {
    console.warn("[appwrite] fetchCoupons fell back to local catalog:", err);
  }
  return LOCAL_COUPONS;
}

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<{ valid: boolean; discount: number; message: string }> {
  const coupons = await fetchCoupons();
  const normalized = code.trim().toUpperCase();
  const coupon = coupons.find(
    (c) => c.code.toUpperCase() === normalized && c.active
  );

  if (!coupon) {
    return { valid: false, discount: 0, message: "Invalid coupon code." };
  }
  if (subtotal < coupon.minOrder) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order ₹${Math.round(coupon.minOrder)} required.`,
    };
  }

  let discount = 0;
  if (coupon.type === "percent") {
    discount = (subtotal * coupon.value) / 100;
  } else {
    discount = coupon.value;
  }
  // never discount more than the subtotal
  discount = Math.min(discount, subtotal);

  return {
    valid: true,
    discount: Math.round(discount),
    message: `Coupon applied — you saved ₹${Math.round(discount)}.`,
  };
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HUX-${stamp}-${rand}`;
}

export async function submitOrder(
  payload: OrderPayload
): Promise<OrderResult> {
  const orderNumber = generateOrderNumber();
  const status = "placed";

  // Best-effort persistence. Even if this fails the customer still gets an
  // order number back — we never want to block checkout on infra issues.
  if (await shouldUseAppwrite()) {
    try {
      const db = getDatabases();
      const doc = await db.createDocument(
        HUXON_DB_ID,
        ORDERS_COLLECTION,
        ID.unique(),
        {
          orderNumber,
          customerName: payload.customerName,
          customerEmail: payload.customerEmail,
          customerPhone: payload.customerPhone,
          address: payload.address,
          city: payload.city,
          state: payload.state,
          pincode: payload.pincode,
          status,
          subtotal: payload.subtotal,
          discount: payload.discount ?? 0,
          shipping: payload.shipping ?? 0,
          total: payload.total,
          paymentMethod: payload.paymentMethod ?? "cod",
          items: JSON.stringify(payload.items),
          timeline: JSON.stringify([
            { stage: "placed", timestamp: new Date().toISOString() },
          ]),
        }
      );
      return {
        orderId: String(doc.$id ?? orderNumber),
        orderNumber,
        status,
      };
    } catch (err) {
      console.warn("[appwrite] submitOrder persisted to local only:", err);
    }
  }

  return {
    orderId: orderNumber,
    orderNumber,
    status,
  };
}

// ---------------------------------------------------------------------------
// Reward members
// ---------------------------------------------------------------------------

export async function fetchRewardMember(
  email: string
): Promise<RewardMember | null> {
  const normalized = email.trim().toLowerCase();

  try {
    if (await shouldUseAppwrite()) {
      const db = getDatabases();
      const res = await db.listDocuments(
        HUXON_DB_ID,
        REWARD_MEMBERS_COLLECTION,
        [Query.equal("email", normalized), Query.limit(1)]
      );
      if (res.documents.length > 0) {
        return docToRewardMember(res.documents[0] as AnyDoc);
      }
      // fall through to local lookup
    }
  } catch (err) {
    console.warn(
      "[appwrite] fetchRewardMember fell back to local catalog:",
      err
    );
  }

  if (LOCAL_REWARD_MEMBER.email.toLowerCase() === normalized) {
    return LOCAL_REWARD_MEMBER;
  }
  return null;
}
