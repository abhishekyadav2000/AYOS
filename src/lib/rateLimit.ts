/**
 * Simple in-memory rate limiter for API routes
 * Uses IP address as identifier
 * 
 * Security Note: This is a basic implementation suitable for low-to-medium traffic.
 * For production at scale, consider:
 * - Redis-based rate limiting (Upstash, Vercel KV)
 * - Distributed rate limiting for multi-server deployments
 * - More sophisticated algorithms (token bucket, leaky bucket)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry>;
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.requests = new Map();
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    
    // Cleanup expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Check if request should be rate limited
   * @param identifier - IP address or other unique identifier
   * @returns { allowed: boolean, remaining: number, resetTime: number }
   */
  check(identifier: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
  } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    // No previous requests or window expired
    if (!entry || now >= entry.resetTime) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });

      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs,
      };
    }

    // Within rate limit
    if (entry.count < this.maxRequests) {
      entry.count++;
      this.requests.set(identifier, entry);

      return {
        allowed: true,
        remaining: this.maxRequests - entry.count,
        resetTime: entry.resetTime,
      };
    }

    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000), // seconds
    };
  }

  /**
   * Clean up expired entries to prevent memory leaks
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now >= entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  /**
   * Reset rate limit for specific identifier (useful for testing)
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * Get current stats (for monitoring/debugging)
   */
  getStats(): { totalTracked: number; maxRequests: number; windowMs: number } {
    return {
      totalTracked: this.requests.size,
      maxRequests: this.maxRequests,
      windowMs: this.windowMs,
    };
  }
}

// Singleton instance for contact form
// 5 requests per 15 minutes per IP
export const contactRateLimiter = new RateLimiter(5, 15 * 60 * 1000);

/**
 * Extract client IP address from Next.js request
 * Handles proxies and various deployment environments
 */
export function getClientIp(request: Request): string {
  // Check common proxy headers
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback to 'unknown' (will rate limit all together - safer than not rate limiting)
  return "unknown";
}
