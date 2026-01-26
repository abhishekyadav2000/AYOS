# [SECURITY] Contact API Abuse — Rate Limiting + Validation

## Finding
**Severity:** 🔴 HIGH  
**CWE:** CWE-770 (Allocation of Resources Without Limits or Throttling), CWE-20 (Improper Input Validation)

### Affected Components
- [src/app/api/contact/route.ts](../src/app/api/contact/route.ts)

### Root Cause
The `POST /api/contact` endpoint lacked both rate limiting and comprehensive input validation. This made it vulnerable to:
- **Automated spam** and **DoS attacks** via high request volume
- **Large payload submissions** (e.g., 10MB `message`) causing memory exhaustion
- **HTML/script injection** in logs or future email integrations

## Exploit Scenario

### Attack: DoS via Excessive Requests
1. Attacker runs bot to send requests continuously:
```bash
while true; do curl -X POST https://site/api/contact -d '{"name":"a","email":"a@b.com","message":"hi"}' -H 'Content-Type: application/json'; done
```
2. No rate limiting → Server spends CPU/memory on each request
3. Service degraded → Contact form unusable

### Attack: Large Payload DoS
1. Attacker sends 50MB `message` field repeatedly
2. Server attempts to process and log message
3. Memory increases sharply, potential crash

### Future Attack: Email Injection
1. When email sending is integrated, unsanitized HTML could inject scripts into HTML emails

## Fix Summary

**Implemented Solution:** In-memory rate limiting with input validation using Zod.

### Changes Made

#### 1. Rate Limiter Utility
**File:** [src/lib/rateLimit.ts](../src/lib/rateLimit.ts)
- Per-IP rate limit: **5 requests per 15 minutes**
- Headers returned: `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Safe fallback IP: `unknown` (limits all unidentified clients together)

#### 2. Validation Utility with Zod
**File:** [src/lib/validation.ts](../src/lib/validation.ts)
- `name`: 2-100 chars, alphanumeric + basic punctuation
- `email`: valid format, max 255 chars
- `message`: 10-5000 chars
- `sanitizeForLog()`: remove control characters, `<script>` tags, limit length

#### 3. Contact API Integration
**File:** [src/app/api/contact/route.ts](../src/app/api/contact/route.ts)
- Rate limit check at start of `POST`
- Validation before processing payload
- Sanitize values before logging and composing email content
- Use environment variable `CONTACT_EMAIL` for recipient (fallback to current default)
- Return rate-limit headers for client awareness

### Example Response on Rate Limit Exceeded
```json
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 742
}
```
Headers:
```
Retry-After: 742
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2026-01-26T12:34:56.000Z
```

## Tests / Verification

### Build Verification
```bash
npm run build
# ✅ PASSED: Build completes, routes generated
```

### Manual API Tests
1. Normal submission → `200 OK`, success message
2. Invalid email → `400 Bad Request`, `Validation failed`
3. Excessive requests → `429 Too Many Requests` with `Retry-After`

### Security Behaviors
- Logs contain sanitized values to prevent log injection
- Large message submissions rejected by validation
- Rate limit prevents spam/abuse

## Risk Reduction

**Before Fix:**
- Risk Level: 🔴 HIGH
- DoS via spam and large payloads
- Log injection potential

**After Fix:**
- Risk Level: 🟡 MEDIUM → 🟢 LOW for typical attacks
- Abuse limited to 5 requests per 15 minutes per IP
- Input strictly validated

**Residual Risks:**
- In-memory limiter not distributed across servers (acceptable for small deployments)
- Future email integration must validate HTML templates

## Breaking Changes

**None.**

- Response format includes additional headers
- Rate limiting may affect automated testing if not accounted for

## Follow-Ups

### Immediate (Included in PR)
- [x] Implement rate limiting and validation
- [x] Add `.env.example` for `CONTACT_EMAIL`

### Short-Term
- [ ] Integrate Redis-based rate limiter for distributed deployments (e.g., Upstash)
- [ ] Add CAPTCHA (Cloudflare Turnstile/hCaptcha) to UI

### Long-Term
- [ ] Comprehensive monitoring for abuse patterns
- [ ] Email service integration with HTML sanitization

## References

- **OWASP Rate Limiting:** https://cheatsheetseries.owasp.org/cheatsheets/Rate_Limiting_Cheat_Sheet.html
- **Zod:** https://zod.dev/
- **HTTP Rate Limit Headers:** https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers

---

**Reviewed By:** Security Engineer Agent  
**Date:** January 26, 2026  
**Approved for Merge:** ✅ (Pending code review)
