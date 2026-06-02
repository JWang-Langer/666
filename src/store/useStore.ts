import { create } from 'zustand';
import type { Notebook, Note, SortBy, Theme } from '../types';
import { generateId } from '../utils';

const LS_NOTEBOOKS = 'knowledge-base-notebooks';
const LS_NOTES = 'knowledge-base-notes';
const LS_SETTINGS = 'knowledge-base-settings';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

interface Store {
  // State
  notebooks: Notebook[];
  notes: Note[];
  theme: Theme;
  searchQuery: string;
  activeTag: string | null;
  sortBy: SortBy;

  // Notebook actions
  addNotebook: (name: string) => void;
  deleteNotebook: (id: string) => void;

  // Note actions
  addNote: (title: string, content: string, notebookId: string, tags: string[]) => void;
  updateNote: (id: string, data: Partial<Pick<Note, 'title' | 'content' | 'tags'>>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  toggleFavorite: (id: string) => void;

  // UI actions
  setSearchQuery: (q: string) => void;
  setActiveTag: (tag: string | null) => void;
  setSortBy: (sort: SortBy) => void;
  setTheme: (t: Theme) => void;

  // Data
  exportAll: () => string;
  importAll: (json: string) => boolean;
}

export const useStore = create<Store>((set, get) => ({
  notebooks: load<Notebook[]>(LS_NOTEBOOKS, []),
  notes: load<Note[]>(LS_NOTES, []),
  theme: load<{ theme: Theme }>(LS_SETTINGS, { theme: 'dark' }).theme,
  searchQuery: '',
  activeTag: null,
  sortBy: 'updatedAt',

  // Notebooks
  addNotebook: (name) => {
    const nb: Notebook = { id: generateId(), name, icon: '📓', createdAt: Date.now() };
    set((s) => {
      const next = [...s.notebooks, nb];
      save(LS_NOTEBOOKS, next);
      return { notebooks: next };
    });
  },
  deleteNotebook: (id) => {
    set((s) => {
      const notebooks = s.notebooks.filter((n) => n.id !== id);
      const notes = s.notes.filter((n) => n.notebookId !== id);
      save(LS_NOTEBOOKS, notebooks);
      save(LS_NOTES, notes);
      return { notebooks, notes };
    });
  },

  // Notes
  addNote: (title, content, notebookId, tags) => {
    const note: Note = {
      id: generateId(),
      title,
      content,
      notebookId,
      tags,
      isPinned: false,
      isFavorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((s) => {
      const next = [...s.notes, note];
      save(LS_NOTES, next);
      return { notes: next };
    });
  },
  updateNote: (id, data) => {
    set((s) => {
      const next = s.notes.map((n) =>
        n.id === id ? { ...n, ...data, updatedAt: Date.now() } : n
      );
      save(LS_NOTES, next);
      return { notes: next };
    });
  },
  deleteNote: (id) => {
    set((s) => {
      const next = s.notes.filter((n) => n.id !== id);
      save(LS_NOTES, next);
      return { notes: next };
    });
  },
  togglePin: (id) => {
    set((s) => {
      const next = s.notes.map((n) =>
        n.id === id ? { ...n, isPinned: !n.isPinned } : n
      );
      save(LS_NOTES, next);
      return { notes: next };
    });
  },
  toggleFavorite: (id) => {
    set((s) => {
      const next = s.notes.map((n) =>
        n.id === id ? { ...n, isFavorite: !n.isFavorite } : n
      );
      save(LS_NOTES, next);
      return { notes: next };
    });
  },

  // UI
  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveTag: (tag) => set({ activeTag: tag }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setTheme: (t) => {
    save(LS_SETTINGS, { theme: t });
    set({ theme: t });
  },

  // Data export/import
  exportAll: () => {
    const { notebooks, notes } = get();
    return JSON.stringify({ notebooks, notes, exportedAt: new Date().toISOString() }, null, 2);
  },
  importAll: (json) => {
    try {
      const data = JSON.parse(json);
      if (!data.notebooks || !data.notes) return false;
      save(LS_NOTEBOOKS, data.notebooks);
      save(LS_NOTES, data.notes);
      set({ notebooks: data.notebooks, notes: data.notes });
      return true;
    } catch {
      return false;
    }
  },
}));
