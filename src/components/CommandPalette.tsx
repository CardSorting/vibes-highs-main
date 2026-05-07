import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, Terminal, FileText, Users, Globe, X, ArrowRight, Sparkles, Clock, Star, Zap, Activity } from 'lucide-react';
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

  const popularSearches = [
    { title: 'Modal GPU Infrastructure', path: '/partners?partner=modal', icon: <Zap size={14} /> },
    { title: 'AI Strategy Editorial', path: '/editorial', icon: <FileText size={14} /> },
    { title: 'Cloudflare Network', path: '/partners?partner=cloudflare', icon: <Globe size={14} /> },
    { title: 'Join Discord Server', path: 'https://discord.gg/ua5UUXZTyz', icon: <Users size={14} />, isExternal: true },
  ];

  const results = useMemo(() => {
    if (query.length < 2) return [];
    
    return [
      ...partners.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).map(p => ({
        id: `partner-${p.id}`,
        title: p.name,
        category: 'Partner Registry',
        path: `/partners?partner=${p.id}`,
        icon: <Users size={16} />
      })),
      ...editorialPosts.filter(post => post.title.toLowerCase().includes(query.toLowerCase())).map(post => ({
        id: `post-${post.id}`,
        title: post.title,
        category: 'Editorial Hub',
        path: `/editorial`,
        icon: <FileText size={16} />
      })),
      { id: 'home', title: 'Home Page', category: 'Site Navigation', path: '/', icon: <Terminal size={16} /> },
      { id: 'about', title: 'About the Collective', category: 'Site Navigation', path: '/#about', icon: <Globe size={16} /> },
    ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const handleSelect = (path: string, isExternal?: boolean) => {
    if (isExternal) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
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
                placeholder="Search technical registry... (CMD+K)"
                className="flex-1 bg-transparent border-none text-white focus:ring-0 placeholder:text-white/20 font-mono text-sm uppercase tracking-widest"
              />
              <div className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 rounded-md">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">ESC</span>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
              {query.length < 2 ? (
                <div className="space-y-6 p-2">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-4 px-2">
                      <Sparkles size={12} className="text-primary" /> Popular Explorations
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {popularSearches.map((item) => (
                        <button
                          key={item.title}
                          onClick={() => handleSelect(item.path, item.isExternal)}
                          className="flex items-center gap-3 p-3 bg-white/2 border border-white/5 hover:bg-primary group transition-all text-left"
                        >
                          <div className="text-white/40 group-hover:text-black">{item.icon}</div>
                          <div className="text-[11px] font-bold text-white/60 group-hover:text-black uppercase tracking-wider">{item.title}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-4 px-2">
                      <Clock size={12} /> System Registry Shortcuts
                    </div>
                    <div className="flex flex-wrap gap-2 px-2">
                      {['Editorial', 'Partners', 'Schedule', 'RSVP'].map(tag => (
                        <button 
                          key={tag}
                          onClick={() => handleSelect(`/${tag.toLowerCase()}`)}
                          className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-primary hover:border-primary transition-all"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : results.length > 0 ? (
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
              ) : (
                <div className="py-12 text-center space-y-4">
                  <Terminal className="mx-auto text-white/10" size={48} strokeWidth={1} />
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">No records found for "{query}"</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/2">
              <div className="flex items-center gap-6 text-[9px] font-mono uppercase tracking-widest text-white/20">
                <div className="flex items-center gap-1.5"><span className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-white/40">↵</span> Select</div>
                <div className="flex items-center gap-1.5"><span className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-white/40">↑↓</span> Navigate</div>
                <div className="hidden sm:flex items-center gap-1.5"><span className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-white/40">ESC</span> Close</div>
              </div>
              <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest text-primary font-bold">
                <Activity size={10} className="animate-pulse" /> SYSTEM_INDEX_READY
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
