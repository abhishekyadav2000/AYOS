"use client";

import React from "react";
import { useWindowManager } from "./WindowManager";
import { Window } from "./Window";
import { Taskbar } from "./Taskbar";
import { WindowManager } from "./WindowManager";
import { motion } from "framer-motion";

function OSContent() {
  const { windows } = useWindowManager();

  return (
    <div className="w-full h-screen bg-gradient-to-br from-black via-indigo-950/20 to-black overflow-hidden">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(34,211,238,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99,102,241,0.1) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Windows */}
      <div className="relative w-full h-full">
        {windows.map((window) => (
          <Window key={window.id} window={window} />
        ))}
      </div>

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}

export function OSPage() {
  return (
    <WindowManager>
      <OSContent />
    </WindowManager>
  );
}
