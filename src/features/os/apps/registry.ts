import React from "react";
import { CalculatorApp } from "./CalculatorApp";
import { MyComputerApp } from "./Explorer/MyComputerApp";
import { RecycleBinApp } from "./RecycleBinApp";
import { NotepadApp } from "./NotepadApp";
import { PaintApp } from "./PaintApp";
import { SettingsApp } from "./SettingsApp";
import { AboutApp } from "./AboutApp";
import { SnakeGameApp } from "./SnakeGameApp";
import { GamesHub } from "./GamesHub";
import { Game2048 } from "./games/Game2048";
import { TetrisGame } from "./games/TetrisGame";
import { MinesweeperGame } from "./games/MinesweeperGame";
import { MemoryGame } from "./games/MemoryGame";
import { TicTacToeGame } from "./games/TicTacToeGame";
import { FieldNotesApp } from "./FieldNotesApp";
import { StoreApp } from "./StoreApp";

export type AppId = 
  | "my-computer" 
  | "recycle-bin" 
  | "calculator" 
  | "notepad" 
  | "paint" 
  | "settings" 
  | "about" 
  | "snake" 
  | "games" 
  | "2048" 
  | "tetris"
  | "minesweeper"
  | "memory"
  | "tic-tac-toe"
  | "field-notes"
  | "store";

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
		title: "This PC",
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
	about: {
		appId: "about",
		title: "About Me",
		icon: "user",
		component: () => React.createElement(AboutApp),
		defaultSize: { w: 800, h: 700 },
	},
	// Games
	snake: {
		appId: "snake",
		title: "Snake",
		icon: "gamepad-2",
		component: () => React.createElement(SnakeGameApp),
		defaultSize: { w: 550, h: 650 },
	},
	games: {
		appId: "games",
		title: "Games",
		icon: "joystick",
		component: () => React.createElement(GamesHub),
		defaultSize: { w: 800, h: 600 },
	},
	"2048": {
		appId: "2048",
		title: "2048",
		icon: "grid-3x3",
		component: () => React.createElement(Game2048),
		defaultSize: { w: 550, h: 650 },
	},
	tetris: {
		appId: "tetris",
		title: "Tetris",
		icon: "cube",
		component: () => React.createElement(TetrisGame),
		defaultSize: { w: 600, h: 700 },
	},
	minesweeper: {
		appId: "minesweeper",
		title: "Minesweeper",
		icon: "bomb",
		component: () => React.createElement(MinesweeperGame),
		defaultSize: { w: 600, h: 700 },
	},
	memory: {
		appId: "memory",
		title: "Memory",
		icon: "brain",
		component: () => React.createElement(MemoryGame),
		defaultSize: { w: 600, h: 700 },
	},
	"tic-tac-toe": {
		appId: "tic-tac-toe",
		title: "Tic-Tac-Toe",
		icon: "grid-2x2",
		component: () => React.createElement(TicTacToeGame),
		defaultSize: { w: 550, h: 650 },
	},
	"field-notes": {
		appId: "field-notes",
		title: "Field Notes",
		icon: "book-open",
		component: () => React.createElement(FieldNotesApp),
		defaultSize: { w: 900, h: 700 },
	},
	store: {
		appId: "store",
		title: "Store",
		icon: "shopping-bag",
		component: () => React.createElement(StoreApp),
		defaultSize: { w: 900, h: 700 },
	},
};

export const appList = Object.values(appRegistry);
