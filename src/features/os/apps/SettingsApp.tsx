"use client";

import React from "react";
import { Palette } from "lucide-react";
import { useTheme, themes } from "../ThemeContext";

export function SettingsApp() {
  const { theme, setTheme } = useTheme();

  const themeNames: Record<string, string> = {
    cyan: "Cyan (Default)",
    green: "Green",
    purple: "Purple",
    orange: "Orange",
    pink: "Pink",
    blue: "Blue",
  };

  const themeColors: Record<string, string> = {
    cyan: "bg-cyan-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
    blue: "bg-blue-500",
  };

  return (
    <div className="flex flex-col h-full text-white gap-4">
      <div className="flex items-center gap-2 text-sm text-white/80 border-b border-white/10 pb-3">
        <Palette size={18} />
        <span className="font-semibold">Settings</span>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white/90">Accent Color Theme</h3>
        <p className="text-xs text-white/60">Choose your preferred accent color for highlights and UI elements</p>
        
        <div className="grid grid-cols-3 gap-3 mt-4">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === t
                  ? "border-white/40 bg-white/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <div className={`w-full h-12 rounded ${themeColors[t]} mb-2`} />
              <div className="text-xs font-medium text-white/90">{themeNames[t]}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      <div className="text-[10px] text-white/40 text-center border-t border-white/10 pt-3">
        AYOS v1.0 | Built with Next.js & React
      </div>
    </div>
  );
}
