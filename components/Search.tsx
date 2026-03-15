'use client';

import { Search as SearchIcon, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Book, Chapter } from '../lib/types';
import { clsx } from 'clsx';

interface SearchResult {
  bookId: string;
  bookTitle: string;
  chapterId: string;
  chapterTitle: string;
  excerpt: string;
}

interface SearchProps {
  books: Book[];
  onSelectResult: (bookId: string, chapterId: string) => void;
}

export function Search({ books, onSelectResult }: SearchProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    const searchResults: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    books.forEach(book => {
      book.chapters.forEach(chapter => {
        const chapterText = chapter.blocks
          .map(b => {
            if ('text' in b) return b.text;
            if ('items' in b) return b.items.join(' ');
            if ('rows' in b) return b.rows.map(r => r.join(' ')).join(' ');
            return '';
          })
          .join(' ')
          .toLowerCase();

        if (chapterText.includes(lowerQuery) || chapter.title.toLowerCase().includes(lowerQuery)) {
          // Find an excerpt
          const index = chapterText.indexOf(lowerQuery);
          const start = Math.max(0, index - 40);
          const end = Math.min(chapterText.length, index + 60);
          let excerpt = chapterText.substring(start, end);
          if (start > 0) excerpt = '...' + excerpt;
          if (end < chapterText.length) excerpt = excerpt + '...';

          searchResults.push({
            bookId: book.id,
            bookTitle: book.title,
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            excerpt: excerpt
          });
        }
      });
    });

    return searchResults.slice(0, 10);
  }, [query, books]);

  return (
    <div className="relative w-full">
      <div className="relative group">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search knowledge base..."
          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-10 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-zinc-600"
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl z-50 max-h-[400px] overflow-y-auto overflow-x-hidden backdrop-blur-xl">
          <div className="p-2 space-y-1">
            {results.map((result, i) => (
              <button
                key={`${result.bookId}-${result.chapterId}-${i}`}
                onClick={() => {
                  onSelectResult(result.bookId, result.chapterId);
                  setQuery('');
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-emerald-500/50 uppercase tracking-tighter">{result.bookTitle}</span>
                  <span className="text-[10px] text-zinc-700">{"//"}</span>
                  <span className="text-sm font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors">{result.chapterTitle}</span>
                </div>
                <p className="text-xs text-zinc-500 line-clamp-2 italic">
                  {result.excerpt}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f0f] border border-white/10 rounded-xl p-4 text-center text-zinc-500 text-sm z-50">
          No results found for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
