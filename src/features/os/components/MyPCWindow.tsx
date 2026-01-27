"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Folder, FileText, Code, Image, Music, Archive, ChevronRight } from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: "folder" | "file";
  icon?: React.ReactNode;
  size?: string;
  modified?: string;
}

interface MyPCWindowProps {
  onClose: () => void;
}

const getFileIcon = (fileName: string) => {
  if (fileName.includes(".txt") || fileName.includes(".md"))
    return <FileText size={16} className="text-cyan-400" />;
  if (fileName.includes(".js") || fileName.includes(".ts"))
    return <Code size={16} className="text-yellow-400" />;
  if (fileName.includes(".jpg") || fileName.includes(".png"))
    return <Image size={16} className="text-pink-400" />;
  if (fileName.includes(".mp3") || fileName.includes(".wav"))
    return <Music size={16} className="text-purple-400" />;
  if (fileName.includes(".zip") || fileName.includes(".rar"))
    return <Archive size={16} className="text-orange-400" />;
  return <FileText size={16} className="text-gray-400" />;
};

const folderStructure: Record<string, FileItem[]> = {
  "This PC": [
    { id: "documents", name: "📄 Documents", type: "folder" },
    { id: "projects", name: "💼 Projects", type: "folder" },
    { id: "downloads", name: "⬇️ Downloads", type: "folder" },
    { id: "portfolio", name: "🎨 Portfolio", type: "folder" },
  ],
  documents: [
    { id: "resume", name: "Abhishek_Resume.pdf", type: "file", size: "2.4 MB", modified: "Jan 2024" },
    { id: "cv", name: "CV_FullStack.docx", type: "file", size: "1.2 MB", modified: "Jan 2024" },
    { id: "notes", name: "Project_Notes.txt", type: "file", size: "45 KB", modified: "Jan 2024" },
  ],
  projects: [
    { id: "ecommerce", name: "E-Commerce Platform", type: "folder" },
    { id: "streaming", name: "Streaming App", type: "folder" },
    { id: "security", name: "Security Tools", type: "folder" },
    { id: "main.ts", name: "index.ts", type: "file", size: "15 KB", modified: "Jan 2024" },
    { id: "config.ts", name: "config.ts", type: "file", size: "8 KB", modified: "Jan 2024" },
  ],
  portfolio: [
    { id: "banner.jpg", name: "banner.jpg", type: "file", size: "850 KB", modified: "Dec 2023" },
    { id: "profile.jpg", name: "profile.jpg", type: "file", size: "245 KB", modified: "Dec 2023" },
    { id: "projects.json", name: "projects.json", type: "file", size: "12 KB", modified: "Jan 2024" },
  ],
  downloads: [
    { id: "node_modules.zip", name: "node_modules.zip", type: "file", size: "450 MB", modified: "Today" },
    { id: "dependencies", name: "📦 Dependencies", type: "folder" },
  ],
};

export function MyPCWindow({ onClose }: MyPCWindowProps) {
  const [currentFolder, setCurrentFolder] = React.useState("This PC");
  const [breadcrumb, setBreadcrumb] = React.useState(["This PC"]);

  const items = folderStructure[currentFolder] || [];

  const handleFolderOpen = (folderName: string, folderKey: string) => {
    setCurrentFolder(folderKey);
    setBreadcrumb([...breadcrumb, folderName]);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newBreadcrumb);
    const folderKey = newBreadcrumb[newBreadcrumb.length - 1];
    setCurrentFolder(folderKey === "This PC" ? "This PC" : folderKey.includes("📄") ? "documents" : folderKey.includes("💼") ? "projects" : folderKey.includes("⬇️") ? "downloads" : folderKey.includes("🎨") ? "portfolio" : "This PC");
  };

  const handleGoBack = () => {
    if (breadcrumb.length > 1) {
      const newBreadcrumb = breadcrumb.slice(0, -1);
      setBreadcrumb(newBreadcrumb);
      const prevFolder = newBreadcrumb[newBreadcrumb.length - 1];
      setCurrentFolder(prevFolder === "This PC" ? "This PC" : prevFolder.includes("documents") ? "documents" : prevFolder.includes("projects") ? "projects" : prevFolder.includes("downloads") ? "downloads" : "portfolio");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, x: -80, y: 80 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, x: -80, y: 80 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-20 left-12 z-40 w-full max-w-3xl bg-gradient-to-br from-white/8 via-white/5 to-white/3 border border-white/15 backdrop-blur-2xl rounded-xl overflow-hidden shadow-2xl"
      style={{ maxHeight: "70vh" }}
    >
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-white/10 to-white/5 border-b border-white/10 px-5 py-3 flex items-center justify-between group hover:bg-gradient-to-r hover:from-white/15 hover:to-white/8 transition-colors">
        <div className="flex items-center gap-3 text-white font-medium">
          <Folder size={18} className="text-cyan-400" />
          <span>My Computer</span>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1.5 rounded transition text-white/70 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white/5 border-b border-white/10 px-4 py-2.5 flex items-center gap-3 backdrop-blur-sm">
        <button
          onClick={handleGoBack}
          disabled={breadcrumb.length <= 1}
          className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-white/80 hover:text-white text-sm transition font-medium"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2 text-white/70 text-sm flex-1 px-2">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight size={14} className="text-white/30" />}
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className="hover:text-white transition px-2 py-1 rounded hover:bg-white/10"
              >
                {item}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* File List */}
      <div className="overflow-y-auto" style={{ maxHeight: "calc(70vh - 140px)" }}>
        {items.length === 0 ? (
          <div className="p-12 text-center text-white/40">
            <Folder size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm">Empty folder</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {items.map((item, idx) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => {
                  if (item.type === "folder") {
                    const folderKey = item.name.replace(/[📄💼⬇️🎨]/g, "").trim().toLowerCase();
                    handleFolderOpen(item.name, folderKey);
                  }
                }}
                disabled={item.type === "file"}
                className="w-full px-5 py-3 flex items-center gap-4 hover:bg-white/8 transition-colors disabled:cursor-default group"
              >
                <div className="text-xl flex-shrink-0">
                  {item.type === "folder" ? "📁" : getFileIcon(item.name)}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-white/90 font-medium truncate group-hover:text-cyan-300 transition">
                    {item.name}
                  </p>
                  {item.size && (
                    <p className="text-white/40 text-xs">
                      {item.size} • {item.modified}
                    </p>
                  )}
                </div>
                {item.type === "folder" && (
                  <span className="text-white/30 group-hover:text-white/60 transition flex-shrink-0">
                    <ChevronRight size={16} />
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-white/5 border-t border-white/10 px-5 py-2 text-white/50 text-xs flex justify-between backdrop-blur-sm">
        <span>{items.length} items</span>
        <span className="text-white/30">Ready</span>
      </div>
    </motion.div>
  );
}
