"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type NodeType = "root" | "folder" | "file" | "drive";
export type FileKind = "txt" | "pdf" | "docx" | "png" | "jpg" | "link" | "exe";

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
    // Folders section
    { id: "docs", name: "Documents", type: "folder", parentId: "root", createdAt: timestamp, updatedAt: timestamp, meta: { group: "folder" } },
    { id: "downloads", name: "Downloads", type: "folder", parentId: "root", createdAt: timestamp, updatedAt: timestamp, meta: { group: "folder" } },
    { id: "desktop", name: "Desktop", type: "folder", parentId: "root", createdAt: timestamp, updatedAt: timestamp, meta: { group: "folder" } },
    { id: "pictures", name: "Pictures", type: "folder", parentId: "root", createdAt: timestamp, updatedAt: timestamp, meta: { group: "folder" } },
    { id: "music", name: "Music", type: "folder", parentId: "root", createdAt: timestamp, updatedAt: timestamp, meta: { group: "folder" } },
    { id: "videos", name: "Videos", type: "folder", parentId: "root", createdAt: timestamp, updatedAt: timestamp, meta: { group: "folder" } },
    // Drives
    { id: "drive-c", name: "Local Disk (C:)", type: "drive", parentId: "root", createdAt: timestamp, updatedAt: timestamp, meta: { group: "drive" } },
    { id: "drive-d", name: "Data (D:)", type: "drive", parentId: "root", createdAt: timestamp, updatedAt: timestamp, meta: { group: "drive" } },
    // C drive contents
    { id: "program-files", name: "Program Files", type: "folder", parentId: "drive-c", createdAt: timestamp, updatedAt: timestamp },
    { id: "users", name: "Users", type: "folder", parentId: "drive-c", createdAt: timestamp, updatedAt: timestamp },
    // D drive contents
    { id: "projects", name: "Projects", type: "folder", parentId: "drive-d", createdAt: timestamp, updatedAt: timestamp },
    { id: "media", name: "Media", type: "folder", parentId: "drive-d", createdAt: timestamp, updatedAt: timestamp },
    // Documents content
    { id: "resume-pdf", name: "Resume.pdf", type: "file", fileType: "pdf", parentId: "docs", createdAt: timestamp, updatedAt: timestamp },
    { id: "resume-docx", name: "Resume.docx", type: "file", fileType: "docx", parentId: "docs", createdAt: timestamp, updatedAt: timestamp },
    { id: "portfolio", name: "Portfolio.txt", type: "file", fileType: "txt", content: "Abhishek Yadav | Full Stack Developer\nSkills: React, Next.js, TypeScript, Node.js, Python\nPortfolio: Building innovative web applications", parentId: "docs", createdAt: timestamp, updatedAt: timestamp },
    // Downloads content
    { id: "setup-exe", name: "Setup.exe", type: "file", fileType: "exe", parentId: "downloads", createdAt: timestamp, updatedAt: timestamp },
    // Desktop folders
    { id: "desktop-projects", name: "Projects", type: "folder", parentId: "desktop", createdAt: timestamp, updatedAt: timestamp },
    { id: "desktop-socials", name: "Social Media", type: "folder", parentId: "desktop", createdAt: timestamp, updatedAt: timestamp },
    // Projects folder content
    { id: "proj-ayos", name: "AYOS (This Site).link", type: "file", fileType: "link", content: "https://github.com/abhishekyadav2000/AYOS", parentId: "desktop-projects", createdAt: timestamp, updatedAt: timestamp },
    { id: "proj-github", name: "All Projects - GitHub.link", type: "file", fileType: "link", content: "https://github.com/abhishekyadav2000", parentId: "desktop-projects", createdAt: timestamp, updatedAt: timestamp },
    // Social Media folder content
    { id: "social-linkedin", name: "LinkedIn.link", type: "file", fileType: "link", content: "https://www.linkedin.com/in/itsmebro", parentId: "desktop-socials", createdAt: timestamp, updatedAt: timestamp },
    { id: "social-github", name: "GitHub.link", type: "file", fileType: "link", content: "https://github.com/abhishekyadav2000", parentId: "desktop-socials", createdAt: timestamp, updatedAt: timestamp },
    { id: "social-youtube", name: "YouTube.link", type: "file", fileType: "link", content: "https://youtube.com/@abhishekyadav", parentId: "desktop-socials", createdAt: timestamp, updatedAt: timestamp },
    { id: "social-x", name: "X (Twitter).link", type: "file", fileType: "link", content: "https://x.com/abhishekyadav", parentId: "desktop-socials", createdAt: timestamp, updatedAt: timestamp },
    { id: "social-instagram", name: "Instagram.link", type: "file", fileType: "link", content: "https://instagram.com/abhishekyadav", parentId: "desktop-socials", createdAt: timestamp, updatedAt: timestamp },
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
