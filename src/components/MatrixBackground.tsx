"use client";

import { useEffect, useRef } from "react";

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Color variations for gaming aesthetic
    const colors = [
      "rgba(0, 255, 65, 1)",    // Bright green (primary)
      "rgba(0, 255, 200, 1)",   // Cyan-green
      "rgba(0, 200, 255, 1)",   // Bright cyan (accent)
      "rgba(100, 100, 255, 1)", // Blue-purple
    ];

    function draw() {
      if (!ctx || !canvas) return;

      // Add trailing effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set font
      ctx.font = `${fontSize}px monospace`;

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Color selection - first character brighter
        const colorIndex = drops[i] === 0 ? 0 : Math.floor(Math.random() * colors.length);
        const alpha = drops[i] === 0 ? 1 : 0.7 + Math.random() * 0.3;
        
        // Gaming color scheme
        if (i % 5 === 0) {
          ctx.fillStyle = colors[2]; // Cyan for accent columns
        } else if (i % 7 === 0) {
          ctx.fillStyle = colors[3]; // Blue-purple for variation
        } else {
          ctx.fillStyle = colors[0]; // Default Matrix green
        }
        
        // Adjust alpha
        ctx.globalAlpha = alpha;

        // Draw the character
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);

        // Reset drops randomly or when off screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Move drop down
        drops[i]++;
      }

      ctx.globalAlpha = 1;
    }

    // Animation loop
    const interval = setInterval(draw, 33); // ~30 FPS

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 pointer-events-none"
      style={{ opacity: 0.15 }}
    />
  );
}

export default MatrixBackground;
