"use client";

import React from "react";
import { motion } from "framer-motion";
import { PinnedApp, RecommendedItem } from "@/config/os";
import { IconButton, resolveIcon } from "./IconButton";
import { Power, ArrowRight } from "lucide-react";
import clsx from "clsx";

type StartMenuProps = {
  pinnedApps: PinnedApp[];
  recommendedItems: RecommendedItem[];
  userName: string;
  osName: string;
  onSelect: (label: string) => void;
};

export const StartMenu = React.forwardRef<HTMLDivElement, StartMenuProps>(
  ({ pinnedApps, recommendedItems, userName, osName, onSelect }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: 0.14, ease: "easeOut" }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[720px] max-w-[92vw] rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 text-sm font-semibold text-white/90">
          <span className="tracking-tight">Pinned</span>
          <button className="text-xs text-white/70 hover:text-white flex items-center gap-1" aria-label="View all apps">
            All apps <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-6 gap-3 px-6">
          {pinnedApps.map((app) => {
            const Icon = resolveIcon(app.icon) ?? resolveIcon("app");
            return (
              <button
                key={app.id}
                onClick={() => onSelect(app.label)}
                className="group flex flex-col items-center gap-2 rounded-2xl p-3 text-xs text-white/80 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition"
              >
                <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xl flex items-center justify-center shadow-md group-hover:bg-white/15">
                  {Icon ? <Icon size={22} className="text-white drop-shadow" /> : null}
                </div>
                <span className="text-center leading-tight line-clamp-2">{app.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 px-6 pb-2 text-sm font-semibold text-white/90">Recommended</div>
        <div className="px-6 pb-4 space-y-2">
          {recommendedItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.label)}
              className="flex items-center justify-between rounded-2xl px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 transition text-left w-full"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-400/80 to-indigo-500/80 flex items-center justify-center text-sm font-semibold text-slate-900">
                  {item.label.slice(0, 1)}
                </div>
                <div>
                  <div className="text-sm text-white">{item.label}</div>
                  <div className="text-xs text-white/70">{item.time}</div>
                </div>
              </div>
              <ArrowRight size={16} className="text-white/60" />
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/5 rounded-b-3xl">
          <div className="flex items-center gap-3 text-white">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border border-white/20 flex items-center justify-center text-base font-semibold shadow-inner">
              {userName.slice(0, 1)}
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">{userName}</div>
              <div className="text-xs text-white/70">{osName}</div>
            </div>
          </div>
          <button
            aria-label="Power options"
            className={clsx(
              "h-11 w-11 rounded-xl border border-white/10 bg-white/10 text-white/90",
              "hover:bg-white/15 hover:border-white/20 flex items-center justify-center transition"
            )}
            onClick={() => onSelect("Power")}
          >
            <Power size={18} />
          </button>
        </div>
      </motion.div>
    );
  },
);

StartMenu.displayName = "StartMenu";
