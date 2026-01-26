# Security Policy

## Reporting a Vulnerability

- Please report security issues privately via email: security@abhishekyadav.dev
- Provide a clear description, reproduction steps, and impact assessment.
- We aim to acknowledge reports within 72 hours and provide a remediation plan within 14 days for High/Critical issues.

## Supported Versions

- Active development branch: main
- We do not support older releases; please update to the latest version.

## Disclosure Policy

- Do not publicly disclose vulnerabilities until a fix is released and deployed.
- We follow responsible disclosure practices. Coordinated release notes will be provided for impactful fixes.

## Security Controls in This Repo

- SAST: Semgrep in CI (PRs and pushes)
- Dependency scanning: npm audit (fails on High+)
- Secret scanning: Gitleaks (fails on any findings)
- Security headers: Configured via Next.js
- XSS protections: DOMPurify sanitization for MDX content
- Rate limiting: Contact API route limited to 5 requests / 15 minutes per IP

## Best Practices for Contributors

- Never commit secrets. Use environment variables and secret managers.
- Validate and sanitize all inputs (use Zod schemas in src/lib/validation.ts).
- Avoid using dangerouslySetInnerHTML; when necessary, sanitize content first.
- Keep dependencies updated; prefer minor/patch updates.
- Add tests for security-relevant changes.

## Responsible Use of Third-Party Services

- Use least-privilege API keys.
- Rotate keys regularly and revoke unused credentials.
- Document any new external integrations in PRs.
