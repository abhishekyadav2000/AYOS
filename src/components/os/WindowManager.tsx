"use client";

import React, { createContext, useState, useCallback } from "react";
import { OSWindow, WindowRect, SnapPreset, getSnapRect } from "@/lib/windowManager";

interface WindowContextType {
  windows: OSWindow[];
  openWindow: (appId: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  setWindowRect: (id: string, rect: WindowRect) => void;
  snapWindow: (id: string, preset: SnapPreset) => void;
  getNextZIndex: () => number;
}

export const WindowContext = createContext<WindowContextType | undefined>(undefined);

interface WindowManagerProviderProps {
  children: React.ReactNode;
}

const APPS = {
  about: { id: "about", title: "About" },
  projects: { id: "projects", title: "Projects" },
  resume: { id: "resume", title: "Resume" },
  contact: { id: "contact", title: "Contact" },
  socials: { id: "socials", title: "Socials" },
  privacyPolicy: { id: "privacyPolicy", title: "Privacy Policy" },
  computer: { id: "computer", title: "My Computer" },
  recycleBin: { id: "recycleBin", title: "Recycle Bin" },
  calculator: { id: "calculator", title: "Calculator" },
  notes: { id: "notes", title: "Notes" },
  docs: { id: "docs", title: "Docs" },
  files: { id: "files", title: "Files" },
};

export function WindowManager({ children }: WindowManagerProviderProps) {
  const [windows, setWindows] = useState<OSWindow[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);

  const getNextZIndex = useCallback(() => {
    const newZ = nextZIndex;
    setNextZIndex((prev) => prev + 1);
    return newZ;
  }, [nextZIndex]);

  const openWindow = useCallback(
    (appId: string) => {
      const existing = windows.find((w) => w.appId === appId);
      if (existing) {
        focusWindow(existing.id);
        return;
      }

      const app = Object.values(APPS).find((a) => a.id === appId);
      if (!app) return;

      const id = `${appId}-${Date.now()}`;
      const zIndex = getNextZIndex();

      const newWindow: OSWindow = {
        id,
        appId,
        title: app.title,
        isMinimized: false,
        isMaximized: false,
        rect: { x: 100 + zIndex * 20, y: 100 + zIndex * 20, w: 600, h: 400 },
        zIndex,
      };

      setWindows((prev) => [...prev, newWindow]);
    },
    [windows, getNextZIndex]
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), nextZIndex);
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w));
    });
    setNextZIndex((prev) => Math.max(prev, Math.max(...windows.map((w) => w.zIndex), nextZIndex) + 2));
  }, [windows, nextZIndex]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              isMaximized: !w.isMaximized,
              rect: !w.isMaximized
                ? { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight - 64 }
                : { x: 100, y: 100, w: 600, h: 400 },
            }
          : w
      )
    );
  }, []);

  const setWindowRect = useCallback((id: string, rect: WindowRect) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, rect } : w))
    );
  }, []);

  const snapWindow = useCallback((id: string, preset: SnapPreset) => {
    const rect = getSnapRect(preset, window.innerWidth, window.innerHeight);
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              rect,
              isMaximized: preset === "full",
            }
          : w
      )
    );
  }, []);

  return (
    <WindowContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        focusWindow,
        minimizeWindow,
        maximizeWindow,
        setWindowRect,
        snapWindow,
        getNextZIndex,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

export function useWindowManager() {
  const context = React.useContext(WindowContext);
  if (!context) {
    throw new Error("useWindowManager must be used within WindowManager");
  }
  return context;
}
