"use client";

import { useEffect, useRef, useState } from "react";

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    // Throttle mouse updates
    let timeout: NodeJS.Timeout;
    const throttledMouseMove = (e: MouseEvent) => {
      if (!timeout) {
        timeout = setTimeout(() => {
          handleMouseMove(e);
          timeout = null as any;
        }, 16); // ~60fps
      }
    };
    
    window.addEventListener("mousemove", throttledMouseMove);
    return () => {
      window.removeEventListener("mousemove", throttledMouseMove);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

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

    // Matrix characters - mix of katakana, latin, numbers, and symbols
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
    const fontSize = 14;
    const columns = canvas.width / fontSize;

    // Array to hold y position of each column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    // Extended rainbow color palette with more variety
    const colors = [
      "rgba(255, 0, 0, 1)",       // Red
      "rgba(255, 127, 0, 1)",     // Orange  
      "rgba(255, 200, 0, 1)",     // Gold
      "rgba(255, 255, 0, 1)",     // Yellow
      "rgba(127, 255, 0, 1)",     // Lime
      "rgba(0, 255, 0, 1)",       // Green
      "rgba(0, 255, 127, 1)",     // Spring Green
      "rgba(0, 255, 255, 1)",     // Cyan
      "rgba(0, 127, 255, 1)",     // Sky Blue
      "rgba(0, 0, 255, 1)",       // Blue
      "rgba(75, 0, 130, 1)",      // Indigo
      "rgba(148, 0, 211, 1)",     // Violet
      "rgba(255, 0, 255, 1)",     // Magenta
      "rgba(255, 0, 127, 1)",     // Pink
      "rgba(255, 20, 147, 1)",    // Deep Pink
      "rgba(255, 105, 180, 1)",   // Hot Pink
    ];

    let colorIndex = 0;
    let lastFrameTime = 0;
    const targetFPS = 30;
    const frameDelay = 1000 / targetFPS;

    function draw(currentTime: number) {
      if (!ctx || !canvas) return;

      // Frame rate limiting
      const elapsed = currentTime - lastFrameTime;
      if (elapsed < frameDelay) {
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrameTime = currentTime - (elapsed % frameDelay);

      // Add trailing effect with darker fade
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw white spotlight effect around cursor - only redraw if needed
      const currentMouse = mousePosRef.current;
      const gradient = ctx.createRadialGradient(
        currentMouse.x, currentMouse.y, 0,
        currentMouse.x, currentMouse.y, 300
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.15)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.05)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set font once
      ctx.font = `bold ${fontSize}px monospace`;

      // Draw characters - optimize by reducing calculations
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        // Skip offscreen characters
        if (y < -fontSize || y > canvas.height + fontSize) {
          drops[i]++;
          continue;
        }
        
        // Simplified distance calculation - only for spotlight
        const dx = x - currentMouse.x;
        const dy = y - currentMouse.y;
        const distanceSq = dx * dx + dy * dy;
        const spotlightBoost = distanceSq < 160000 ? Math.max(0, 1 - Math.sqrt(distanceSq) / 400) : 0;
        
        // Rainbow color cycling - each column cycles through colors
        const columnColorIndex = Math.floor((i + colorIndex) % colors.length);
        const baseColor = colors[columnColorIndex];
        
        // Enhanced alpha with spotlight effect
        const baseAlpha = drops[i] === 0 ? 1 : 0.5 + Math.random() * 0.3;
        const alpha = Math.min(1, baseAlpha + spotlightBoost * 0.5);
        
        ctx.fillStyle = baseColor;
        ctx.globalAlpha = alpha;

        // Draw the character with glow effect - only when needed
        if (spotlightBoost > 0.3) {
          ctx.shadowColor = baseColor;
          ctx.shadowBlur = 15 + spotlightBoost * 25;
        } else if (spotlightBoost > 0) {
          ctx.shadowBlur = 3;
          ctx.shadowColor = baseColor;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fillText(text, x, y);

        // Reset drops to maintain continuous effect
        if (y > canvas.height) {
          drops[i] = Math.random() * -50; // Reset with random offset
        } else {
          // Move drop down
          drops[i]++;
        }
      }

      // Cycle through colors for animation effect
      colorIndex = (colorIndex + 0.01) % colors.length;

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      animationFrameRef.current = requestAnimationFrame(draw);
    }

    // Start animation loop with requestAnimationFrame
    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []); // Remove mousePos dependency - use ref instead

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 pointer-events-none"
      style={{ opacity: 0.35 }}
    />
  );
}

export default MatrixBackground;
