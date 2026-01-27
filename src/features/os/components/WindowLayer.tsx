"use client";

import React from "react";
import { useWindowStore } from "../state/useWindowStore";
import { appRegistry } from "../apps/registry";
import { WindowFrame } from "./WindowFrame";

export function WindowLayer() {
  const windows = useWindowStore((s) => s.windows);

  return (
    <div className="absolute inset-0">
      {windows.map((win) => {
        const app = appRegistry[win.appId];
        if (!app) return null;
        return (
          <WindowFrame key={win.id} instance={win}>
            {app.component()}
          </WindowFrame>
        );
      })}
    </div>
  );
}
