'use client';

import { useState, useEffect } from 'react';
import { knowledgeBase } from '../data/knowledgeBase';
import { Sidebar } from '../components/Sidebar';
import { ContentView } from '../components/ContentView';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';

export default function CosmicInterface() {
  const [activeBookId, setActiveBookId] = useState(knowledgeBase[0].id);
  const [activeChapterId, setActiveChapterId] = useState(knowledgeBase[0].chapters[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeBook = knowledgeBase.find(b => b.id === activeBookId) || knowledgeBase[0];
  const activeChapter = activeBook.chapters.find(c => c.id === activeChapterId) || activeBook.chapters[0];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#050505]">
      {/* Sidebar Wrapper */}
      <div 
        className={clsx(
          "transition-all duration-300 ease-in-out shrink-0 h-full z-40 overflow-hidden absolute md:relative bg-[#0a0a0a]",
          isSidebarOpen ? "w-72 border-r border-white/5" : "w-0 border-r-0"
        )}
      >
        <div className="w-72 h-full">
          <Sidebar
            books={knowledgeBase}
            activeBookId={activeBookId}
            activeChapterId={activeChapterId}
            onSelectChapter={(bookId, chapterId) => {
              setActiveBookId(bookId);
              setActiveChapterId(chapterId);
              if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
              }
            }}
          />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="absolute inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05)_0%,transparent_50%)] pointer-events-none" />
        
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-6 left-6 z-50 p-2.5 bg-[#0a0a0a] border border-white/10 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-emerald-400 transition-colors backdrop-blur-md shadow-lg"
          title="Toggle Sidebar"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <ContentView book={activeBook} chapter={activeChapter} />
      </main>
    </div>
  );
}

