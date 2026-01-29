"use client";

import React from "react";
import {
  AppWindow,
  BatteryMedium,
  BookOpen,
  Calculator,
  Calendar,
  File,
  FileText,
  Folder,
  Globe2,
  HardDrive,
  Info,
  Mail,
  Megaphone,
  Music,
  NotebookPen,
  PanelsTopLeft,
  Search,
  Settings,
  ShoppingBag,
  StickyNote,
  Terminal,
  Trash2,
  Video,
  Wifi,
  Gamepad2,
  Monitor,
  Palette,
} from "lucide-react";
import clsx from "clsx";

const iconMap = {
  folder: Folder,
  "file-text": FileText,
  file: File,
  globe: Globe2,
  info: Info,
  mail: Mail,
  book: BookOpen,
  "book-open": BookOpen,
  "hard-drive": HardDrive,
  "sticky-note": StickyNote,
  calculator: Calculator,
  settings: Settings,
  image: Megaphone, // placeholder graphic
  music: Music,
  video: Video,
  calendar: Calendar,
  "shopping-bag": ShoppingBag,
  terminal: Terminal,
  search: Search,
  trash: Trash2,
  app: AppWindow,
  wifi: Wifi,
  battery: BatteryMedium,
  socials: Globe2,
  gamepad: Gamepad2,
  monitor: Monitor,
  palette: Palette,
} as const;

type IconName = keyof typeof iconMap;

type IconButtonProps = {
  label?: string;
  iconName?: IconName;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  active?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  tooltip?: string;
  className?: string;
  size?: "md" | "lg";
};

export function resolveIcon(name?: string) {
  if (!name) return null;
  return iconMap[name as IconName] ?? null;
}

export function IconButton({
  label,
  iconName,
  icon: IconOverride,
  active,
  onClick,
  ariaLabel,
  tooltip,
  className,
  size = "md",
}: IconButtonProps) {
  const Icon = IconOverride || (iconName ? resolveIcon(iconName) : null) || PanelsTopLeft;
  return (
    <button
      type="button"
      aria-label={ariaLabel || label}
      title={tooltip || label}
      onClick={onClick}
      className={clsx(
        "relative flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white",
        "hover:bg-white/10 hover:border-white/20 shadow-sm backdrop-blur-xl transition",
        size === "lg" ? "h-12 w-12" : "h-11 w-11",
        active && "ring-2 ring-cyan-300/70",
        className,
      )}
    >
      <Icon size={20} className="text-white drop-shadow" />
      {label ? <span className="sr-only">{label}</span> : null}
    </button>
  );
}
