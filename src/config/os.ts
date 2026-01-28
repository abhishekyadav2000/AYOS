export type DesktopIcon = {
  id: string;
  label: string;
};

export type PinnedApp = {
  id: string;
  label: string;
  icon?: string;
};

export type RecommendedItem = {
  id: string;
  label: string;
  time: string;
};

export type OSConfig = {
  osName: string;
  userName: string;
  desktopIcons: DesktopIcon[];
  pinnedApps: PinnedApp[];
  recommendedItems: RecommendedItem[];
  socials: {
    linkedin: string;
    github: string;
  };
};

export const osConfig: OSConfig = {
  osName: "Welcome to Abhishek OS",
  userName: "Abhishek",
  desktopIcons: [
    { id: "this-pc", label: "This PC" },
    { id: "recycle-bin", label: "Recycle Bin" },
  ],
  pinnedApps: [
    { id: "my-computer", label: "This PC", icon: "monitor" },
    { id: "projects", label: "Projects", icon: "folder" },
    { id: "blog", label: "Blog Reader", icon: "book" },
    { id: "notepad-ai", label: "Notepad AI", icon: "file-text" },
    { id: "calculator", label: "Calculator", icon: "calculator" },
    { id: "paint", label: "Paint", icon: "palette" },
    { id: "recycle-bin", label: "Recycle Bin", icon: "trash" },
  ],
  recommendedItems: [],
  socials: {
    linkedin: "https://www.linkedin.com/in/itsmebro",
    github: "https://github.com/abhishekyadav2000",
  },
};
