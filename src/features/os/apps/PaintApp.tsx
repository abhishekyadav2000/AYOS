"use client";

import React from "react";

const COLORS = ["#ffffff", "#22d3ee", "#6366f1", "#f97316", "#10b981", "#f43f5e", "#e5e7eb", "#111827"];
const STROKE_WIDTHS = [2, 4, 6, 8, 12];

export function PaintApp() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [color, setColor] = React.useState(COLORS[1]);
  const [stroke, setStroke] = React.useState(4);
  const [history, setHistory] = React.useState<ImageData[]>([]);
  const [future, setFuture] = React.useState<ImageData[]>([]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0b1120";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const snapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-30), data]);
    setFuture([]);
  };

  const start = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    snapshot();
    setIsDrawing(true);
    draw(e, true);
  };

  const end = () => setIsDrawing(false);

  const draw = (e: React.MouseEvent, isStart = false) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawing && !isStart) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.strokeStyle = color;
    ctx.lineWidth = stroke;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (isStart) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleUndo = () => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const canvas = canvasRef.current;
      if (!canvas) return prev;
      const ctx = canvas.getContext("2d");
      if (!ctx) return prev;
      const last = prev[prev.length - 1];
      setFuture((f) => [...f, ctx.getImageData(canvas.width / 2 - last.width / 2, canvas.height / 2 - last.height / 2, last.width, last.height)]);
      ctx.putImageData(last, 0, 0);
      return prev.slice(0, -1);
    });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "paint.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col h-full text-white gap-3">
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
        <span className="text-sm font-semibold">Paint</span>
        <div className="flex items-center gap-2 ml-4">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`h-6 w-6 rounded-full border border-white/20 ${color === c ? "ring-2 ring-cyan-400" : ""}`}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 ml-4">
          {STROKE_WIDTHS.map((w) => (
            <button
              key={w}
              onClick={() => setStroke(w)}
              className={`px-2 py-1 rounded bg-white/10 border border-white/15 text-xs ${stroke === w ? "ring-1 ring-cyan-400" : ""}`}
            >
              {w}px
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button onClick={handleUndo} className="px-3 py-1 rounded bg-white/10 border border-white/15 text-xs hover:bg-white/15">Undo</button>
        <button onClick={handleDownload} className="px-3 py-1 rounded bg-cyan-500 text-black text-xs font-semibold">Download</button>
      </div>

      <div className="flex-1 bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          onMouseDown={start}
          onMouseUp={end}
          onMouseLeave={end}
          onMouseMove={draw}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
