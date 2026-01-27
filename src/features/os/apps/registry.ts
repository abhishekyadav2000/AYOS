import React from "react";
import { CalculatorApp } from "./CalculatorApp";
import { MyComputerApp } from "./Explorer/MyComputerApp";
import { RecycleBinApp } from "./RecycleBinApp";
import { NotepadApp } from "./NotepadApp";
import { PaintApp } from "./PaintApp";
import { SettingsApp } from "./SettingsApp";

export type AppId = "my-computer" | "recycle-bin" | "calculator" | "notepad" | "paint" | "settings";

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
		component: () => React.createElement(MyComputerApp),
		defaultSize: { w: 1000, h: 700 },
	},
	"recycle-bin": {
		appId: "recycle-bin",
		title: "Recycle Bin",
		icon: "trash",
		component: () => React.createElement(RecycleBinApp),
		defaultSize: { w: 720, h: 520 },
	},
	calculator: {
		appId: "calculator",
		title: "Calculator",
		icon: "calculator",
		component: () => React.createElement(CalculatorApp),
		defaultSize: { w: 420, h: 560 },
	},
	notepad: {
		appId: "notepad",
		title: "Notepad AI",
		icon: "file-text",
		component: () => React.createElement(NotepadApp),
		defaultSize: { w: 960, h: 640 },
	},
	paint: {
		appId: "paint",
		title: "Paint",
		icon: "paint-brush",
		component: () => React.createElement(PaintApp),
		defaultSize: { w: 1040, h: 680 },
	},
	settings: {
		appId: "settings",
		title: "Settings",
		icon: "settings",
		component: () => React.createElement(SettingsApp),
		defaultSize: { w: 600, h: 500 },
	},
};

export const appList = Object.values(appRegistry);
