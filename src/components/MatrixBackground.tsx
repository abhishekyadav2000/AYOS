"use client";

import { useEffect, useRef, useState } from "react";

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Matrix characters - mix of katakana, latin, numbers, and symbols
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
    const fontSize = 14;
    const columns = canvas.width / fontSize;

    // Array to hold y position of each column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    // Rainbow color palette with cycling colors
    const colors = [
      "rgba(255, 0, 0, 1)",       // Red
      "rgba(255, 127, 0, 1)",     // Orange
      "rgba(255, 255, 0, 1)",     // Yellow
      "rgba(0, 255, 0, 1)",       // Green
      "rgba(0, 0, 255, 1)",       // Blue
      "rgba(75, 0, 130, 1)",      // Indigo
      "rgba(148, 0, 211, 1)",     // Violet
      "rgba(255, 0, 127, 1)",     // Pink
    ];

    let colorIndex = 0;

    function draw() {
      if (!ctx || !canvas) return;

      // Add trailing effect with darker fade
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw white spotlight effect around cursor
      const gradient = ctx.createRadialGradient(
        mousePos.x, mousePos.y, 0,
        mousePos.x, mousePos.y, 300
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.15)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.05)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set font
      ctx.font = `bold ${fontSize}px monospace`;

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        // Calculate distance from mouse for spotlight enhancement
        const dx = x - mousePos.x;
        const dy = y - mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const spotlightBoost = Math.max(0, 1 - distance / 400);
        
        // Rainbow color cycling - each column cycles through colors
        const columnColorIndex = (i + colorIndex) % colors.length;
        const baseColor = colors[columnColorIndex];
        
        // Enhanced alpha with spotlight effect
        const baseAlpha = drops[i] === 0 ? 1 : 0.5 + Math.random() * 0.3;
        const alpha = Math.min(1, baseAlpha + spotlightBoost * 0.5);
        
        ctx.fillStyle = baseColor;
        ctx.globalAlpha = alpha;

        // Draw the character with glow effect - enhanced for rainbow
        if (spotlightBoost > 0.3) {
          ctx.shadowColor = baseColor;
          ctx.shadowBlur = 15 + spotlightBoost * 25;
        } else {
          ctx.shadowBlur = 3; // Subtle glow even without spotlight
          ctx.shadowColor = baseColor;
        }
        
        ctx.fillText(text, x, y);

        // Reset drops randomly or when off screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Move drop down
        drops[i]++;
      }

      // Cycle through colors for animation effect
      colorIndex = (colorIndex + 0.01) % colors.length;

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    // Animation loop
    const interval = setInterval(draw, 33); // ~30 FPS

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, [mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 pointer-events-none"
      style={{ opacity: 0.35 }}
    />
  );
}

export default MatrixBackground;
