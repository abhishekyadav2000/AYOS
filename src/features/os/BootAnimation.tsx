"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface BootAnimationProps {
  onBootComplete: () => void;
}

export function BootAnimation({ onBootComplete }: BootAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Polygon animation canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const polygons: Array<{
      x: number;
      y: number;
      size: number;
      rotation: number;
      vx: number;
      vy: number;
      color: string;
      sides: number;
    }> = [];

    // Create initial polygons
    const colors = [
      "rgba(255, 0, 255, 0.3)", // Magenta
      "rgba(0, 255, 255, 0.3)", // Cyan
      "rgba(0, 255, 0, 0.2)", // Green
      "rgba(255, 100, 255, 0.25)", // Light magenta
    ];

    for (let i = 0; i < 15; i++) {
      polygons.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 100 + 50,
        rotation: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: colors[i % colors.length],
        sides: Math.floor(Math.random() * 4) + 4, // 4-7 sided polygons
      });
    }

    // Draw polygon function
    const drawPolygon = (
      x: number,
      y: number,
      sides: number,
      size: number,
      rotation: number,
      color: string,
      glow: boolean = false
    ) => {
      ctx.save();

      if (glow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
      }

      ctx.translate(x, y);
      ctx.rotate(rotation);

      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      ctx.strokeStyle = color.replace("0.3", "0.6").replace("0.2", "0.5").replace("0.25", "0.6");
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.fill();

      ctx.restore();
    };

    let frameCount = 0;
    const animate = () => {
      // Clear with dark background
      ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw polygons
      polygons.forEach((poly, index) => {
        poly.x += poly.vx;
        poly.y += poly.vy;
        poly.rotation += 0.01 + index * 0.001;

        // Bounce off edges
        if (poly.x < 0 || poly.x > canvas.width) poly.vx *= -1;
        if (poly.y < 0 || poly.y > canvas.height) poly.vy *= -1;

        // Keep in bounds
        poly.x = Math.max(poly.size, Math.min(canvas.width - poly.size, poly.x));
        poly.y = Math.max(poly.size, Math.min(canvas.height - poly.size, poly.y));

        // Draw with glow effect
        const hasGlow = frameCount % 60 < 30;
        drawPolygon(poly.x, poly.y, poly.sides, poly.size, poly.rotation, poly.color, hasGlow && index < 5);
      });

      frameCount++;
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
      {/* Animated polygon background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ display: "block" }}
      />

      {/* Loading content overlay */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        {/* Status Text */}
        <motion.p
          key={bootSteps[currentStep]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-cyan-300 text-lg font-mono font-medium mb-8"
          style={{
            textShadow: "0 0 15px #00ffff",
          }}
        >
          {bootSteps[currentStep]}
        </motion.p>

        {/* Geometric Progress Bar */}
        <div className="w-96 h-4 rounded-full overflow-hidden backdrop-blur-sm border border-cyan-500/50 bg-black/40">
          <motion.div
            className="h-full relative overflow-hidden"
            animate={{
              background: progress < 33
                ? "linear-gradient(90deg, #ff00ff, #8b00ff, #ff00ff)"
                : progress < 66
                ? "linear-gradient(90deg, #00ffff, #0080ff, #00ffff)"
                : "linear-gradient(90deg, #00ff00, #00ff80, #00ff00)",
              boxShadow: progress < 33
                ? "0 0 20px #ff00ff, inset 0 0 20px #ff00ff"
                : progress < 66
                ? "0 0 20px #00ffff, inset 0 0 20px #00ffff"
                : "0 0 20px #00ff00, inset 0 0 20px #00ff00",
              width: `${progress}%`,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
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

        {/* Progress Percentage */}
        <p className="text-cyan-300 text-sm font-mono mt-6 tracking-wider" style={{ textShadow: "0 0 10px #00ffff" }}>
          {Math.floor(progress)}% LOADING
        </p>
      </motion.div>
    </div>
  );
}
