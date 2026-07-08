import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Rate limiting store (in-memory, per-edge-instance).
 * In production this would use Redis or Upstash.
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 100; // 100 requests per minute per IP

function getRateLimitResponse(ip: string): NextResponse | null {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return null;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: "Rate limit exceeded", message: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((entry.resetTime - now) / 1000)),
          "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(entry.resetTime),
        },
      }
    );
  }

  return null;
}

/**
 * Security & Performance Middleware
 * - Adds security headers (CSP, X-Frame-Options, etc.)
 * - Rate limiting on API routes (100 req/min per IP)
 * - CORS for API routes
 * - Admin route protection
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Get client IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown";

  // API routes — CORS + rate limiting
  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }

    // Rate limiting (skip health check)
    if (!request.nextUrl.pathname.startsWith("/api/health")) {
      const limited = getRateLimitResponse(ip);
      if (limited) return limited;

      // Add rate limit headers to successful responses
      const entry = rateLimitMap.get(ip);
      if (entry) {
        response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT_MAX));
        response.headers.set("X-RateLimit-Remaining", String(Math.max(0, RATE_LIMIT_MAX - entry.count)));
        response.headers.set("X-RateLimit-Reset", String(entry.resetTime));
      }
    }
  }

  // Admin route protection
  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.svg|manifest|products|ingredients|brand|robots.txt|sitemap.xml).*)"],
};
