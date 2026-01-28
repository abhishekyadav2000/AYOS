"use client";

import React from "react";
import { Monitor, Globe2, Trash2, FileText, Calculator, Paintbrush, Folder, Users, Settings, User, GripVertical } from "lucide-react";
import { DesktopIcon } from "@/config/os";
import { motion, AnimatePresence, useDragControls, PanInfo } from "framer-motion";
import { useWindowStore } from "../state/useWindowStore";
import { appRegistry, AppId } from "../apps/registry";

const iconLookup: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "this-pc": Monitor,
  "notepad-ai": FileText,
  paint: Paintbrush,
  projects: Folder,
  socials: Users,
  about: User,
  settings: Settings,
  network: Globe2,
  "recycle-bin": Trash2,
  calculator: Calculator,
};

type DesktopIconsProps = {
  icons: DesktopIcon[];
  onOpen: (label: string, id: string) => void;
};

export function DesktopIcons({ icons, onOpen }: DesktopIconsProps) {
  const [toast, setToast] = React.useState<string | null>(null);
  const [iconPositions, setIconPositions] = React.useState<Record<string, { x: number; y: number }>>({});
  const openWindow = useWindowStore((s) => s.openWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  
  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  // Load positions from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('ayos-desktop-icon-positions');
    if (saved) {
      try {
        setIconPositions(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load icon positions', e);
      }
    }
  }, []);

  const handleDragEnd = (iconId: string, info: PanInfo) => {
    const newPositions = {
      ...iconPositions,
      [iconId]: {
        x: (iconPositions[iconId]?.x || 0) + info.offset.x,
        y: (iconPositions[iconId]?.y || 0) + info.offset.y,
      },
    };
    setIconPositions(newPositions);
    localStorage.setItem('ayos-desktop-icon-positions', JSON.stringify(newPositions));
  };

  const handleDoubleClick = (label: string, id: string) => {
    console.log('Desktop icon double-clicked:', { label, id });
    setToast(`${label} opening...`);
    const mapping: Record<string, { appId: AppId; folderId?: string }> = {
      "this-pc": { appId: "my-computer" },
      "recycle-bin": { appId: "recycle-bin" },
      calculator: { appId: "calculator" },
      "notepad-ai": { appId: "notepad" },
      paint: { appId: "paint" },
      settings: { appId: "settings" },
      about: { appId: "about" },
      projects: { appId: "my-computer", folderId: "projects" },
      socials: { appId: "my-computer", folderId: "social" },
    };
    const config = mapping[id];
    if (config && appRegistry[config.appId]) {
      console.log('Opening window for:', config.appId, 'with folder:', config.folderId);
      const newId = openWindow(config.appId, config.folderId ? { folderId: config.folderId } : undefined);
      focusWindow(newId);
    } else {
      console.log('No app found, calling onOpen');
      onOpen(label, id);
    }
  };

  return (
    <>
      {icons.map((icon, index) => {
        const Icon = iconLookup[icon.id] ?? Monitor;
        const position = iconPositions[icon.id] || { x: 0, y: 0 };
        const baseY = 32 + index * 100; // Top padding + spacing
        
        return (
          <motion.div
            key={icon.id}
            drag
            dragMomentum={false}
            dragElastic={0}
            onDragEnd={(_, info) => handleDragEnd(icon.id, info)}
            style={{
              position: 'fixed',
              left: 32,
              top: baseY,
              x: position.x,
              y: position.y,
              zIndex: 40,
            }}
            className="flex flex-col items-center gap-2 text-sm text-white/90 hover:text-white cursor-move select-none"
            onDoubleClick={() => handleDoubleClick(icon.label, icon.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="h-14 w-14 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-lg hover:bg-white/15 transition relative group">
              <Icon size={28} className="drop-shadow" />
              <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={12} className="text-white/40" />
              </div>
            </div>
            <span className="text-xs leading-tight text-center px-2 max-w-[80px] break-words">{icon.label}</span>
          </motion.div>
        );
      })}

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-2 w-52 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-xl p-3 text-xs text-white shadow-xl"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
