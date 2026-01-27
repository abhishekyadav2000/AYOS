"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Folder, FileText, Code, Image, Music, Archive } from "lucide-react";

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
    return <FileText size={20} className="text-blue-400" />;
  if (fileName.includes(".js") || fileName.includes(".ts"))
    return <Code size={20} className="text-yellow-400" />;
  if (fileName.includes(".jpg") || fileName.includes(".png"))
    return <Image size={20} className="text-pink-400" />;
  if (fileName.includes(".mp3") || fileName.includes(".wav"))
    return <Music size={20} className="text-purple-400" />;
  if (fileName.includes(".zip") || fileName.includes(".rar"))
    return <Archive size={20} className="text-orange-400" />;
  return <FileText size={20} className="text-gray-400" />;
};

const folderStructure: Record<string, FileItem[]> = {
  "This PC": [
    {
      id: "documents",
      name: "📄 Documents",
      type: "folder",
    },
    {
      id: "projects",
      name: "💼 Projects",
      type: "folder",
    },
    {
      id: "downloads",
      name: "⬇️ Downloads",
      type: "folder",
    },
    {
      id: "portfolio",
      name: "🎨 Portfolio",
      type: "folder",
    },
  ],
  documents: [
    {
      id: "resume",
      name: "Abhishek_Resume.pdf",
      type: "file",
      size: "2.4 MB",
      modified: "Jan 2024",
    },
    {
      id: "cv",
      name: "CV_FullStack.docx",
      type: "file",
      size: "1.2 MB",
      modified: "Jan 2024",
    },
    {
      id: "notes",
      name: "Project_Notes.txt",
      type: "file",
      size: "45 KB",
      modified: "Jan 2024",
    },
  ],
  projects: [
    {
      id: "ecommerce",
      name: "E-Commerce Platform",
      type: "folder",
    },
    {
      id: "streaming",
      name: "Streaming App",
      type: "folder",
    },
    {
      id: "security",
      name: "Security Tools",
      type: "folder",
    },
    {
      id: "main.ts",
      name: "index.ts",
      type: "file",
      size: "15 KB",
      modified: "Jan 2024",
    },
    {
      id: "config.ts",
      name: "config.ts",
      type: "file",
      size: "8 KB",
      modified: "Jan 2024",
    },
  ],
  portfolio: [
    {
      id: "banner.jpg",
      name: "banner.jpg",
      type: "file",
      size: "850 KB",
      modified: "Dec 2023",
    },
    {
      id: "profile.jpg",
      name: "profile.jpg",
      type: "file",
      size: "245 KB",
      modified: "Dec 2023",
    },
    {
      id: "projects.json",
      name: "projects.json",
      type: "file",
      size: "12 KB",
      modified: "Jan 2024",
    },
  ],
  downloads: [
    {
      id: "node_modules.zip",
      name: "node_modules.zip",
      type: "file",
      size: "450 MB",
      modified: "Today",
    },
    {
      id: "dependencies",
      name: "📦 Dependencies",
      type: "folder",
    },
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
    setCurrentFolder(folderKey.includes("📄") ? "documents" : folderKey.includes("💼") ? "projects" : folderKey.includes("⬇️") ? "downloads" : folderKey.includes("🎨") ? "portfolio" : "This PC");
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
      initial={{ opacity: 0, scale: 0.8, x: -100, y: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: -100, y: 100 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-20 left-12 z-40 w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-xl rounded-lg overflow-hidden shadow-2xl"
      style={{ maxHeight: "600px" }}
    >
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Folder size={18} />
          <span>My PC</span>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded transition"
        >
          <X size={20} className="text-white" />
        </button>
      </div>

      {/* Navigation */}
      <div className="bg-white/10 border-b border-white/10 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={handleGoBack}
          disabled={breadcrumb.length <= 1}
          className="px-3 py-1 rounded bg-white/10 text-white/80 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition"
        >
          ← Back
        </button>
        <div className="flex items-center gap-1 text-white/70 text-sm">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-white/50">/</span>}
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className="hover:text-white transition"
              >
                {item}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* File List */}
      <div className="overflow-y-auto" style={{ maxHeight: "450px" }}>
        {items.length === 0 ? (
          <div className="p-8 text-center text-white/50">
            <Folder size={48} className="mx-auto mb-4 opacity-30" />
            <p>Empty folder</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {items.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => {
                  if (item.type === "folder") {
                    const folderKey = item.name
                      .replace(/[📄💼⬇️🎨]/g, "")
                      .trim()
                      .toLowerCase();
                    handleFolderOpen(item.name, folderKey);
                  }
                }}
                disabled={item.type === "file"}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition disabled:cursor-default text-left group"
                whileHover={item.type === "folder" ? { x: 4 } : {}}
              >
                <div className="text-2xl">
                  {item.type === "folder" ? "📁" : getFileIcon(item.name)}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium group-hover:text-cyan-300 transition">
                    {item.name}
                  </p>
                  {item.size && (
                    <p className="text-white/50 text-xs">
                      {item.size} • {item.modified}
                    </p>
                  )}
                </div>
                {item.type === "folder" && (
                  <span className="text-white/30 group-hover:text-white/60 transition">
                    →
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-white/5 border-t border-white/10 px-4 py-2 text-white/60 text-xs flex justify-between">
        <span>{items.length} items</span>
        <span>Ready</span>
      </div>
    </motion.div>
  );
}
