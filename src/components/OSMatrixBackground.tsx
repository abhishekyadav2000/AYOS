"use client";

import { useEffect, useRef, useState } from "react";
import {
  getPreferences,
  rainContentOptions,
  type BackgroundPreferences,
} from "@/lib/backgroundPreferences";

// Extended formations for OS mode
const osFormations = {
  wave: (x: number, time: number, columns: number) => Math.sin((x / columns) * Math.PI * 2 + time * 0.02) * 50,
  spiral: (x: number, time: number, columns: number) => Math.sin((x / columns) * Math.PI * 4 + time * 0.015) * 40,
  pulse: (x: number, time: number, columns: number) => Math.sin(time * 0.01) * 60,
  zigzag: (x: number, time: number, columns: number) => ((x % 20) < 10 ? 40 : -40) + Math.sin(time * 0.01) * 20,
  vortex: (x: number, time: number, columns: number) => Math.sin((x / columns) * Math.PI + time * 0.01) * 30 + Math.cos(time * 0.008) * 40,
  ripple: (x: number, time: number, columns: number) => Math.sin((x - time * 0.5) * 0.05) * 45,
  // New OS-specific formations
  tornado: (x: number, time: number, columns: number) => {
    const centerX = columns / 2;
    const distance = Math.abs(x - centerX);
    const angle = (time * 0.03 + distance * 0.01) % (Math.PI * 2);
    return Math.sin(angle) * (60 - distance * 0.1) + Math.cos(time * 0.015) * 30;
  },
  lightning: (x: number, time: number, columns: number) => {
    const bolt = Math.sin((x * 0.1 + time * 0.02) * Math.PI) * 80;
    const flicker = Math.random() > 0.95 ? 200 : 0;
    return bolt + flicker;
  },
  blackhole: (x: number, time: number, columns: number) => {
    const centerX = columns / 2;
    const distance = Math.abs(x - centerX);
    const pull = Math.sin(time * 0.01) * 100;
    return -(distance * 0.1) + pull;
  },
};

type FormationKey = keyof typeof osFormations;

export function OSMatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const formationIndexRef = useRef(0);
  const formationStartTimeRef = useRef(Date.now());
  const [prefs, setPrefs] = useState<BackgroundPreferences | null>(null);
  const [currentChars, setCurrentChars] = useState<string[]>([]);

  useEffect(() => {
    // Load initial preferences
    setPrefs(getPreferences());

    const handlePreferencesChanged = (e: Event) => {
      const event = e as CustomEvent;
      setPrefs(event.detail);
    };

    window.addEventListener("backgroundPreferencesChanged", handlePreferencesChanged);
    return () => {
      window.removeEventListener("backgroundPreferencesChanged", handlePreferencesChanged);
    };
  }, []);

  useEffect(() => {
    if (!prefs) return;

    // Update character set based on rain content preference
    let chars: string[] = [];
    if (prefs.rainContent === "custom" && prefs.customText) {
      chars = prefs.customText.split("");
    } else {
      chars = rainContentOptions[prefs.rainContent] || rainContentOptions.matrix;
    }
    setCurrentChars(chars);
  }, [prefs?.rainContent, prefs?.customText]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    let timeout: NodeJS.Timeout;
    const throttledMouseMove = (e: MouseEvent) => {
      if (!timeout) {
        timeout = setTimeout(() => {
          handleMouseMove(e);
          timeout = null as any;
        }, 16);
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
    if (!canvas || !prefs || currentChars.length === 0) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    const chars = currentChars;
    const fontSize = 14;
    const columns = canvas.width / fontSize;

    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const getFormation = () => {
      const formationNames = Object.keys(osFormations) as FormationKey[];
      const elapsed = Date.now() - formationStartTimeRef.current;
      const rotationInterval = 120000;

      const newIndex = Math.floor(elapsed / rotationInterval) % formationNames.length;
      if (newIndex !== formationIndexRef.current) {
        formationIndexRef.current = newIndex;
      }

      return formationNames[formationIndexRef.current];
    };

    const colors = [
      "rgba(255, 0, 0, 1)",
      "rgba(255, 127, 0, 1)",
      "rgba(255, 200, 0, 1)",
      "rgba(255, 255, 0, 1)",
      "rgba(127, 255, 0, 1)",
      "rgba(0, 255, 0, 1)",
      "rgba(0, 255, 127, 1)",
      "rgba(0, 255, 255, 1)",
      "rgba(0, 127, 255, 1)",
      "rgba(0, 0, 255, 1)",
      "rgba(75, 0, 130, 1)",
      "rgba(148, 0, 211, 1)",
      "rgba(255, 0, 255, 1)",
      "rgba(255, 0, 127, 1)",
      "rgba(255, 20, 147, 1)",
      "rgba(255, 105, 180, 1)",
    ];

    let colorIndex = 0;
    let lastFrameTime = 0;
    const targetFPS = 30;
    const frameDelay = 1000 / targetFPS;
    let globalTimeOffset = 0;

    function draw(currentTime: number) {
      if (!ctx || !canvas) return;

      const elapsed = currentTime - lastFrameTime;
      if (elapsed < frameDelay) {
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrameTime = currentTime - (elapsed % frameDelay);
      globalTimeOffset += elapsed * 0.5;

      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const currentMouse = mousePosRef.current;
      const gradient = ctx.createRadialGradient(
        currentMouse.x,
        currentMouse.y,
        0,
        currentMouse.x,
        currentMouse.y,
        300
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.15)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.05)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px monospace`;

      const currentFormationName = getFormation();
      const currentFormation = osFormations[currentFormationName];

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];

        const x = i * fontSize;
        const formationOffset = currentFormation(i, globalTimeOffset, drops.length);
        const y = drops[i] * fontSize + formationOffset;

        if (y < -fontSize || y > canvas.height + fontSize) {
          drops[i]++;
          continue;
        }

        const dx = x - currentMouse.x;
        const dy = y - currentMouse.y;
        const distanceSq = dx * dx + dy * dy;
        const spotlightBoost =
          distanceSq < 160000
            ? Math.max(0, 1 - Math.sqrt(distanceSq) / 400)
            : 0;

        const columnColorIndex = Math.floor(
          (i + colorIndex) % colors.length
        );
        const baseColor = colors[columnColorIndex];

        const baseAlpha = drops[i] === 0 ? 1 : 0.5 + Math.random() * 0.3;
        const alpha = Math.min(1, baseAlpha + spotlightBoost * 0.5);

        ctx.fillStyle = baseColor;
        ctx.globalAlpha = alpha;

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

        if (y > canvas.height) {
          drops[i] = Math.random() * -50;
        } else {
          drops[i]++;
        }
      }

      colorIndex = (colorIndex + 0.01) % colors.length;

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      animationFrameRef.current = requestAnimationFrame(draw);
    }

    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", setCanvasSize);
    };
  }, [currentChars, prefs]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 pointer-events-none"
      style={{ opacity: prefs?.matrixOpacity ?? 0.35 }}
    />
  );
}

export default OSMatrixBackground;
