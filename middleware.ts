import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 100; // requests
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || userLimit.resetTime < windowStart) {
    // Reset or new user
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
  } else {
    if (userLimit.count >= RATE_LIMIT) {
      return NextResponse.json(
        { error: "Too many requests, please try again later." },
        { status: 429 }
      );
    }
    userLimit.count++;
  }

  // Admin route protection
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Check for admin authentication token
    const authToken = request.cookies.get("admin_auth_token")?.value;
    const authExpiry = request.cookies.get("admin_auth_expiry")?.value;

    if (!authToken || !authExpiry) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const expiry = new Date(authExpiry);
    if (expiry < new Date()) {
      // Token expired
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin_auth_token");
      response.cookies.delete("admin_auth_expiry");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"], // Apply to API routes and admin routes
};
