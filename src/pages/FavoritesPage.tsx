import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { excerpt } from '../utils';

export function FavoritesPage() {
  const { notes, notebooks, toggleFavorite } = useStore();
  const navigate = useNavigate();
  const favorites = notes.filter((n) => n.isFavorite);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Star size={24} className="text-amber-400" fill="currentColor" />
        <h1 className="text-2xl font-bold text-zinc-100">我的收藏</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">
          <Star size={40} className="mx-auto mb-3 opacity-20" />
          <p>还没有收藏任何笔记</p>
          <p className="text-sm mt-1">点击笔记旁的星号即可收藏</p>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((note) => {
            const nb = notebooks.find((n) => n.id === note.notebookId);
            return (
              <div
                key={note.id}
                onClick={() => navigate(`/notebook/${note.notebookId}/note/${note.id}`)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 cursor-pointer hover:border-zinc-700 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-600">{nb?.icon} {nb?.name}</span>
                    </div>
                    <h3 className="font-medium text-zinc-100 text-sm mt-1">{note.title || '无标题'}</h3>
                    <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{excerpt(note.content)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(note.id); }}
                    className="p-1 text-amber-400 hover:text-amber-300"
                  >
                    <Star size={16} fill="currentColor" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
