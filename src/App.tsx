import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store/useStore';
import { TitleBar } from './components/layout/TitleBar';
import { Sidebar } from './components/layout/Sidebar';
import { HomePage } from './pages/HomePage';
import { NotebookPage } from './pages/NotebookPage';
import { EditorPage } from './pages/EditorPage';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';

export default function App() {
  const initTheme = useStore((s) => s.initTheme);
  useEffect(() => { initTheme(); }, []);

  return (
    <HashRouter>
      <div className="h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <TitleBar />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 ml-[240px] overflow-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/notebook/:id" element={<NotebookPage />} />
              <Route path="/notebook/:id/new" element={<EditorPage />} />
              <Route path="/notebook/:id/note/:noteId" element={<EditorPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
}
