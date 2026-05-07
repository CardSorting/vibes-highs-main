import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, Terminal, FileText, Users, Globe, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { partners } from '../data/partners';
import { editorialPosts } from '../data/editorial';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const results = query.length < 2 ? [] : [
    ...partners.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).map(p => ({
      id: `partner-${p.id}`,
      title: p.name,
      category: 'Partner',
      path: `/partners/${p.id}`,
      icon: <Users size={16} />
    })),
    ...editorialPosts.filter(post => post.title.toLowerCase().includes(query.toLowerCase())).map(post => ({
      id: `post-${post.id}`,
      title: post.title,
      category: 'Editorial',
      path: `/editorial`, // Would ideally deep link to post if possible
      icon: <FileText size={16} />
    })),
    { id: 'home', title: 'Home', category: 'Page', path: '/', icon: <Terminal size={16} /> },
    { id: 'about', title: 'About', category: 'Page', path: '/#about', icon: <Globe size={16} /> },
  ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-[#0A0A0B]/80 backdrop-blur-md" 
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-[#0C0C0D] border border-white/10 shadow-2xl overflow-hidden rounded-none"
          >
            <div className="flex items-center px-6 border-b border-white/5 h-16">
              <Search className="text-white/40 mr-4" size={20} />
              <input 
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anything... (Pages, Partners, Articles)"
                className="flex-1 bg-transparent border-none text-white focus:ring-0 placeholder:text-white/20 font-mono text-sm uppercase tracking-widest"
              />
              <div className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 rounded-md">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">ESC</span>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
              {results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result.path)}
                      className="w-full flex items-center justify-between p-4 hover:bg-primary group transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-white/40 group-hover:text-black transition-colors">
                          {result.icon}
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-primary group-hover:text-black/60 transition-colors">
                            {result.category}
                          </div>
                          <div className="text-sm font-bold text-white group-hover:text-black transition-colors">
                            {result.title}
                          </div>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-white/20 group-hover:text-black transition-all -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              ) : query.length >= 2 ? (
                <div className="py-12 text-center space-y-4">
                  <Terminal className="mx-auto text-white/10" size={48} strokeWidth={1} />
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">No records found for "{query}"</p>
                </div>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <Command className="mx-auto text-white/10" size={48} strokeWidth={1} />
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Enter at least 2 characters to search the registry</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/2">
              <div className="flex items-center gap-6 text-[9px] font-mono uppercase tracking-widest text-white/20">
                <div className="flex items-center gap-1.5"><span className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">↵</span> Select</div>
                <div className="flex items-center gap-1.5"><span className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">↑↓</span> Navigate</div>
              </div>
              <div className="text-[9px] font-mono uppercase tracking-widest text-primary animate-pulse">
                SYS_REGISTRY_READY
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
