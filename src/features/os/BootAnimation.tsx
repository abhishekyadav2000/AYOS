"use client";

import React, { useEffect, useState } from "react";

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
    // Start loading immediately
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
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
      <style>{`
        @keyframes orbit {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(70px) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(70px) rotate(-360deg);
          }
        }

        .orbital-loader {
          width: 180px;
          height: 180px;
          position: relative;
          filter: drop-shadow(0 0 15px rgba(0, 255, 255, 0.2));
        }

        .orbital-ring {
          position: absolute;
          inset: 0;
          border: 2px solid rgba(0, 255, 255, 0.35);
          border-radius: 999px;
        }

        .orbital-ring.ring2 {
          inset: 22px;
          border-color: rgba(0, 255, 255, 0.18);
        }

        .orbital-dot {
          position: absolute;
          width: 10px;
          height: 10px;
          background: rgba(0, 255, 255, 0.95);
          border-radius: 999px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: orbit 1.2s linear infinite;
        }

        .orbital-dot.dot2 {
          width: 7px;
          height: 7px;
          opacity: 0.8;
          animation-duration: 1.6s;
        }

        .orbital-dot.dot3 {
          width: 6px;
          height: 6px;
          opacity: 0.7;
          animation-duration: 2.1s;
        }

        .orbital-dot.dot4 {
          width: 5px;
          height: 5px;
          opacity: 0.65;
          animation-duration: 2.6s;
        }

        .orbital-dot.dot1 {
          animation-delay: 0s;
        }

        .orbital-dot.dot2 {
          animation-delay: -0.4s;
        }

        .orbital-dot.dot3 {
          animation-delay: -0.8s;
        }

        .orbital-dot.dot4 {
          animation-delay: -1.2s;
        }
      `}</style>

      {/* Orbiting Nodes Loader */}
      <div className="orbital-loader" role="status" aria-label="Loading">
        <div className="orbital-ring"></div>
        <div className="orbital-ring ring2"></div>
        <div className="orbital-dot dot1"></div>
        <div className="orbital-dot dot2"></div>
        <div className="orbital-dot dot3"></div>
        <div className="orbital-dot dot4"></div>
      </div>

      {/* Loading Text & Progress Overlay */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4 z-10">
        {/* Status Text */}
        <p
          key={bootSteps[currentStep]}
          className="text-cyan-300 text-lg font-mono font-medium"
          style={{
            textShadow: "0 0 15px #00ffff",
            animation: "fadeInUp 0.3s ease-out",
          }}
        >
          {bootSteps[currentStep]}
        </p>

        {/* Progress Bar */}
        <div className="w-96 h-4 rounded-full overflow-hidden backdrop-blur-sm border border-cyan-500/50 bg-black/40">
          <div
            className="h-full relative overflow-hidden transition-all duration-500"
            style={{
              background:
                progress < 33
                  ? "linear-gradient(90deg, #ff00ff, #8b00ff, #ff00ff)"
                  : progress < 66
                  ? "linear-gradient(90deg, #00ffff, #0080ff, #00ffff)"
                  : "linear-gradient(90deg, #00ff00, #00ff80, #00ff00)",
              boxShadow:
                progress < 33
                  ? "0 0 20px #ff00ff, inset 0 0 20px #ff00ff"
                  : progress < 66
                  ? "0 0 20px #00ffff, inset 0 0 20px #00ffff"
                  : "0 0 20px #00ff00, inset 0 0 20px #00ff00",
              width: `${progress}%`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
                animation: "shimmer 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        {/* Progress Percentage */}
        <p className="text-cyan-300 text-sm font-mono tracking-wider" style={{ textShadow: "0 0 10px #00ffff" }}>
          {Math.floor(progress)}% LOADING
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
