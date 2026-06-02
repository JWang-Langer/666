import { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import clsx from 'clsx';
import { Plus, Search, Pin, Star, Trash2, ChevronRight } from 'lucide-react';
import type { SortBy } from '../types';
import { excerpt } from '../types';

export function NotebookPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notebooks, notes, searchQuery, activeTag, sortBy, loadNotebooks, loadNotes, deleteNote, togglePin, toggleFavorite, setSearchQuery, setActiveTag, setSortBy } = useStore();

  useEffect(() => { loadNotebooks(); }, []);
  useEffect(() => { if (id) loadNotes(id); }, [id]);

  const notebook = notebooks.find((n) => n.id === id);

  const filtered = useMemo(() => {
    let list = [...notes];
    if (searchQuery) { const q = searchQuery.toLowerCase(); list = list.filter((n) => n.title.toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q)); }
    if (activeTag) { list = list.filter((n) => (n.tags || []).includes(activeTag)); }
    list.sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return (b[sortBy] || 0) - (a[sortBy] || 0);
    });
    return list;
  }, [notes, searchQuery, activeTag, sortBy]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => (n.tags || []).forEach((t: string) => set.add(t)));
    return [...set];
  }, [notes]);

  if (!notebook) return <div className="p-8 text-center text-zinc-500">笔记本不存在</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
        <Link to="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">知识库</Link><ChevronRight size={14} /><span className="text-zinc-700 dark:text-zinc-300">{notebook.name}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{notebook.name}</h1>
        <button onClick={() => navigate(`/notebook/${id}/new`)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> 新建笔记
        </button>
      </div>

      {/* Search + Sort */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="搜索笔记…" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-zinc-400" />
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)} className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none">
          <option value="updated_at">按更新时间</option>
          <option value="created_at">按创建时间</option>
          <option value="title">按标题</option>
        </select>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {allTags.map((tag) => (
            <button key={tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)} className={clsx('px-2.5 py-1 rounded-full text-xs font-medium transition-colors', activeTag === tag ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700')}>{tag}</button>
          ))}
          {activeTag && <button onClick={() => setActiveTag(null)} className="text-xs text-zinc-400 hover:text-zinc-600">清除</button>}
        </div>
      )}

      {/* Note list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-400"><p>暂无笔记</p></div>
      ) : (
        <div className="space-y-2">
          {filtered.map((note) => {
            const handleDelete = async () => { if (confirm('删除此笔记？')) { await deleteNote(note.id); await loadNotes(id!); } };
            const handlePin = async () => { await togglePin(note.id); await loadNotes(id!); };
            const handleFav = async () => { await toggleFavorite(note.id); await loadNotes(id!); };

            return (
              <div key={note.id} onClick={() => navigate(`/notebook/${id}/note/${note.id}`)} className="group bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {note.is_pinned ? <Pin size={11} className="text-amber-500" /> : null}
                      <h3 className="font-medium text-sm truncate">{note.title || '无标题'}</h3>
                    </div>
                    <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{excerpt(note.content || '')}</p>
                    {(note.tags || []).length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {(note.tags || []).map((t: string) => <span key={t} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] text-zinc-500">{t}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                    <button onClick={(e) => { e.stopPropagation(); handlePin(); }} className="p-1 hover:text-amber-500 text-zinc-400"><Pin size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleFav(); }} className={clsx('p-1 hover:text-amber-500', note.is_favorite ? 'text-amber-500' : 'text-zinc-400')}><Star size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(); }} className="p-1 hover:text-red-500 text-zinc-400"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="text-[10px] text-zinc-400 mt-2">{new Date(note.updated_at).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
