"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { osConfig } from "@/config/os";
import { siteConfig } from "@/config/site";
import { DesktopIcons } from "./components/DesktopIcons";
import { Windows11Taskbar } from "./components/Windows11Taskbar";
import { MyPCWindow } from "./components/MyPCWindow";
import { NotepadAIWindow } from "./components/NotepadAIWindow";

interface Windows11OSProps {
  showWelcome?: boolean;
  onWelcomeClose?: () => void;
  onExit?: () => void; // exit back to hero
}

export function Windows11OS({ showWelcome = false, onWelcomeClose, onExit }: Windows11OSProps) {
  const [notification, setNotification] = React.useState<string | null>(null);
  const [displayWelcome, setDisplayWelcome] = React.useState(showWelcome);
  const [openWindows, setOpenWindows] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 2500);
    return () => clearTimeout(timer);
  }, [notification]);

  const handleDesktopIconClick = (label: string, id: string) => {
    // Open window after a short delay
    setTimeout(() => {
      setOpenWindows((prev) => new Set([...prev, id]));
    }, 200);
  };

  const handleAppOpen = (label: string) => {
    // Special handling for power option from Start Menu
    if (label === "Power") {
      setNotification("Exiting AYOS...");
      onExit?.();
      return;
    }
    setNotification(`${label} launched`);
  };

  const handleSearch = () => {
    setNotification("🔍 Search feature coming soon");
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
    <div className="h-screen w-screen overflow-hidden bg-transparent relative flex flex-col">

      {/* OS Content Container */}
      <div className="flex-1 flex flex-col relative">
        {/* Desktop Area */}
        <div className="flex-1 relative overflow-hidden">
          <DesktopIcons icons={osConfig.desktopIcons} onOpen={handleDesktopIconClick} />

          {/* Open Windows */}
          <AnimatePresence>
            {openWindows.has("this-pc") && (
              <MyPCWindow onClose={() => handleCloseWindow("this-pc")} />
            )}
            {openWindows.has("notepad-ai") && (
              <NotepadAIWindow onClose={() => handleCloseWindow("notepad-ai")} />
            )}
          </AnimatePresence>
        </div>

        {/* Taskbar - Always at bottom */}
        <Windows11Taskbar
          pinnedApps={osConfig.pinnedApps}
          recommendedItems={osConfig.recommendedItems}
          userName={osConfig.userName}
          osName={osConfig.osName}
          onSearch={handleSearch}
          onAppOpen={handleAppOpen}
        />
      </div>

      {/* Welcome Overlay - Only shows on first visit */}
      <AnimatePresence>
        {displayWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-xl flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center space-y-8 max-w-2xl px-6"
            >
              {/* Large Welcome Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-4"
              >
                <h1 className="text-8xl md:text-9xl font-bold">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {siteConfig.name.split(" ")[0]}
                  </span>
                </h1>
                <p className="text-3xl text-white/80 font-light">
                  {siteConfig.title}
                </p>
              </motion.div>

              {/* Subtext */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-3"
              >
                <p className="text-xl text-white/70">
                  {siteConfig.tagline}
                </p>
              </motion.div>

              {/* Quick Guide */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center justify-center gap-6 text-white/60 text-sm pt-4"
              >
                <div className="flex gap-2 items-center">
                  <span className="text-lg">💻</span>
                  <span>Click icons to open</span>
                </div>
                <div className="text-white/20">•</div>
                <div className="flex gap-2 items-center">
                  <span className="text-lg">⚙️</span>
                  <span>Use taskbar</span>
                </div>
              </motion.div>

              {/* Enter Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                onClick={handleCloseWelcome}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500/70 via-blue-500/70 to-purple-500/70 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 transition-all duration-300 px-8 py-4 font-semibold text-white text-lg shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 backdrop-blur-sm border border-white/20"
              >
                <span className="relative z-10">Let's Begin →</span>
                <div className="absolute inset-0 -z-10 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-8 right-8 z-40 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-lg text-white text-sm font-medium pointer-events-none"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
