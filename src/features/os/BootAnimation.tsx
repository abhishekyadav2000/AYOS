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
        {/* Om Symbol Animation */}
        <div className="relative mb-12 h-48 w-full flex items-center justify-center">
          {/* Om Symbol */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0, rotate: -180 }}
            animate={{
              scale: [0.3, 1.2, 1, 1, 1.2, 0.3],
              opacity: [0, 1, 1, 1, 1, 0],
              rotate: [-180, 0, 0, 0, 0, 180],
            }}
            transition={{
              duration: 3.5,
              times: [0, 0.25, 0.4, 0.6, 0.75, 1],
              ease: "easeInOut",
            }}
            className="relative"
          >
            {/* Om (ॐ) Symbol */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Main Om glow */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  boxShadow: [
                    "0 0 40px rgba(255, 165, 0, 0.6), 0 0 80px rgba(255, 140, 0, 0.4)",
                    "0 0 60px rgba(255, 140, 0, 0.8), 0 0 120px rgba(255, 100, 0, 0.6)",
                    "0 0 40px rgba(255, 165, 0, 0.6), 0 0 80px rgba(255, 140, 0, 0.4)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  borderRadius: "50%",
                }}
              />

              {/* Om Symbol - ॐ */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  fontSize: "120px",
                  fontWeight: "bold",
                  background: "linear-gradient(135deg, #ff9933 0%, #ffaa44 50%, #ff8800 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "0 0 30px rgba(255, 140, 0, 0.8)",
                  filter: "drop-shadow(0 0 20px rgba(255, 140, 0, 0.9))",
                }}
              >
                ॐ
              </div>

              {/* Rotating ring around Om */}
              <motion.div
                className="absolute inset-0 border-4 rounded-full"
                style={{
                  borderColor: "transparent",
                  borderTopColor: "rgba(255, 140, 0, 0.8)",
                  borderRightColor: "rgba(255, 100, 0, 0.6)",
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Sacred lotus petals around Om */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const angle = (i * 360) / 8;
                const radius = 100;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                
                return (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-6 rounded-full"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}deg)`,
                      background: "linear-gradient(180deg, rgba(255, 153, 51, 0.8), rgba(255, 100, 0, 0.6))",
                      boxShadow: "0 0 15px rgba(255, 140, 0, 0.6)",
                    }}
                    animate={{
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                );
              })}
            </div>
          </motion.div>

          {/* Spiritual energy particles */}
          {[...Array(30)].map((_, i) => {
            const angle = Math.random() * 360;
            const distance = Math.random() * 150 + 50;
            const x = Math.cos((angle * Math.PI) / 180) * distance;
            const y = Math.sin((angle * Math.PI) / 180) * distance;
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  left: "50%",
                  top: "50%",
                  background: i % 3 === 0 
                    ? "rgba(255, 153, 51, 0.8)" 
                    : i % 3 === 1 
                    ? "rgba(255, 200, 100, 0.8)" 
                    : "rgba(255, 140, 0, 0.8)",
                  boxShadow: "0 0 10px currentColor",
                }}
                animate={{
                  x: [0, x, x * 1.5],
                  y: [0, y, y * 1.5],
                  opacity: [1, 0.6, 0],
                  scale: [0.5, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 2 + 1.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            );
          })}
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
