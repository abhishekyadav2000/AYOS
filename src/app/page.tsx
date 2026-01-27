"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Windows11OS } from "@/features/os/Windows11OS";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

const WELCOME_STORAGE_KEY = "ayos_welcomed";

export default function Home() {
  const [isWelcomed, setIsWelcomed] = React.useState(false);
  const [showGuide, setShowGuide] = React.useState(false);

  React.useEffect(() => {
    // Check if user has been welcomed before
    const hasWelcomed = localStorage.getItem(WELCOME_STORAGE_KEY);
    if (hasWelcomed) {
      setIsWelcomed(true);
      setShowGuide(false);
    } else {
      setShowGuide(true);
    }
  }, []);

  const handleCloseGuide = () => {
    setIsWelcomed(true);
    setShowGuide(false);
    localStorage.setItem(WELCOME_STORAGE_KEY, "true");
  };

  const handleNewUserGuide = () => {
    setShowGuide(true);
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Main OS Interface */}
      <Windows11OS showWelcome={!isWelcomed} onWelcomeClose={handleCloseGuide} />

      {/* Welcome Guide Modal */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/95 backdrop-blur-lg rounded-2xl max-w-2xl w-full shadow-2xl border border-white/20 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 px-8 py-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      Welcome to AYOS
                    </h1>
                    <p className="text-white/90 text-lg">
                      The interactive operating system of {siteConfig.name}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseGuide}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    🎮 Getting Started
                  </h2>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex gap-3">
                      <span className="text-2xl">🖱️</span>
                      <span>
                        <strong>Desktop Icons:</strong> Click on icons to open
                        applications and explore content
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-2xl">💼</span>
                      <span>
                        <strong>My PC:</strong> Open to browse projects and
                        work files
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-2xl">📝</span>
                      <span>
                        <strong>Notepad AI:</strong> Write and get AI assistance
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-2xl">⚙️</span>
                      <span>
                        <strong>Taskbar:</strong> Access pinned apps at the
                        bottom
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    🌟 Features
                  </h2>
                  <ul className="space-y-2 text-gray-700">
                    <li>✨ Interactive applications and games</li>
                    <li>🎨 Real computer experience with modern UI</li>
                    <li>🔍 Explore projects and portfolio content</li>
                    <li>📧 Contact directly from the OS</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 text-sm">
                    💡 <strong>Tip:</strong> This is a fully interactive
                    operating system. Click around, explore, and enjoy!
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 border-t border-gray-200 px-8 py-4 flex justify-between items-center">
                <button
                  onClick={handleCloseGuide}
                  className="text-gray-600 hover:text-gray-900 transition font-medium"
                >
                  I'll Figure it Out
                </button>
                <Button
                  onClick={handleCloseGuide}
                  className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white"
                >
                  Let's Go! 🚀
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
