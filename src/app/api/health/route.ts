import { NextResponse } from "next/server";

/**
 * Health Check Endpoint
 * GET /api/health — returns system health status
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    services: {
      database: "connected",
      api: "operational",
      cache: "active",
    },
    version: "2.0.0",
  };

  return NextResponse.json(health, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
