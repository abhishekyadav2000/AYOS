"use client";

import React from "react";
import { BatteryCharging, Wifi } from "lucide-react";
import clsx from "clsx";

type SystemTrayProps = {
  timeLabel: string;
  dateLabel: string;
};

export function SystemTray({ timeLabel, dateLabel }: SystemTrayProps) {
  return (
    <div className="flex items-center gap-3 text-white/90 text-xs">
      <button className={trayButton()} aria-label="Network status">
        <Wifi size={16} />
      </button>
      <button className={trayButton()} aria-label="Battery status">
        <BatteryCharging size={16} />
      </button>
      <div className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xl leading-tight text-right">
        <div>{timeLabel}</div>
        <div className="text-[11px] text-white/70">{dateLabel}</div>
      </div>
    </div>
  );
}

function trayButton() {
  return clsx(
    "h-9 w-9 rounded-xl bg-white/10 border border-white/10",
    "flex items-center justify-center hover:bg-white/15 hover:border-white/20 transition",
  );
}
