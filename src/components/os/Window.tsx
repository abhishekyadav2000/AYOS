"use client";

import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { X, Minus, Square, MoreVertical } from "lucide-react";
import { useWindowManager } from "./WindowManager";
import { OSWindow, WindowRect, SnapPreset, detectSnapZone } from "@/lib/windowManager";
import { motion } from "framer-motion";

interface WindowComponentProps {
  window: OSWindow;
}

const SNAP_OPTIONS: { label: string; preset: SnapPreset }[] = [
  { label: "Left Half", preset: "leftHalf" },
  { label: "Right Half", preset: "rightHalf" },
  { label: "Maximize", preset: "full" },
  { label: "Top Left", preset: "topLeftQuarter" },
  { label: "Top Right", preset: "topRightQuarter" },
];

export function Window({ window: osWindow }: WindowComponentProps) {
  const { closeWindow, focusWindow, minimizeWindow, maximizeWindow, setWindowRect, snapWindow } = useWindowManager();
  const [showSnapMenu, setShowSnapMenu] = useState(false);
  const snapMenuRef = useRef<HTMLDivElement>(null);

  if (osWindow.isMinimized) return null;

  const handleDragStop = (e: any, d: any) => {
    const threshold = 20;
    const vw = typeof globalThis !== "undefined" && globalThis.window ? globalThis.window.innerWidth : 1920;
    const vh = typeof globalThis !== "undefined" && globalThis.window ? globalThis.window.innerHeight : 1080;
    const snap = detectSnapZone(d.x, d.y, vw, vh, threshold);
    if (snap) {
      snapWindow(osWindow.id, snap);
    } else {
      setWindowRect(osWindow.id, { ...osWindow.rect, x: d.x, y: d.y });
    }
  };

  const handleResizeStop = (e: any, direction: string, ref: any, delta: any, position: any) => {
    setWindowRect(osWindow.id, {
      x: position.x,
      y: position.y,
      w: ref.offsetWidth,
      h: ref.offsetHeight,
    });
  };

  return (
    <Rnd
      default={{
        x: osWindow.rect.x,
        y: osWindow.rect.y,
        width: osWindow.rect.w,
        height: osWindow.rect.h,
      }}
      position={{ x: osWindow.rect.x, y: osWindow.rect.y }}
      size={{ width: osWindow.rect.w, height: osWindow.rect.h }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      dragHandleClassName="window-titlebar"
      style={{ zIndex: osWindow.zIndex }}
      minWidth={300}
      minHeight={200}
      bounds="window"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full flex flex-col bg-black/90 border border-indigo-500/30 rounded-lg backdrop-blur-xl shadow-2xl"
        onClick={() => focusWindow(osWindow.id)}
      >
        {/* Title Bar */}
        <div className="window-titlebar flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-500/20 to-cyan-400/10 border-b border-indigo-500/20 cursor-move select-none">
          <h2 className="text-sm font-semibold text-white flex-1">{osWindow.title}</h2>
          
          <div className="flex items-center gap-2">
            {/* Snap Layout Menu */}
            <div className="relative" ref={snapMenuRef}>
              <button
                onClick={() => setShowSnapMenu(!showSnapMenu)}
                className="p-1 hover:bg-indigo-500/30 rounded transition-colors"
                title="Snap Layouts"
              >
                <MoreVertical size={16} className="text-gray-300" />
              </button>
              {showSnapMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-1 bg-black/95 border border-indigo-500/30 rounded-lg p-2 z-50 min-w-40 backdrop-blur-xl"
                >
                  {SNAP_OPTIONS.map((opt) => (
                    <button
                      key={opt.preset}
                      onClick={() => {
                        snapWindow(osWindow.id, opt.preset);
                        setShowSnapMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-500/20 rounded transition-colors text-gray-300"
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            <button
              onClick={() => minimizeWindow(osWindow.id)}
              className="p-1 hover:bg-indigo-500/30 rounded transition-colors"
              title="Minimize"
            >
              <Minus size={16} className="text-gray-300" />
            </button>
            <button
              onClick={() => maximizeWindow(osWindow.id)}
              className="p-1 hover:bg-indigo-500/30 rounded transition-colors"
              title="Maximize"
            >
              <Square size={16} className="text-gray-300" />
            </button>
            <button
              onClick={() => closeWindow(osWindow.id)}
              className="p-1 hover:bg-red-500/30 rounded transition-colors"
              title="Close"
            >
              <X size={16} className="text-red-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 text-gray-300 text-sm">
          <WindowContent appId={osWindow.appId} title={osWindow.title} />
        </div>
      </motion.div>
    </Rnd>
  );
}

interface WindowContentProps {
  appId: string;
  title: string;
}

function WindowContent({ appId, title }: WindowContentProps) {
  switch (appId) {
    case "about":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-cyan-400">About Abhishek</h3>
          <p>I'm Abhishek Yadav — a systems thinker, full-stack technologist, and community-driven builder currently pursuing a Master's in Information Systems & Technology (STEM) at the University of North Texas.</p>
          <p>I work at the intersection of technology, design, and human impact. My journey began with curiosity about how systems work — from embedded electronics and IoT to cloud platforms, data analytics, and secure digital infrastructure.</p>
        </div>
      );
    case "projects":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-cyan-400">Projects</h3>
          <p>Click the "Projects" link in the taskbar or taskbar to view detailed project information and case studies.</p>
          <div className="text-xs text-gray-500 mt-4">
            Open the Projects window to see your portfolio work.
          </div>
        </div>
      );
    case "resume":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-cyan-400">Resume</h3>
          <p>Full-Stack Developer & Designer</p>
          <p>Master's in Information Systems & Technology (STEM)</p>
          <p>University of North Texas</p>
          <div className="text-xs text-gray-500 mt-4">
            Contact for full resume
          </div>
        </div>
      );
    case "contact":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-cyan-400">Let's Connect</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Email:</strong> abhishekyadav@my.unt.edu</p>
            <p><strong>Phone:</strong> +1 (214) 899-2073</p>
            <p><strong>Location:</strong> Frisco, Texas</p>
          </div>
          <p className="text-xs text-gray-500 mt-4">Use the Contact form for detailed inquiries.</p>
        </div>
      );
    case "socials":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-cyan-400">Connect</h3>
          <div className="space-y-3">
            <a href="https://www.linkedin.com/in/itsmebro" target="_blank" rel="noopener noreferrer" className="block text-cyan-400 hover:text-cyan-300">
              LinkedIn → itsmebro
            </a>
            <a href="https://github.com/abhishekyadav2000" target="_blank" rel="noopener noreferrer" className="block text-cyan-400 hover:text-cyan-300">
              GitHub → abhishekyadav2000
            </a>
          </div>
        </div>
      );
    case "privacyPolicy":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-cyan-400">Privacy Policy</h3>
          <p>Your privacy is important. This portfolio collects minimal data and respects your information.</p>
          <p className="text-xs text-gray-500">Contact for detailed privacy information.</p>
        </div>
      );
    case "computer":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-cyan-400">System Overview</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p><strong>User:</strong> Abhishek Yadav</p>
              <p><strong>OS:</strong> {typeof navigator !== "undefined" ? navigator.platform : "Unknown"}</p>
              <p><strong>Browser:</strong> {typeof navigator !== "undefined" ? navigator.userAgent : "Unknown"}</p>
              <p><strong>Language:</strong> {typeof navigator !== "undefined" ? navigator.language : "en"}</p>
            </div>
            <div className="space-y-2">
              <p><strong>Viewport:</strong> {typeof window !== "undefined" ? `${window.innerWidth} x ${window.innerHeight}` : "N/A"}</p>
              <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
              <p><strong>Connection:</strong> {typeof (navigator as any) !== "undefined" && (navigator as any).connection ? `${(navigator as any).connection.effectiveType}` : "N/A"}</p>
            </div>
          </div>
        </div>
      );
    case "recycleBin":
      return <RecycleBinApp />;
    case "calculator":
      return <CalculatorApp />;
    case "notes":
      return <NotesApp />;
    case "docs":
      return <DocsApp />;
    case "files":
      return <FilesApp />;
    default:
      return <div>Unknown Application</div>;
  }
}

function CalculatorApp() {
  const [display, setDisplay] = React.useState<string>("0");
  const [prev, setPrev] = React.useState<number | null>(null);
  const [op, setOp] = React.useState<string | null>(null);

  const input = (val: string) => {
    setDisplay((d) => (d === "0" ? val : d + val));
  };

  const clear = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
  };

  const setOperator = (operator: string) => {
    setPrev(parseFloat(display));
    setDisplay("0");
    setOp(operator);
  };

  const equals = () => {
    const current = parseFloat(display);
    if (prev === null || !op) return;
    let result = 0;
    switch (op) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "*":
        result = prev * current;
        break;
      case "/":
        result = current === 0 ? NaN : prev / current;
        break;
    }
    setDisplay(isNaN(result) ? "Error" : String(result));
    setPrev(null);
    setOp(null);
  };

  const ButtonEl = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button onClick={onClick} className="p-3 bg-black/40 hover:bg-indigo-500/20 border border-indigo-500/30 rounded text-white">
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-cyan-400">Calculator</h3>
      <div className="p-3 bg-black/60 border border-indigo-500/30 rounded text-right text-2xl">{display}</div>
      <div className="grid grid-cols-4 gap-2">
        {"789".split("").map((n) => (
          <ButtonEl key={n} label={n} onClick={() => input(n)} />
        ))}
        <ButtonEl label="/" onClick={() => setOperator("/")} />
        {"456".split("").map((n) => (
          <ButtonEl key={n} label={n} onClick={() => input(n)} />
        ))}
        <ButtonEl label="*" onClick={() => setOperator("*")} />
        {"123".split("").map((n) => (
          <ButtonEl key={n} label={n} onClick={() => input(n)} />
        ))}
        <ButtonEl label="-" onClick={() => setOperator("-")} />
        <ButtonEl label="0" onClick={() => input("0")} />
        <ButtonEl label="." onClick={() => input(".")} />
        <ButtonEl label="C" onClick={clear} />
        <ButtonEl label="+" onClick={() => setOperator("+")} />
        <ButtonEl label="=" onClick={equals} />
      </div>
    </div>
  );
}

function useLocalStorage(key: string, initialValue: string) {
  const [value, setValue] = React.useState<string>(() => {
    if (typeof window === "undefined") return initialValue;
    const v = window.localStorage.getItem(key);
    return v ?? initialValue;
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}

function NotesApp() {
  const [text, setText] = useLocalStorage("ayos_notes", "Welcome to Abhishek OS Notes\n\nType your notes here...");
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-cyan-400">Notes</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        className="w-full bg-black/60 border border-indigo-500/30 rounded p-3 text-gray-200 focus:outline-none"
      />
      <p className="text-xs text-gray-500">Auto-saved to your browser (localStorage).</p>
    </div>
  );
}

function DocsApp() {
  const docs = [
    { id: "resume", title: "Resume (Overview)", content: "Full-Stack Developer & Designer | UNT (MS in IS&T)" },
    { id: "portfolio", title: "Portfolio Overview", content: "Projects spanning web apps, design systems, and platforms." },
  ];
  const [selected, setSelected] = React.useState(docs[0]);
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-cyan-400">Docs</h3>
        {docs.map((d) => (
          <button key={d.id} onClick={() => setSelected(d)} className={`w-full text-left px-3 py-2 rounded border ${selected.id === d.id ? "border-cyan-400 bg-cyan-400/10" : "border-indigo-500/30 hover:bg-indigo-500/20"}`}>
            {d.title}
          </button>
        ))}
      </div>
      <div className="md:col-span-2">
        <div className="p-4 bg-black/60 border border-indigo-500/30 rounded min-h-48">
          <h4 className="font-semibold mb-2">{selected.title}</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{selected.content}</p>
        </div>
      </div>
    </div>
  );
}

import { listFiles, createFile, updateFile, deleteFile, listDeletedFiles, restoreFile, emptyRecycleBin } from "@/lib/osStore";

function FilesApp() {
  const [files, setFiles] = React.useState(listFiles());
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const refresh = () => setFiles(listFiles());

  const create = () => {
    if (!title.trim()) return;
    const f = createFile(title.trim(), content);
    setTitle("");
    setContent("");
    setSelectedId(f.id);
    refresh();
  };

  const updateSelected = () => {
    if (!selectedId) return;
    updateFile(selectedId, { title, content });
    refresh();
  };

  const removeSelected = () => {
    if (!selectedId) return;
    deleteFile(selectedId);
    setSelectedId(null);
    refresh();
  };

  const selected = files.find((f) => f.id === selectedId) || null;

  React.useEffect(() => {
    if (selected) {
      setTitle(selected.title);
      setContent(selected.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [selectedId]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-cyan-400">Files</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h4 className="font-semibold">Your Files</h4>
          <div className="space-y-2">
            {files.length ? (
              files.map((f) => (
                <button key={f.id} onClick={() => setSelectedId(f.id)} className={`w-full text-left px-3 py-2 rounded border ${selectedId === f.id ? "border-cyan-400 bg-cyan-400/10" : "border-indigo-500/30 hover:bg-indigo-500/20"}`}>
                  <span className="block text-sm text-white">{f.title}</span>
                  <span className="block text-xs text-gray-500">Updated {new Date(f.updatedAt).toLocaleString()}</span>
                </button>
              ))
            ) : (
              <p className="text-xs text-gray-500">No files yet</p>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-3">
          <h4 className="font-semibold">Editor</h4>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full px-3 py-2 rounded bg-black/40 border border-indigo-500/30" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} placeholder="Content" className="w-full px-3 py-2 rounded bg-black/40 border border-indigo-500/30" />
          <div className="flex gap-2">
            <button onClick={create} className="px-3 py-2 text-xs rounded bg-cyan-400 text-black hover:bg-cyan-300">Create</button>
            <button onClick={updateSelected} disabled={!selectedId} className="px-3 py-2 text-xs rounded border border-indigo-500/40 hover:bg-indigo-500/20 disabled:opacity-50">Save</button>
            <button onClick={removeSelected} disabled={!selectedId} className="px-3 py-2 text-xs rounded bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 disabled:opacity-50">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecycleBinApp() {
  const [items, setItems] = React.useState(listDeletedFiles());
  const refresh = () => setItems(listDeletedFiles());

  const restore = (id: string) => {
    restoreFile(id);
    refresh();
  };

  const empty = () => {
    emptyRecycleBin();
    refresh();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-cyan-400">Recycle Bin</h3>
      {items.length ? (
        <div className="space-y-2">
          {items.map((f) => (
            <div key={f.id} className="flex items-center justify-between p-3 rounded border border-indigo-500/30">
              <div>
                <p className="text-sm text-white">{f.title}</p>
                <p className="text-xs text-gray-500">Deleted {f.deletedAt ? new Date(f.deletedAt).toLocaleString() : ""}</p>
              </div>
              <button onClick={() => restore(f.id)} className="px-3 py-2 text-xs rounded bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40">Restore</button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No items. Your bin is empty.</p>
      )}
      <div>
        <button onClick={empty} className="px-3 py-2 text-xs rounded bg-red-500/20 hover:bg-red-500/30 border border-red-500/40">Empty Bin</button>
      </div>
    </div>
  );
}
