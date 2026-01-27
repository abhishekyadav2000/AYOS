"use client";

import React from "react";
import { Trash2, RotateCcw, XCircle } from "lucide-react";
import { useFileSystemStore } from "../state/useFileSystem";

export function RecycleBinApp() {
  const fs = useFileSystemStore();
  const items = fs.recycleBin;
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const selected = items.find((i) => i.id === selectedId);

  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-white/80">
          <Trash2 size={16} />
          <span>Recycle Bin</span>
          <span className="text-white/50">{items.length} item{items.length === 1 ? "" : "s"}</span>
        </div>
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => selected && fs.restoreItem(selected.id)}
            disabled={!selected}
            className="px-3 py-1.5 rounded bg-white/10 border border-white/15 hover:bg-white/15 disabled:opacity-50"
          >
            Restore
          </button>
          <button
            onClick={() => selected && fs.deleteBinItem(selected.id)}
            disabled={!selected}
            className="px-3 py-1.5 rounded bg-red-500/20 border border-red-500/40 text-red-200 hover:bg-red-500/30 disabled:opacity-50"
          >
            Delete permanently
          </button>
          <button
            onClick={() => fs.emptyRecycleBin()}
            className="px-3 py-1.5 rounded bg-red-600/30 border border-red-500/50 text-red-100 hover:bg-red-500/40"
          >
            Empty Bin
          </button>
        </div>
      </div>

      <div className="flex-1 rounded-lg border border-white/10 bg-white/5 overflow-auto divide-y divide-white/5">
        {items.length === 0 ? (
          <div className="p-6 text-center text-white/60">Bin is empty</div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-white/5 ${selectedId === item.id ? "bg-white/10" : ""}`}
            >
              <div>
                <div className="text-sm text-white">{item.nodeSnapshot[0]?.name ?? "Item"}</div>
                <div className="text-[11px] text-white/50">Deleted {new Date(item.deletedAt).toLocaleString()}</div>
              </div>
              <div className="text-xs text-white/60">{item.nodeSnapshot.length} item(s)</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
