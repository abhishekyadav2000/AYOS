"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  getPreferences,
  savePreferences,
  rainContentOptions,
  formations,
  backgrounds,
  type BackgroundPreferences,
} from "@/lib/backgroundPreferences";

interface ContextMenuPosition {
  x: number;
  y: number;
}

export function BackgroundContextMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 });
  const [prefs, setPrefs] = useState<BackgroundPreferences | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const customInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPrefs(getPreferences());

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setPosition({ x: e.clientX, y: e.clientY });
      setIsOpen(true);
    };

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handlePreferencesChanged = (e: Event) => {
      const event = e as CustomEvent;
      setPrefs(event.detail);
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClick);
    window.addEventListener("backgroundPreferencesChanged", handlePreferencesChanged);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("backgroundPreferencesChanged", handlePreferencesChanged);
    };
  }, []);

  useEffect(() => {
    if (showCustomInput && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [showCustomInput]);

  if (!prefs) return null;

  const handleBackgroundChange = (bg: string) => {
    savePreferences({ background: bg as any });
    setIsOpen(false);
  };

  const handleRainContentChange = (content: string) => {
    savePreferences({ rainContent: content as any });
    setIsOpen(false);
    setShowCustomInput(false);
  };

  const handleCustomTextSubmit = () => {
    if (customInputRef.current?.value) {
      savePreferences({
        rainContent: "custom",
        customText: customInputRef.current.value,
      });
      setShowCustomInput(false);
      setIsOpen(false);
    }
  };

  const handleFormationChange = (formation: string) => {
    savePreferences({ formation });
    setIsOpen(false);
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    savePreferences({ matrixOpacity: parseFloat(e.target.value) });
  };

  return (
    <div
      ref={menuRef}
      className={`fixed z-50 bg-black/95 border border-cyan-500/30 rounded-lg shadow-2xl backdrop-blur-sm transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        minWidth: "280px",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20">
        <h3 className="text-sm font-bold text-cyan-400">Background Options</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-cyan-400/60 hover:text-cyan-400 transition"
        >
          <X size={16} />
        </button>
      </div>

      <div className="py-2 max-h-96 overflow-y-auto">
        {/* Background Selection */}
        <div className="px-4 py-3 border-b border-cyan-500/10">
          <p className="text-xs text-cyan-300/70 font-semibold mb-2 uppercase tracking-wide">
            Background
          </p>
          <div className="space-y-1">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => handleBackgroundChange(bg.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                  prefs.background === bg.id
                    ? "bg-cyan-500/30 text-cyan-300 font-semibold"
                    : "text-cyan-300/70 hover:bg-cyan-500/20 hover:text-cyan-300"
                }`}
              >
                {prefs.background === bg.id && "✓ "}{bg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rain Content Selection */}
        {prefs.background !== "none" && (
          <div className="px-4 py-3 border-b border-cyan-500/10">
            <p className="text-xs text-cyan-300/70 font-semibold mb-2 uppercase tracking-wide">
              Rain Content
            </p>
            <div className="space-y-1">
              {Object.keys(rainContentOptions).map((content) => (
                <button
                  key={content}
                  onClick={() => {
                    if (content === "custom") {
                      setShowCustomInput(true);
                    } else {
                      handleRainContentChange(content);
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                    prefs.rainContent === content
                      ? "bg-cyan-500/30 text-cyan-300 font-semibold"
                      : "text-cyan-300/70 hover:bg-cyan-500/20 hover:text-cyan-300"
                  }`}
                >
                  {prefs.rainContent === content && "✓ "}
                  {content.charAt(0).toUpperCase() + content.slice(1)}
                </button>
              ))}
            </div>

            {/* Custom Text Input */}
            {showCustomInput && (
              <div className="mt-3 p-2 bg-cyan-500/10 rounded">
                <input
                  ref={customInputRef}
                  type="text"
                  placeholder="Enter custom text or emojis..."
                  defaultValue={prefs.customText || ""}
                  maxLength={50}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCustomTextSubmit();
                    if (e.key === "Escape") setShowCustomInput(false);
                  }}
                  className="w-full px-2 py-1 bg-black/50 border border-cyan-500/30 rounded text-cyan-300 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleCustomTextSubmit}
                    className="flex-1 px-2 py-1 bg-cyan-500/30 hover:bg-cyan-500/50 text-cyan-300 text-xs rounded transition"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => setShowCustomInput(false)}
                    className="flex-1 px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs rounded transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Formation Selection */}
        {prefs.background === "matrix" && (
          <div className="px-4 py-3 border-b border-cyan-500/10">
            <p className="text-xs text-cyan-300/70 font-semibold mb-2 uppercase tracking-wide">
              Formation
            </p>
            <div className="space-y-1">
              {formations.map((formation) => (
                <button
                  key={formation}
                  onClick={() => handleFormationChange(formation)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                    prefs.formation === formation
                      ? "bg-cyan-500/30 text-cyan-300 font-semibold"
                      : "text-cyan-300/70 hover:bg-cyan-500/20 hover:text-cyan-300"
                  }`}
                >
                  {prefs.formation === formation && "✓ "}
                  {formation.charAt(0).toUpperCase() + formation.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-xs text-cyan-300/50 mt-2">
              (Auto-rotates every 2 min)
            </p>
          </div>
        )}

        {/* Opacity Control */}
        {prefs.background !== "none" && (
          <div className="px-4 py-3">
            <p className="text-xs text-cyan-300/70 font-semibold mb-2 uppercase tracking-wide">
              Opacity
            </p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={prefs.matrixOpacity}
                onChange={handleOpacityChange}
                className="flex-1 h-2 bg-cyan-500/20 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-cyan-300 font-mono w-10 text-right">
                {Math.round(prefs.matrixOpacity * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-cyan-500/10 border-t border-cyan-500/10 text-xs text-cyan-300/50">
        Right-click anywhere to access options
      </div>
    </div>
  );
}

export default BackgroundContextMenu;
