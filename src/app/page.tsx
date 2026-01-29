"use client";

import React from "react";
import { Windows11OS } from "@/features/os/Windows11OS";
import { BootAnimation } from "@/features/os/BootAnimation";
import { siteConfig } from "@/config/site";
import { ChevronDown, Rocket, Folder, Mail } from "lucide-react";
import { useAYOSGlobal } from "@/features/os/state/useAYOSGlobal";
import { RotatingFacts } from "@/components/RotatingFacts";
import { ShutdownAnimation } from "@/components/ShutdownAnimation";

export default function Home() {
  const { appMode, enterAYOS, exitAYOS } = useAYOSGlobal();
  const osRef = React.useRef<HTMLDivElement | null>(null);
  const [isBooting, setIsBooting] = React.useState(false);
  const [isShuttingDown, setIsShuttingDown] = React.useState(false);

  const startBoot = React.useCallback(() => {
    if (appMode !== "MAIN_SCREEN" || isBooting) return;
    setIsBooting(true);
  }, [appMode, isBooting]);

  const handleBootComplete = React.useCallback(() => {
    setIsBooting(false);
    enterAYOS();
    setTimeout(() => {
      osRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [enterAYOS]);

  // Handle scroll to enter AYOS
  React.useEffect(() => {
    const handleScroll = () => {
      if (appMode === 'MAIN_SCREEN') {
        // Scroll position when user scrolls down at all
        if (window.scrollY > 100) {
          startBoot();
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [appMode, startBoot]);

  // Ensure body can scroll
  React.useEffect(() => {
    if (appMode === 'MAIN_SCREEN') {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
  }, [appMode]);

  // Handle Enter key to enter AYOS
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && appMode === 'MAIN_SCREEN') {
        startBoot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appMode, startBoot]);

  return (
    <div className="w-full">
      {/* MAIN SCREEN - Landing Page */}
      {appMode === 'MAIN_SCREEN' && (
        <section className="h-screen w-full flex items-center justify-center relative overflow-hidden">
          {/* Top left - Projects button */}
          <a
            href="/projects"
            className="absolute top-8 left-8 z-20 px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all flex items-center gap-2"
          >
            <Folder size={18} />
            <span className="hidden sm:inline">Projects</span>
          </a>

          {/* Top right - Contact button */}
          <a
            href="/contact"
            className="absolute top-8 right-8 z-20 px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all flex items-center gap-2"
          >
            <Mail size={18} />
            <span className="hidden sm:inline">Contact</span>
          </a>

          <div className="text-center space-y-8 max-w-4xl px-6 z-10">
            {/* Hero */}
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {siteConfig.name}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Building AI-powered business products
            </p>

            <RotatingFacts />

            {/* Scroll hint - centered */}
            <div className="pt-12 space-y-4">
              <p className="text-lg text-cyan-300 font-semibold">Scroll to Enter AYOS</p>
              <div className="animate-bounce flex justify-center">
                <ChevronDown className="text-cyan-400" size={32} />
              </div>
            </div>
          </div>
        </section>
      )}

      {isBooting && <BootAnimation onBootComplete={handleBootComplete} />}

      {isShuttingDown && (
        <ShutdownAnimation
          onAnimationComplete={() => {
            setIsShuttingDown(false);
            exitAYOS();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {/* AYOS DESKTOP - OS Environment */}
      <section ref={osRef} className="w-full">
        {appMode === 'AYOS_DESKTOP' && (
          <Windows11OS
            onPowerOff={() => {
              setIsShuttingDown(true);
            }}
          />
        )}
      </section>

      {/* Hidden scrollable content for main screen */}
      {appMode === 'MAIN_SCREEN' && (
        <div className="min-h-[200vh] bg-gradient-to-b from-black via-black to-black"></div>
      )}
    </div>
  );
}
