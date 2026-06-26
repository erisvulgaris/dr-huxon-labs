import { NextResponse } from "next/server";

import { fetchCoupons } from "@/lib/appwrite/service";

export const dynamic = "force-dynamic";

/**
 * GET /api/coupons
 * Returns all active coupons. Falls back to the local coupon list when
 * Appwrite is unreachable.
 */
export async function GET() {
  try {
    const coupons = await fetchCoupons();
    return NextResponse.json({ coupons });
  } catch (err) {
    console.error("[api/coupons] error:", err);
    return NextResponse.json(
      { error: "Failed to load coupons." },
      { status: 500 }
    );
  }
}
