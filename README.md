# Production-Ready Next.js Portfolio Website

A modern, fully-featured portfolio website built with Next.js 16, TypeScript, Tailwind CSS, and Framer Motion.

## 🎯 Features

### Core Technologies
- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for smooth animations
- **MDX** support for blog posts
- **Gray Matter** for frontmatter parsing
- **Marked** for markdown to HTML conversion
- **Lucide React** for icons
- **clsx & Tailwind Merge** for utility classes

### Design System
- Dark theme with black background
- Cyan (#22d3ee) and Indigo (#6366f1) accent colors
- Glass morphism effects
- 60px grid background pattern
- Responsive design (mobile-first)
- Smooth scroll behavior

### Pages & Features
1. **Home Page** - Hero section with 10 major sections:
   - Hero (with CTA buttons)
   - Proof Strip (statistics)
   - About Me
   - Services (4 key services)
   - Projects (3 featured projects)
   - Skills (organized by category)
   - Blog Preview (latest 3 posts)
   - Principles (4 core principles)
   - Contact CTA
   - Footer

2. **Blog System**
   - MDX-based blog with frontmatter metadata
   - Static generation for performance
   - Reading time estimation
   - Tag support
   - Date-based sorting
   - Author attribution

3. **Projects Page** - Full project showcase with tags and links

4. **Contact Page** - Complete contact form with:
   - Email validation
   - Success/error states
   - Contact information cards
   - Form submission to `/api/contact` endpoint

5. **SEO Support**
   - Sitemap generation (`/sitemap.xml`)
   - Robots.txt configuration
   - Meta tags and Open Graph support
   - Structured metadata

## 🗂️ Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with Navbar & Footer
│   ├── page.tsx             # Home page with 10 sections
│   ├── globals.css          # Global styles & dark theme
│   ├── sitemap.ts           # SEO sitemap
│   ├── robots.ts            # Robots.txt
│   ├── blog/
│   │   ├── page.tsx         # Blog listing
│   │   └── [slug]/
│   │       └── page.tsx     # Individual blog post
│   ├── projects/
│   │   └── page.tsx         # Projects showcase
│   ├── contact/
│   │   └── page.tsx         # Contact form
│   └── api/
│       ├── contact/
│       │   └── route.ts     # Contact form handler
│       └── posts/
│           └── route.ts     # Blog posts API
├── components/
│   ├── ui/
│   │   ├── Container.tsx    # Layout container
│   │   ├── Button.tsx       # Reusable button
│   │   ├── Card.tsx         # Card component with glass effect
│   │   ├── Tag.tsx          # Tag/badge component
│   │   └── index.ts
│   ├── motion/
│   │   └── MotionWrap.tsx   # Framer Motion scroll effects
│   ├── nav/
│   │   ├── Navbar.tsx       # Navigation bar
│   │   └── MobileMenu.tsx   # Mobile menu
│   └── sections/
│       ├── Hero.tsx
│       ├── ProofStrip.tsx
│       ├── About.tsx
│       ├── Services.tsx
│       ├── Projects.tsx
│       ├── Skills.tsx
│       ├── BlogPreview.tsx
│       ├── Principles.tsx
│       ├── Contact.tsx
│       ├── Footer.tsx
│       └── index.ts
├── config/
│   └── site.ts              # Site configuration
├── lib/
│   ├── utils.ts             # Utility functions (cn)
│   └── mdx.ts               # MDX parsing utilities
content/
├── posts/
│   ├── nextjs-portfolio.mdx
│   ├── web-design-principles.mdx
│   └── typescript-guide.mdx
public/                       # Static assets (place images here)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (includes npm)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Customization

### Update Site Configuration
Edit `src/config/site.ts`:
- Update `name`, `title`, `tagline`
- Add your email and social links
- Customize highlights, services, projects, and skills

### Modify Theme Colors
Edit `src/app/globals.css`:
- Change accent colors (update Tailwind classes)
- Adjust grid background pattern
- Modify responsive breakpoints

### Add Blog Posts
Create MDX files in `content/posts/`:

```mdx
---
title: "Your Post Title"
description: "Brief description"
date: "2024-01-20"
author: "Your Name"
tags: ["tag1", "tag2"]
published: true
---

# Your Post Content

Your markdown content here...
```

### Update Navigation
Edit `src/components/nav/Navbar.tsx`:
- Add/remove navigation links
- Customize styling
- Modify mobile menu behavior

## 🔧 API Endpoints

- **POST /api/contact** - Handle contact form submissions
- **GET /api/posts** - Fetch all blog posts (used by BlogPreview)

### Contact Form
The contact form currently logs submissions. To send emails, integrate:
- **Nodemailer** for email sending
- **SendGrid/Mailgun** for email services
- **Slack webhooks** for notifications
- **MongoDB/PostgreSQL** for database storage

## 📝 Component API Reference

### Button Component
```tsx
<Button 
  variant="primary|secondary|ghost"  // default: 'primary'
  size="sm|md|lg"                    // default: 'md'
  asChild={false}                    // wrap Link elements
  disabled={false}
>
  Click me
</Button>
```

### Card Component
```tsx
<Card hoverable={true} className="custom-class">
  Content with glass effect
</Card>
```

### MotionWrap Component
```tsx
<MotionWrap 
  direction="up|down|left|right"     // default: 'up'
  delay={0.1}
  className="custom-class"
>
  Content with scroll animation
</MotionWrap>
```

## 🔒 Environment Variables

Create a `.env.local` file for any environment-specific variables:
```env
# Add any necessary environment variables here
```

## 📊 Performance

- **Turbopack** enabled for faster development
- **Static generation** for blog posts and pages
- **Image optimization** with Next.js Image component
- **Font optimization** with Google Fonts
- **Code splitting** and lazy loading
- **CSS optimization** with Tailwind CSS

## 🌐 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Other Platforms
The project is compatible with:
- Netlify
- AWS Amplify
- GitHub Pages (with static export)
- Docker containers
- Traditional Node.js hosting

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [MDX](https://mdxjs.com)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and customize it for your portfolio. If you make improvements, consider sharing them back!

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
