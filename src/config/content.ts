// Content configuration files - Single source of truth for all dynamic content

export const projectsConfig = [
  {
    id: 'ayos',
    title: 'AYOS - Interactive OS Portfolio',
    description: 'Windows 11-style web OS with apps, games, and local AI',
    url: 'https://github.com/abhishekyadav2000/AYOS',
    type: 'github'
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Platform',
    description: 'Full-stack marketplace with payments and inventory',
    url: 'https://github.com/abhishekyadav2000',
    type: 'github'
  },
  {
    id: 'dashboard',
    title: 'Analytics Dashboard',
    description: 'Real-time analytics and visualization system',
    url: 'https://github.com/abhishekyadav2000',
    type: 'github'
  },
  {
    id: 'ai-chatbot',
    title: 'AI Chatbot Assistant',
    description: 'GPT-powered chatbot with custom knowledge base',
    url: 'https://github.com/abhishekyadav2000',
    type: 'github'
  },
  {
    id: 'design-system',
    title: 'Design System & UI Kit',
    description: 'Reusable component library with documentation',
    url: 'https://github.com/abhishekyadav2000',
    type: 'github'
  },
];

export const socialsConfig = [
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/abhishekyadav2000',
    icon: 'github',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/itsmebro',
    icon: 'linkedin',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    url: 'https://youtube.com/@abhishekyadav',
    icon: 'youtube',
  },
  {
    id: 'twitter',
    label: 'X (Twitter)',
    url: 'https://x.com/abhishekyadav',
    icon: 'twitter',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    url: 'https://instagram.com/abhishekyadav',
    icon: 'instagram',
  },
];

export const storeConfig = [
  {
    id: 'react-templates',
    category: 'Digital Products',
    title: 'React Component Library',
    description: 'Pre-built production-ready components',
    price: 29.99,
    url: 'https://gumroad.com',
  },
  {
    id: 'nextjs-starter',
    category: 'Digital Products',
    title: 'Next.js Full-Stack Starter',
    description: 'Boilerplate with auth, DB, API',
    price: 49.99,
    url: 'https://gumroad.com',
  },
  {
    id: 'consulting',
    category: 'Services',
    title: '1-on-1 Consultation',
    description: 'Technical mentoring and code review',
    price: 99.00,
    url: 'https://calendly.com',
  },
  {
    id: 'web-dev-course',
    category: 'Courses',
    title: 'Modern Web Development',
    description: 'Complete guide to React & Next.js',
    price: 79.99,
    url: 'https://gumroad.com',
  },
];

export const fieldNotesConfig = [
  {
    id: 'building-os',
    title: 'Building an Interactive Web OS',
    date: '2025-01-27',
    excerpt: 'Lessons from creating AYOS: window management, persistence, and UX patterns',
    tags: ['web', 'systems', 'architecture'],
    content: `# Building an Interactive Web OS

When I started AYOS, I didn't realize I was building an entire operating system in the browser. Here's what I learned:

## Window Management is Hard
Managing z-index, focus, minimize/restore states, and multiple windows requires careful state design. Zustand made this manageable.

## Persistence Matters
localStorage is your friend. Users expect their files, settings, and game scores to persist across sessions.

## Keep It Minimal
The temptation to add every feature is real. Focus on core functionality first.

---

The codebase is open-source on GitHub. Feel free to fork and build something cool!`,
  },
  {
    id: 'ai-local-first',
    title: 'Local-First AI: Running Models in the Browser',
    date: '2025-01-20',
    excerpt: 'How to integrate Ollama and other local LLMs into web applications',
    tags: ['AI', 'ollama', 'local-llm'],
    content: `# Local-First AI: Running Models in the Browser

Privacy and performance are two of the biggest reasons to run AI locally.

## Why Local LLMs?
1. No data sent to external servers
2. Offline capability
3. Lower latency
4. Cost-effective at scale

## Ollama Integration
Ollama makes it dead simple to run models locally. Just point your API calls to http://localhost:11434 and you're good to go.

Check out the Notepad AI agent to see this in action!`,
  },
  {
    id: 'product-intuition',
    title: 'Building Products with Intuition',
    date: '2025-01-10',
    excerpt: 'First principles thinking about what users actually want',
    tags: ['product', 'design', 'business'],
    content: `# Building Products with Intuition

The best products are built by people who deeply understand their users—often because they ARE their users.

## Listen to Your Users
But also build for yourself first. If you don't love using your product, nobody else will either.

## Minimize Friction
Every extra click, every extra field in a form, every moment of confusion costs you users. Design for the happy path.

## Iterate Fast
Ship something imperfect. Get feedback. Iterate. Repeat.

The OS you're using right now started as a side project and evolved into something I'm genuinely proud of.`,
  },
];
