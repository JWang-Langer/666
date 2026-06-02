export interface Notebook {
  id: string;
  name: string;
  icon: string;
  created_at: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  notebook_id: string;
  tags: string[];
  is_pinned: number;
  is_favorite: number;
  created_at: number;
  updated_at: number;
}

export type SortBy = 'updated_at' | 'created_at' | 'title';
export type Theme = 'dark' | 'light';

// Typed bridge to preload API
export interface ElectronAPI {
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
  getNotebooks: () => Promise<Notebook[]>;
  createNotebook: (name: string) => Promise<Notebook>;
  deleteNotebook: (id: string) => Promise<void>;
  getNotes: (notebookId: string) => Promise<Note[]>;
  getNote: (id: string) => Promise<Note | undefined>;
  saveNote: (note: Partial<Note> & { id: string; notebook_id: string }) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  searchNotes: (query: string) => Promise<Note[]>;
  getAllNotes: () => Promise<Note[]>;
  getSetting: (key: string) => Promise<string | null>;
  setSetting: (key: string, value: string) => Promise<void>;
  exportAll: () => Promise<string>;
  importAll: (json: string) => Promise<boolean>;
}

declare global {
  interface Window {
    api: ElectronAPI;
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function excerpt(content: string, maxLen = 120): string {
  const text = content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
}
