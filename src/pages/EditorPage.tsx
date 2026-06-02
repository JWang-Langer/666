import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useMemo, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronRight, Save, ArrowLeft, Eye, Edit3, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export function EditorPage() {
  const { id, noteId } = useParams<{ id: string; noteId?: string }>();
  const navigate = useNavigate();
  const { notes, notebooks, addNote, updateNote, deleteNote } = useStore();
  const isNew = !noteId;

  const existing = noteId ? notes.find((n) => n.id === noteId) : null;
  const notebook = notebooks.find((n) => n.id === id);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [content, setContent] = useState(existing?.content ?? '');
  const [tags, setTags] = useState(existing?.tags.join(', ') ?? '');
  const [mode, setMode] = useState<'edit' | 'split' | 'preview'>('split');

  const parsedTags = useMemo(() => {
    return tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean);
  }, [tags]);

  const handleSave = useCallback(() => {
    if (isNew) {
      addNote(title.trim() || '无标题', content, id!, parsedTags);
      navigate(`/notebook/${id}`);
    } else {
      updateNote(noteId!, { title: title.trim() || '无标题', content, tags: parsedTags });
      navigate(`/notebook/${id}`);
    }
  }, [isNew, title, content, parsedTags, id, noteId, addNote, updateNote, navigate]);

  const handleDelete = () => {
    if (noteId && confirm('确定删除此笔记？')) {
      deleteNote(noteId);
      navigate(`/notebook/${id}`);
    }
  };

  if (!notebook) {
    return <div className="max-w-4xl mx-auto p-8 text-center text-zinc-500 py-20">笔记本不存在</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-950/50 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/notebook/${id}`)} className="p-1 hover:text-zinc-200 text-zinc-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Link to="/" className="hover:text-zinc-300">知识库</Link>
            <ChevronRight size={12} />
            <Link to={`/notebook/${id}`} className="hover:text-zinc-300">{notebook.name}</Link>
            <ChevronRight size={12} />
            <span className="text-zinc-300">{isNew ? '新建笔记' : '编辑笔记'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="flex bg-zinc-800 rounded-lg p-0.5 mr-2">
            {(['edit', 'split', 'preview'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={clsx('px-2.5 py-1 rounded text-xs font-medium transition-colors', mode === m ? 'bg-zinc-700 text-zinc-200' : 'text-zinc-500')}
              >
                {m === 'edit' ? <Edit3 size={14} /> : m === 'split' ? <Eye size={14} /> : <Eye size={14} />}
                <span className="ml-1">{m === 'edit' ? '编辑' : m === 'split' ? '分栏' : '预览'}</span>
              </button>
            ))}
          </div>
          {!isNew && (
            <button onClick={handleDelete} className="p-2 hover:text-red-400 text-zinc-600 transition-colors" title="删除">
              <Trash2 size={18} />
            </button>
          )}
          <button onClick={handleSave} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Save size={15} /> 保存
          </button>
        </div>
      </div>

      {/* Title input */}
      <div className="px-6 py-3 border-b border-zinc-800 shrink-0 bg-zinc-950/30">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="笔记标题..."
          className="w-full bg-transparent text-xl font-bold text-zinc-100 outline-none placeholder:text-zinc-700"
        />
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="标签（用逗号分隔）"
          className="w-full bg-transparent text-xs text-zinc-500 mt-1 outline-none placeholder:text-zinc-700"
        />
        {parsedTags.length > 0 && (
          <div className="flex gap-1.5 mt-1.5">
            {parsedTags.map((t) => (
              <span key={t} className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded text-[10px]">{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* Editor body */}
      <div className={mode === 'split' ? 'flex flex-1 overflow-hidden' : 'flex-1 overflow-hidden'}>
        {mode !== 'preview' && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="开始写 Markdown..."
            className={clsx(
              'bg-zinc-950 text-zinc-300 p-6 outline-none resize-none font-mono text-sm leading-relaxed',
              mode === 'split' ? 'w-1/2 border-r border-zinc-800' : 'flex-1'
            )}
          />
        )}
        {mode !== 'edit' && (
          <div className={clsx('overflow-auto p-6 prose prose-invert prose-sm max-w-none', mode === 'split' ? 'w-1/2' : 'flex-1')}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content || '*还没有内容...*'}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
