"use client";

import React from "react";
import { Windows11OS } from "@/features/os/Windows11OS";
import { BootAnimation } from "@/features/os/BootAnimation";
import { siteConfig } from "@/config/site";
import { ChevronDown } from "lucide-react";
import { useAYOSGlobal } from "@/features/os/state/useAYOSGlobal";

export default function Home() {
  const { appMode, enterAYOS, exitAYOS } = useAYOSGlobal();
  const osRef = React.useRef<HTMLDivElement | null>(null);
  const [isBooting, setIsBooting] = React.useState(false);

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
        <section className="h-screen w-full flex items-center justify-center relative">
          <div className="text-center space-y-8 max-w-4xl px-6 z-10">
            {/* Hero */}
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {siteConfig.name}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Building micro-businesses and AI-powered products.
            </p>

            <p className="text-base text-gray-400 max-w-2xl mx-auto">
              System engineer, architect, and designer — all in one. <br />
              Crafting modern digital experiences with performance, security, and polish.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button
                onClick={startBoot}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all"
              >
                Enter AYOS
              </button>
              <a
                href="/projects"
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all"
              >
                Projects
              </a>
              <a
                href="/contact"
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all"
              >
                Contact
              </a>
            </div>

            {/* Scroll hint */}
            <div className="pt-12 animate-bounce">
              <ChevronDown className="mx-auto text-cyan-400" size={32} />
              <p className="text-sm text-gray-500 mt-2">Scroll or press Enter to enter AYOS</p>
            </div>
          </div>
        </section>
      )}

      {isBooting && <BootAnimation onBootComplete={handleBootComplete} />}

      {/* AYOS DESKTOP - OS Environment */}
      <section ref={osRef} className="w-full">
        {appMode === 'AYOS_DESKTOP' && <Windows11OS onPowerOff={exitAYOS} />}
      </section>

      {/* Hidden scrollable content for main screen */}
      {appMode === 'MAIN_SCREEN' && (
        <div className="min-h-[200vh] bg-gradient-to-b from-black via-black to-black"></div>
      )}
    </div>
  );
}
