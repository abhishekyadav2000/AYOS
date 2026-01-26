"use client";

import React from "react";
import { motion } from "framer-motion";
import { osConfig } from "@/config/os";
import { Wallpaper } from "./components/Wallpaper";
import { DesktopIcons } from "./components/DesktopIcons";
import { Windows11Taskbar } from "./components/Windows11Taskbar";

export function Windows11OS() {
  const [notification, setNotification] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  const handleDesktopIconClick = (label: string) => {
    setNotification(`Opening ${label}...`);
  };

  const handleAppOpen = (label: string) => {
    setNotification(`Launched: ${label}`);
  };

  const handleSearch = () => {
    setNotification("Search not yet implemented");
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
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
