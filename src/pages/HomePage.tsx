import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Plus, BookOpen, Search, Star } from 'lucide-react';

export function HomePage() {
  const { notebooks, notes, addNotebook, deleteNotebook } = useStore();
  const navigate = useNavigate();

  const handleCreate = () => {
    const name = prompt('笔记本名称：', '我的笔记');
    if (name) addNotebook(name);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">知识库</h1>
          <p className="text-zinc-500 mt-1 text-sm">管理你的笔记与灵感</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> 新建笔记本
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="text-2xl font-bold text-zinc-100">{notebooks.length}</div>
          <div className="text-zinc-500 text-sm mt-1">笔记本</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="text-2xl font-bold text-zinc-100">{notes.length}</div>
          <div className="text-zinc-500 text-sm mt-1">笔记</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="text-2xl font-bold text-zinc-100">{notes.filter((n) => n.isFavorite).length}</div>
          <div className="text-zinc-500 text-sm mt-1">收藏</div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button onClick={() => navigate('/search')} className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors text-left">
          <Search size={24} className="text-blue-400" />
          <div><div className="font-medium text-zinc-200">全局搜索</div><div className="text-zinc-500 text-sm">跨笔记本搜索所有笔记</div></div>
        </button>
        <button onClick={() => navigate('/favorites')} className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors text-left">
          <Star size={24} className="text-amber-400" />
          <div><div className="font-medium text-zinc-200">我的收藏</div><div className="text-zinc-500 text-sm">快速访问收藏的笔记</div></div>
        </button>
      </div>

      {/* Notebook grid */}
      {notebooks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-zinc-200 mb-4">笔记本</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {notebooks.map((nb) => {
              const count = notes.filter((n) => n.notebookId === nb.id).length;
              return (
                <div
                  key={nb.id}
                  onClick={() => navigate(`/notebook/${nb.id}`)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 cursor-pointer hover:border-zinc-700 hover:bg-zinc-800/50 transition-all group"
                >
                  <div className="text-3xl mb-3">{nb.icon}</div>
                  <div className="font-medium text-zinc-200 text-sm truncate">{nb.name}</div>
                  <div className="text-zinc-600 text-xs mt-1">{count} 篇笔记</div>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (confirm('删除此笔记本？')) deleteNotebook(nb.id); }}
                    className="text-zinc-600 hover:text-red-400 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    删除
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {notebooks.length === 0 && (
        <div className="text-center py-20 text-zinc-600">
          <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
          <p>还没有笔记本</p>
          <p className="text-sm mt-1">点击上方按钮创建一个吧</p>
        </div>
      )}
    </div>
  );
}
