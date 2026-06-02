export interface Notebook {
  id: string;
  name: string;
  icon: string;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  notebookId: string;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export type SortBy = 'updatedAt' | 'createdAt' | 'title';
export type Theme = 'dark' | 'light';

export interface AppSettings {
  theme: Theme;
}
