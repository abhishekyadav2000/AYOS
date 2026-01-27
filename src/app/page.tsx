"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { Windows11OS } from "@/features/os/Windows11OS";
import { siteConfig } from "@/config/site";
import { ChevronDown } from "lucide-react";

export default function Home() {
  const osSectionRef = React.useRef<HTMLDivElement | null>(null);
  const osInView = useInView(osSectionRef, { once: true, amount: 0.3 });
  const [osActive, setOsActive] = React.useState(false);

  React.useEffect(() => {
    if (osInView) setOsActive(true);
  }, [osInView]);

  // Add keyboard listener for Enter key to navigate to AYOS
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && !osActive) {
        setOsActive(true);
        const osSection = osSectionRef.current;
        if (osSection) {
          osSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [osActive]);

  return (
    <div className="w-full">
      {/* Hero Section - Landing Page with Matrix Background */}
      {!osActive && (
      <section className="h-screen w-full flex items-center justify-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 max-w-4xl px-6 z-10"
        >
          {/* Hero Heading */}
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {siteConfig.name}
            </span>
          </h1>

          {/* Hero Subheading */}
          <p className="text-2xl md:text-3xl text-white/80 font-light">
            We build micro businesses and AI‑powered products.
          </p>

          {/* Hero Description */}
          <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            System engineer, architect, and designer — all in one. Crafting modern digital experiences with performance, security, and polish.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <a href="#os" className="px-5 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white/90 transition">Enter AYOS</a>
            <a href="/projects" className="px-5 py-2 rounded-lg border border-white/15 bg-white/0 hover:bg-white/10 text-white/80 transition">Projects</a>
            <a href="/contact" className="px-5 py-2 rounded-lg border border-white/15 bg-white/0 hover:bg-white/10 text-white/80 transition">Contact</a>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="pt-12"
          >
            <p className="text-white/50 text-sm font-medium mb-4">Scroll to Enter AYOS</p>
            <div className="flex justify-center">
              <ChevronDown
                size={24}
                className="text-cyan-400/50 animate-pulse"
              />
            </div>
          </motion.div>
        </motion.div>
        {/* Subtle dark overlay for readability while keeping matrix visible */}
        <div className="absolute inset-0 bg-black/30" />
      </section>
      )}

      {/* OS Mode Section - Lazy mounted when in view */}
      <section ref={osSectionRef} id="os" className="w-full relative min-h-screen">
        {osActive ? (
          <Windows11OS
            showWelcome={false}
            onWelcomeClose={() => {}}
            onExit={() => {
              setOsActive(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ) : (
          osInView ? null : <div className="h-screen" />
        )}
      </section>
    </div>
  );
}
