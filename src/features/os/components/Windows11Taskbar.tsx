"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Wind } from "lucide-react";
import clsx from "clsx";
import { IconButton, resolveIcon } from "./IconButton";
import { StartMenu } from "./StartMenu";
import { SystemTray } from "./SystemTray";
import { PinnedApp, RecommendedItem } from "@/config/os";

type Windows11TaskbarProps = {
  pinnedApps: PinnedApp[];
  recommendedItems: RecommendedItem[];
  userName: string;
  osName: string;
  onSearch?: () => void;
  onAppOpen: (label: string) => void;
};

export function Windows11Taskbar({
  pinnedApps,
  recommendedItems,
  userName,
  osName,
  onSearch,
  onAppOpen,
}: Windows11TaskbarProps) {
  const [isStartOpen, setIsStartOpen] = React.useState(false);
  const [time, setTime] = React.useState<{ time: string; date: string }>({ time: "", date: "" });
  const startMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime({
        time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }).toLowerCase(),
        date: now.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (startMenuRef.current && !startMenuRef.current.contains(e.target as Node)) {
        setIsStartOpen(false);
      }
    };
    if (isStartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isStartOpen]);

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isStartOpen) setIsStartOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isStartOpen]);

  const handleAppOpen = (label: string) => {
    onAppOpen(label);
    setIsStartOpen(false);
  };

  const displayedApps = pinnedApps.slice(0, 5);

  return (
    <>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={clsx(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-40",
          "px-6 py-3 rounded-full",
          "bg-white/10 border border-white/20 backdrop-blur-2xl shadow-2xl",
          "flex items-center justify-between gap-4",
        )}
      >
        {/* Start Button */}
        <button
          onClick={() => setIsStartOpen(!isStartOpen)}
          aria-label="Start"
          title="Start"
          className={clsx(
            "h-11 w-11 rounded-lg bg-white/15 border border-white/20 text-white",
            "hover:bg-white/25 hover:border-white/30 shadow-md backdrop-blur-xl transition",
            isStartOpen && "ring-2 ring-cyan-300/70",
          )}
        >
          <Wind size={20} className="drop-shadow" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-white/10" />

        {/* Search */}
        <button
          onClick={onSearch}
          aria-label="Search"
          title="Search"
          className="h-11 w-11 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/15 shadow-sm transition flex items-center justify-center"
        >
          <Search size={18} />
        </button>

        {/* Pinned Apps */}
        {displayedApps.map((app) => {
          const Icon = resolveIcon(app.icon);
          return (
            <button
              key={app.id}
              onClick={() => handleAppOpen(app.label)}
              aria-label={app.label}
              title={app.label}
              className="h-11 w-11 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/15 hover:border-white/20 shadow-sm transition flex items-center justify-center"
            >
              {Icon ? <Icon size={18} /> : null}
            </button>
          );
        })}

        {/* Divider */}
        <div className="h-6 w-px bg-white/10" />

        {/* System Tray */}
        <SystemTray timeLabel={time.time} dateLabel={time.date} />
      </motion.div>

      {/* Start Menu */}
      <AnimatePresence>
        {isStartOpen ? (
          <StartMenu
            ref={startMenuRef}
            pinnedApps={pinnedApps}
            recommendedItems={recommendedItems}
            userName={userName}
            osName={osName}
            onSelect={handleAppOpen}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
