# Threat Model (Lite)

## Assets
- Portfolio website content (MDX posts)
- Contact form submissions (transient data)
- Build artifacts and configuration

## Entry Points
- Web routes: /, /blog, /blog/[slug], /contact, /projects, /os
- API: POST /api/contact, GET /api/posts
- CI/CD pipeline and repository access

## Trust Boundaries
- Untrusted user inputs: contact form fields (name, email, message)
- Author-controlled content: MDX files (must be sanitized before rendering)
- External integrations: future email providers, CDNs

## Threats
- XSS via MDX or unsafe HTML rendering
- DoS via excessive contact form submissions or large payloads
- Secret leakage via repository or logs
- Clickjacking and insecure resource loading
- Supply chain vulnerabilities in npm dependencies

## Controls
- DOMPurify sanitization for blog HTML
- HTTP security headers (CSP, HSTS, X-Frame-Options, etc.)
- Rate limiting and validation on contact API
- CI guardrails: Semgrep, npm audit, Gitleaks
- .env.example and .gitignore for secret hygiene

## Assumptions
- No authentication or sensitive backend data stores
- MDX content controlled by repository maintainers
- Deployment on HTTPS with HSTS enforced

## Residual Risks
- CSP includes 'unsafe-inline'/'unsafe-eval' (Next.js limitation); plan migration to nonces
- In-memory rate limiting not distributed; consider Redis for scale
- Dependency vulnerabilities may emerge; continuous scanning mitigates

## Future Work
- CAPTCHA (Cloudflare Turnstile/hCaptcha) for contact form
- CSP violation reporting endpoint
- Dependabot/Snyk for automated dependency updates
- Monitoring and alerting for abuse patterns
