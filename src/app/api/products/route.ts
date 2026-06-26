import { NextResponse } from "next/server";

import { fetchProducts } from "@/lib/appwrite/service";

export const dynamic = "force-dynamic";

/**
 * GET /api/products
 * Returns the full product catalogue. Always 200 — falls back to the local
 * catalog when Appwrite is unreachable.
 */
export async function GET() {
  try {
    const products = await fetchProducts();
    return NextResponse.json({ products });
  } catch (err) {
    console.error("[api/products] error:", err);
    return NextResponse.json(
      { error: "Failed to load products." },
      { status: 500 }
    );
  }
}
