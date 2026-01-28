# AYOS Quick Reference Guide

## What You Have

A production-ready **Next.js portfolio website** that transforms into an **interactive Windows 11 OS** with AI capabilities.

```
Landing Page (Portfolio Showcase)
    ↓ (Scroll Down)
AYOS Desktop (Windows 11 Emulation)
    ↓ (Double-click)
16 Applications + 5 Games + AI Chat
```

---

## 🚀 Launch AYOS Now

```bash
cd /Users/abhshek/Desktop/mywebsite
npm run dev
# Visit http://localhost:3000
```

**First Time**:
1. See portfolio landing page
2. Scroll down to enter AYOS
3. Desktop appears with taskbar and icons
4. Double-click any icon to open apps

---

## 📦 What's Included

### 16 Applications
- **My Computer** - File explorer (4 main folders + system folders)
- **Notepad** - Text editor with AI (when Ollama installed)
- **Calculator** - Full calculator with history
- **Paint** - Drawing app with colors
- **Field Notes** - Blog reader
- **Terminal** - Command line
- **Tasks** - Todo list
- **Chat** - AI chat interface
- **And 8 more...** (Settings, About, Media Player, Photo Viewer, etc.)

### 5 Playable Games
- **Snake** - Eat food, grow, high score
- **2048** - Merge tiles to reach 2048
- **Tetris** - Stack falling blocks
- **Breakout** - Ball and paddle
- **Pacman** - Eat pellets, avoid ghosts

All games have **scoring systems** - your scores are saved locally.

### File System
```
📁 This PC
├── 📁 Projects (6 portfolio links)
├── 📖 Blog & Stories (field notes)
├── 📱 Social Media (9 social links)
├── 🛍️ Store (services)
├── 📁 Documents
├── 📁 Downloads
├── 📁 Pictures
└── 💾 Drives (C: and D:)
```

### AI Features (Optional Setup)
- **Notepad AI** with intelligent suggestions
- Chat with local AI models
- No internet required (runs locally)

---

## 🎯 Key Features

### ✨ Interactive
- Real Windows 11 OS emulation
- Draggable windows
- Taskbar with active windows
- Desktop icons that actually work
- Double-click to open, right-click for menu

### 🎮 Games & Scoring
- 5 fully functional games
- Real-time scoring
- High scores saved to browser
- Try to beat your records

### 🤖 AI Powered
- Ollama integration ready
- Notepad AI with model selection
- 6 specialized agents available
- No API keys needed (all local)

### 🎨 Beautiful Design
- Dark theme with glass morphism
- Smooth animations (Framer Motion)
- Fully responsive
- Professional typography

### 📝 Blog Integration
- Read blog posts in OS
- MDX-based content
- Field Notes app included
- XSS-protected rendering

### 🔒 Secure
- XSS protection
- Rate limiting on APIs
- Security headers included
- No sensitive data exposed

---

## 🧠 How to Use Key Apps

### My Computer (File Explorer)
1. Double-click "📁 My Computer" on desktop
2. Click any folder to open it
3. Double-click files (links) to open them
4. See file properties and preview

### Notepad AI (with Ollama)
1. **Optional**: Install Ollama (see below)
2. Double-click "Notepad AI"
3. Write or paste text
4. Click "Suggest" for AI improvements
5. Chat with AI at bottom
6. Switch models from dropdown

### Games
1. Double-click any game (Snake, 2048, etc.)
2. Game instructions appear
3. Play and earn points
4. Close when done - scores save automatically
5. Open "High Scores" to see your records

### Settings
- Adjust OS display settings
- Manage themes
- Configure applications
- View system information

---

## 🤖 AI Setup (Optional)

### Step 1: Download Ollama
Visit **https://ollama.ai** and download for your OS (macOS, Linux, Windows)

### Step 2: Install Models
Open terminal and run:
```bash
# Fast model (recommended to start)
ollama pull neural-chat

# Or other models
ollama pull mistral
ollama pull llama2
```

### Step 3: Start Server
```bash
ollama serve
```

### Step 4: Use in AYOS
- Open Notepad AI in AYOS
- Green "Ollama Ready" badge appears
- Select model from dropdown
- Start chatting!

### Models Available
- `neural-chat` (4B) - Fast ⚡
- `mistral` (7B) - Balanced ⚖️
- `llama2` (7B) - Powerful 🔥
- `orca-mini` (3B) - Ultra-fast ⚡
- `openchat` (7B) - Conversational

---

## 📱 Your Portfolio Features

### Landing Page
Shows off your work with:
- Hero section with intro
- About section
- Services you offer
- Projects showcase
- Blog preview
- Contact form (rate-limited)

### AYOS Portfolio
Shows off your skills through:
- Organized file system
- Working applications
- Playable games
- AI integration
- Professional design

---

## 🔧 Common Tasks

### Change Portfolio Content
Edit `/src/config/site.ts`:
- Your name and title
- Project links
- Social profiles
- Services offered
- Skills list

### Add Blog Posts
Create file in `/content/posts/`:
```markdown
---
title: "Post Title"
description: "Summary"
date: "2024-01-15"
tags: ["tag1", "tag2"]
published: true
---

Your blog content here...
```

### Customize Theme Colors
Edit `/src/app/globals.css`:
```css
:root {
  --color-primary: #22d3ee;      /* Change these */
  --color-secondary: #6366f1;
  --color-accent: #ec4899;
}
```

### Deploy to Production
```bash
npm run build
npm start

# Or deploy to Vercel
vercel deploy --prod
```

---

## 🐛 Troubleshooting

### Dev server won't start
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
npm install

# Try again
npm run dev
```

### Scroll doesn't enter AYOS
- This was just fixed! ✅
- Try refreshing the page
- Clear browser cache

### AI responses slow
- Use a faster model: `neural-chat`
- Close other apps
- Check internet (for first model download)

### File folders empty
- Refresh the page
- Clear browser localStorage
- Check file system structure

### Games not saving scores
- Check if localStorage enabled
- Try in incognito mode to test
- Check browser console for errors

---

## 📊 Project Structure

```
/src
  ├── app/                    # Pages and layouts
  │   ├── page.tsx            # Landing page (scroll to enter)
  │   ├── os/page.tsx         # AYOS OS environment
  │   └── api/                # Backend routes
  ├── features/os/            # Windows 11 OS implementation
  │   ├── apps/               # 16 applications
  │   ├── components/         # OS UI components
  │   └── state/              # Zustand stores
  ├── lib/                     # Utilities and services
  │   ├── ollama.ts           # AI backend
  │   ├── agents.ts           # AI agents
  │   └── ...
  └── config/                 # Configuration
      ├── site.ts             # Portfolio content
      └── os.ts               # OS configuration
```

---

## 🚀 Next Steps

### To Deploy (Production)
1. Create Vercel account at vercel.com
2. Connect GitHub repo
3. Deploy with one click
4. Configure environment variables if needed

### To Extend Features
1. Add more apps (see apps/ folder structure)
2. Add more games (integrate canvas games)
3. Create custom agents
4. Implement themes
5. Add notifications system

### To Integrate External AI
For cloud AI (when Ollama not available):
- Use OpenAI API
- Use Anthropic Claude
- Create backend proxy
- See PHASE3_OLLAMA_SETUP.md for details

---

## 📚 Documentation

- **[IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)** - Complete project status
- **[docs/PHASE3_OLLAMA_SETUP.md](./docs/PHASE3_OLLAMA_SETUP.md)** - AI setup guide
- **[docs/PHASE4_AI_AGENTS.md](./docs/PHASE4_AI_AGENTS.md)** - Agent system
- **[docs/PHASE5_THEME_POLISH.md](./docs/PHASE5_THEME_POLISH.md)** - Polish guide
- **[README.md](./README.md)** - Original project info

---

## 💡 Tips & Tricks

### Keyboard Shortcuts
- `ESC` - Close windows
- `TAB` - Switch between apps (when implemented)
- `CTRL+C` - Copy text
- `CTRL+V` - Paste text

### Hidden Features
- Right-click desktop for context menu
- Drag windows around
- Click taskbar to minimize/restore
- Double-click title bar to maximize
- Resize windows from edges

### Performance Tips
- Close unused windows to free memory
- Restart OS if it gets sluggish
- Clear cache: Settings → Cache
- Use lighter models for faster AI

---

## 🎓 Learning

This project uses:
- **Next.js 16** - React framework with server components
- **TypeScript** - For type safety
- **Tailwind CSS** - For styling
- **Framer Motion** - For animations
- **Zustand** - For state management
- **Ollama** - For local AI models

Great portfolio and learning project!

---

## 📞 Support

**Issues?**
1. Check console for errors (F12 → Console)
2. See Troubleshooting section above
3. Check documentation files
4. Review GitHub issues

**Want to customize?**
1. Edit `/src/config/site.ts` for content
2. Modify `/src/app/globals.css` for colors
3. Add apps to `/src/features/os/apps/`
4. Update portfolio content in `/src/components/sections/`

---

## ✨ You're All Set!

Everything is ready to go. Your AYOS portfolio:
- ✅ Runs locally
- ✅ Has 16 apps
- ✅ Includes 5 games
- ✅ Supports local AI
- ✅ Looks professional
- ✅ Is production-ready

### Quick Start:
```bash
npm run dev
# Visit http://localhost:3000
# Scroll to enter AYOS
# Enjoy!
```

---

**Happy coding!** 🚀
