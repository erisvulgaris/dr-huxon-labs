import { NextResponse } from "next/server";

import { fetchIngredients } from "@/lib/appwrite/service";

export const dynamic = "force-dynamic";

/**
 * GET /api/ingredients
 * Returns every brand ingredient with origin, benefits, quality score.
 */
export async function GET() {
  try {
    const ingredients = await fetchIngredients();
    return NextResponse.json({ ingredients });
  } catch (err) {
    console.error("[api/ingredients] error:", err);
    return NextResponse.json(
      { error: "Failed to load ingredients." },
      { status: 500 }
    );
  }
}
