"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowManager } from "./WindowManager";
import { recentFiles } from "@/lib/osStore";
import { LayoutGrid, Users, FileText, Mail, Share2, FileX, Monitor, Trash2, Calculator, StickyNote, Folder } from "lucide-react";

const APPS = [
  { id: "computer", label: "My Computer", icon: Monitor },
  { id: "files", label: "Files", icon: Folder },
  { id: "docs", label: "Docs", icon: FileText },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "calculator", label: "Calculator", icon: Calculator },
  { id: "recycleBin", label: "Recycle Bin", icon: Trash2 },
  { id: "projects", label: "Projects", icon: LayoutGrid },
  { id: "about", label: "About", icon: Users },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "socials", label: "Socials", icon: Share2 },
];

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StartMenu({ isOpen, onClose }: StartMenuProps) {
  const { openWindow } = useWindowManager();
  const files = recentFiles(6);

  const open = (id: string) => {
    openWindow(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-3xl bg-black/90 border border-indigo-500/30 rounded-2xl backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
        >
          <div className="p-4 border-b border-indigo-500/20">
            <h3 className="text-sm font-semibold text-cyan-400">Welcome to Abhishek OS</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6 p-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-3">Pinned</h4>
              <div className="grid grid-cols-3 gap-3">
                {APPS.map((app) => {
                  const Icon = app.icon;
                  return (
                    <button
                      key={app.id}
                      onClick={() => open(app.id)}
                      className="group flex flex-col items-center gap-2 p-3 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/20"
                    >
                      <Icon className="text-cyan-400 group-hover:text-cyan-300" size={20} />
                      <span className="text-xs text-gray-300 group-hover:text-white text-center">{app.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-xs font-semibold text-gray-400 mb-3">Recommended</h4>
              {files.length ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {files.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => open("files")}
                      className="flex items-center gap-3 p-3 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/20 text-left"
                    >
                      <Folder className="text-cyan-400" size={18} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{f.title}</p>
                        <p className="text-xs text-gray-400">Updated {new Date(f.updatedAt).toLocaleString()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-xs">No recent files</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
