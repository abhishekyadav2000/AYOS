"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface BootAnimationProps {
  onBootComplete: () => void;
}

export function BootAnimation({ onBootComplete }: BootAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const bootSteps = [
    "Initializing system...",
    "Loading firmware...",
    "Checking hardware...",
    "Loading kernel...",
    "Mounting filesystems...",
    "Starting services...",
    "Preparing desktop...",
    "Ready!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onBootComplete, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [onBootComplete]);

  useEffect(() => {
    const step = Math.floor((progress / 100) * bootSteps.length);
    setCurrentStep(Math.min(step, bootSteps.length - 1));
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
      style={{ pointerEvents: 'all' }}
    >
      {/* Rotating Earth → Portal */}
      <div className="relative mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative h-28 w-28 rounded-full overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.35)]"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 30%, rgba(59,130,246,0.9), rgba(2,6,23,0.9) 60%), repeating-linear-gradient(120deg, rgba(34,211,238,0.5) 0 10px, rgba(34,197,94,0.35) 10px 20px)",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(255,255,255,0.15),transparent_45%)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1.1, 1.4, 1.8] }}
          transition={{ duration: 2.2, delay: 0.6, times: [0, 0.3, 0.7, 1] }}
          className="absolute -inset-4 rounded-full border border-cyan-400/40 blur-[1px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 0.8, 0.8, 0], scale: [0.7, 1.2, 1.6, 2] }}
          transition={{ duration: 2.4, delay: 0.8, times: [0, 0.3, 0.7, 1] }}
          className="absolute -inset-8 rounded-full border border-indigo-400/30 blur-[2px]"
        />
      </div>

      {/* Status Text */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="text-white text-sm font-mono mb-8"
      >
        {bootSteps[currentStep]}
      </motion.div>

      {/* Progress Bar */}
      <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.2 }}
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
        />
      </div>

      {/* Progress Percentage */}
      <motion.div
        animate={{ opacity: progress < 100 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-gray-500 text-xs font-mono mt-4"
      >
        {Math.floor(progress)}%
      </motion.div>
    </motion.div>
  );
}
