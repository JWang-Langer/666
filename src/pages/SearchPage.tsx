import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import type { Note } from '../types';
import { excerpt } from '../types';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Note[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim()) {
      window.api.searchNotes(query).then(setResults);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">全局搜索</h1>
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="输入关键词，跨所有笔记本搜索…" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-zinc-400" autoFocus />
      </div>

      {query && <p className="text-zinc-500 text-sm mb-4">找到 {results.length} 条结果</p>}

      <div className="space-y-2">
        {results.map((note) => (
          <div key={note.id} onClick={() => navigate(`/notebook/${note.notebook_id}/note/${note.id}`)} className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
              <span>{note.notebook_id}</span><ChevronRight size={10} /><span className="text-zinc-600 dark:text-zinc-400">{note.title || '无标题'}</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2">{excerpt(note.content || '', 150)}</p>
            {(note.tags || []).length > 0 && <div className="flex gap-1 mt-2">{(note.tags || []).map((t: string) => <span key={t} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] text-zinc-500">{t}</span>)}</div>}
          </div>
        ))}
        {query && results.length === 0 && <div className="text-center py-16 text-zinc-400">没有找到相关笔记</div>}
        {!query && <div className="text-center py-16 text-zinc-400"><Search size={40} className="mx-auto mb-3 opacity-15" /><p>输入关键词开始搜索</p></div>}
      </div>
    </div>
  );
}
