# Copilot Instructions for Portfolio Website

## Project Overview

**Production-ready Next.js 16 portfolio website** with TypeScript, Tailwind CSS, and Framer Motion. Features include:
- Multi-section home page (Hero, About, Services, Projects, Blog Preview, Contact, etc.)
- MDX-based blog system with security sanitization
- Interactive Windows 11 OS page (optional feature)
- Contact form with rate limiting and validation
- Security headers and XSS protection built-in

**Key Technologies**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion, Zod, DOMPurify

---

## Critical Architecture Patterns

### 1. **Data Flow & Content Management**
- **Config-driven**: Site content lives in `src/config/site.ts` (name, projects, skills, services, social links)
- **MDX Blog System**: Posts stored as `.mdx` files in `content/posts/` → parsed via `src/lib/mdx.ts` using `gray-matter` + `marked` + `DOMPurify`
- **Security**: All markdown is sanitized via DOMPurify before rendering (XSS prevention for blog posts)
- **Pattern**: Use `"use server"` in `src/lib/mdx.ts` for filesystem operations; React Server Components handle post fetching

### 2. **API Routes & Request Handling**
- **Contact API** (`src/app/api/contact/route.ts`): 
  - Input validation via Zod schema (`src/lib/validation.ts`)
  - Rate limiting: 5 requests per 15 minutes per IP (in-memory, see `src/lib/rateLimit.ts`)
  - Returns 429 with `Retry-After` header when rate limited
- **Posts API** (`src/app/api/posts/route.ts`): Fetches all blog posts
- **Security**: Rate limiter uses client IP extraction via `x-forwarded-for` header (Vercel-compatible)

### 3. **Component Structure & Motion**
- **UI Primitives** in `src/components/ui/`: `Button`, `Card`, `Container`, `Tag` (glass morphism design)
- **Motion Wrapper** (`src/components/motion/MotionWrap.tsx`): Handles scroll-triggered animations
  - Uses `useInView` from Framer Motion with `once: true` + `amount: 0.3`
  - Supports directional animations (up, down, left, right)
  - Delay prop for staggered animations
- **Section Components** in `src/components/sections/`: Hero, About, Services, Projects, Blog, Contact, Footer (each wraps content in `<MotionWrap>`)
- **Client vs Server**: All components with interactivity use `"use client"`; layout, metadata, and data fetching use server components

### 4. **Security & Validation**
- **Zod Schemas** (`src/lib/validation.ts`): 
  - Contact form: name (2-100 chars, alphanumeric), email (RFC 5321 limit), message (10-5000 chars)
  - Regex validation to prevent injection
- **DOMPurify Sanitization** (`src/lib/mdx.ts`): Whitelisted HTML tags and attributes for blog posts
- **Security Headers** (via `next.config.ts`):
  - CSP, HSTS, X-Frame-Options, X-XSS-Protection, Referrer-Policy
  - Blocks cameras, microphones, geolocation via Permissions-Policy
- **Test Coverage**: `src/lib/__tests__/mdx-security.test.ts` validates XSS prevention

---

## Developer Workflows

### Building & Running
```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build
npm start         # Start production server
npm run lint      # Run ESLint (Next.js + TypeScript config)
```

### Adding Content
- **Blog posts**: Create `.mdx` file in `content/posts/` with frontmatter (title, description, date, tags, published)
- **Projects/Services**: Edit `src/config/site.ts` directly
- **Pages**: Add `.tsx` files in `src/app/` (Next.js file-based routing)

### Testing
- No test runner configured; tests are example-only (`src/lib/__tests__/mdx-security.test.ts`)
- For new features: add test files in `__tests__` directories and update scripts in `package.json`

### Debugging
- **Rate limit issues**: Check `src/lib/rateLimit.ts` for IP extraction logic
- **Markdown rendering**: Verify blog post frontmatter format matches PostMetadata interface in `src/lib/mdx.ts`
- **Missing styling**: Check Tailwind config (`tailwind.config.ts`) and globals.css for theme variables

---

## Project-Specific Conventions

### Color Scheme & Tokens
- **Primary accent**: Cyan (`#22d3ee`), Indigo (`#6366f1`)
- **Background**: Black with 60px grid pattern (CSS)
- **Glass morphism**: `bg-white/10 backdrop-blur-lg` pattern
- **Theme**: Dark-first (defined in globals.css)

### Naming Conventions
- Components: PascalCase (e.g., `MotionWrap.tsx`)
- Config objects: camelCase (e.g., `siteConfig`)
- Utilities: camelCase functions (e.g., `sanitizeForLog`)
- Types: Export as-is from Zod or define with `type` keyword

### Import Path Aliases
- Use `@/` for absolute imports to `src/` (configured in `tsconfig.json`)
- Example: `import { siteConfig } from "@/config/site"`

### File Organization
- Page components in `src/app/`
- Reusable components in `src/components/` (sorted by type: ui, sections, nav, etc.)
- Configuration in `src/config/`
- Utilities & business logic in `src/lib/`
- Third-party integrations in `src/features/`

---

## Integration Points & External Dependencies

### Environment Variables
- `CONTACT_EMAIL`: Recipient for contact form submissions (defaults to hardcoded email in `src/app/api/contact/route.ts`)
- Add to `.env.local` for local development

### External Packages
- **UI/Animation**: Framer Motion, Lucide React, Tailwind CSS
- **Markdown**: gray-matter, marked, @next/mdx
- **Validation**: Zod
- **Security**: isomorphic-dompurify
- **Utilities**: clsx, tailwind-merge, reading-time

### Third-Party Service Integration
- Contact form currently logs to console; ready to integrate email service (Resend, SendGrid, Mailgun)
- See comment in `src/app/api/contact/route.ts` for implementation guidance

---

## When Stuck

1. **Blog post not rendering?** → Check frontmatter in `.mdx` file matches PostMetadata in `src/lib/mdx.ts`
2. **Form validation failing?** → Review Zod schema in `src/lib/validation.ts`
3. **Rate limiting issues?** → Check client IP extraction and reset time logic in `src/lib/rateLimit.ts`
4. **Animation not triggering?** → Verify parent is wrapped in `<MotionWrap>` with correct `delay` prop
5. **Style not applying?** → Check Tailwind purge paths in `tailwind.config.ts` and globals.css theme tokens
6. **Type errors?** → Run `tsc --noEmit` to catch TypeScript issues
