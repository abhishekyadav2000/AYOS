/**
 * Context for passing initialization data to apps
 * Allows parent components to pass parameters like initial folder ID to apps
 */

import React from "react";

export interface AppInitData {
  folderId?: string; // For file explorer, navigate to this folder on open
  filePath?: string; // For text editors, open this file
  [key: string]: string | undefined;
}

export const AppInitContext = React.createContext<AppInitData | null>(null);

export function useAppInit(): AppInitData {
  const context = React.useContext(AppInitContext);
  return context || {};
}

export const AppInitProvider = AppInitContext.Provider;
