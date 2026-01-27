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
          "fixed bottom-0 left-0 right-0 z-40",
          "px-6 py-2 h-14",
          "bg-black/40 border-t border-white/10 backdrop-blur-3xl shadow-2xl",
          "flex items-center justify-center gap-2",
        )}
      >
        <div className="flex items-center gap-2">
          {/* Start Button */}
          <button
            onClick={() => setIsStartOpen(!isStartOpen)}
            aria-label="Start"
            title="Start"
            className={clsx(
              "h-10 w-10 rounded-md bg-white/5 border border-white/10 text-white",
              "hover:bg-white/15 hover:border-white/20 transition-all duration-200",
              "flex items-center justify-center",
              isStartOpen && "bg-white/15 ring-2 ring-cyan-400/50",
            )}
          >
            <Wind size={20} className="drop-shadow" />
          </button>

          {/* Search */}
          <button
            onClick={onSearch}
            aria-label="Search"
            title="Search"
            className="h-10 px-4 min-w-[280px] rounded-md bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all duration-200 flex items-center gap-3 group"
          >
            <Search size={16} className="text-white/70 group-hover:text-white transition" />
            <span className="text-sm">Type here to search</span>
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-white/10 mx-1" />

          {/* Pinned Apps */}
          {displayedApps.map((app) => {
            const Icon = resolveIcon(app.icon);
            return (
              <button
                key={app.id}
                onClick={() => handleAppOpen(app.label)}
                aria-label={app.label}
                title={app.label}
                className="h-10 w-10 rounded-md bg-white/0 hover:bg-white/10 border border-transparent hover:border-white/10 text-white/80 hover:text-white transition-all duration-200 flex items-center justify-center relative group"
              >
                {Icon ? <Icon size={20} /> : null}
                {/* Active indicator */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition" />
              </button>
            );
          })}
        </div>

        {/* System Tray - positioned at right */}
        <div className="absolute right-4">
          <SystemTray timeLabel={time.time} dateLabel={time.date} />
        </div>
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
