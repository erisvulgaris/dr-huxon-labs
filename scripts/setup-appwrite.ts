/**
 * Dr. Huxon Labs — Appwrite setup script
 *
 * Creates the `huxon_labs` database, all 6 collections, their attributes +
 * indexes, and seeds products / ingredients / reviews / coupons from the
 * in-repo catalog when collections are empty.
 *
 * Run with:  `bun scripts/setup-appwrite.ts`
 *
 * Safe to re-run (idempotent — every step is wrapped in "exists?" checks).
 * Exits 0 with a friendly message when Appwrite isn't reachable so the
 * project keeps working in pure-local-catalog mode.
 */

import { Client, Databases, ID, Query } from "node-appwrite";

import {
  PRODUCTS,
  INGREDIENTS,
  REVIEWS,
} from "../src/lib/catalog";
import {
  COUPONS_COLLECTION,
  HUXON_DB_ID,
  INGREDIENTS_COLLECTION,
  ORDERS_COLLECTION,
  PRODUCTS_COLLECTION,
  REWARD_MEMBERS_COLLECTION,
  REVIEWS_COLLECTION,
} from "../src/lib/appwrite/server";

// ---------------------------------------------------------------------------
// Bootstrap client directly (we don't want the cached singleton here so we
// can probe health in isolation).
// ---------------------------------------------------------------------------

const ENDPOINT = process.env.APPWRITE_ENDPOINT?.trim() || "http://localhost:8080/v1";
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID?.trim() || "";
const API_KEY = process.env.APPWRITE_API_KEY?.trim() || "";

const client = new Client().setEndpoint(ENDPOINT);
if (PROJECT_ID) client.setProject(PROJECT_ID);
if (API_KEY) client.setKey(API_KEY);
const databases = new Databases(client);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Appwrite attribute creation is asynchronous — the API returns "processing"
// right away. We poll `getAttribute` until the status is `available` so the
// subsequent createDocument calls don't 400.
async function waitForAttribute(
  coll: string,
  key: string,
  retries = 40
): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      const attr = await databases.getAttribute(HUXON_DB_ID, coll, key);
      const status = (attr as any)?.status;
      if (status === "available" || status === "failed") return;
    } catch {
      // Attribute doesn't exist yet (race with createXAttribute call) — retry.
    }
    await sleep(500);
  }
  // If we never got a clean response, give up silently — the seed step will
  // surface a real error if the attribute truly isn't available.
}

// ---------------------------------------------------------------------------
// Tiny "create if missing" helpers
// ---------------------------------------------------------------------------

async function ensureDatabase(): Promise<boolean> {
  try {
    await databases.get(HUXON_DB_ID);
    console.log(`✓ Database "${HUXON_DB_ID}" already exists.`);
    return true;
  } catch {
    try {
      await databases.create(HUXON_DB_ID, "Huxon Labs");
      console.log(`✓ Database "${HUXON_DB_ID}" created.`);
      return true;
    } catch (err) {
      console.error("✗ Failed to create database:", err);
      return false;
    }
  }
}

async function ensureCollection(
  collId: string,
  name: string
): Promise<boolean> {
  try {
    await databases.getCollection(HUXON_DB_ID, collId);
    console.log(`✓ Collection "${collId}" already exists.`);
    return true;
  } catch {
    try {
      await databases.createCollection(HUXON_DB_ID, collId, name);
      console.log(`✓ Collection "${collId}" created.`);
      return true;
    } catch (err) {
      console.error(`✗ Failed to create collection "${collId}":`, err);
      return false;
    }
  }
}

async function attr(
  coll: string,
  fn: () => Promise<unknown>,
  label: string
): Promise<void> {
  try {
    await fn();
  } catch (err: any) {
    // Appwrite returns 409 when the attribute already exists — that's fine.
    if (err?.code === 409 || /already exist/i.test(err?.message || "")) {
      return;
    }
    console.warn(`  ⚠ ${label}: ${err?.message || err}`);
  }
}

async function ensureStringAttr(
  coll: string,
  key: string,
  size: number,
  required = false
): Promise<void> {
  await attr(
    coll,
    () =>
      databases.createStringAttribute(
        HUXON_DB_ID,
        coll,
        key,
        size,
        required
      ),
    `${coll}.${key} (string)`
  );
  await waitForAttribute(coll, key);
}

async function ensureIntAttr(
  coll: string,
  key: string,
  required = false
): Promise<void> {
  await attr(
    coll,
    () =>
      databases.createIntegerAttribute(HUXON_DB_ID, coll, key, required),
    `${coll}.${key} (int)`
  );
  await waitForAttribute(coll, key);
}

async function ensureFloatAttr(
  coll: string,
  key: string,
  required = false
): Promise<void> {
  await attr(
    coll,
    () =>
      databases.createFloatAttribute(HUXON_DB_ID, coll, key, required),
    `${coll}.${key} (float)`
  );
  await waitForAttribute(coll, key);
}

async function ensureBoolAttr(
  coll: string,
  key: string,
  required = false
): Promise<void> {
  await attr(
    coll,
    () =>
      databases.createBooleanAttribute(HUXON_DB_ID, coll, key, required),
    `${coll}.${key} (bool)`
  );
  await waitForAttribute(coll, key);
}

// ---------------------------------------------------------------------------
// Schema definitions
// ---------------------------------------------------------------------------

async function buildProductsSchema(): Promise<void> {
  const c = PRODUCTS_COLLECTION;
  await ensureStringAttr(c, "id", 64, true);
  await ensureStringAttr(c, "slug", 128, true);
  await ensureStringAttr(c, "name", 128, true);
  await ensureStringAttr(c, "tagline", 256);
  await ensureStringAttr(c, "category", 32, true);
  await ensureStringAttr(c, "description", 4096);
  await ensureFloatAttr(c, "price", true);
  await ensureFloatAttr(c, "mrp", true);
  await ensureFloatAttr(c, "proteinGrams");
  await ensureStringAttr(c, "servingSize", 32);
  await ensureIntAttr(c, "servings");
  await ensureStringAttr(c, "flavor", 64);
  await ensureStringAttr(c, "flavorColor", 64);
  await ensureFloatAttr(c, "rating");
  await ensureIntAttr(c, "reviewCount");
  await ensureBoolAttr(c, "inStock");
  await ensureStringAttr(c, "badge", 32);
  await ensureStringAttr(c, "features", 8192); // JSON
  await ensureStringAttr(c, "ingredients", 8192); // JSON
  await ensureStringAttr(c, "nutritionFacts", 8192); // JSON
  await ensureStringAttr(c, "pairings", 1024); // JSON
  await ensureStringAttr(c, "heroImage", 256);
  await ensureStringAttr(c, "galleryImages", 4096); // JSON
  await ensureStringAttr(c, "accent", 64);
  try {
    await databases.createIndex(HUXON_DB_ID, c, "slug_idx", "key", ["slug"]);
  } catch {
    /* already exists */
  }
}

async function buildIngredientsSchema(): Promise<void> {
  const c = INGREDIENTS_COLLECTION;
  await ensureStringAttr(c, "id", 64, true);
  await ensureStringAttr(c, "slug", 128, true);
  await ensureStringAttr(c, "name", 128, true);
  await ensureStringAttr(c, "origin", 128);
  await ensureFloatAttr(c, "originLat");
  await ensureFloatAttr(c, "originLng");
  await ensureStringAttr(c, "benefits", 4096); // JSON
  await ensureFloatAttr(c, "qualityScore");
  await ensureStringAttr(c, "processingMethod", 256);
  await ensureStringAttr(c, "nutritionalContribution", 256);
  await ensureStringAttr(c, "macroImage", 256);
  await ensureStringAttr(c, "category", 64);
}

async function buildReviewsSchema(): Promise<void> {
  const c = REVIEWS_COLLECTION;
  await ensureStringAttr(c, "id", 64, true);
  await ensureStringAttr(c, "productId", 64, true);
  await ensureStringAttr(c, "author", 128, true);
  await ensureStringAttr(c, "avatar", 256);
  await ensureFloatAttr(c, "rating", true);
  await ensureStringAttr(c, "title", 256, true);
  await ensureStringAttr(c, "body", 4096, true);
  await ensureBoolAttr(c, "verified");
  await ensureStringAttr(c, "date", 64);
  try {
    await databases.createIndex(HUXON_DB_ID, c, "product_idx", "key", [
      "productId",
    ]);
  } catch {
    /* already exists */
  }
}

async function buildCouponsSchema(): Promise<void> {
  const c = COUPONS_COLLECTION;
  await ensureStringAttr(c, "id", 64, true);
  await ensureStringAttr(c, "code", 64, true);
  await ensureStringAttr(c, "type", 16, true);
  await ensureFloatAttr(c, "value", true);
  await ensureFloatAttr(c, "minOrder");
  await ensureBoolAttr(c, "active");
  await ensureStringAttr(c, "expiresAt", 64);
  try {
    await databases.createIndex(HUXON_DB_ID, c, "code_idx", "key", ["code"]);
  } catch {
    /* already exists */
  }
}

async function buildOrdersSchema(): Promise<void> {
  const c = ORDERS_COLLECTION;
  await ensureStringAttr(c, "orderNumber", 64, true);
  await ensureStringAttr(c, "customerName", 128, true);
  await ensureStringAttr(c, "customerEmail", 128, true);
  await ensureStringAttr(c, "customerPhone", 32, true);
  await ensureStringAttr(c, "address", 512, true);
  await ensureStringAttr(c, "city", 64, true);
  await ensureStringAttr(c, "state", 64, true);
  await ensureStringAttr(c, "pincode", 16, true);
  await ensureStringAttr(c, "status", 32);
  await ensureFloatAttr(c, "subtotal", true);
  await ensureFloatAttr(c, "discount");
  await ensureFloatAttr(c, "shipping");
  await ensureFloatAttr(c, "total", true);
  await ensureStringAttr(c, "paymentMethod", 32);
  await ensureStringAttr(c, "items", 16384); // JSON
  await ensureStringAttr(c, "timeline", 16384); // JSON
  try {
    await databases.createIndex(HUXON_DB_ID, c, "order_number_idx", "key", [
      "orderNumber",
    ]);
  } catch {
    /* already exists */
  }
}

async function buildRewardMembersSchema(): Promise<void> {
  const c = REWARD_MEMBERS_COLLECTION;
  await ensureStringAttr(c, "name", 128, true);
  await ensureStringAttr(c, "email", 128, true);
  await ensureStringAttr(c, "phone", 32);
  await ensureIntAttr(c, "points");
  await ensureStringAttr(c, "tier", 32);
  await ensureIntAttr(c, "streak");
  await ensureStringAttr(c, "joinedAt", 32);
  await ensureStringAttr(c, "achievements", 8192); // JSON
  await ensureIntAttr(c, "referrals");
  try {
    await databases.createIndex(HUXON_DB_ID, c, "email_idx", "unique", [
      "email",
    ]);
  } catch {
    /* already exists */
  }
}

// ---------------------------------------------------------------------------
// Seed helpers
// ---------------------------------------------------------------------------

async function countDocs(coll: string): Promise<number> {
  try {
    const res = await databases.listDocuments(HUXON_DB_ID, coll, [
      Query.limit(1),
    ]);
    return res.total ?? 0;
  } catch {
    return 0;
  }
}

async function seedProducts(): Promise<void> {
  const count = await countDocs(PRODUCTS_COLLECTION);
  if (count > 0) {
    console.log(`↻ Products already seeded (${count}). Skipping.`);
    return;
  }
  for (const p of PRODUCTS) {
    try {
      await databases.createDocument(
        HUXON_DB_ID,
        PRODUCTS_COLLECTION,
        ID.custom(p.id),
        {
          id: p.id,
          slug: p.slug,
          name: p.name,
          tagline: p.tagline,
          category: p.category,
          description: p.description,
          price: p.price,
          mrp: p.mrp,
          proteinGrams: p.proteinGrams,
          servingSize: p.servingSize,
          servings: p.servings,
          flavor: p.flavor,
          flavorColor: p.flavorColor,
          rating: p.rating,
          reviewCount: p.reviewCount,
          inStock: p.inStock,
          badge: p.badge ?? "",
          features: JSON.stringify(p.features),
          ingredients: JSON.stringify(p.ingredients),
          nutritionFacts: JSON.stringify(p.nutritionFacts),
          pairings: p.pairings ? JSON.stringify(p.pairings) : "",
          heroImage: p.heroImage,
          galleryImages: JSON.stringify(p.galleryImages),
          accent: p.accent,
        }
      );
    } catch (err) {
      console.warn(`  ⚠ seed product ${p.id}:`, err);
    }
  }
  console.log(`✓ Seeded ${PRODUCTS.length} products.`);
}

async function seedIngredients(): Promise<void> {
  const count = await countDocs(INGREDIENTS_COLLECTION);
  if (count > 0) {
    console.log(`↻ Ingredients already seeded (${count}). Skipping.`);
    return;
  }
  for (const ing of INGREDIENTS) {
    try {
      await databases.createDocument(
        HUXON_DB_ID,
        INGREDIENTS_COLLECTION,
        ID.custom(ing.id),
        {
          id: ing.id,
          slug: ing.slug,
          name: ing.name,
          origin: ing.origin,
          originLat: ing.originLat,
          originLng: ing.originLng,
          benefits: JSON.stringify(ing.benefits),
          qualityScore: ing.qualityScore,
          processingMethod: ing.processingMethod,
          nutritionalContribution: ing.nutritionalContribution,
          macroImage: ing.macroImage,
          category: ing.category,
        }
      );
    } catch (err) {
      console.warn(`  ⚠ seed ingredient ${ing.id}:`, err);
    }
  }
  console.log(`✓ Seeded ${INGREDIENTS.length} ingredients.`);
}

async function seedReviews(): Promise<void> {
  const count = await countDocs(REVIEWS_COLLECTION);
  if (count > 0) {
    console.log(`↻ Reviews already seeded (${count}). Skipping.`);
    return;
  }
  for (const r of REVIEWS) {
    try {
      await databases.createDocument(
        HUXON_DB_ID,
        REVIEWS_COLLECTION,
        ID.custom(r.id),
        {
          id: r.id,
          productId: r.productId,
          author: r.author,
          avatar: r.avatar ?? "",
          rating: r.rating,
          title: r.title,
          body: r.body,
          verified: r.verified,
          date: r.date,
        }
      );
    } catch (err) {
      console.warn(`  ⚠ seed review ${r.id}:`, err);
    }
  }
  console.log(`✓ Seeded ${REVIEWS.length} reviews.`);
}

const SEED_COUPONS = [
  {
    id: "c1",
    code: "HUXON10",
    type: "percent",
    value: 10,
    minOrder: 0,
    active: true,
    expiresAt: "",
  },
  {
    id: "c2",
    code: "WELCOME500",
    type: "flat",
    value: 500,
    minOrder: 1999,
    active: true,
    expiresAt: "",
  },
  {
    id: "c3",
    code: "PLANT15",
    type: "percent",
    value: 15,
    minOrder: 2499,
    active: true,
    expiresAt: "",
  },
];

async function seedCoupons(): Promise<void> {
  const count = await countDocs(COUPONS_COLLECTION);
  if (count > 0) {
    console.log(`↻ Coupons already seeded (${count}). Skipping.`);
    return;
  }
  for (const c of SEED_COUPONS) {
    try {
      await databases.createDocument(
        HUXON_DB_ID,
        COUPONS_COLLECTION,
        ID.custom(c.id),
        {
          id: c.id,
          code: c.code,
          type: c.type,
          value: c.value,
          minOrder: c.minOrder,
          active: c.active,
          expiresAt: c.expiresAt,
        }
      );
    } catch (err) {
      console.warn(`  ⚠ seed coupon ${c.id}:`, err);
    }
  }
  console.log(`✓ Seeded ${SEED_COUPONS.length} coupons.`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  if (!PROJECT_ID || !API_KEY) {
    console.warn(
      "⚠ APPWRITE_PROJECT_ID or APPWRITE_API_KEY not set — skipping setup.\n" +
        "  The app will continue to use the local catalog in src/lib/catalog.ts.\n" +
        "  To enable Appwrite, fill in .env and re-run: bun scripts/setup-appwrite.ts"
    );
    process.exit(0);
  }

  // Reachability probe — fail soft so CI doesn't break.
  try {
    await databases.listDocuments(HUXON_DB_ID, PRODUCTS_COLLECTION, [
      Query.limit(1),
    ]);
  } catch (err: any) {
    // If the database/collection simply doesn't exist yet that's fine — we'll
    // create it below. Only treat genuine connection errors as fatal-soft.
    const msg = err?.message || String(err);
    const code = String(err?.code || "");
    const isConnError =
      /fetch failed|ECONNREFUSED|ENOTFOUND|network|timeout|unable to connect|connectionrefused|connect etimedout/i.test(
        msg + " " + code
      );
    if (isConnError) {
      console.warn(
        "⚠ Could not reach Appwrite at " + ENDPOINT + ":\n  " + msg +
          "\n  The app will keep using the local catalog. Make sure Appwrite is\n" +
          "  running and APPWRITE_ENDPOINT / APPWRITE_PROJECT_ID / APPWRITE_API_KEY\n" +
          "  are set correctly, then re-run this script."
      );
      process.exit(0);
    }
    // Otherwise fall through and try to create the database.
  }

  if (!(await ensureDatabase())) {
    console.error("✗ Cannot continue without a database.");
    process.exit(0);
  }

  console.log("\n— Creating collections —");
  await ensureCollection(PRODUCTS_COLLECTION, "Products");
  await ensureCollection(INGREDIENTS_COLLECTION, "Ingredients");
  await ensureCollection(REVIEWS_COLLECTION, "Reviews");
  await ensureCollection(COUPONS_COLLECTION, "Coupons");
  await ensureCollection(ORDERS_COLLECTION, "Orders");
  await ensureCollection(REWARD_MEMBERS_COLLECTION, "Reward Members");

  console.log("\n— Building attributes —");
  await buildProductsSchema();
  await buildIngredientsSchema();
  await buildReviewsSchema();
  await buildCouponsSchema();
  await buildOrdersSchema();
  await buildRewardMembersSchema();

  console.log("\n— Seeding data —");
  await seedProducts();
  await seedIngredients();
  await seedReviews();
  await seedCoupons();

  console.log("\n✓ Appwrite setup complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(0); // still exit 0 — local fallback keeps the app working
});
