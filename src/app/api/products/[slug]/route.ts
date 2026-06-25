import { NextResponse } from "next/server";

import { fetchProduct } from "@/lib/appwrite/service";

export const dynamic = "force-dynamic";

/**
 * GET /api/products/[slug]
 * Returns a single product by slug. 404 when not found locally either.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json(
      { error: "Missing slug." },
      { status: 400 }
    );
  }

  try {
    const product = await fetchProduct(slug);
    if (!product) {
      return NextResponse.json(
        { error: `No product found for slug "${slug}".` },
        { status: 404 }
      );
    }
    return NextResponse.json({ product });
  } catch (err) {
    console.error("[api/products/[slug]] error:", err);
    return NextResponse.json(
      { error: "Failed to load product." },
      { status: 500 }
    );
  }
}
