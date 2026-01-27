"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { osConfig } from "@/config/os";
import { siteConfig } from "@/config/site";
import { Wallpaper } from "./components/Wallpaper";
import { DesktopIcons } from "./components/DesktopIcons";
import { Windows11Taskbar } from "./components/Windows11Taskbar";
import { MyPCWindow } from "./components/MyPCWindow";
import { NotepadAIWindow } from "./components/NotepadAIWindow";
import { X } from "lucide-react";

interface Windows11OSProps {
  showWelcome?: boolean;
  onWelcomeClose?: () => void;
}

export function Windows11OS({ showWelcome = false, onWelcomeClose }: Windows11OSProps) {
  const [notification, setNotification] = React.useState<string | null>(null);
  const [displayWelcome, setDisplayWelcome] = React.useState(showWelcome);
  const [openWindows, setOpenWindows] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  const handleDesktopIconClick = (label: string, id: string) => {
    setNotification(`Opening ${label}...`);
    // Open window after a short delay
    setTimeout(() => {
      setOpenWindows((prev) => new Set([...prev, id]));
    }, 300);
  };

  const handleAppOpen = (label: string) => {
    setNotification(`Launched: ${label}`);
  };

  const handleSearch = () => {
    setNotification("Search not yet implemented");
  };

  const handleCloseWelcome = () => {
    setDisplayWelcome(false);
    onWelcomeClose?.();
  };

  const handleCloseWindow = (windowId: string) => {
    setOpenWindows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(windowId);
      return newSet;
    });
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative">
      <Wallpaper />
      <DesktopIcons icons={osConfig.desktopIcons} onOpen={handleDesktopIconClick} />
      <Windows11Taskbar
        pinnedApps={osConfig.pinnedApps}
        recommendedItems={osConfig.recommendedItems}
        userName={osConfig.userName}
        osName={osConfig.osName}
        onSearch={handleSearch}
        onAppOpen={handleAppOpen}
      />

      {/* Open Windows */}
      <AnimatePresence>
        {openWindows.has("this-pc") && (
          <MyPCWindow onClose={() => handleCloseWindow("this-pc")} />
        )}
        {openWindows.has("notepad-ai") && (
          <NotepadAIWindow onClose={() => handleCloseWindow("notepad-ai")} />
        )}
      </AnimatePresence>

      {/* Welcome Overlay */}
      <AnimatePresence>
        {displayWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-6 max-w-2xl"
            >
              {/* Close button */}
              <button
                onClick={handleCloseWelcome}
                className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full p-2 text-white transition"
              >
                <X size={24} />
              </button>

              {/* Animated Welcome Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-7xl md:text-8xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {siteConfig.name}
                  </span>
                </h1>
                <p className="text-2xl text-white/90 mb-2">
                  Welcome to AYOS
                </p>
                <p className="text-lg text-white/70">
                  {siteConfig.title}
                </p>
              </motion.div>

              {/* Subtext */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                <p className="text-white/80 text-lg max-w-xl mx-auto">
                  {siteConfig.tagline}
                </p>
                <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
                  <div className="flex gap-2">
                    <span>💻</span>
                    <span>Double-click icons to explore</span>
                  </div>
                  <span className="text-white/30">•</span>
                  <div className="flex gap-2">
                    <span>⚙️</span>
                    <span>Use taskbar to access apps</span>
                  </div>
                </div>
              </motion.div>

              {/* Enter Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                onClick={handleCloseWelcome}
                className="mt-8 px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
              >
                Enter System →
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      {notification ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-8 right-8 z-50 px-6 py-4 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-xl shadow-xl text-white text-sm"
        >
          {notification}
        </motion.div>
      ) : null}
    </div>
  );
}
