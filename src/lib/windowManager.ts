export interface WindowRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface OSWindow {
  id: string;
  appId: string;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  rect: WindowRect;
  zIndex: number;
}

export interface WindowManagerState {
  windows: OSWindow[];
  nextZIndex: number;
}

export type SnapPreset = "leftHalf" | "rightHalf" | "full" | "topLeftQuarter" | "topRightQuarter" | "threeColumn";

export function getSnapRect(preset: SnapPreset, viewportWidth: number, viewportHeight: number): WindowRect {
  const taskbarHeight = 64;
  const availableHeight = viewportHeight - taskbarHeight;

  switch (preset) {
    case "leftHalf":
      return { x: 0, y: 0, w: viewportWidth / 2, h: availableHeight };
    case "rightHalf":
      return { x: viewportWidth / 2, y: 0, w: viewportWidth / 2, h: availableHeight };
    case "topLeftQuarter":
      return { x: 0, y: 0, w: viewportWidth / 2, h: availableHeight / 2 };
    case "topRightQuarter":
      return { x: viewportWidth / 2, y: 0, w: viewportWidth / 2, h: availableHeight / 2 };
    case "threeColumn":
      return { x: 0, y: 0, w: viewportWidth / 3, h: availableHeight };
    case "full":
    default:
      return { x: 0, y: 0, w: viewportWidth, h: availableHeight };
  }
}

export function detectSnapZone(
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number,
  threshold: number = 20
): SnapPreset | null {
  // Check corners first (priority)
  if (x < threshold && y < threshold) return "topLeftQuarter";
  if (x > viewportWidth - threshold && y < threshold) return "topRightQuarter";

  // Check edges
  if (x < threshold) return "leftHalf";
  if (x > viewportWidth - threshold) return "rightHalf";
  if (y < threshold) return "full";

  return null;
}
