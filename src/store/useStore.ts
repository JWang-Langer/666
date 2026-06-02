import { create } from 'zustand';
import type { Notebook, Note, SortBy, Theme } from '../types';

interface Store {
  notebooks: Notebook[];
  notes: Note[];
  theme: Theme;
  searchQuery: string;
  activeTag: string | null;
  sortBy: SortBy;

  // Async actions that bridge to Electron IPC
  loadNotebooks: () => Promise<void>;
  loadNotes: (notebookId: string) => Promise<void>;
  createNotebook: (name: string) => Promise<void>;
  deleteNotebook: (id: string) => Promise<void>;
  saveNote: (note: Partial<Note> & { id: string; notebook_id: string }) => Promise<Note | undefined>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;

  // UI
  setSearchQuery: (q: string) => void;
  setActiveTag: (tag: string | null) => void;
  setSortBy: (sort: SortBy) => void;
  setTheme: (t: Theme) => void;
  initTheme: () => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  notebooks: [],
  notes: [],
  theme: 'dark',
  searchQuery: '',
  activeTag: null,
  sortBy: 'updated_at',

  loadNotebooks: async () => {
    const list = await window.api.getNotebooks();
    set({ notebooks: list });
  },
  loadNotes: async (notebookId) => {
    const list = await window.api.getNotes(notebookId);
    set({ notes: list });
  },
  createNotebook: async (name) => {
    await window.api.createNotebook(name);
    await get().loadNotebooks();
  },
  deleteNotebook: async (id) => {
    await window.api.deleteNotebook(id);
    await get().loadNotebooks();
  },
  saveNote: async (note) => {
    const saved = await window.api.saveNote(note);
    return saved;
  },
  deleteNote: async (id) => {
    await window.api.deleteNote(id);
  },
  togglePin: async (id) => {
    await window.api.togglePin(id);
  },
  toggleFavorite: async (id) => {
    await window.api.toggleFavorite(id);
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveTag: (tag) => set({ activeTag: tag }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setTheme: (t) => {
    document.documentElement.classList.toggle('dark', t === 'dark');
    set({ theme: t });
    window.api.setSetting('theme', t);
  },
  initTheme: async () => {
    const saved = await window.api.getSetting('theme');
    const t = (saved || 'dark') as Theme;
    document.documentElement.classList.toggle('dark', t === 'dark');
    set({ theme: t });
  },
}));
