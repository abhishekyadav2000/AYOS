"use client";

import React from "react";
import { Rnd } from "react-rnd";
import { Minus, Square, X, Monitor, Calculator, Trash2 } from "lucide-react";
import { WindowInstance, useWindowStore } from "../state/useWindowStore";
import { appRegistry } from "../apps/registry";
import { AppInitProvider, type AppInitData } from "../context/AppInitContext";

const TASKBAR_HEIGHT = 72;

type WindowFrameProps = {
  instance: WindowInstance;
  children: React.ReactNode;
};

export function WindowFrame({ instance, children }: WindowFrameProps) {
  const store = useWindowStore();
  const { position, size, isMinimized, isMaximized } = instance;

  if (isMinimized) return null;

  const onDragStop = (_: any, data: { x: number; y: number }) => {
    store.updatePosition(instance.id, { x: data.x, y: data.y });
  };

  const onResizeStop = (_: any, __: any, ref: HTMLElement, ___: any, pos: { x: number; y: number }) => {
    store.updateSize(instance.id, { w: ref.offsetWidth, h: ref.offsetHeight });
    store.updatePosition(instance.id, pos);
  };

  const maxHeight = typeof window !== "undefined" ? window.innerHeight - TASKBAR_HEIGHT : size.h;

  return (
    <Rnd
      bounds="window"
      size={{ width: size.w, height: isMaximized ? maxHeight : size.h }}
      position={{ x: position.x, y: position.y }}
      minWidth={360}
      minHeight={260}
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      onDragStart={() => store.focusWindow(instance.id)}
      onResizeStart={() => store.focusWindow(instance.id)}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      dragHandleClassName="window-titlebar"
      style={{ zIndex: instance.zIndex }}
    >
      <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-black/85 shadow-2xl backdrop-blur-xl" onMouseDown={() => store.focusWindow(instance.id)}>
        <div className="window-titlebar flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/10 cursor-move select-none">
          <TitleArea appId={instance.appId} title={instance.title} />
          <div className="flex items-center gap-1">
            <TitleButton label="Minimize" onClick={() => store.minimizeWindow(instance.id)}>
              <Minus size={14} />
            </TitleButton>
            <TitleButton label={isMaximized ? "Restore" : "Maximize"} onClick={() => store.toggleMaximize(instance.id)}>
              <Square size={14} />
            </TitleButton>
            <TitleButton label="Close" intent="danger" onClick={() => store.closeWindow(instance.id)}>
              <X size={14} />
            </TitleButton>
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-black/70 p-4">
          <AppInitProvider value={instance.initData || null}>{children}</AppInitProvider>
        </div>
      </div>
    </Rnd>
  );
}

type TitleButtonProps = { children: React.ReactNode; onClick: () => void; label: string; intent?: "danger" };
const TitleButton = ({ children, onClick, label, intent }: TitleButtonProps) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    title={label}
    className={`h-8 w-8 rounded hover:bg-white/10 flex items-center justify-center text-white ${intent === "danger" ? "hover:bg-red-500/30" : ""}`}
  >
    {children}
  </button>
);

function TitleArea({ appId, title }: { appId: string; title: string }) {
  const iconName = appRegistry[appId as keyof typeof appRegistry]?.icon;
  const Icon = iconName === "monitor" ? Monitor : iconName === "calculator" ? Calculator : iconName === "trash" ? Trash2 : Monitor;
  return (
    <div className="flex items-center gap-2 text-sm text-white">
      <Icon size={14} className="text-cyan-300" />
      <span className="font-semibold">{title}</span>
    </div>
  );
}
