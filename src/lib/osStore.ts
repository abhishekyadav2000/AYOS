export interface OSFile {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
  deletedAt?: string;
}

const KEY = "ayos_files";

function readFiles(): OSFile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as OSFile[]) : [];
  } catch {
    return [];
  }
}

function writeFiles(files: OSFile[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(files));
}

export function listFiles(includeDeleted = false): OSFile[] {
  return readFiles().filter((f) => (includeDeleted ? true : !f.deleted));
}

export function listDeletedFiles(): OSFile[] {
  return readFiles().filter((f) => !!f.deleted);
}

export function createFile(title: string, content: string): OSFile {
  const now = new Date().toISOString();
  const file: OSFile = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    content,
    createdAt: now,
    updatedAt: now,
  };
  const files = readFiles();
  files.unshift(file);
  writeFiles(files);
  return file;
}

export function updateFile(id: string, updates: Partial<OSFile>): OSFile | null {
  const files = readFiles();
  const idx = files.findIndex((f) => f.id === id);
  if (idx === -1) return null;
  const updated = { ...files[idx], ...updates, updatedAt: new Date().toISOString() };
  files[idx] = updated;
  writeFiles(files);
  return updated;
}

export function deleteFile(id: string): boolean {
  const files = readFiles();
  const idx = files.findIndex((f) => f.id === id);
  if (idx === -1) return false;
  files[idx].deleted = true;
  files[idx].deletedAt = new Date().toISOString();
  writeFiles(files);
  return true;
}

export function restoreFile(id: string): boolean {
  const files = readFiles();
  const idx = files.findIndex((f) => f.id === id);
  if (idx === -1) return false;
  files[idx].deleted = false;
  files[idx].deletedAt = undefined;
  files[idx].updatedAt = new Date().toISOString();
  writeFiles(files);
  return true;
}

export function emptyRecycleBin() {
  const files = readFiles().filter((f) => !f.deleted);
  writeFiles(files);
}

export function recentFiles(limit = 6): OSFile[] {
  return listFiles(true)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}
