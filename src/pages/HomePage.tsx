import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Plus, BookOpen, Search, Star } from 'lucide-react';

export function HomePage() {
  const { notebooks, loadNotebooks, createNotebook, deleteNotebook } = useStore();
  const navigate = useNavigate();
  useEffect(() => { loadNotebooks(); }, []);

  const handleCreate = async () => {
    const name = prompt('笔记本名称：', '我的笔记');
    if (name) await createNotebook(name);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">个人知识库</h1>
          <p className="text-zinc-500 text-sm mt-1">管理你的笔记与灵感</p>
        </div>
        <button onClick={handleCreate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> 新建笔记本
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: '笔记本', value: notebooks.length },
          { label: '快捷操作', value: '⚡' },
          { label: '本地安全', value: '🔒' },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-zinc-500 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button onClick={() => navigate('/search')} className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors text-left">
          <Search size={24} className="text-blue-500" />
          <div><div className="font-medium">全局搜索</div><div className="text-zinc-500 text-sm">跨笔记本搜索所有笔记</div></div>
        </button>
        <button onClick={() => navigate('/favorites')} className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors text-left">
          <Star size={24} className="text-amber-400" />
          <div><div className="font-medium">我的收藏</div><div className="text-zinc-500 text-sm">快速访问收藏的笔记</div></div>
        </button>
      </div>

      {/* Notebook grid */}
      {notebooks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">笔记本</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {notebooks.map((nb) => (
              <div key={nb.id} onClick={() => navigate(`/notebook/${nb.id}`)} className="group bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all">
                <div className="text-3xl mb-3">{nb.icon}</div>
                <div className="font-medium text-sm truncate">{nb.name}</div>
                <button onClick={(e) => { e.stopPropagation(); if (confirm('删除此笔记本？')) deleteNotebook(nb.id); }} className="text-zinc-400 hover:text-red-500 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">删除</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {notebooks.length === 0 && (
        <div className="text-center py-20 text-zinc-400">
          <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
          <p>还没有笔记本</p>
          <p className="text-sm mt-1">点击上方按钮创建一个吧</p>
        </div>
      )}
    </div>
  );
}
