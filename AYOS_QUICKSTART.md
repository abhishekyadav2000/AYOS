# AYOS - Quick Start Guide

## Accessing the OS
Visit: **http://localhost:3001/os** (or :3000 depending on port availability)

Or click **AYOS** in the navigation menu.

## Using AYOS

### Opening Windows
1. Click any app icon in the taskbar at the bottom
2. Available apps:
   - **About** - Abhishek's bio
   - **Projects** - Portfolio projects
   - **Resume** - Career information
   - **Contact** - Contact details
   - **Socials** - LinkedIn & GitHub links
   - **Privacy** - Privacy information

### Search
1. Click the **Search icon** (magnifying glass) in taskbar
2. Start typing to search:
   - Apps by name
   - Projects by title, description, or tags
   - Blog posts
3. Navigate with arrow keys, select with Enter
4. Press ESC to close search

### Window Controls
- **Move**: Drag the title bar
- **Resize**: Drag any edge or corner
- **Minimize**: Click minus button
- **Maximize/Restore**: Click square button
- **Close**: Click X button
- **Snap**: Click three dots menu on title bar

### Snap Layouts
Click the **three dots menu** on any window to:
- Snap to Left Half (50%)
- Snap to Right Half (50%)
- Maximize (100%)
- Snap to Top Left Quarter
- Snap to Top Right Quarter

### Snap by Dragging
Drag window near screen edges:
- **Left edge** → Snaps to left half
- **Right edge** → Snaps to right half
- **Top edge** → Maximizes
- **Top-left corner** → Snaps to top-left quarter
- **Top-right corner** → Snaps to top-right quarter

## Technical Info

**Framework**: Next.js 16.1.5 with App Router
**Styling**: Tailwind CSS + Framer Motion
**Window Management**: react-rnd
**State Management**: React Context

**Build**: `npm run build` ✅
**Run**: `npm run dev` (port 3001)

## File Structure
```
src/
├── app/
│   └── os/
│       └── page.tsx
├── components/
│   └── os/
│       ├── WindowManager.tsx (Context)
│       ├── Window.tsx (Window component)
│       ├── SearchPanel.tsx (Search UI)
│       ├── Taskbar.tsx (Taskbar)
│       └── OSPage.tsx (Main OS)
└── lib/
    └── windowManager.ts (Types & logic)
```

## Keyboard Shortcuts
- **ESC** - Close search panel
- **Arrow Up/Down** - Navigate search results
- **Enter** - Open selected result
- **Ctrl+L** - Focus search (in future versions)

## Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Recommended: Desktop browsers

## Known Limitations
- Mobile: Snap layouts disabled (full window only)
- Blog search: Currently disabled (ready to integrate)
- File explorer: Not yet implemented

## Support
For issues or feature requests, contact: abhishekyadav@my.unt.edu

---
**Version**: 1.0.0  
**Last Updated**: January 2026  
**Creator**: Abhishek Yadav
