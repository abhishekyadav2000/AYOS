"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { Coffee, Share2, Heart, Home } from "lucide-react";

interface ShutdownAnimationProps {
  onAnimationComplete: () => void;
}

export function ShutdownAnimation({ onAnimationComplete }: ShutdownAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(onAnimationComplete, 12000); // Slowed down to 12 seconds for better timing
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Movie Credits Style Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255, 255, 255, 0.03) 50px, rgba(255, 255, 255, 0.03) 51px),
            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255, 255, 255, 0.03) 50px, rgba(255, 255, 255, 0.03) 51px)
          `,
        }}
      />

      {/* Credits Container - Scrolling up like movie credits */}
      <motion.div
        className="absolute inset-x-0 flex flex-col items-center justify-start pt-[100vh] pb-20 space-y-16"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{
          duration: 11,
          ease: "linear",
        }}
      >
        {/* Goodbye Message */}
        <motion.div
          className="flex flex-col items-center space-y-4 text-center px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
        >
          <h2 className="text-5xl font-bold text-white mb-2">Thank You</h2>
          <p className="text-xl text-gray-400 max-w-2xl">
            For exploring AYOS. Hope you enjoyed the experience!
          </p>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          className="w-64 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.5, duration: 1.2 }}
        />

        {/* Call to Actions */}
        <motion.div
          className="flex flex-col items-center space-y-8 text-center px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1.5 }}
        >
          <h3 className="text-3xl font-semibold text-white mb-4">Stay Connected</h3>
          
          <div className="flex flex-wrap justify-center gap-6">
            {/* Share Button */}
            <motion.a
              href="https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20portfolio!&url=YOUR_SITE_URL"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg text-blue-400 hover:text-blue-300 transition-all backdrop-blur-sm group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="font-medium">Share</span>
            </motion.a>

            {/* Subscribe/Follow Button */}
            <motion.a
              href="mailto:your@email.com?subject=Subscribe&body=I'd like to stay updated!"
              className="flex items-center gap-3 px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 rounded-lg text-purple-400 hover:text-purple-300 transition-all backdrop-blur-sm group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Subscribe</span>
            </motion.a>
          </div>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          className="w-64 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 3.5, duration: 1.2 }}
        />

        {/* Buy Me a Coffee */}
        <motion.div
          className="flex flex-col items-center space-y-6 text-center px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.5, duration: 1.5 }}
        >
          <h3 className="text-2xl font-semibold text-white">Support My Work</h3>
          <p className="text-gray-400 max-w-md">
            If you enjoyed this experience, consider buying me a coffee!
          </p>
          
          <motion.a
            href="https://buymeacoffee.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 hover:from-yellow-600/30 hover:to-orange-600/30 border border-yellow-500/50 rounded-xl text-yellow-400 hover:text-yellow-300 transition-all backdrop-blur-sm text-lg font-medium group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Coffee className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>Buy Me a Coffee</span>
          </motion.a>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          className="w-64 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 6, duration: 1.2 }}
        />

        {/* Return Home */}
        <motion.div
          className="flex flex-col items-center space-y-6 text-center px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 7.5, duration: 1.5 }}
        >
          <p className="text-gray-500 text-sm uppercase tracking-widest">Returning to main</p>
          <motion.div
            className="flex items-center gap-2 text-cyan-400"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Home className="w-5 h-5" />
            <span className="font-mono">Loading homepage...</span>
          </motion.div>
        </motion.div>

        {/* Final Fade to Black */}
        <div className="h-40" />
      </motion.div>

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.8) 100%)",
        }}
      />

      {/* Film grain effect */}
      <motion.div
        className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        animate={{
          opacity: [0.03, 0.05, 0.03],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
}

export default ShutdownAnimation;
