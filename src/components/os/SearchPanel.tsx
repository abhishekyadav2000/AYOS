"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowManager } from "./WindowManager";
import { siteConfig } from "@/config/site";

interface SearchResult {
  type: "app" | "project" | "blog";
  id: string;
  title: string;
  description?: string;
  appId?: string;
}

const APPS = [
  { id: "about", title: "About", appId: "about" },
  { id: "projects", title: "Projects", appId: "projects" },
  { id: "resume", title: "Resume", appId: "resume" },
  { id: "contact", title: "Contact", appId: "contact" },
  { id: "socials", title: "Socials", appId: "socials" },
  { id: "privacyPolicy", title: "Privacy Policy", appId: "privacyPolicy" },
  { id: "computer", title: "My Computer", appId: "computer" },
  { id: "recycleBin", title: "Recycle Bin", appId: "recycleBin" },
  { id: "calculator", title: "Calculator", appId: "calculator" },
  { id: "notes", title: "Notes", appId: "notes" },
  { id: "docs", title: "Docs", appId: "docs" },
  { id: "files", title: "Files", appId: "files" },
];

export function SearchPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { openWindow } = useWindowManager();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const allResults: SearchResult[] = [];

    // Search apps
    APPS.forEach((app) => {
      if (app.title.toLowerCase().includes(q)) {
        allResults.push({
          type: "app",
          id: app.id,
          title: app.title,
          appId: app.appId,
        });
      }
    });

    // Search projects
    siteConfig.projects.forEach((project) => {
      if (
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.tags.some((tag) => tag.toLowerCase().includes(q))
      ) {
        allResults.push({
          type: "project",
          id: project.id,
          title: project.title,
          description: project.description,
        });
      }
    });

    setResults(allResults);
    setSelectedIndex(0);
  }, [query]);

  const handleSelectResult = (result: SearchResult) => {
    if (result.type === "app" && result.appId) {
      openWindow(result.appId);
    }
    setIsOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      handleSelectResult(results[selectedIndex]);
    }
  };

  return (
    <>
      {/* Search Icon in Taskbar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-indigo-500/30 rounded-lg transition-colors"
        title="Search"
      >
        <Search size={20} className="text-cyan-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-2xl max-h-96 bg-black/95 border border-indigo-500/30 rounded-2xl backdrop-blur-xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="px-4 pt-4 text-xs font-semibold text-cyan-400">Welcome to Abhishek OS</div>
            {/* Search Input */}
            <div className="p-4 border-b border-indigo-500/20">
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search apps, projects, blog..."
                className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
              />
            </div>

            {/* Results */}
            <div className="overflow-y-auto flex-1">
              {results.length > 0 ? (
                <div className="p-4 space-y-2">
                  {results.map((result, idx) => (
                    <motion.button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSelectResult(result)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedIndex === idx
                          ? "bg-indigo-500/30 border border-indigo-500/50"
                          : "hover:bg-indigo-500/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-xs font-semibold text-cyan-400 bg-cyan-400/20 px-2 py-1 rounded">
                          {result.type === "app" ? "App" : result.type === "project" ? "Project" : "Blog"}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-white">{result.title}</p>
                          {result.description && (
                            <p className="text-xs text-gray-400 line-clamp-1">{result.description}</p>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : query ? (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  Start typing to search...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
