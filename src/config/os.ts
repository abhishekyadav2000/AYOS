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
    { id: "projects", label: "Projects" },
    { id: "socials", label: "Social Media" },
    { id: "about", label: "About Me" },
    { id: "notepad-ai", label: "Notepad AI" },
    { id: "paint", label: "Paint" },
    { id: "calculator", label: "Calculator" },
    { id: "settings", label: "Settings" },
    { id: "recycle-bin", label: "Recycle Bin" },
  ],
  pinnedApps: [
    { id: "projects", label: "Projects", icon: "folder" },
    { id: "resume", label: "Resume", icon: "file-text" },
    { id: "socials", label: "Socials", icon: "globe" },
    { id: "about", label: "About", icon: "info" },
    { id: "contact", label: "Contact", icon: "mail" },
    { id: "blog", label: "Blog", icon: "book-open" },
    { id: "files", label: "Files", icon: "hard-drive" },
    { id: "notes", label: "Notes", icon: "sticky-note" },
    { id: "docs", label: "Docs", icon: "file" },
    { id: "calculator", label: "Calculator", icon: "calculator" },
    { id: "settings", label: "Settings", icon: "settings" },
    { id: "photos", label: "Photos", icon: "image" },
    { id: "music", label: "Music", icon: "music" },
    { id: "videos", label: "Videos", icon: "video" },
    { id: "calendar", label: "Calendar", icon: "calendar" },
    { id: "mail", label: "Mail", icon: "mail" },
    { id: "store", label: "Store", icon: "shopping-bag" },
    { id: "terminal", label: "Terminal", icon: "terminal" },
  ],
  recommendedItems: [
    { id: "portfolio", label: "Portfolio Overview", time: "Today" },
    { id: "resume", label: "Resume.pdf", time: "Yesterday" },
    { id: "notes", label: "Project Notes", time: "This week" },
    { id: "blog", label: "Latest Blog", time: "Earlier" },
  ],
  socials: {
    linkedin: "https://www.linkedin.com/in/itsmebro",
    github: "https://github.com/abhishekyadav2000",
  },
};
