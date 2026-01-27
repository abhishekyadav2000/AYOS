"use client";

import React from "react";
import { Search, X, FileText, Folder, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFileSystemStore, FSNode } from "../state/useFileSystem";

type SearchPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile: (file: FSNode) => void;
};

export function SearchPanel({ isOpen, onClose, onSelectFile }: SearchPanelProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<FSNode[]>([]);
  const fs = useFileSystemStore();

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = fs.nodes.filter((node) => {
      if (node.type === "root") return false; // Skip root
      return node.name.toLowerCase().includes(searchTerm) || node.content?.toLowerCase().includes(searchTerm);
    });

    setResults(filtered);
  }, [query, fs.nodes]);

  const getIcon = (node: FSNode) => {
    if (node.type === "folder") return Folder;
    if (node.fileType === "link") return LinkIcon;
    return FileText;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-16 left-1/2 -translate-x-1/2 w-[600px] max-w-[90vw] z-50 bg-black/95 border border-white/15 rounded-lg shadow-2xl backdrop-blur-xl overflow-hidden"
        >
          {/* Search Input */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
              <Search size={18} className="text-white/60" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search files, folders, and content..."
                className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Escape") onClose();
                }}
              />
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {query && results.length === 0 ? (
              <div className="p-6 text-center text-white/50 text-sm">
                No results found for "{query}"
              </div>
            ) : results.length > 0 ? (
              <div className="divide-y divide-white/5">
                {results.map((file) => {
                  const Icon = getIcon(file);
                  return (
                    <motion.button
                      key={file.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => {
                        onSelectFile(file);
                        onClose();
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition text-left group"
                    >
                      <Icon size={18} className="text-white/60 group-hover:text-white transition flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white/90 truncate group-hover:text-white">
                          {file.name}
                        </div>
                        <div className="text-xs text-white/40">
                          {file.type === "folder" ? "Folder" : file.type === "file" ? file.fileType?.toUpperCase() : "Link"}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-white/40 text-sm">
                Start typing to search...
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
