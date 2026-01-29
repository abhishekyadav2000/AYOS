"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Windows11OS } from "@/features/os/Windows11OS";
import { BootAnimation } from "@/features/os/BootAnimation";
import { BackgroundContextMenu } from "@/components/BackgroundContextMenu";
import { OSMatrixBackground } from "@/components/OSMatrixBackground";

export default function AYOSPage() {
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <>
      <OSMatrixBackground />
      <BackgroundContextMenu />
      <AnimatePresence mode="wait">
        {!bootComplete ? (
          <BootAnimation key="boot" onBootComplete={() => setBootComplete(true)} />
        ) : (
          <Windows11OS key="os" showWelcome={true} />
        )}
      </AnimatePresence>
    </>
  );
}
