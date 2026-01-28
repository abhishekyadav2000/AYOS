"use client";

import { create } from "zustand";
import type { AppId } from "../apps/registry";
import { appRegistry } from "../apps/registry";

const TASKBAR_HEIGHT = 72;
const MIN_WIDTH = 360;
const MIN_HEIGHT = 260;

export type WindowInstance = {
  id: string;
  appId: AppId;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { w: number; h: number };
  restorePosition?: { x: number; y: number };
  restoreSize?: { w: number; h: number };
  initData?: { folderId?: string; filePath?: string; [key: string]: string | undefined };
};

export type WindowStore = {
  windows: WindowInstance[];
  nextZ: number;
  openWindow: (appId: AppId, initData?: { folderId?: string; filePath?: string }) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  updatePosition: (id: string, position: { x: number; y: number }) => void;
  updateSize: (id: string, size: { w: number; h: number }) => void;
};

const getWorkspaceBounds = () => {
  if (typeof window === "undefined") return { width: 1440, height: 900 };
  return {
    width: window.innerWidth,
    height: Math.max(window.innerHeight - TASKBAR_HEIGHT, MIN_HEIGHT),
  };
};

const clampRect = (pos: { x: number; y: number }, size: { w: number; h: number }) => {
  const { width, height } = getWorkspaceBounds();
  const maxX = Math.max(width - MIN_WIDTH, 0);
  const maxY = Math.max(height - MIN_HEIGHT, 0);

  return {
    x: Math.min(Math.max(pos.x, 0), Math.max(maxX, 0)),
    y: Math.min(Math.max(pos.y, 0), Math.max(maxY, 0)),
  };
};

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  nextZ: 10,
  openWindow: (appId, initData) => {
    const existing = get().windows.find((w) => w.appId === appId);
    if (existing) {
      set((state) => ({
        windows: state.windows.map((w) =>
          w.id === existing.id ? { ...w, isMinimized: false, zIndex: state.nextZ + 1, initData } : w
        ),
        nextZ: state.nextZ + 2,
      }));
      return existing.id;
    }

    const definition = appRegistry[appId];
    if (!definition) throw new Error(`Missing app definition for ${appId}`);
    const { width, height } = getWorkspaceBounds();
    const size = definition.defaultSize ?? { w: 900, h: 600 };
    const initial = definition.defaultPosition ?? {
      x: Math.max((width - size.w) / 2, 0),
      y: Math.max((height - size.h) / 2, 0),
    };
    const position = clampRect(initial, size);

    const id = `${appId}-${Date.now()}`;
    set((state) => ({
      windows: [
        ...state.windows,
        {
          id,
          appId,
          title: definition.title,
          isMinimized: false,
          isMaximized: false,
          zIndex: state.nextZ,
          position,
          size,
          initData,
        },
      ],
      nextZ: state.nextZ + 1,
    }));
    return id;
  },
  closeWindow: (id) => {
    set((state) => ({ windows: state.windows.filter((w) => w.id !== id) }));
  },
  focusWindow: (id) => {
    set((state) => {
      const maxZ = state.nextZ + 1;
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, zIndex: maxZ, isMinimized: false } : w
        ),
        nextZ: maxZ + 1,
      };
    });
  },
  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
    }));
  },
  toggleMinimize: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
      ),
    }));
  },
  toggleMaximize: (id) => {
    const { width, height } = getWorkspaceBounds();
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id !== id) return w;
        if (!w.isMaximized) {
          return {
            ...w,
            isMaximized: true,
            restorePosition: w.position,
            restoreSize: w.size,
            position: { x: 0, y: 0 },
            size: { w: width, h: height },
          };
        }
        return {
          ...w,
          isMaximized: false,
          position: w.restorePosition ?? w.position,
          size: w.restoreSize ?? w.size,
        };
      }),
    }));
  },
  updatePosition: (id, position) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? { ...w, position: clampRect(position, w.size), isMaximized: false }
          : w
      ),
    }));
  },
  updateSize: (id, size) => {
    const nextSize = {
      w: Math.max(size.w, MIN_WIDTH),
      h: Math.max(size.h, MIN_HEIGHT),
    };
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, size: nextSize, isMaximized: false } : w
      ),
    }));
  },
}));
