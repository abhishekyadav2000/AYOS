"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Folder, HardDrive, RefreshCw, Search, Home, FileText, File, FileArchive, FileCode, Link } from "lucide-react";
import { useFileSystemStore, FSNode, FileKind } from "../../state/useFileSystem";
import { useAppInit } from "../../context/AppInitContext";

const BREADCRUMB_ROOT = { id: "root", label: "This PC" };

type ToolbarButtonProps = {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

const ToolbarButton = ({ icon: Icon, label, onClick, disabled }: ToolbarButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/5 text-xs text-white/80 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Icon size={14} />
    <span>{label}</span>
  </button>
);

type ExplorerHistory = {
  stack: string[];
  pointer: number;
};

const buildBreadcrumb = (nodes: FSNode[], currentId: string) => {
  const parts: { id: string; label: string }[] = [];
  let node = nodes.find((n) => n.id === currentId);
  while (node) {
    if (node.id === "root") break;
    parts.unshift({ id: node.id, label: node.name });
    node = nodes.find((n) => n.id === node?.parentId);
  }
  return [BREADCRUMB_ROOT, ...parts];
};

const iconForNode = (node: FSNode) => {
  if (node.type === "folder") return Folder;
  if (node.type === "drive") return HardDrive;
  if (node.type === "file") {
    switch (node.fileType) {
      case "pdf":
        return FileText;
      case "docx":
        return File;
      case "txt":
        return FileCode;
      case "exe":
        return FileArchive;
      case "link":
        return Link;
      default:
        return File;
    }
  }
  return Folder;
};

type ContextMenuAction = "new-folder" | "new-file" | "rename" | "delete";

type Selection = {
  id: string | null;
};

const isSelectable = (node: FSNode) => node.type !== "root";

export function MyComputerApp() {
  const fs = useFileSystemStore();
  const initData = useAppInit();
  
  // Use initial folder ID if provided, otherwise use root
  const [currentId, setCurrentId] = React.useState(initData?.folderId || "root");
  const [history, setHistory] = React.useState<ExplorerHistory>({ stack: ["root"], pointer: 0 });
  const [selection, setSelection] = React.useState<Selection>({ id: null });
  const [contextMenu, setContextMenu] = React.useState<{ x: number; y: number; show: boolean }>({ x: 0, y: 0, show: false });
  const [renameValue, setRenameValue] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [editorNode, setEditorNode] = React.useState<FSNode | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const nodes = fs.nodes;
  const children = fs.getChildren(currentId).filter((n) => !searchQuery || n.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const breadcrumb = buildBreadcrumb(nodes, currentId);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current || containerRef.current.contains(e.target as Node)) return;
      setContextMenu({ x: 0, y: 0, show: false });
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  const navigateTo = (id: string) => {
    setCurrentId(id);
    setSelection({ id: null });
    setContextMenu({ x: 0, y: 0, show: false });
    setHistory((prev) => {
      const newStack = [...prev.stack.slice(0, prev.pointer + 1), id];
      return { stack: newStack, pointer: newStack.length - 1 };
    });
  };

  const goBack = () => {
    setHistory((prev) => {
      if (prev.pointer === 0) return prev;
      const pointer = prev.pointer - 1;
      setCurrentId(prev.stack[pointer]);
      setSelection({ id: null });
      return { ...prev, pointer };
    });
  };

  const goForward = () => {
    setHistory((prev) => {
      if (prev.pointer >= prev.stack.length - 1) return prev;
      const pointer = prev.pointer + 1;
      setCurrentId(prev.stack[pointer]);
      setSelection({ id: null });
      return { ...prev, pointer };
    });
  };

  const enterNode = (node: FSNode) => {
    if (node.type === "folder" || node.type === "drive" || node.type === "root") {
      navigateTo(node.id);
    } else if (node.type === "file") {
      if (node.fileType === "link" && node.content) {
        // .link files open in new browser tab
        window.open(node.content, "_blank");
      } else if (node.fileType === "pdf") {
        // .pdf files open in new tab or download
        if (node.name === "Resume.pdf") {
          window.open("/resume.pdf", "_blank");
        } else {
          setEditorNode(node);
        }
      } else if (node.fileType === "docx") {
        // .docx files download
        if (node.name === "Resume.docx") {
          const link = document.createElement("a");
          link.href = "/resume.docx";
          link.download = "Resume.docx";
          link.click();
        } else {
          setEditorNode(node);
        }
      } else if (node.fileType === "txt") {
        // .txt files open in Notepad AI
        setEditorNode(node);
      } else {
        // Default to showing in editor
        setEditorNode(node);
      }
    }
  };

  const onContext = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, show: true });
  };

  const createFolder = () => {
    fs.createFolder(currentId, "New Folder");
  };

  const createDocument = (fileType: FileKind = "txt") => {
    const label = fileType === "txt" ? "New Document.txt" : `New File.${fileType}`;
    fs.createDocument(currentId, label, fileType, "");
  };

  const deleteSelection = () => {
    if (!selection.id) return;
    fs.deleteNode(selection.id);
    setSelection({ id: null });
  };

  const startRename = () => {
    if (!selection.id) return;
    const node = fs.getNode(selection.id);
    if (!node) return;
    setRenameValue(node.name);
  };

  const commitRename = () => {
    if (!selection.id) return;
    if (!renameValue.trim()) return;
    fs.renameNode(selection.id, renameValue.trim());
    setRenameValue("");
  };

  const openParent = () => {
    const current = fs.getNode(currentId);
    if (current?.parentId) navigateTo(current.parentId);
  };

  const statusText = `${children.length} item${children.length === 1 ? "" : "s"}`;

  return (
    <div className="flex flex-col h-full text-white" onContextMenu={onContext} ref={containerRef}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border-b border-white/10">
        <ToolbarButton icon={ChevronLeft} label="Back" onClick={goBack} disabled={history.pointer === 0} />
        <ToolbarButton icon={ChevronRight} label="Forward" onClick={goForward} disabled={history.pointer >= history.stack.length - 1} />
        <ToolbarButton icon={Home} label="Up" onClick={openParent} disabled={currentId === "root"} />
        <ToolbarButton icon={RefreshCw} label="Refresh" onClick={() => setSearchQuery("")} />

        <div className="flex-1 flex items-center gap-2 ml-2">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-sm bg-white/5 border border-white/10 rounded px-2 py-1 min-w-[240px]">
            {breadcrumb.map((part, idx) => (
              <React.Fragment key={part.id}>
                <button onClick={() => navigateTo(part.id)} className="text-white/80 hover:text-white">
                  {part.label}
                </button>
                {idx < breadcrumb.length - 1 && <span className="text-white/30">›</span>}
              </React.Fragment>
            ))}
          </div>

          <div className="relative w-64">
            <Search size={14} className="absolute left-2 top-2.5 text-white/50" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-white/5 border border-white/10 rounded pl-8 pr-3 py-1.5 text-sm text-white/90 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation pane */}
        <div className="w-56 border-r border-white/10 bg-white/5 p-2 space-y-1 text-sm">
          <NavItem label="This PC" active={currentId === "root"} onClick={() => navigateTo("root")} />
          <NavItem label="Documents" active={currentId === "docs"} onClick={() => navigateTo("docs")} />
          <NavItem label="Downloads" active={currentId === "downloads"} onClick={() => navigateTo("downloads")} />
          <NavItem label="Desktop" active={currentId === "desktop"} onClick={() => navigateTo("desktop")} />
          <NavItem label="Pictures" active={currentId === "pictures"} onClick={() => navigateTo("pictures")} />
          <NavItem label="This PC (Drives)" active={false} onClick={() => navigateTo("root")} />
        </div>

        {/* Content */}
        <div className="flex-1 bg-black/30 p-3 overflow-auto" onDoubleClick={() => setContextMenu({ x: 0, y: 0, show: false })}>
          {/* Sections for root */}
          {currentId === "root" ? (
            <div className="space-y-6">
              <Section title="Folders">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {children.filter((n) => n.meta?.group === "folder").map((child) => (
                    <NodeTile key={child.id} node={child} isSelected={selection.id === child.id} onClick={() => setSelection({ id: child.id })} onDoubleClick={() => enterNode(child)} />
                  ))}
                </div>
              </Section>
              <Section title="Devices and drives">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {children.filter((n) => n.meta?.group === "drive").map((child) => (
                    <NodeTile key={child.id} node={child} isSelected={selection.id === child.id} onClick={() => setSelection({ id: child.id })} onDoubleClick={() => enterNode(child)} />
                  ))}
                </div>
              </Section>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {children.map((child) => (
                <NodeTile key={child.id} node={child} isSelected={selection.id === child.id} onClick={() => setSelection({ id: child.id })} onDoubleClick={() => enterNode(child)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-9 border-t border-white/10 bg-white/5 px-3 flex items-center text-xs text-white/70">{statusText}</div>

      {/* Context Menu */}
      {contextMenu.show ? (
        <div
          className="fixed z-50 bg-black/90 border border-white/15 rounded-md shadow-2xl text-sm text-white/90"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <ContextItem label="New Folder" onClick={createFolder} />
          <ContextItem label="New Document" onClick={() => createDocument("txt")} />
          <ContextItem label="Rename" onClick={startRename} disabled={!selection.id} />
          <ContextItem label="Delete" onClick={deleteSelection} disabled={!selection.id} />
        </div>
      ) : null}

      {/* Rename overlay */}
      {renameValue ? (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setRenameValue("")}>
          <div className="bg-black/90 border border-white/15 rounded-lg p-4 min-w-[320px]" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-white/80 mb-2">Rename</p>
            <input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setRenameValue("")} className="px-3 py-1.5 text-xs rounded bg-white/5 border border-white/10 text-white">Cancel</button>
              <button onClick={commitRename} className="px-3 py-1.5 text-xs rounded bg-cyan-500 text-black font-semibold">Save</button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Editor */}
      {editorNode ? (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setEditorNode(null)}>
          <div className="bg-black/95 border border-white/15 rounded-lg p-4 w-[640px] max-w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">{editorNode.name}</h3>
              <button onClick={() => setEditorNode(null)} className="text-white/60 hover:text-white text-xs">Close</button>
            </div>
            {editorNode.fileType === "txt" || editorNode.fileType === "docx" ? (
              <textarea
                defaultValue={editorNode.content || ""}
                onBlur={(e) => fs.updateContent(editorNode.id, e.target.value)}
                className="w-full h-64 bg-white/5 border border-white/10 rounded p-3 text-sm text-white"
              />
            ) : editorNode.fileType === "pdf" ? (
              <div className="h-64 bg-white/5 border border-white/10 rounded p-3 text-sm text-white/70 flex items-center justify-center">
                PDF viewer placeholder
              </div>
            ) : (
              <div className="h-64 bg-white/5 border border-white/10 rounded p-3 text-sm text-white/70 flex items-center justify-center">
                Preview not available
              </div>
            )}
            <div className="mt-3 flex justify-end">
              <button onClick={() => setEditorNode(null)} className="px-3 py-1.5 text-xs rounded bg-cyan-500 text-black font-semibold">Close</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type SectionProps = { title: string; children: React.ReactNode };
const Section = ({ title, children }: SectionProps) => (
  <div className="space-y-3">
    <div className="text-xs uppercase tracking-wide text-white/60">{title}</div>
    {children}
  </div>
);

type NavItemProps = { label: string; active: boolean; onClick: () => void };
const NavItem = ({ label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-2 py-1.5 rounded text-sm ${active ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10"}`}
  >
    {label}
  </button>
);

type NodeTileProps = { node: FSNode; isSelected: boolean; onClick: () => void; onDoubleClick: () => void };
const NodeTile = ({ node, isSelected, onClick, onDoubleClick }: NodeTileProps) => {
  const Icon = iconForNode(node);
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`border border-white/10 rounded-lg p-3 bg-white/5 hover:bg-white/10 cursor-pointer ${isSelected ? "ring-2 ring-cyan-400/60" : ""}`}
    >
      <Icon size={18} className="text-cyan-300 mb-2" />
      <div className="text-sm text-white/90 truncate">{node.name}</div>
      <div className="text-[11px] text-white/40">{node.type === "drive" ? "Drive" : node.type === "folder" ? "Folder" : node.fileType?.toUpperCase()}</div>
    </div>
  );
};

type ContextItemProps = { label: string; onClick?: () => void; disabled?: boolean };
const ContextItem = ({ label, onClick, disabled }: ContextItemProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-48 flex items-center gap-2 px-3 py-2 text-left hover:bg-white/10 disabled:opacity-50"
  >
    <span>{label}</span>
  </button>
);
