"use client";

import React from "react";
import { useWindowManager } from "./WindowManager";
import { SearchPanel } from "./SearchPanel";
import { StartMenu } from "./StartMenu";
import { siteConfig } from "@/config/site";
import { motion } from "framer-motion";
import { LayoutGrid, FileText, Users, Mail, Share2, FileX, Monitor, Trash2, Calculator, StickyNote, Folder } from "lucide-react";

const TASKBAR_APPS = [
  { id: "about", label: "About", icon: Users },
  { id: "projects", label: "Projects", icon: LayoutGrid },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "socials", label: "Socials", icon: Share2 },
  { id: "privacyPolicy", label: "Privacy", icon: FileX },
  { id: "computer", label: "My Computer", icon: Monitor },
  { id: "recycleBin", label: "Recycle Bin", icon: Trash2 },
  { id: "calculator", label: "Calculator", icon: Calculator },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "files", label: "Files", icon: Folder },
  { id: "docs", label: "Docs", icon: FileText },
];

export function Taskbar() {
  const { windows, openWindow, minimizeWindow } = useWindowManager();
  const [startOpen, setStartOpen] = React.useState(false);

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 h-16 bg-black/80 border-t border-indigo-500/20 backdrop-blur-xl flex items-center justify-center gap-2 px-4 z-40"
    >
      <div className="flex items-center gap-2 bg-black/50 border border-indigo-500/20 rounded-full px-4 py-2 backdrop-blur-lg">
        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setStartOpen((v) => !v)}
          className="p-2 rounded-lg hover:bg-indigo-500/30"
          title="Start"
        >
          <LayoutGrid size={20} className="text-cyan-400" />
        </motion.button>
        {/* Search */}
        <SearchPanel />

        {/* App Icons */}
        {TASKBAR_APPS.map((app) => {
          const Icon = app.icon;
          const isOpen = windows.some((w) => w.appId === app.id);

          return (
            <motion.button
              key={app.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (isOpen) {
                  const window = windows.find((w) => w.appId === app.id);
                  if (window) {
                    minimizeWindow(window.id);
                  }
                } else {
                  openWindow(app.id);
                }
              }}
              className={`p-2 rounded-lg transition-all ${
                isOpen
                  ? "bg-indigo-500/50 border border-indigo-500"
                  : "hover:bg-indigo-500/30"
              }`}
              title={app.label}
            >
              <Icon
                size={20}
                className={isOpen ? "text-cyan-400" : "text-gray-300"}
              />
            </motion.button>
          );
        })}

        {/* Separator */}
        <div className="w-px h-6 bg-indigo-500/20 mx-2" />

        {/* OS Name */}
        <div className="text-xs font-semibold text-cyan-400 whitespace-nowrap">
          Abhishek OS
        </div>
      </div>

      {/* Start Menu Panel */}
      <StartMenu isOpen={startOpen} onClose={() => setStartOpen(false)} />
    </motion.div>
  );
}
