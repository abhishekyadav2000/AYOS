"use client";

import React from "react";

export function Wallpaper() {
  return (
    <div className="fixed inset-0 -z-20 bg-slate-950">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/wallpapers/win11.jpg')" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(120,200,255,0.16),transparent_35%),radial-gradient(circle_at_70%_60%,rgba(30,120,255,0.18),transparent_32%)]" />
      <div className="absolute inset-0 bg-black/15" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_60%)] mix-blend-screen" />
    </div>
  );
}
