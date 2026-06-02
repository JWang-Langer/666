import { NavLink } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import {
  Plus, Search, Star, BookOpen, Moon, Sun,
  ChevronLeft, ChevronRight, Download, Upload,
} from 'lucide-react';
import { useState, useRef } from 'react';
import clsx from 'clsx';

export function Sidebar({ onToggle }: { onToggle: () => void }) {
  const { notebooks, theme, setTheme, exportAll, importAll, addNotebook } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const [newNbName, setNewNbName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => { setCollapsed(!collapsed); onToggle(); };
  const handleAdd = () => {
    const name = newNbName.trim() || '未命名笔记本';
    addNotebook(name);
    setNewNbName('');
  };
  const handleExport = () => {
    const json = exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowledge-base-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleImport = () => fileRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      importAll(reader.result as string);
      window.location.reload();
    };
    reader.readAsText(file);
  };

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-screen bg-zinc-900 dark:bg-zinc-900 text-zinc-300 transition-all flex flex-col z-30 border-r border-zinc-800',
        collapsed ? 'w-14' : 'w-[260px]'
      )}
    >
      {/* Toggle */}
      <button onClick={handleToggle} className="absolute -right-3 top-4 bg-zinc-700 rounded-full p-0.5 hover:bg-zinc-600">
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo */}
      <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
        <BookOpen size={22} className="text-blue-400 shrink-0" />
        {!collapsed && <span className="font-bold text-sm text-zinc-100">知识库</span>}
      </div>

      {/* Search */}
      <NavLink to="/search" className="mx-3 mt-4 flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors">
        <Search size={18} />
        {!collapsed && <span className="text-sm">全局搜索</span>}
      </NavLink>

      {/* Favorites */}
      <NavLink to="/favorites" className="mx-3 mt-1 flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors">
        <Star size={18} />
        {!collapsed && <span className="text-sm">我的收藏</span>}
      </NavLink>

      {/* Notebook list */}
      {!collapsed && <div className="text-xs text-zinc-500 uppercase tracking-wider px-3 mt-6 mb-2">笔记本</div>}
      {!collapsed && (
        <div className="flex-1 overflow-auto px-2">
          {notebooks.map((nb) => (
            <NavLink
              key={nb.id}
              to={`/notebook/${nb.id}`}
              className={({ isActive }) =>
                clsx('flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors', isActive ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200')
              }
            >
              <span>{nb.icon}</span>
              {!collapsed && <span className="truncate">{nb.name}</span>}
            </NavLink>
          ))}
          {notebooks.length === 0 && (
            <div className="text-xs text-zinc-600 text-center py-4">暂无笔记本</div>
          )}
        </div>
      )}

      {/* Add notebook */}
      {!collapsed && (
        <div className="px-3 py-2 border-t border-zinc-800">
          <div className="flex gap-1">
            <input
              value={newNbName}
              onChange={(e) => setNewNbName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="新建笔记本..."
              className="flex-1 bg-zinc-800 text-sm rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-zinc-600"
            />
            <button onClick={handleAdd} className="p-1.5 rounded hover:bg-zinc-700 text-blue-400">
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="p-3 border-t border-zinc-800 flex flex-col gap-1">
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 text-sm transition-colors">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {!collapsed && <span>{theme === 'dark' ? '浅色模式' : '深色模式'}</span>}
        </button>
        <button onClick={handleExport} className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 text-sm transition-colors">
          <Download size={16} />
          {!collapsed && <span>导出数据</span>}
        </button>
        <button onClick={handleImport} className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 text-sm transition-colors">
          <Upload size={16} />
          {!collapsed && <span>导入数据</span>}
        </button>
        <input ref={fileRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />
      </div>
    </aside>
  );
}
