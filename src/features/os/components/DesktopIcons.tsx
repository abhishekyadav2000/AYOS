"use client";

import React from "react";
import { Monitor, Globe2, Trash2 } from "lucide-react";
import { DesktopIcon } from "@/config/os";
import { motion, AnimatePresence } from "framer-motion";

const iconLookup: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "this-pc": Monitor,
  network: Globe2,
  "recycle-bin": Trash2,
};

type DesktopIconsProps = {
  icons: DesktopIcon[];
  onOpen: (label: string) => void;
};

export function DesktopIcons({ icons, onOpen }: DesktopIconsProps) {
  const [toast, setToast] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const handleClick = (label: string) => {
    setToast(`${label} opening...`);
    onOpen(label);
  };

  return (
    <div className="fixed top-8 left-8 flex flex-col gap-6 select-none">
      {icons.map((icon) => {
        const Icon = iconLookup[icon.id] ?? Monitor;
        return (
          <button
            key={icon.id}
            className="flex flex-col items-center gap-2 text-sm text-white/90 hover:text-white"
            onClick={() => handleClick(icon.label)}
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
