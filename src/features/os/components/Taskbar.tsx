"use client";

import React from "react";
import clsx from "clsx";
import { PinnedApp } from "@/config/os";
import { IconButton, resolveIcon } from "./IconButton";
import { SystemTray } from "./SystemTray";
import { Search } from "lucide-react";

type TaskbarProps = {
  startOpen: boolean;
  onToggleStart: () => void;
  onToggleSearch: () => void;
  pinnedApps: PinnedApp[];
  onAppSelect: (label: string) => void;
  timeLabel: string;
  dateLabel: string;
  osLabel?: string;
};

export function Taskbar({
  startOpen,
  onToggleStart,
  onToggleSearch,
  pinnedApps,
  onAppSelect,
  timeLabel,
  dateLabel,
  osLabel = "Abhishek OS",
}: TaskbarProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full flex justify-center px-3 pointer-events-none">
      <div className="flex items-center justify-between gap-6 rounded-3xl bg-white/10 border border-white/15 shadow-2xl backdrop-blur-2xl px-4 py-2 w-full max-w-5xl pointer-events-auto">
        <div className="flex items-center gap-2">
          <button
            aria-label="Open Start"
            onClick={onToggleStart}
            data-ayos-start-button
            className={clsx(
              "h-11 w-11 rounded-2xl border border-white/10 bg-white/10 flex items-center justify-center transition",
              "hover:bg-white/15 hover:border-white/20",
              startOpen && "ring-2 ring-cyan-300/70",
            )}
          >
            <WindowsLogo />
          </button>

          <IconButton
            ariaLabel="Search"
            icon={Search}
            tooltip="Search"
            onClick={onToggleSearch}
            className="ml-1"
          />

          <div className="flex items-center gap-1 px-2">
            {pinnedApps.map((app) => {
              const Icon = resolveIcon(app.icon) ?? undefined;
              return (
                <IconButton
                  key={app.id}
                  icon={Icon || undefined}
                  ariaLabel={app.label}
                  tooltip={app.label}
                  onClick={() => onAppSelect(app.label)}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-xs text-white/70 pr-2 border-r border-white/10">{osLabel}</div>
          <SystemTray timeLabel={timeLabel} dateLabel={dateLabel} />
        </div>
      </div>
    </div>
  );
}

function WindowsLogo() {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-6 w-6 text-white">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="bg-white/90 rounded-sm" />
      ))}
    </div>
  );
}
