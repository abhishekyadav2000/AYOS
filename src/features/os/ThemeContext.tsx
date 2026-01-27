"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "cyan" | "green" | "purple" | "orange" | "pink" | "blue";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: string;
  accentColorDark: string;
};

const themeColors: Record<Theme, { accent: string; accentDark: string }> = {
  cyan: { accent: "#22d3ee", accentDark: "#06b6d4" },
  green: { accent: "#10b981", accentDark: "#059669" },
  purple: { accent: "#a855f7", accentDark: "#9333ea" },
  orange: { accent: "#f97316", accentDark: "#ea580c" },
  pink: { accent: "#ec4899", accentDark: "#db2777" },
  blue: { accent: "#3b82f6", accentDark: "#2563eb" },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("cyan");

  useEffect(() => {
    const saved = localStorage.getItem("ayos-theme") as Theme;
    if (saved && themeColors[saved]) {
      setThemeState(saved);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("ayos-theme", newTheme);
    
    // Update CSS variables
    const root = document.documentElement;
    root.style.setProperty("--accent-color", themeColors[newTheme].accent);
    root.style.setProperty("--accent-color-dark", themeColors[newTheme].accentDark);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent-color", themeColors[theme].accent);
    root.style.setProperty("--accent-color-dark", themeColors[theme].accentDark);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        accentColor: themeColors[theme].accent,
        accentColorDark: themeColors[theme].accentDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export const themes: Theme[] = ["cyan", "green", "purple", "orange", "pink", "blue"];
