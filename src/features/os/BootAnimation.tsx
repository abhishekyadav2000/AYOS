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
        @keyframes rotateClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes rotateCounterClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .network-loader {
          width: 280px;
          height: 280px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .network-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.3));
        }

        .outer-ring {
          animation: rotateClockwise 8s linear infinite;
        }

        .middle-ring {
          animation: rotateCounterClockwise 12s linear infinite;
        }

        .inner-ring {
          animation: rotateClockwise 6s linear infinite;
        }

        .node-large {
          r: 8;
          fill: rgba(239, 68, 68, 0.9);
          filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.8));
        }

        .node-small {
          r: 4;
          fill: rgba(255, 255, 255, 0.8);
          filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.6));
        }

        .connection {
          stroke: rgba(148, 163, 184, 0.2);
          stroke-width: 1;
          fill: none;
        }
      `}</style>

      {/* Network Geometric Loader */}
      <div className="network-loader" role="status" aria-label="Loading">
        <svg className="network-svg" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
          {/* Outer Ring - Red nodes */}
          <g className="outer-ring">
            {/* Connections for outer ring */}
            {[0, 1, 2, 3, 4].map((i) => {
              const angle1 = (i / 5) * Math.PI * 2;
              const angle2 = ((i + 1) / 5) * Math.PI * 2;
              const x1 = 140 + Math.cos(angle1) * 110;
              const y1 = 140 + Math.sin(angle1) * 110;
              const x2 = 140 + Math.cos(angle2) * 110;
              const y2 = 140 + Math.sin(angle2) * 110;
              return (
                <line key={`outer-conn-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} className="connection" />
              );
            })}
            {/* Outer nodes */}
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i / 5) * Math.PI * 2;
              const x = 140 + Math.cos(angle) * 110;
              const y = 140 + Math.sin(angle) * 110;
              return <circle key={`outer-${i}`} cx={x} cy={y} className="node-large" />;
            })}
          </g>

          {/* Middle Ring - White nodes */}
          <g className="middle-ring">
            {/* Connections for middle ring */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const angle1 = (i / 8) * Math.PI * 2;
              const angle2 = ((i + 1) / 8) * Math.PI * 2;
              const x1 = 140 + Math.cos(angle1) * 70;
              const y1 = 140 + Math.sin(angle1) * 70;
              const x2 = 140 + Math.cos(angle2) * 70;
              const y2 = 140 + Math.sin(angle2) * 70;
              return (
                <line key={`middle-conn-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} className="connection" />
              );
            })}
            {/* Middle nodes */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const angle = (i / 8) * Math.PI * 2;
              const x = 140 + Math.cos(angle) * 70;
              const y = 140 + Math.sin(angle) * 70;
              return <circle key={`middle-${i}`} cx={x} cy={y} className="node-small" />;
            })}
          </g>

          {/* Inner Ring - Red nodes */}
          <g className="inner-ring">
            {/* Connections for inner ring */}
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const angle1 = (i / 6) * Math.PI * 2;
              const angle2 = ((i + 1) / 6) * Math.PI * 2;
              const x1 = 140 + Math.cos(angle1) * 40;
              const y1 = 140 + Math.sin(angle1) * 40;
              const x2 = 140 + Math.cos(angle2) * 40;
              const y2 = 140 + Math.sin(angle2) * 40;
              return (
                <line key={`inner-conn-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} className="connection" />
              );
            })}
            {/* Inner nodes */}
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const angle = (i / 6) * Math.PI * 2;
              const x = 140 + Math.cos(angle) * 40;
              const y = 140 + Math.sin(angle) * 40;
              return <circle key={`inner-${i}`} cx={x} cy={y} className="node-large" />;
            })}
          </g>

          {/* Center node */}
          <circle cx="140" cy="140" r="6" className="node-small" style={{ opacity: 1 }} />
        </svg>
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
