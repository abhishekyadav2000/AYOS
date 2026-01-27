import React from "react";
import { CalculatorApp } from "./CalculatorApp";
import { MyComputerApp } from "./Explorer/MyComputerApp";
import { RecycleBinApp } from "./RecycleBinApp";

export type AppId = "my-computer" | "recycle-bin" | "calculator";

type AppDefinition = {
  appId: AppId;
  title: string;
  icon: string;
  component: () => React.ReactNode;
  defaultSize?: { w: number; h: number };
  defaultPosition?: { x: number; y: number };
};

export const appRegistry: Record<AppId, AppDefinition> = {
  "my-computer": {
    appId: "my-computer",
    title: "My Computer",
    icon: "monitor",
    component: () => <MyComputerApp />,
    defaultSize: { w: 1000, h: 700 },
  },
  "recycle-bin": {
    appId: "recycle-bin",
    title: "Recycle Bin",
    icon: "trash",
    component: () => <RecycleBinApp />,
    defaultSize: { w: 720, h: 520 },
  },
  calculator: {
    appId: "calculator",
    title: "Calculator",
    icon: "calculator",
    component: () => <CalculatorApp />,
    defaultSize: { w: 420, h: 560 },
  },
};

export const appList = Object.values(appRegistry);
