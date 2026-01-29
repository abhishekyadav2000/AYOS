"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type NodeType = "root" | "folder" | "file" | "drive";
export type FileKind = "txt" | "pdf" | "docx" | "doc" | "xlsx" | "pptx" | "png" | "jpg" | "link" | "exe";

export type FSNode = {
  id: string;
  name: string;
  type: NodeType;
  fileType?: FileKind;
  content?: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  meta?: { size?: number; group?: "folder" | "drive" };
};

export type RecycleItem = {
  id: string;
  nodeSnapshot: FSNode[];
  originalParentId: string | null;
  deletedAt: string;
};

export type FileSystemState = {
  nodes: FSNode[];
  recycleBin: RecycleItem[];
  createFolder: (parentId: string, name: string) => void;
  createDocument: (parentId: string, name: string, fileType?: FileKind, content?: string) => void;
  renameNode: (id: string, name: string) => void;
  updateContent: (id: string, content: string) => void;
  deleteNode: (id: string) => void;
  restoreItem: (itemId: string) => void;
  deleteBinItem: (itemId: string) => void;
  emptyRecycleBin: () => void;
  getChildren: (parentId: string) => FSNode[];
  getNode: (id: string) => FSNode | undefined;
};

const STORAGE_KEY = "ay_os_fs_v1";
const BIN_KEY = "ay_os_bin_v1";

const now = () => new Date().toISOString();

const seedNodes = (): FSNode[] => {
  const timestamp = now();
  return [
    { id: "root", name: "This PC", type: "root", parentId: null, createdAt: timestamp, updatedAt: timestamp },
    
    // Main Folders (4 Core) - At Root Level
    { id: "projects", name: "📁 Projects", type: "folder", parentId: "root", createdAt: timestamp, updatedAt: timestamp, meta: { group: "folder" } },
    { id: "blog", name: "📖 Blog & Stories", type: "folder", parentId: "root", createdAt: timestamp, updatedAt: timestamp, meta: { group: "folder" } },
    { id: "social", name: "📱 Social Media", type: "folder", parentId: "root", createdAt: timestamp, updatedAt: timestamp, meta: { group: "folder" } },
    { id: "store", name: "🛍️ Store", type: "folder", parentId: "root", createdAt: timestamp, updatedAt: timestamp, meta: { group: "folder" } },
    
    // System Folders
    { id: "docs", name: "Documents", type: "folder", parentId: "root", createdAt: timestamp, updatedAt: timestamp, meta: { group: "folder" } },
    { id: "downloads", name: "Downloads", type: "folder", parentId: "root", createdAt: timestamp, updatedAt: timestamp, meta: { group: "folder" } },
    { id: "pictures", name: "Pictures", type: "folder", parentId: "root", createdAt: timestamp, updatedAt: timestamp, meta: { group: "folder" } },
    
    // Drives
    { id: "drive-c", name: "Local Disk (C:)", type: "drive", parentId: "root", createdAt: timestamp, updatedAt: timestamp, meta: { group: "drive" } },
    { id: "drive-d", name: "Data (D:)", type: "drive", parentId: "root", createdAt: timestamp, updatedAt: timestamp, meta: { group: "drive" } },
    
    // C drive contents
    { id: "program-files", name: "Program Files", type: "folder", parentId: "drive-c", createdAt: timestamp, updatedAt: timestamp },
    { id: "users", name: "Users", type: "folder", parentId: "drive-c", createdAt: timestamp, updatedAt: timestamp },
    
    // D drive contents
    { id: "archived", name: "Archived", type: "folder", parentId: "drive-d", createdAt: timestamp, updatedAt: timestamp },
    { id: "backups", name: "Backups", type: "folder", parentId: "drive-d", createdAt: timestamp, updatedAt: timestamp },
    
    // Documents content
    { id: "resume-pdf", name: "Resume.pdf", type: "file", fileType: "pdf", content: "Download from: /resume.pdf", parentId: "docs", createdAt: timestamp, updatedAt: timestamp },
    { id: "resume-docx", name: "Resume.docx", type: "file", fileType: "docx", content: "Download from: /resume.docx", parentId: "docs", createdAt: timestamp, updatedAt: timestamp },
    { id: "portfolio", name: "Portfolio.txt", type: "file", fileType: "txt", content: "Abhishek Yadav | Full Stack Developer\nSkills: React, Next.js, TypeScript, Node.js, Python\nPortfolio: Building innovative web applications", parentId: "docs", createdAt: timestamp, updatedAt: timestamp },
    
    // Downloads content
    { id: "setup-exe", name: "Setup.exe", type: "file", fileType: "exe", parentId: "downloads", createdAt: timestamp, updatedAt: timestamp },
    
    // ========== PROJECTS FOLDER STRUCTURE ==========
    // Projects folder content - Portfolio work
    { id: "proj-ayos", name: "AYOS - Interactive OS Portfolio.link", type: "file", fileType: "link", content: "https://github.com/abhishekyadav2000/AYOS", parentId: "projects", createdAt: timestamp, updatedAt: timestamp },
    { id: "proj-ecommerce", name: "E-Commerce Platform.link", type: "file", fileType: "link", content: "https://github.com/abhishekyadav2000", parentId: "projects", createdAt: timestamp, updatedAt: timestamp },
    { id: "proj-dashboard", name: "Analytics Dashboard.link", type: "file", fileType: "link", content: "https://github.com/abhishekyadav2000", parentId: "projects", createdAt: timestamp, updatedAt: timestamp },
    { id: "proj-ai-chatbot", name: "AI Chatbot Assistant.link", type: "file", fileType: "link", content: "https://github.com/abhishekyadav2000", parentId: "projects", createdAt: timestamp, updatedAt: timestamp },
    { id: "proj-portfolio", name: "Portfolio Template.link", type: "file", fileType: "link", content: "https://github.com/abhishekyadav2000", parentId: "projects", createdAt: timestamp, updatedAt: timestamp },
    { id: "proj-github-all", name: "View All Projects on GitHub.link", type: "file", fileType: "link", content: "https://github.com/abhishekyadav2000", parentId: "projects", createdAt: timestamp, updatedAt: timestamp },
    
    // ========== BLOG FOLDER STRUCTURE ==========
    // Blog folder subfolders
    { id: "blog-published", name: "Published", type: "folder", parentId: "blog", createdAt: timestamp, updatedAt: timestamp },
    { id: "blog-drafts", name: "Drafts", type: "folder", parentId: "blog", createdAt: timestamp, updatedAt: timestamp },
    { id: "blog-readme", name: "📖 All Field Notes.txt", type: "file", fileType: "txt", content: "Field Notes & Personal Stories\n\n1. Building an Interactive Web OS\n2. Local-First AI: Running Models in the Browser\n3. Building Products with Intuition\n\nRead these in the Field Notes app!", parentId: "blog", createdAt: timestamp, updatedAt: timestamp },
    
    // ========== SOCIAL MEDIA FOLDER STRUCTURE ==========
    // Social Media folder content
    { id: "social-linkedin", name: "LinkedIn Profile.link", type: "file", fileType: "link", content: "https://www.linkedin.com/in/itsmebro", parentId: "social", createdAt: timestamp, updatedAt: timestamp },
    { id: "social-github", name: "GitHub Profile.link", type: "file", fileType: "link", content: "https://github.com/abhishekyadav2000", parentId: "social", createdAt: timestamp, updatedAt: timestamp },
    { id: "social-youtube", name: "YouTube Channel.link", type: "file", fileType: "link", content: "https://youtube.com/@abhishekyadav", parentId: "social", createdAt: timestamp, updatedAt: timestamp },
    { id: "social-x", name: "X (Twitter).link", type: "file", fileType: "link", content: "https://x.com/abhishekyadav", parentId: "social", createdAt: timestamp, updatedAt: timestamp },
    { id: "social-instagram", name: "Instagram.link", type: "file", fileType: "link", content: "https://instagram.com/abhishekyadav", parentId: "social", createdAt: timestamp, updatedAt: timestamp },
    { id: "social-canva", name: "Canva - Design Tool.link", type: "file", fileType: "link", content: "https://canva.com", parentId: "social", createdAt: timestamp, updatedAt: timestamp },
    { id: "social-buffer", name: "Buffer - Social Scheduling.link", type: "file", fileType: "link", content: "https://buffer.com", parentId: "social", createdAt: timestamp, updatedAt: timestamp },
    { id: "social-analytics", name: "Analytics Dashboard.link", type: "file", fileType: "link", content: "https://analytics.google.com", parentId: "social", createdAt: timestamp, updatedAt: timestamp },
    { id: "social-hootsuite", name: "Hootsuite - Social Manager.link", type: "file", fileType: "link", content: "https://hootsuite.com", parentId: "social", createdAt: timestamp, updatedAt: timestamp },
    
    // ========== STORE FOLDER STRUCTURE ==========
    // Store folder content - Marketplace items
    { id: "store-services", name: "💼 My Services.txt", type: "file", fileType: "txt", content: "Professional Services:\n\n1. Full Stack Development\n2. UI/UX Design\n3. API Development\n4. System Architecture\n5. Technical Consulting\n\nContact: abhishekyadav@my.unt.edu", parentId: "store", createdAt: timestamp, updatedAt: timestamp },
    { id: "store-templates", name: "🎨 Portfolio Templates.link", type: "file", fileType: "link", content: "https://github.com/abhishekyadav2000", parentId: "store", createdAt: timestamp, updatedAt: timestamp },
    { id: "store-consulting", name: "💡 Tech Consulting.txt", type: "file", fileType: "txt", content: "Offering technical consulting for:\n- Web Development\n- System Design\n- Performance Optimization\n- Cloud Architecture\n\nHourly/Project rates available", parentId: "store", createdAt: timestamp, updatedAt: timestamp },
    { id: "store-courses", name: "📚 Online Courses (Coming Soon).txt", type: "file", fileType: "txt", content: "Upcoming courses:\n- Modern Web Development\n- React & Next.js Mastery\n- System Design Fundamentals\n\nStay tuned!", parentId: "store", createdAt: timestamp, updatedAt: timestamp },
    { id: "store-gigs", name: "⚡ Freelance Gigs.link", type: "file", fileType: "link", content: "https://www.fiverr.com", parentId: "store", createdAt: timestamp, updatedAt: timestamp },
  ];
};

const buildId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

const collectSubtree = (nodes: FSNode[], id: string): FSNode[] => {
  const target = nodes.find((n) => n.id === id);
  if (!target) return [];
  const descendants = nodes.filter((n) => n.parentId === id).flatMap((child) => collectSubtree(nodes, child.id));
  return [target, ...descendants];
};

export const useFileSystemStore = create<FileSystemState>()(
  persist(
    (set, get) => ({
      nodes: seedNodes(),
      recycleBin: [],
      createFolder: (parentId, name) => {
        const timestamp = now();
        const newNode: FSNode = {
          id: buildId("folder"),
          name: name || "New Folder",
          type: "folder",
          parentId,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        set((state) => ({ nodes: [...state.nodes, newNode] }));
      },
      createDocument: (parentId, name, fileType = "txt", content = "") => {
        const timestamp = now();
        const newNode: FSNode = {
          id: buildId("file"),
          name: name || "New Document.txt",
          type: "file",
          fileType,
          parentId,
          content,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        set((state) => ({ nodes: [...state.nodes, newNode] }));
      },
      renameNode: (id, name) => {
        set((state) => ({
          nodes: state.nodes.map((n) => (n.id === id ? { ...n, name, updatedAt: now() } : n)),
        }));
      },
      updateContent: (id, content) => {
        set((state) => ({
          nodes: state.nodes.map((n) => (n.id === id ? { ...n, content, updatedAt: now() } : n)),
        }));
      },
      deleteNode: (id) => {
        set((state) => {
          const snapshot = collectSubtree(state.nodes, id);
          if (!snapshot.length) return state;
          const remaining = state.nodes.filter((n) => !snapshot.some((s) => s.id === n.id));
          const item: RecycleItem = {
            id: buildId("bin"),
            nodeSnapshot: snapshot,
            originalParentId: snapshot[0]?.parentId ?? null,
            deletedAt: now(),
          };
          return { nodes: remaining, recycleBin: [item, ...state.recycleBin] };
        });
      },
      restoreItem: (itemId) => {
        set((state) => {
          const target = state.recycleBin.find((i) => i.id === itemId);
          if (!target) return state;
          const parentExists = state.nodes.some((n) => n.id === target.originalParentId);
          const reassigned = target.nodeSnapshot.map((n) =>
            n.id === target.nodeSnapshot[0].id && !parentExists ? { ...n, parentId: "root" } : n
          );
          return {
            nodes: [...state.nodes, ...reassigned],
            recycleBin: state.recycleBin.filter((i) => i.id !== itemId),
          };
        });
      },
      deleteBinItem: (itemId) => {
        set((state) => ({ recycleBin: state.recycleBin.filter((i) => i.id !== itemId) }));
      },
      emptyRecycleBin: () => set(() => ({ recycleBin: [] })),
      getChildren: (parentId) => get().nodes.filter((n) => n.parentId === parentId),
      getNode: (id) => get().nodes.find((n) => n.id === id),
    }),
    {
      name: STORAGE_KEY,
      storage: typeof window === "undefined" ? undefined : createJSONStorage(() => localStorage),
      partialize: (state) => ({ nodes: state.nodes, recycleBin: state.recycleBin }),
      onRehydrateStorage: () => (state) => {
        if (!state?.nodes?.length) return;
      },
    }
  )
);

// Secondary bin persistence key for compatibility with older versions
if (typeof window !== "undefined") {
  const migrated = window.localStorage.getItem(STORAGE_KEY);
  if (!migrated && window.localStorage.getItem(BIN_KEY)) {
    window.localStorage.removeItem(BIN_KEY);
  }
}
