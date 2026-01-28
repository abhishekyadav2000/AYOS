"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function CyberpunkCityBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Particles for atmosphere
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    // Flying vehicles (cars and drones)
    const vehicles: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      speed: number;
      type: "car" | "drone";
      color: string;
      lightColor: string;
    }> = [];

    for (let i = 0; i < 12; i++) {
      const isDrone = Math.random() > 0.5;
      vehicles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.7) + canvas.height * 0.1,
        width: isDrone ? 20 : 30,
        height: isDrone ? 8 : 12,
        speed: Math.random() * 2 + 1,
        type: isDrone ? "drone" : "car",
        color: isDrone ? "#22d3ee" : "#f472b6",
        lightColor: isDrone ? "#06b6d4" : "#ec4899",
      });
    }

    // Droids/Robots walking
    const droids: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      legOffset: number;
      color: string;
    }> = [];

    for (let i = 0; i < 8; i++) {
      droids.push({
        x: Math.random() * canvas.width,
        y: canvas.height - 50 - Math.random() * 30,
        size: 20 + Math.random() * 15,
        speed: Math.random() * 0.5 + 0.3,
        legOffset: Math.random() * Math.PI * 2,
        color: ["#06b6d4", "#a78bfa", "#fbbf24"][Math.floor(Math.random() * 3)],
      });
    }

    let animationFrame: number;
    let frame = 0;

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradient background (dark cyberpunk sky)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#0a0118");
      gradient.addColorStop(0.5, "#1a0828");
      gradient.addColorStop(1, "#2d1b3d");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw city skyline (buildings)
      const buildingCount = 15;
      for (let i = 0; i < buildingCount; i++) {
        const x = (i * canvas.width) / buildingCount;
        const width = canvas.width / buildingCount + 10;
        const height = Math.random() * canvas.height * 0.4 + canvas.height * 0.3;
        const y = canvas.height - height;

        // Building body
        ctx.fillStyle = `rgba(${20 + Math.random() * 20}, ${15 + Math.random() * 25}, ${40 + Math.random() * 30}, 0.8)`;
        ctx.fillRect(x, y, width - 5, height);

        // Windows (glowing)
        const windowRows = Math.floor(height / 15);
        const windowCols = Math.floor(width / 12);
        for (let row = 0; row < windowRows; row++) {
          for (let col = 0; col < windowCols; col++) {
            if (Math.random() > 0.3) {
              const windowX = x + col * 12 + 3;
              const windowY = y + row * 15 + 5;
              const isNeon = Math.random() > 0.7;
              ctx.fillStyle = isNeon
                ? ["#22d3ee", "#a78bfa", "#f472b6"][Math.floor(Math.random() * 3)]
                : "#fbbf24";
              ctx.fillRect(windowX, windowY, 5, 8);
              
              // Glow effect
              if (isNeon && Math.random() > 0.5) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = ctx.fillStyle;
                ctx.fillRect(windowX, windowY, 5, 8);
                ctx.shadowBlur = 0;
              }
            }
          }
        }

        // Rooftop antenna/lights
        if (Math.random() > 0.6) {
          ctx.strokeStyle = "#06b6d4";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x + width / 2, y);
          ctx.lineTo(x + width / 2, y - 20);
          ctx.stroke();
          
          // Blinking light on top
          if (frame % 30 < 15) {
            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.arc(x + width / 2, y - 22, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw flying vehicles
      vehicles.forEach((vehicle) => {
        vehicle.x += vehicle.speed;
        if (vehicle.x > canvas.width + 50) {
          vehicle.x = -50;
          vehicle.y = Math.random() * (canvas.height * 0.7) + canvas.height * 0.1;
        }

        if (vehicle.type === "car") {
          // Flying car body
          ctx.fillStyle = vehicle.color;
          ctx.fillRect(vehicle.x, vehicle.y, vehicle.width, vehicle.height);
          
          // Windshield
          ctx.fillStyle = "rgba(34, 211, 238, 0.5)";
          ctx.fillRect(vehicle.x + 5, vehicle.y + 2, vehicle.width - 10, vehicle.height - 4);
          
          // Headlights trail
          ctx.fillStyle = vehicle.lightColor;
          ctx.globalAlpha = 0.4;
          ctx.fillRect(vehicle.x - 15, vehicle.y + vehicle.height / 2 - 1, 15, 2);
          ctx.globalAlpha = 1;
          
          // Lights
          ctx.fillStyle = "#fff";
          ctx.fillRect(vehicle.x + vehicle.width - 3, vehicle.y + 2, 3, 3);
          ctx.fillRect(vehicle.x + vehicle.width - 3, vehicle.y + vehicle.height - 5, 3, 3);
        } else {
          // Drone body
          ctx.fillStyle = vehicle.color;
          ctx.beginPath();
          ctx.ellipse(vehicle.x, vehicle.y, vehicle.width / 2, vehicle.height / 2, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Propellers
          const propellerSpeed = frame * 0.5;
          [-10, 10].forEach((offsetX) => {
            [-6, 6].forEach((offsetY) => {
              ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(
                vehicle.x + offsetX,
                vehicle.y + offsetY,
                4,
                propellerSpeed,
                propellerSpeed + Math.PI
              );
              ctx.stroke();
            });
          });
          
          // LED lights
          ctx.fillStyle = vehicle.lightColor;
          ctx.beginPath();
          ctx.arc(vehicle.x, vehicle.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw droids/robots
      droids.forEach((droid) => {
        droid.x += droid.speed;
        droid.legOffset += 0.1;
        
        if (droid.x > canvas.width + 30) {
          droid.x = -30;
        }

        // Droid body (rounded rectangle)
        ctx.fillStyle = droid.color;
        ctx.fillRect(droid.x - droid.size / 3, droid.y - droid.size, droid.size / 1.5, droid.size);
        
        // Head
        ctx.beginPath();
        ctx.arc(droid.x, droid.y - droid.size - 5, droid.size / 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye (glowing)
        ctx.fillStyle = "#22d3ee";
        ctx.beginPath();
        ctx.arc(droid.x + 2, droid.y - droid.size - 5, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 5;
        ctx.shadowColor = "#22d3ee";
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Legs (animated)
        const legSwing = Math.sin(droid.legOffset) * 5;
        ctx.strokeStyle = droid.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(droid.x - 5, droid.y);
        ctx.lineTo(droid.x - 5 + legSwing, droid.y + 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(droid.x + 5, droid.y);
        ctx.lineTo(droid.x + 5 - legSwing, droid.y + 10);
        ctx.stroke();
      });

      // Draw atmospheric particles (fog/dust)
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.y > canvas.height) {
          particle.y = 0;
          particle.x = Math.random() * canvas.width;
        }
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;

        ctx.fillStyle = `rgba(100, 200, 255, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />
      {/* Overlay for depth */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)",
          zIndex: 1,
        }}
      />
      {/* Neon grid floor */}
      <div
        className="fixed bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "200px",
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 19px,
              rgba(34, 211, 238, 0.1) 20px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 19px,
              rgba(34, 211, 238, 0.1) 20px
            ),
            linear-gradient(180deg, transparent 0%, rgba(10, 1, 24, 0.9) 100%)
          `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
          transform: "perspective(500px) rotateX(60deg)",
          transformOrigin: "bottom",
          zIndex: 2,
        }}
      />
    </>
  );
}
