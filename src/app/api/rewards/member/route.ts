import { NextResponse } from "next/server";

import { fetchRewardMember } from "@/lib/appwrite/service";

export const dynamic = "force-dynamic";

/**
 * GET /api/rewards/member?email=arjun@example.com
 * Returns the reward member record for the given email, or 404 if unknown.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email")?.trim() || "";

  if (!email) {
    return NextResponse.json(
      { error: "Missing 'email' query parameter." },
      { status: 400 }
    );
  }

  // Cheap RFC-ish check — we don't need a perfect validator here.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format." },
      { status: 400 }
    );
  }

  try {
    const member = await fetchRewardMember(email);
    if (!member) {
      return NextResponse.json(
        { error: `No reward member found for "${email}".` },
        { status: 404 }
      );
    }
    return NextResponse.json({ member });
  } catch (err) {
    console.error("[api/rewards/member] error:", err);
    return NextResponse.json(
      { error: "Failed to load reward member." },
      { status: 500 }
    );
  }
}
