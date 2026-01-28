"use client";

import { useEffect, useRef } from "react";

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  angle: number;
  color: string;
  trail: { x: number; y: number; opacity: number }[];
}

export function MeteorShowerBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Create stars for background
    const stars: { x: number; y: number; size: number; opacity: number; twinkleSpeed: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    // Create meteors
    const meteors: Meteor[] = [];
    const meteorColors = [
      "#FFD700", // Gold
      "#FF6347", // Tomato red
      "#00FFFF", // Cyan
      "#FF69B4", // Hot pink
      "#FFFFFF", // White
      "#FFA500", // Orange
    ];

    const createMeteor = () => {
      meteors.push({
        x: Math.random() * canvas.width * 1.5,
        y: -50,
        length: Math.random() * 100 + 80,
        speed: Math.random() * 8 + 6,
        opacity: 1,
        angle: Math.PI / 4, // 45 degrees
        color: meteorColors[Math.floor(Math.random() * meteorColors.length)],
        trail: [],
      });
    };

    // Initial meteors
    for (let i = 0; i < 3; i++) {
      createMeteor();
    }

    let frame = 0;
    const draw = () => {
      frame++;

      // Deep space background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#000428");
      gradient.addColorStop(0.5, "#001242");
      gradient.addColorStop(1, "#000000");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update stars with twinkling
      stars.forEach((star) => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 1 || star.opacity < 0.2) {
          star.twinkleSpeed *= -1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Add occasional glow to brighter stars
        if (star.opacity > 0.7 && star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.2})`;
          ctx.fill();
        }
      });

      // Draw and update meteors
      meteors.forEach((meteor, index) => {
        // Update meteor position
        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;

        // Add current position to trail
        meteor.trail.unshift({ x: meteor.x, y: meteor.y, opacity: meteor.opacity });

        // Limit trail length
        if (meteor.trail.length > 30) {
          meteor.trail.pop();
        }

        // Fade out meteor
        if (meteor.y > canvas.height * 0.6) {
          meteor.opacity -= 0.02;
        }

        // Draw meteor trail with gradient
        meteor.trail.forEach((point, i) => {
          const trailOpacity = point.opacity * (1 - i / meteor.trail.length);
          const size = (1 - i / meteor.trail.length) * 3;

          // Glow effect
          const glowGradient = ctx.createRadialGradient(
            point.x,
            point.y,
            0,
            point.x,
            point.y,
            size * 3
          );
          glowGradient.addColorStop(0, `${meteor.color}${Math.floor(trailOpacity * 255).toString(16).padStart(2, "0")}`);
          glowGradient.addColorStop(0.5, `${meteor.color}${Math.floor(trailOpacity * 100).toString(16).padStart(2, "0")}`);
          glowGradient.addColorStop(1, "rgba(0,0,0,0)");

          ctx.beginPath();
          ctx.arc(point.x, point.y, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${trailOpacity})`;
          ctx.fill();
        });

        // Draw meteor head (brightest part)
        const headGradient = ctx.createRadialGradient(meteor.x, meteor.y, 0, meteor.x, meteor.y, 8);
        headGradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity})`);
        headGradient.addColorStop(0.3, `${meteor.color}${Math.floor(meteor.opacity * 255).toString(16).padStart(2, "0")}`);
        headGradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = headGradient;
        ctx.fill();

        // Remove meteor if it's off screen or faded
        if (meteor.y > canvas.height + 100 || meteor.opacity <= 0) {
          meteors.splice(index, 1);
        }
      });

      // Spawn new meteors occasionally
      if (frame % 60 === 0 && meteors.length < 8) {
        createMeteor();
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ background: "#000428" }}
    />
  );
}
