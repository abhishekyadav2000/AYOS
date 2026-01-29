// Background preference management
export type BackgroundType = "matrix" | "cyberpunk" | "meteor" | "none";
export type RainContent = "matrix" | "emojis" | "symbols" | "binary" | "custom";

export interface BackgroundPreferences {
  background: BackgroundType;
  rainContent: RainContent;
  customText?: string;
  formation: string;
  matrixOpacity: number;
}

const DEFAULT_PREFERENCES: BackgroundPreferences = {
  background: "matrix",
  rainContent: "matrix",
  formation: "wave",
  matrixOpacity: 0.35,
};

const STORAGE_KEY = "bg-preferences";

export function getPreferences(): BackgroundPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: Partial<BackgroundPreferences>) {
  if (typeof window === "undefined") return;
  
  try {
    const current = getPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Dispatch custom event for components to listen to
    window.dispatchEvent(
      new CustomEvent("backgroundPreferencesChanged", { detail: updated })
    );
  } catch (error) {
    console.error("Failed to save preferences:", error);
  }
}

export const rainContentOptions: Record<RainContent, string[]> = {
  matrix: "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ".split(""),
  emojis: ["🚀", "💻", "🎮", "⚡", "🌟", "💡", "🔥", "🎯", "💎", "🎨", "🌈", "🦾", "🤖", "👾", "🎭"],
  symbols: ["@", "#", "$", "%", "^", "&", "*", "!", "~", "`", "+", "=", "-", "|", "/"],
  binary: ["0", "1"],
  custom: [],
};

export const formations = [
  "wave",
  "spiral",
  "pulse",
  "zigzag",
  "vortex",
  "ripple",
];

export const backgrounds = [
  { id: "matrix", label: "Matrix Rain" },
  { id: "cyberpunk", label: "Cyberpunk City" },
  { id: "meteor", label: "Meteor Shower" },
  { id: "none", label: "None" },
] as const;
