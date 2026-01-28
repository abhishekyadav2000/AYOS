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
        {/* Flying Mothership Animation */}
        <div className="relative mb-12 h-48">
          {/* Mothership */}
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
            {/* Star Wars Style Mothership */}
            <div className="relative">
              {/* Top Command Tower */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                {/* Bridge/Control Room */}
                <div
                  className="w-12 h-8 rounded-t-lg"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(71, 85, 105, 0.95), rgba(51, 65, 85, 0.9))",
                    boxShadow: "0 0 20px rgba(59, 130, 246, 0.6), inset 0 2px 8px rgba(147, 197, 253, 0.3)",
                  }}
                >
                  {/* Windows */}
                  <div className="flex gap-1 justify-center pt-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-3 bg-cyan-400/80 rounded-sm"
                        animate={{
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                        style={{ boxShadow: "0 0 6px rgba(34, 211, 238, 0.8)" }}
                      />
                    ))}
                  </div>
                  
                  {/* Cute Alien in Window */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{
                      y: [-1, 1, -1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    {/* Alien head - cute style */}
                    <div className="relative">
                      {/* Big alien head */}
                      <div className="w-6 h-7 bg-gradient-to-b from-green-300 to-green-400 rounded-full relative">
                        {/* Big eyes */}
                        <div className="absolute top-2 left-1 flex gap-1.5">
                          <motion.div 
                            className="w-2 h-2.5 bg-black rounded-full relative"
                            animate={{ scaleY: [1, 0.2, 1] }}
                            transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}
                          >
                            <div className="absolute top-0 left-0.5 w-1 h-1 bg-white rounded-full" />
                          </motion.div>
                          <motion.div 
                            className="w-2 h-2.5 bg-black rounded-full relative"
                            animate={{ scaleY: [1, 0.2, 1] }}
                            transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}
                          >
                            <div className="absolute top-0 left-0.5 w-1 h-1 bg-white rounded-full" />
                          </motion.div>
                        </div>
                        
                        {/* Cute smile */}
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 border-b-2 border-gray-700 rounded-full" />
                        
                        {/* Antennas */}
                        <div className="absolute -top-2 left-1">
                          <div className="w-0.5 h-2 bg-green-400" />
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full -mt-0.5" />
                        </div>
                        <div className="absolute -top-2 right-1">
                          <div className="w-0.5 h-2 bg-green-400" />
                          <div className="w-1.5 h-1.5 bg-pink-400 rounded-full -mt-0.5" />
                        </div>
                      </div>
                      
                      {/* Waving hand */}
                      <motion.div
                        className="absolute -right-2 top-3"
                        animate={{
                          rotate: [0, 20, -20, 20, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                      >
                        <div className="w-1.5 h-2 bg-green-300 rounded-full" />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Neck/Connection */}
                <div
                  className="w-8 h-3 mx-auto"
                  style={{
                    background: "linear-gradient(180deg, rgba(51, 65, 85, 0.9), rgba(71, 85, 105, 0.8))",
                  }}
                />
              </div>

              {/* Main Hull - elongated Star Wars style */}
              <div
                className="relative w-40 h-12 mt-10 rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(148, 163, 184, 0.95) 0%, rgba(100, 116, 139, 0.98) 30%, rgba(71, 85, 105, 0.95) 70%, rgba(51, 65, 85, 0.9) 100%)",
                  boxShadow:
                    "0 6px 40px rgba(59, 130, 246, 0.6), 0 -3px 20px rgba(147, 197, 253, 0.4), inset 0 -4px 15px rgba(0, 0, 0, 0.5)",
                }}
              >
                {/* Hull panels/details */}
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-slate-400/30 to-transparent" />
                <div className="absolute inset-x-8 top-1/3 h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent" />
                
                {/* Engine ports on sides */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-1.5 rounded-r-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      animate={{
                        opacity: [0.4, 1, 0.4],
                        boxShadow: [
                          "0 0 5px rgba(34, 211, 238, 0.3)",
                          "0 0 15px rgba(34, 211, 238, 0.8)",
                          "0 0 5px rgba(34, 211, 238, 0.3)",
                        ],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-1.5 rounded-l-full bg-gradient-to-l from-blue-500 to-cyan-400"
                      animate={{
                        opacity: [0.4, 1, 0.4],
                        boxShadow: [
                          "0 0 5px rgba(34, 211, 238, 0.3)",
                          "0 0 15px rgba(34, 211, 238, 0.8)",
                          "0 0 5px rgba(34, 211, 238, 0.3)",
                        ],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>

                {/* Bottom lights array */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: i % 3 === 0 ? "#22d3ee" : i % 3 === 1 ? "#f472b6" : "#a78bfa",
                        boxShadow: `0 0 10px ${i % 3 === 0 ? "#22d3ee" : i % 3 === 1 ? "#f472b6" : "#a78bfa"}`,
                      }}
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.7, 1.1, 0.7],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.08,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Rear Engines */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                {[...Array(2)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-6 h-1 rounded-l-full bg-gradient-to-l from-orange-500 via-orange-400 to-transparent"
                    animate={{
                      opacity: [0.6, 1, 0.6],
                      scaleX: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    style={{ transformOrigin: "right", boxShadow: "0 0 15px rgba(249, 115, 22, 0.6)" }}
                  />
                ))}
              </div>
            </div>

            {/* Tractor beam effect */}
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{
                opacity: [0, 0.5, 0.5, 0],
                scaleY: [0, 1, 1, 0],
              }}
              transition={{
                duration: 3.5,
                times: [0, 0.3, 0.65, 1],
              }}
              className="absolute top-full left-1/2 -translate-x-1/2 w-28 h-32 origin-top"
              style={{
                background:
                  "linear-gradient(180deg, rgba(34, 211, 238, 0.5) 0%, rgba(168, 85, 247, 0.3) 50%, rgba(244, 114, 182, 0.1) 100%)",
                clipPath: "polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)",
                filter: "blur(2px)",
              }}
            />
          </motion.div>

          {/* Space particles and stars */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() > 0.7 ? "3px" : "1px",
                height: Math.random() > 0.7 ? "3px" : "1px",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                delay: Math.random() * 3,
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
