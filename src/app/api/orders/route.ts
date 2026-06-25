import { NextResponse } from "next/server";

import { submitOrder, type OrderPayload } from "@/lib/appwrite/service";

export const dynamic = "force-dynamic";

/**
 * POST /api/orders
 * Body: OrderPayload (customer + items + totals)
 * Returns: { orderId, orderNumber, status }
 *
 * We always return a synthetic order number even if Appwrite persistence
 * fails — checkout must never be blocked on infra issues.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const errors = validateOrderPayload(body);
  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Invalid order payload.", details: errors },
      { status: 400 }
    );
  }

  try {
    const result = await submitOrder(body as OrderPayload);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("[api/orders] error:", err);
    return NextResponse.json(
      { error: "Could not place order right now." },
      { status: 500 }
    );
  }
}

function validateOrderPayload(body: unknown): string[] {
  const errors: string[] = [];
  if (!body || typeof body !== "object") {
    return ["Body must be a JSON object."];
  }
  const b = body as Record<string, unknown>;

  const requiredStrings = [
    "customerName",
    "customerEmail",
    "customerPhone",
    "address",
    "city",
    "state",
    "pincode",
  ];
  for (const key of requiredStrings) {
    if (typeof b[key] !== "string" || (b[key] as string).trim().length === 0) {
      errors.push(`Missing or empty field: ${key}`);
    }
  }

  for (const key of ["subtotal", "total"]) {
    const v = Number(b[key]);
    if (!Number.isFinite(v) || v < 0) {
      errors.push(`Field "${key}" must be a non-negative number.`);
    }
  }

  if (!Array.isArray(b.items) || b.items.length === 0) {
    errors.push("Field 'items' must be a non-empty array.");
  } else {
    b.items.forEach((item, idx) => {
      const it = item as Record<string, unknown>;
      if (typeof it.productId !== "string" || it.productId.length === 0) {
        errors.push(`items[${idx}].productId is required.`);
      }
      if (typeof it.name !== "string" || it.name.length === 0) {
        errors.push(`items[${idx}].name is required.`);
      }
      const price = Number(it.price);
      if (!Number.isFinite(price) || price < 0) {
        errors.push(`items[${idx}].price must be a non-negative number.`);
      }
      const qty = Number(it.quantity);
      if (!Number.isFinite(qty) || qty < 1) {
        errors.push(`items[${idx}].quantity must be a positive integer.`);
      }
    });
  }

  return errors;
}
