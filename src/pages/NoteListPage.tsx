import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useMemo } from 'react';
import clsx from 'clsx';
import {
  Plus, Pin, Star, Trash2, ChevronRight, Search,
} from 'lucide-react';
import type { SortBy, Note } from '../types';
import { excerpt } from '../utils';

export function NoteListPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, notebooks, searchQuery, activeTag, sortBy, setSearchQuery, setActiveTag, setSortBy, togglePin, toggleFavorite, deleteNote } = useStore();

  const notebook = notebooks.find((n) => n.id === id);

  const filtered = useMemo(() => {
    let list = notes.filter((n) => n.notebookId === id);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }
    if (activeTag) {
      list = list.filter((n) => n.tags.includes(activeTag));
    }
    list.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return b[sortBy] - a[sortBy];
    });
    return list;
  }, [notes, id, searchQuery, activeTag, sortBy]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    notes.filter((n) => n.notebookId === id).forEach((n) => n.tags.forEach((t) => set.add(t)));
    return [...set];
  }, [notes, id]);

  if (!notebook) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-zinc-500 py-20">
        笔记本不存在
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
        <Link to="/" className="hover:text-zinc-300">知识库</Link>
        <ChevronRight size={14} />
        <span className="text-zinc-300">{notebook.name}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">{notebook.name}</h1>
        <button
          onClick={() => navigate(`/notebook/${id}/new`)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> 新建笔记
        </button>
      </div>

      {/* Search + Sort */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索笔记..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-zinc-600"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none"
        >
          <option value="updatedAt">按更新时间</option>
          <option value="createdAt">按创建时间</option>
          <option value="title">按标题</option>
        </select>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={clsx(
                'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                activeTag === tag
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              )}
            >
              {tag}
            </button>
          ))}
          {activeTag && (
            <button onClick={() => setActiveTag(null)} className="text-xs text-zinc-600 hover:text-zinc-400">
              清除筛选
            </button>
          )}
        </div>
      )}

      {/* Note list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">
          <p>暂无笔记</p>
          <p className="text-sm mt-1">点击「新建笔记」开始记录</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => navigate(`/notebook/${id}/note/${note.id}`)}
              onPin={() => togglePin(note.id)}
              onFavorite={() => toggleFavorite(note.id)}
              onDelete={() => { if (confirm('删除此笔记？')) deleteNote(note.id); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NoteCard({ note, onClick, onPin, onFavorite, onDelete }: {
  note: Note;
  onClick: () => void;
  onPin: () => void;
  onFavorite: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group bg-zinc-900 border border-zinc-800 rounded-xl p-4 cursor-pointer hover:border-zinc-700 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {note.isPinned && <Pin size={12} className="text-amber-400" />}
            <h3 className="font-medium text-zinc-100 text-sm truncate">{note.title || '无标题'}</h3>
          </div>
          <p className="text-zinc-500 text-xs mt-1.5 line-clamp-2">{excerpt(note.content)}</p>
          {note.tags.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {note.tags.map((t) => (
                <span key={t} className="px-1.5 py-0.5 bg-zinc-800 rounded text-[10px] text-zinc-500">{t}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={(e) => { e.stopPropagation(); onPin(); }} className="p-1 hover:text-amber-400 text-zinc-600 transition-colors" title="置顶">
            <Pin size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onFavorite(); }} className={clsx('p-1 hover:text-amber-400 transition-colors', note.isFavorite ? 'text-amber-400' : 'text-zinc-600')} title="收藏">
            <Star size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 hover:text-red-400 text-zinc-600 transition-colors" title="删除">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="text-[10px] text-zinc-600 mt-2">
        {new Date(note.updatedAt).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
