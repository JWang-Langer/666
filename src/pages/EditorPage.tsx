import { useEffect, useState } from 'react';
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { ChevronRight, Save, ArrowLeft, Trash2, Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote, Heading1, Heading2, Heading3, Eye, Edit3 } from 'lucide-react';
import clsx from 'clsx';
import { generateId } from '../types';

export function EditorPage() {
  const { id, noteId } = useParams<{ id: string; noteId?: string }>();
  const navigate = useNavigate();
  const { saveNote, deleteNote } = useStore();

  const isNew = !noteId;
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: '开始写点什么…' }),
    ],
    content: '',
    immediatelyRender: false,
  });

  // Load existing note
  useEffect(() => {
    if (!isNew && noteId) {
      window.api.getNote(noteId).then((note) => {
        if (note) {
          setTitle(note.title);
          setTags((note.tags || []).join(', '));
          editor?.commands.setContent(note.content || '');
        }
      });
    }
  }, [noteId]);

  const handleSave = async () => {
    const content = editor?.getHTML() || '';
    const parsedTags = tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean);

    const note = {
      id: isNew ? generateId() : noteId!,
      title: title.trim() || '无标题',
      content,
      notebook_id: id!,
      tags: parsedTags,
      is_pinned: 0,
      is_favorite: 0,
    };

    await saveNote(note);
    navigate(`/notebook/${id}`);
  };

  const handleDelete = async () => {
    if (noteId && confirm('确定删除此笔记？')) {
      await deleteNote(noteId);
      navigate(`/notebook/${id}`);
    }
  };

  const editorButtons: Array<{ action: () => void; icon: React.ComponentType<{ size?: number }>; active?: boolean } | { type: 'divider' }> = [
    { action: () => editor?.chain().focus().toggleBold().run(), icon: Bold, active: editor?.isActive('bold') },
    { action: () => editor?.chain().focus().toggleItalic().run(), icon: Italic, active: editor?.isActive('italic') },
    { action: () => editor?.chain().focus().toggleStrike().run(), icon: Strikethrough, active: editor?.isActive('strike') },
    { action: () => editor?.chain().focus().toggleCode().run(), icon: Code, active: editor?.isActive('code') },
    { type: 'divider' },
    { action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), icon: Heading1, active: editor?.isActive('heading', { level: 1 }) },
    { action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), icon: Heading2, active: editor?.isActive('heading', { level: 2 }) },
    { action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), icon: Heading3, active: editor?.isActive('heading', { level: 3 }) },
    { type: 'divider' },
    { action: () => editor?.chain().focus().toggleBulletList().run(), icon: List, active: editor?.isActive('bulletList') },
    { action: () => editor?.chain().focus().toggleOrderedList().run(), icon: ListOrdered, active: editor?.isActive('orderedList') },
    { action: () => editor?.chain().focus().toggleBlockquote().run(), icon: Quote, active: editor?.isActive('blockquote') },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/notebook/${id}`)} className="p-1 hover:text-zinc-600 dark:hover:text-zinc-300 text-zinc-400"><ArrowLeft size={20} /></button>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Link to="/" className="hover:text-zinc-700 dark:hover:text-zinc-300">知识库</Link>
            <ChevronRight size={12} />
            <span className="text-zinc-700 dark:text-zinc-300">{isNew ? '新建笔记' : '编辑笔记'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')} className={clsx('p-1.5 rounded text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300', viewMode === 'preview' && 'bg-zinc-100 dark:bg-zinc-800')} title={viewMode === 'edit' ? '预览' : '编辑'}>
            {viewMode === 'edit' ? <Eye size={17} /> : <Edit3 size={17} />}
          </button>
          {!isNew && <button onClick={handleDelete} className="p-1.5 rounded text-zinc-400 hover:text-red-500"><Trash2 size={17} /></button>}
          <button onClick={handleSave} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"><Save size={15} /> 保存</button>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="笔记标题…" className="w-full bg-transparent text-xl font-bold outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700" />
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="标签（逗号分隔）" className="w-full bg-transparent text-xs text-zinc-400 mt-1 outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700" />
      </div>

      {/* Toolbar (edit mode only) */}
      {viewMode === 'edit' && (
        <div className="flex items-center gap-0.5 px-4 py-1.5 border-b border-zinc-200 dark:border-zinc-800 shrink-0 flex-wrap">
          {editorButtons.map((btn, i) => {
            if ('type' in btn && btn.type === 'divider') return <div key={i} className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1" />;
            if ('action' in btn)
              return (
                <button key={i} onClick={(btn as { action: () => void; icon: any; active?: boolean }).action} className={clsx('p-1.5 rounded text-sm transition-colors', (btn as any).active ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300')}>
                  {React.createElement((btn as any).icon, { size: 16 })}
              </button>
              );
            return null;
          })}
        </div>
      )}

      {/* Editor / Preview */}
      <div className="flex-1 overflow-auto p-6">
        {viewMode === 'edit' ? (
          <EditorContent editor={editor} className="prose prose-sm dark:prose-invert max-w-none" />
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '<p class="text-zinc-400">暂无内容</p>' }} />
        )}
      </div>
    </div>
  );
}
