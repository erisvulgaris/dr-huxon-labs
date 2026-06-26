/**
 * Dr. Huxon Labs — Appwrite server client (node-appwrite)
 *
 * Used by API routes and the setup script. Reads config from env vars and
 * exposes a singleton `Databases` instance + collection ID constants. The
 * app remains 100% functional without Appwrite configured — callers use
 * `isAppwriteConfigured()` to decide whether to attempt a remote call.
 */

import { Client, Databases } from "node-appwrite";

/** Database ID — single shared database for the whole storefront. */
export const HUXON_DB_ID = "huxon_labs";

/** Collection IDs — stable lower-case keys so we can re-run setup safely. */
export const PRODUCTS_COLLECTION = "products";
export const INGREDIENTS_COLLECTION = "ingredients";
export const REVIEWS_COLLECTION = "reviews";
export const COUPONS_COLLECTION = "coupons";
export const ORDERS_COLLECTION = "orders";
export const REWARD_MEMBERS_COLLECTION = "reward_members";

const APPWRITE_ENDPOINT =
  process.env.APPWRITE_ENDPOINT?.trim() || "http://localhost:8080/v1";
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID?.trim() || "";
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY?.trim() || "";

/**
 * True only when all three required env vars are present. This does NOT
 * guarantee the server is reachable — callers must still try/catch.
 */
export function isAppwriteConfigured(): boolean {
  return (
    APPWRITE_ENDPOINT.length > 0 &&
    APPWRITE_PROJECT_ID.length > 0 &&
    APPWRITE_API_KEY.length > 0
  );
}

/**
 * Singleton server client. Constructed lazily so the module is safe to import
 * even when node-appwrite isn't actually needed (e.g. during static render).
 */
let _client: Client | null = null;
let _databases: Databases | null = null;

function buildClient(): Client {
  const client = new Client();
  client.setEndpoint(APPWRITE_ENDPOINT);
  if (APPWRITE_PROJECT_ID) client.setProject(APPWRITE_PROJECT_ID);
  if (APPWRITE_API_KEY) client.setKey(APPWRITE_API_KEY);
  return client;
}

/** Returns the configured node-appwrite Client (creates it on first use). */
export function getClient(): Client {
  if (!_client) _client = buildClient();
  return _client;
}

/** Returns a Databases service instance backed by the singleton Client. */
export function getDatabases(): Databases {
  if (!_databases) _databases = new Databases(getClient());
  return _databases;
}

/**
 * Lightweight connectivity probe. Returns true if Appwrite responded to a
 * trivial request. Failures (offline, 401, wrong project) return false.
 * Used by the resilient service to decide between remote vs. local data.
 */
export async function isAppwriteReachable(): Promise<boolean> {
  if (!isAppwriteConfigured()) return false;
  try {
    // A document list with limit(1) is the cheapest "real" call we can make.
    // We pick PRODUCTS_COLLECTION because every Huxon install is expected to
    // have it (the setup script creates it first). If it's missing we still
    // treat the request as a successful ping — the service layer will fall
    // back on the actual data call.
    const db = getDatabases();
    await db.listDocuments(HUXON_DB_ID, PRODUCTS_COLLECTION, ["limit(1)"]);
    return true;
  } catch {
    return false;
  }
}

/** Expose raw env values for diagnostic endpoints / setup scripts. */
export const appwriteConfig = {
  endpoint: APPWRITE_ENDPOINT,
  projectId: APPWRITE_PROJECT_ID,
  hasApiKey: APPWRITE_API_KEY.length > 0,
};
