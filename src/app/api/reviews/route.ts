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

/**
 * POST /api/reviews
 * Submit a new product review.
 * Body: { productId, author, rating, title, body }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, author, rating, title, body: reviewBody } = body;

    // Validate
    if (!productId || !author || !title || !reviewBody) {
      return NextResponse.json(
        { error: "Missing required fields: productId, author, title, body" },
        { status: 400 }
      );
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be a number between 1 and 5" },
        { status: 400 }
      );
    }
    if (title.length < 3) {
      return NextResponse.json(
        { error: "Title must be at least 3 characters" },
        { status: 400 }
      );
    }
    if (reviewBody.length < 10) {
      return NextResponse.json(
        { error: "Review body must be at least 10 characters" },
        { status: 400 }
      );
    }

    // In production, this would save to Appwrite/Prisma
    // For now, return success with the review object
    const review = {
      id: `rev-${Date.now()}`,
      productId,
      author: String(author).slice(0, 50),
      rating: Math.round(rating),
      title: String(title).slice(0, 80),
      body: String(reviewBody).slice(0, 500),
      verified: true,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { review, message: "Review submitted successfully. It will be visible after moderation." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[api/reviews] POST error:", err);
    return NextResponse.json(
      { error: "Failed to submit review." },
      { status: 500 }
    );
  }
}
