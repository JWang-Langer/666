import { useState, useEffect } from 'react';
import { Minus, Square, X } from 'lucide-react';

export function TitleBar() {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    window.api.isMaximized().then(setMaximized);
  }, []);

  return (
    <div className="drag-region h-9 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2 pl-3 text-xs text-zinc-500 font-medium">
        <span>个人知识库</span>
      </div>
      <div className="flex no-drag">
        <button onClick={() => window.api.minimize()} className="h-9 w-11 flex items-center justify-center hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors">
          <Minus size={15} />
        </button>
        <button onClick={() => { window.api.maximize(); setMaximized(!maximized); }} className="h-9 w-11 flex items-center justify-center hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors">
          <Square size={13} />
        </button>
        <button onClick={() => window.api.close()} className="h-9 w-11 flex items-center justify-center hover:bg-red-600 text-zinc-400 hover:text-white transition-colors">
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
