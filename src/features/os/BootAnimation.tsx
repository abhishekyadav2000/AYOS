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
      {/* Cyberpunk Purple Glitch Transition */}
      <div className="absolute inset-0 bg-black">
        {/* Multi-color gradient waves - continuous animation */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(45deg, #ff00ff, #8b00ff, #4b0082, #000000)", // Purple
              "linear-gradient(45deg, #00ffff, #0080ff, #0040ff, #000000)", // Blue
              "linear-gradient(45deg, #00ff00, #00ff80, #008040, #000000)", // Green
              "linear-gradient(45deg, #ff00ff, #00ffff, #00ff00, #000000)", // Mix
              "linear-gradient(45deg, #ff00ff, #8b00ff, #4b0082, #000000)", // Back to Purple
            ],
            opacity: [0.3, 0.7, 0.5, 0.6, 0.4],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        {/* Glitch horizontal bars - continuous animation with multi-color */}
        {[...Array(20)].map((_, i) => {
          const colors = [
            "linear-gradient(90deg, #ff00ff, #8b00ff, transparent)", // Purple
            "linear-gradient(90deg, #00ffff, #0080ff, transparent)", // Cyan/Blue
            "linear-gradient(90deg, #00ff00, #00ff80, transparent)", // Green
            "linear-gradient(90deg, #ff00ff, #00ffff, transparent)", // Purple to Cyan
          ];
          return (
            <motion.div
              key={`glitch-bar-${i}`}
              className="absolute w-full"
              style={{
                height: `${Math.random() * 40 + 10}px`,
                top: `${i * 5}%`,
                background: colors[i % colors.length],
                mixBlendMode: "screen",
              }}
              animate={{
                x: ["100%", "-100%", "100%"],
                opacity: [0, 1, 0.5, 1, 0, 1, 0.5, 1, 0],
              }}
              transition={{
                duration: 3,
                delay: i * 0.05,
                ease: "linear",
                repeat: Infinity,
              }}
            />
          );
        })}

        {/* Vertical scan lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139, 0, 255, 0.1) 2px, rgba(139, 0, 255, 0.1) 4px)",
          }}
        />

        {/* Digital grid overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255, 0, 255, 0.05) 50px, rgba(255, 0, 255, 0.05) 51px),
              repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255, 0, 255, 0.05) 50px, rgba(255, 0, 255, 0.05) 51px)
            `,
          }}
          animate={{
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
        />

        {/* Glitch noise effect */}
        <motion.div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
          }}
        />

        {/* Expanding hexagons - continuous with multi-color */}
        {[...Array(8)].map((_, i) => {
          const hexColors = ["#ff00ff", "#00ffff", "#00ff00", "#8b00ff"];
          const color = hexColors[i % hexColors.length];
          return (
            <motion.div
              key={`hex-${i}`}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: "100px",
                height: "100px",
                border: `2px solid ${color}`,
                clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
                boxShadow: `0 0 20px ${color}`,
              }}
              animate={{
                scale: [0, 15, 0],
                rotate: [0, 360, 0],
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 4,
                delay: i * 0.3,
                ease: "easeOut",
                repeat: Infinity,
              }}
            />
          );
        })}

        {/* Center burst effect - cycling colors */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "200px",
            height: "200px",
            filter: "blur(20px)",
          }}
          animate={{
            background: [
              "radial-gradient(circle, #ff00ff 0%, transparent 70%)", // Purple
              "radial-gradient(circle, #00ffff 0%, transparent 70%)", // Cyan
              "radial-gradient(circle, #00ff00 0%, transparent 70%)", // Green
              "radial-gradient(circle, #ff00ff 0%, transparent 70%)", // Back to Purple
            ],
            scale: [1, 3, 1],
            opacity: [0.8, 0.3, 0.8],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        {/* Cyberpunk text glitch */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            times: [0, 0.5, 1],
            ease: "easeInOut",
          }}
        >
          <div className="relative">
            <motion.div
              className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
              style={{
                fontFamily: "monospace",
                textShadow: "0 0 20px #ff00ff, 0 0 40px #8b00ff",
              }}
              animate={{
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 0.1,
                repeat: Infinity,
              }}
            >
              AYOS
            </motion.div>
            {/* Glitch duplicate layers - multi-color chromatic aberration */}
            <motion.div
              className="absolute inset-0 text-6xl font-bold text-cyan-500 mix-blend-screen"
              style={{ fontFamily: "monospace" }}
              animate={{
                x: [0, -3, 3, -2, 0],
                opacity: [0, 0.8, 0.5, 0.8, 0],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
              }}
            >
              AYOS
            </motion.div>
            <motion.div
              className="absolute inset-0 text-6xl font-bold text-green-500 mix-blend-screen"
              style={{ fontFamily: "monospace" }}
              animate={{
                x: [0, 2, -2, 3, 0],
                y: [0, 1, -1, 0],
                opacity: [0, 0.7, 0.5, 0.7, 0],
              }}
              transition={{
                duration: 0.3,
                delay: 0.1,
                repeat: Infinity,
              }}
            >
              AYOS
            </motion.div>
            <motion.div
              className="absolute inset-0 text-6xl font-bold text-red-500 mix-blend-screen"
              style={{ fontFamily: "monospace" }}
              animate={{
                x: [0, 3, -3, 2, 0],
                opacity: [0, 0.8, 0.5, 0.8, 0],
              }}
              transition={{
                duration: 0.3,
                delay: 0.15,
                repeat: Infinity,
              }}
            >
              AYOS
            </motion.div>
          </div>
        </motion.div>

        {/* Loading progress - shows during transition */}
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Status Text with glitch */}
          <motion.p
            key={bootSteps[currentStep]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-purple-400 text-lg font-mono font-medium"
            style={{
              textShadow: "0 0 10px #8b00ff",
            }}
          >
            {bootSteps[currentStep]}
          </motion.p>

          {/* Cyberpunk Progress Bar - color changes with progress */}
          <div className="w-96 h-3 bg-black/50 rounded-full overflow-hidden backdrop-blur-sm border border-purple-500/30">
            <motion.div
              className="h-full relative overflow-hidden"
              animate={{
                background: progress < 33
                  ? "linear-gradient(90deg, #ff00ff, #8b00ff, #ff00ff)" // Purple
                  : progress < 66
                  ? "linear-gradient(90deg, #00ffff, #0080ff, #00ffff)" // Blue/Cyan
                  : "linear-gradient(90deg, #00ff00, #00ff80, #00ff00)", // Green
                boxShadow: progress < 33
                  ? "0 0 20px #ff00ff"
                  : progress < 66
                  ? "0 0 20px #00ffff"
                  : "0 0 20px #00ff00",
                width: `${progress}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)",
                }}
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </div>

          {/* Progress Percentage with glow */}
          <p
            className="text-purple-300 text-sm font-mono"
            style={{
              textShadow: "0 0 10px #8b00ff",
            }}
          >
            {Math.floor(progress)}%
          </p>
        </motion.div>

        {/* Corner accent lines */}
        {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
          <motion.div
            key={`corner-${i}`}
            className={`absolute ${pos} w-20 h-20`}
            style={{
              borderColor: "#ff00ff",
              boxShadow: "0 0 20px #ff00ff",
              ...(i === 0 && { borderTop: "3px solid", borderLeft: "3px solid" }),
              ...(i === 1 && { borderTop: "3px solid", borderRight: "3px solid" }),
              ...(i === 2 && { borderBottom: "3px solid", borderLeft: "3px solid" }),
              ...(i === 3 && { borderBottom: "3px solid", borderRight: "3px solid" }),
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
          />
        ))}
      </div>

      <style>{`
        @keyframes cyberpunk-glitch {
          0%, 100% { transform: translate(0); }
          33% { transform: translate(-2px, 2px); }
          66% { transform: translate(2px, -2px); }
        }
      `}</style>
    </div>
  );
}
