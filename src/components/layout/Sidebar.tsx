import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Plus, Search, Star, Moon, Sun, Download, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export function Sidebar() {
  const { notebooks, theme, setTheme, loadNotebooks, createNotebook } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => { loadNotebooks(); }, []);

  const handleAdd = async () => {
    const name = newName.trim() || '新笔记本';
    await createNotebook(name);
    setNewName('');
  };

  const handleExport = async () => {
    const json = await window.api.exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowledge-base-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const text = await file.text();
      await window.api.importAll(text);
      await loadNotebooks();
    };
    input.click();
  };

  return (
    <aside className={clsx('fixed left-0 top-9 bottom-0 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all z-20', collapsed ? 'w-12' : 'w-[240px]')}>
      {/* Toggle */}
      <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-2.5 top-3 w-5 h-5 bg-zinc-700 rounded-full flex items-center justify-center hover:bg-zinc-600">
        {collapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
      </button>

      {/* Quick links */}
      <div className={clsx('px-2 pt-3 space-y-0.5', collapsed && 'px-1')}>
        <NavLink to="/search" className={({ isActive }) => clsx('flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors', isActive ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200', collapsed && 'justify-center px-0')}>
          <Search size={17} />
          {!collapsed && <span>搜索</span>}
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => clsx('flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors', isActive ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200', collapsed && 'justify-center px-0')}>
          <Star size={17} />
          {!collapsed && <span>收藏</span>}
        </NavLink>
      </div>

      {!collapsed && <div className="text-[10px] text-zinc-600 uppercase tracking-wider px-3 mt-4 mb-1 font-medium">笔记本</div>}
      <div className={clsx('flex-1 overflow-auto px-2', collapsed && 'px-1')}>
        {notebooks.map((nb) => (
          <NavLink key={nb.id} to={`/notebook/${nb.id}`} className={({ isActive }) => clsx('flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors', isActive ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200', collapsed && 'justify-center px-0')}>
            <span className="text-sm shrink-0">{nb.icon}</span>
            {!collapsed && <span className="truncate">{nb.name}</span>}
          </NavLink>
        ))}
        {notebooks.length === 0 && !collapsed && <div className="text-xs text-zinc-600 text-center py-6">暂无笔记本</div>}
      </div>

      {/* Add */}
      {!collapsed && (
        <div className="px-2 py-2 border-t border-zinc-800">
          <div className="flex gap-1">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} placeholder="新建笔记本…" className="flex-1 bg-zinc-800 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-zinc-600" />
            <button onClick={handleAdd} className="p-1 rounded hover:bg-zinc-700 text-blue-400"><Plus size={15} /></button>
          </div>
        </div>
      )}

      {/* Bottom */}
      <div className={clsx('border-t border-zinc-800 p-2 space-y-0.5', collapsed && 'p-1')}>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={clsx('flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors w-full', collapsed && 'justify-center px-0')}>
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button onClick={handleExport} className={clsx('flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors w-full', collapsed && 'justify-center px-0')}>
          <Download size={15} />
        </button>
        <button onClick={handleImport} className={clsx('flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors w-full', collapsed && 'justify-center px-0')}>
          <Upload size={15} />
        </button>
      </div>
    </aside>
  );
}
