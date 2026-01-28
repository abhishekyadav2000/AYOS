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
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
      <div className="relative flex flex-col items-center justify-center">
        {/* Flying UFO Animation */}
        <div className="relative mb-12 h-48">
          {/* UFO */}
          <motion.div
            initial={{ x: -300, y: 50, scale: 0.5, opacity: 0 }}
            animate={{
              x: [-300, -150, 0, 0, 150, 300],
              y: [50, 30, 0, 0, -30, -50],
              scale: [0.5, 0.8, 1, 1, 0.8, 0.5],
              opacity: [0, 1, 1, 1, 1, 0],
              rotate: [-10, -5, 0, 0, 5, 10],
            }}
            transition={{
              duration: 3.5,
              times: [0, 0.25, 0.4, 0.6, 0.75, 1],
              ease: "easeInOut",
            }}
            className="relative"
          >
            {/* UFO Body */}
            <div className="relative">
              {/* Dome (top part) */}
              <div className="relative mx-auto w-20 h-16 mb-[-8px] z-10">
                <div
                  className="absolute inset-0 rounded-t-full"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 30%, rgba(96, 165, 250, 0.8), rgba(59, 130, 246, 0.6), rgba(37, 99, 235, 0.3))",
                    boxShadow: "0 -4px 20px rgba(59, 130, 246, 0.6), inset 0 -5px 15px rgba(0, 0, 0, 0.3)",
                  }}
                />
                {/* Alien window */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-300/90 to-cyan-600/70"
                  style={{
                    boxShadow: "0 0 15px rgba(34, 211, 238, 0.8), inset 0 2px 8px rgba(255, 255, 255, 0.3)",
                  }}
                />
              </div>

              {/* Main Saucer */}
              <div
                className="relative w-32 h-8 rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(148, 163, 184, 0.9) 0%, rgba(100, 116, 139, 0.95) 50%, rgba(71, 85, 105, 0.9) 100%)",
                  boxShadow:
                    "0 4px 30px rgba(59, 130, 246, 0.5), 0 -2px 15px rgba(147, 197, 253, 0.3), inset 0 -3px 10px rgba(0, 0, 0, 0.4)",
                }}
              >
                {/* Lights around the rim */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: `${(i * 100) / 7}%`,
                      bottom: "-4px",
                      background: i % 2 === 0 ? "#22d3ee" : "#f472b6",
                      boxShadow: `0 0 10px ${i % 2 === 0 ? "#22d3ee" : "#f472b6"}`,
                    }}
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Beam of light */}
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{
                opacity: [0, 0.6, 0.6, 0],
                scaleY: [0, 1, 1, 0],
              }}
              transition={{
                duration: 3.5,
                times: [0, 0.3, 0.65, 1],
              }}
              className="absolute top-full left-1/2 -translate-x-1/2 w-24 h-32 origin-top"
              style={{
                background:
                  "linear-gradient(180deg, rgba(34, 211, 238, 0.6) 0%, rgba(34, 211, 238, 0.3) 50%, rgba(34, 211, 238, 0) 100%)",
                clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)",
              }}
            />
          </motion.div>

          {/* Sparkles/Stars */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Status Text */}
        <motion.p
          key={bootSteps[currentStep]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-lg font-medium mb-4"
        >
          {bootSteps[currentStep]}
        </motion.p>

        {/* Progress Bar */}
        <div className="w-80 h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Progress Percentage */}
        <p className="text-white/60 text-sm mt-2">{Math.floor(progress)}%</p>
      </div>
    </div>
  );
}
