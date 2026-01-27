"use client";

import React from "react";
import Image from "next/image";

export function Wallpaper() {
  return (
    <div className="fixed inset-0 -z-20 bg-black">
      {/* Deadpool wallpaper */}
      <div className="absolute inset-0">
        <Image
          src="/wallpapers/deadpool.jpg"
          alt="Deadpool Wallpaper"
          fill
          className="object-cover"
          priority
          quality={100}
        />
      </div>
      
      {/* Subtle overlay for better contrast with UI elements */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Windows 11 style acrylic effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/10 backdrop-blur-[0.5px]" />
    </div>
  );
}
