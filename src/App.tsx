import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import { useStore } from './store/useStore';
import { Sidebar } from './components/layout/Sidebar';
import { HomePage } from './pages/HomePage';
import { NoteListPage } from './pages/NoteListPage';
import { EditorPage } from './pages/EditorPage';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';

export const SidebarCollapsed = createContext(false);

export default function App() {
  const theme = useStore((s) => s.theme);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <BrowserRouter>
      <SidebarCollapsed.Provider value={collapsed}>
        <div className="flex h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
          <Sidebar onToggle={() => setCollapsed(!collapsed)} />
          <main className={`flex-1 overflow-auto transition-all ${collapsed ? 'ml-14' : 'ml-[260px]'}`}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/notebook/:id" element={<NoteListPage />} />
              <Route path="/notebook/:id/new" element={<EditorPage />} />
              <Route path="/notebook/:id/note/:noteId" element={<EditorPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </main>
        </div>
      </SidebarCollapsed.Provider>
    </BrowserRouter>
  );
}
