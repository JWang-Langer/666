import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Note } from '../types';
import { excerpt } from '../types';

export function FavoritesPage() {
  const [favorites, setFavorites] = useState<Note[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    const all = await window.api.getAllNotes();
    setFavorites(all.filter((n) => n.is_favorite));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Star size={24} className="text-amber-400" fill="currentColor" />
        <h1 className="text-2xl font-bold">我的收藏</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 text-zinc-400"><Star size={40} className="mx-auto mb-3 opacity-15" /><p>还没有收藏任何笔记</p></div>
      ) : (
        <div className="space-y-2">
          {favorites.map((note) => (
            <div key={note.id} onClick={() => navigate(`/notebook/${note.notebook_id}/note/${note.id}`)} className="group bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{note.title || '无标题'}</h3>
                  <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{excerpt(note.content || '')}</p>
                </div>
                <button onClick={async (e) => { e.stopPropagation(); await window.api.toggleFavorite(note.id); load(); }} className="p-1 text-amber-400 hover:text-amber-300">
                  <Star size={16} fill="currentColor" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
