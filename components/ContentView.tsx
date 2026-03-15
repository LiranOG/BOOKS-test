import { motion } from 'motion/react';
import { Book, Chapter, ContentBlock } from '../lib/types';
import { clsx } from 'clsx';

export function ContentView({ book, chapter }: { book: Book; chapter: Chapter }) {
  const isHe = book.language === 'he';

  const renderBlock = (block: ContentBlock, idx: number) => {
    switch (block.type) {
      case 'h1':
        return <h1 key={idx} className="text-4xl md:text-5xl font-display font-bold text-white mb-8 tracking-tight">{block.text}</h1>;
      case 'h2':
        return <h2 key={idx} className="text-2xl md:text-3xl font-display font-semibold text-zinc-100 mt-12 mb-6">{block.text}</h2>;
      case 'h3':
        return <h3 key={idx} className="text-xl font-display font-medium text-emerald-400 mt-8 mb-4">{block.text}</h3>;
      case 'h4':
        return <h4 key={idx} className="text-lg font-bold text-zinc-300 mt-6 mb-3">{block.text}</h4>;
      case 'p':
        return <p key={idx} className="text-base md:text-lg text-zinc-400 leading-relaxed mb-6">{block.text}</p>;
      case 'quote':
        return (
          <blockquote key={idx} className="border-l-4 border-emerald-500/50 pl-6 py-4 my-8 italic text-xl text-zinc-300 bg-emerald-500/5 rounded-r-lg">
            {block.text}
          </blockquote>
        );
      case 'list':
        return (
          <ul key={idx} className="list-disc list-inside space-y-3 mb-8 text-zinc-400 text-lg ml-4">
            {block.items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        );
      case 'table':
        return (
          <div key={idx} className="overflow-x-auto mb-8 rounded-xl border border-white/10 bg-black/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {block.headers.map((h, i) => <th key={i} className="p-4 text-sm font-mono text-emerald-400 uppercase">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {block.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    {row.map((cell, j) => <td key={j} className="p-4 text-zinc-300">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'code':
        return (
          <pre key={idx} className="bg-[#0a0a0a] border border-white/10 p-6 rounded-xl overflow-x-auto mb-8 font-mono text-sm text-emerald-300">
            <code>{block.text}</code>
          </pre>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth">
      <div className="max-w-4xl mx-auto px-8 py-16 md:py-24">
        <motion.div
          key={chapter.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          dir={isHe ? 'rtl' : 'ltr'}
          className={clsx(
            "pb-32",
            isHe ? "font-sans text-right" : "font-sans text-left"
          )}
        >
          <div className={clsx("flex items-center gap-3 text-sm font-mono text-emerald-500/70 mb-8 uppercase tracking-widest", isHe && "flex-row-reverse")}>
            <span>{book.title}</span>
            <span>{"//"}</span>
            <span>{chapter.title}</span>
          </div>
          {chapter.blocks.map(renderBlock)}
        </motion.div>
      </div>
    </div>
  );
}
