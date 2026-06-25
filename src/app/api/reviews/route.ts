import { NextResponse } from "next/server";

import { fetchReviews } from "@/lib/appwrite/service";

export const dynamic = "force-dynamic";

/**
 * GET /api/reviews?productId=p1
 * Returns all reviews, or reviews filtered by product id.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId") || undefined;
    const reviews = await fetchReviews(productId);
    return NextResponse.json({ reviews });
  } catch (err) {
    console.error("[api/reviews] error:", err);
    return NextResponse.json(
      { error: "Failed to load reviews." },
      { status: 500 }
    );
  }
}
