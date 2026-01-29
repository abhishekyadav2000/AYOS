"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const facts = [
  "Full-stack engineer building AI-powered SaaS products and automation platforms",
  "Open-source contributor with a passion for developer tools and frameworks",
  "Expert in Next.js, TypeScript, and cloud-native architecture at scale",
  "Delivered high-performance web applications to enterprises and startups",
  "Specialized in real-time data processing and distributed systems",
  "Strong advocate for clean code, security-first design, and DevOps best practices",
  "Building the next generation of AI-powered micro-businesses and digital products",
  "Active in tech communities: speaking, mentoring, and sharing knowledge",
  "Passionate about solving complex problems with elegant, scalable solutions",
  "Constantly learning and exploring emerging technologies like AI, blockchain, and edge computing",
];

export function RotatingFacts() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % facts.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[60px] flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
          className="text-base text-gray-400 max-w-2xl mx-auto text-center"
        >
          {facts[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
