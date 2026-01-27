"use client";

import React from "react";
import { motion } from "framer-motion";
import { Monitor, Calculator, Trash2 } from "lucide-react";
import { useWindowStore } from "../state/useWindowStore";
import { appList } from "../apps/registry";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "my-computer": Monitor,
  "recycle-bin": Trash2,
  calculator: Calculator,
};

export function Taskbar() {
  const windows = useWindowStore((s) => s.windows);
  const openWindow = useWindowStore((s) => s.openWindow);
  const toggleMinimize = useWindowStore((s) => s.toggleMinimize);
  const focusWindow = useWindowStore((s) => s.focusWindow);

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 h-[72px] z-40 flex items-center justify-center"
    >
      <div className="w-full mx-auto max-w-6xl h-full flex items-center gap-2 px-4">
        <div className="flex items-center gap-2 bg-black/60 border border-white/10 backdrop-blur-xl rounded-full px-4 py-2 shadow-2xl">
          {windows.map((win) => {
            const Icon = iconMap[win.appId] ?? Monitor;
            const minimized = win.isMinimized;
            return (
              <button
                key={win.id}
                onClick={() => {
                  if (minimized) {
                    toggleMinimize(win.id);
                    focusWindow(win.id);
                  } else {
                    toggleMinimize(win.id);
                  }
                }}
                className={`h-10 px-3 rounded-lg border text-white flex items-center gap-2 transition ${
                  minimized ? "border-transparent hover:bg-white/10" : "border-cyan-400/40 bg-white/10"
                }`}
                title={win.title}
              >
                {<Icon size={18} className={minimized ? "text-white" : "text-cyan-300"} />}
                <span className="text-xs whitespace-nowrap">{win.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
