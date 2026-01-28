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
      {/* Apple Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-16"
      >
        <svg width="120" height="120" viewBox="0 0 24 24" fill="white" className="drop-shadow-lg">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.38-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.12-.38C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.905-.07 1.81-.66 2.95-.56 1.93.21 3.38 1.03 3.75 2.63-3.12 1.93-2.38 5.98.5 7.13-.58 1.65-1.68 2.51-3.28 3.17l-.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
      </motion.div>

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
