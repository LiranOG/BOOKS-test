import { Book as BookType } from '../lib/types';
import { Book, ChevronRight, Database } from 'lucide-react';
import { clsx } from 'clsx';
import { Search } from './Search';

interface SidebarProps {
  books: BookType[];
  activeBookId: string;
  activeChapterId: string;
  onSelectChapter: (bookId: string, chapterId: string) => void;
}

export function Sidebar({ books, activeBookId, activeChapterId, onSelectChapter }: SidebarProps) {
  return (
    <div className="w-full h-full bg-[#0a0a0a] flex flex-col z-10 shrink-0">
      <div className="p-6 border-b border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-emerald-400">
            <Database className="w-5 h-5" />
            <h1 className="font-display font-bold tracking-widest uppercase text-sm">Nexus Core</h1>
          </div>
          <p className="text-[10px] text-zinc-600 font-mono">v3.1.0</p>
        </div>
        
        <Search books={books} onSelectResult={onSelectChapter} />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {books.map((book) => (
          <div key={book.id} className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-400 px-2 mb-3">
              <Book className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider">{book.title}</h2>
            </div>
            <div className="space-y-1">
              {book.chapters.map((chapter) => {
                const isActive = book.id === activeBookId && chapter.id === activeChapterId;
                return (
                  <button
                    key={chapter.id}
                    onClick={() => onSelectChapter(book.id, chapter.id)}
                    className={clsx(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 group",
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400 font-medium"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                    )}
                    dir={book.language === 'he' ? 'rtl' : 'ltr'}
                  >
                    {isActive ? (
                      <ChevronRight className="w-3 h-3 shrink-0" />
                    ) : (
                      <div className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    )}
                    <span className="truncate">{chapter.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
