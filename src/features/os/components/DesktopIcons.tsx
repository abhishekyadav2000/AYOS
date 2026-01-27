"use client";

import React from "react";
import { Monitor, Globe2, Trash2, FileText, Calculator, Paintbrush, Folder, Users, Settings } from "lucide-react";
import { DesktopIcon } from "@/config/os";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowStore } from "../state/useWindowStore";
import { appRegistry, AppId } from "../apps/registry";

const iconLookup: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "this-pc": Monitor,
  "notepad-ai": FileText,
  paint: Paintbrush,
  projects: Folder,
  socials: Users,
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
  const openWindow = useWindowStore((s) => s.openWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const handleDoubleClick = (label: string, id: string) => {
    console.log('Desktop icon double-clicked:', { label, id });
    setToast(`${label} opening...`);
    const mapping: Record<string, AppId> = {
      "this-pc": "my-computer",
      "recycle-bin": "recycle-bin",
      calculator: "calculator",
      "notepad-ai": "notepad",
      paint: "paint",
      settings: "settings",
      projects: "my-computer", // Open My Computer to Desktop/Projects
      socials: "my-computer", // Open My Computer to Desktop/Social Media
    };
    const appId = mapping[id];
    console.log('Mapped appId:', appId);
    if (appId && appRegistry[appId]) {
      console.log('Opening window for:', appId);
      const newId = openWindow(appId);
      console.log('Window ID:', newId);
      focusWindow(newId);
      
      // TODO: Navigate to specific folder for projects/socials
      // This would require passing initial path to MyComputerApp
    } else {
      console.log('No app found, calling onOpen');
      onOpen(label, id);
    }
  };

  return (
    <div className="fixed top-8 left-8 flex flex-col gap-6 select-none">
      {icons.map((icon) => {
        const Icon = iconLookup[icon.id] ?? Monitor;
        return (
          <button
            key={icon.id}
            className="flex flex-col items-center gap-2 text-sm text-white/90 hover:text-white"
            onDoubleClick={() => handleDoubleClick(icon.label, icon.id)}
            aria-label={icon.label}
          >
            <div className="h-14 w-14 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-lg hover:bg-white/15 transition">
              <Icon size={28} className="drop-shadow" />
            </div>
            <span className="text-xs leading-tight text-center px-2">{icon.label}</span>
          </button>
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
    </div>
  );
}
