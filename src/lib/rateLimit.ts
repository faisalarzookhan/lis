import { NextRequest, NextResponse } from 'next/server';

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
  statusCode?: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (for production, use Redis or similar)
const rateLimitStore: RateLimitStore = {};

export function rateLimit(options: RateLimitOptions) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100,
    message = 'Too many requests, please try again later.',
    statusCode = 429,
  } = options;

  return (request: NextRequest) => {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const key = `${ip}:${request.nextUrl.pathname}`;
    const now = Date.now();

    // Clean up expired entries
    Object.keys(rateLimitStore).forEach((storeKey) => {
      if (rateLimitStore[storeKey].resetTime < now) {
        delete rateLimitStore[storeKey];
      }
    });

    const current = rateLimitStore[key];

    if (!current || current.resetTime < now) {
      // First request or window expired
      rateLimitStore[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return null; // Allow request
    }

    if (current.count >= maxRequests) {
      // Rate limit exceeded
      const resetTime = new Date(current.resetTime);
      const response = NextResponse.json(
        {
          error: message,
          retryAfter: Math.ceil((current.resetTime - now) / 1000),
        },
        {
          status: statusCode,
          headers: {
            'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetTime.toISOString(),
          },
        }
      );
      return response;
    }

    // Increment counter
    current.count++;
    return null; // Allow request
  };
}

// Pre-configured rate limiters
export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  message: 'Too many requests. Please slow down.',
});

export const moderateRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Rate limit exceeded. Please try again later.',
});

export const lenientRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 1000,
  message: 'Rate limit exceeded. Please try again later.',
});
