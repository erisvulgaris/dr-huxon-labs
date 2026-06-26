import { NextResponse } from "next/server";

import { validateCoupon } from "@/lib/appwrite/service";

export const dynamic = "force-dynamic";

type ValidateBody = {
  code?: unknown;
  subtotal?: unknown;
};

/**
 * POST /api/coupons/validate
 * Body: { code: string, subtotal: number }
 * Returns: { valid: boolean, discount: number, message: string }
 */
export async function POST(req: Request) {
  let body: ValidateBody;
  try {
    body = (await req.json()) as ValidateBody;
  } catch {
    return NextResponse.json(
      { valid: false, discount: 0, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const code = typeof body.code === "string" ? body.code.trim() : "";
  const subtotal = Number(body.subtotal);

  if (!code) {
    return NextResponse.json(
      { valid: false, discount: 0, message: "Coupon code is required." },
      { status: 400 }
    );
  }
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    return NextResponse.json(
      { valid: false, discount: 0, message: "Subtotal must be a non-negative number." },
      { status: 400 }
    );
  }

  try {
    const result = await validateCoupon(code, subtotal);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/coupons/validate] error:", err);
    return NextResponse.json(
      { valid: false, discount: 0, message: "Could not validate coupon right now." },
      { status: 500 }
    );
  }
}
