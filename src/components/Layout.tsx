import { useState, useEffect } from 'react';
import { Terminal, Menu, X, Github, Twitter, Linkedin, Mail, ExternalLink, ChevronRight, Search, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Breadcrumbs from './Breadcrumbs';
import CommandPalette from './CommandPalette';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'About', path: '/#about', isAnchor: true },
    { label: 'Schedule', path: '/#schedule', isAnchor: true },
    { label: 'Editorial', path: '/editorial', isAnchor: false },
    { label: 'Partners', path: '/partners', isAnchor: false },
    { label: 'Join', path: '/#location', isAnchor: true },
    { label: 'Contact', path: '/#contact', isAnchor: true },
  ];

  const isActive = (path: string) => {
    if (path.startsWith('/#')) {
      return location.pathname === '/' && location.hash === path.substring(1);
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] selection:bg-primary selection:text-black relative overflow-x-hidden font-sans">
      <CommandPalette />
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0A0A0B]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary group">
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all duration-500">
              <Terminal size={20} />
            </div>
            <span className="font-display font-black text-xl tracking-tighter text-white">VIBES<span className="text-primary group-hover:text-white transition-colors">&amp;</span>HIGHS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              link.isAnchor ? (
                <a 
                  key={link.path}
                  href={link.path} 
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all hover:text-primary relative group ${isActive(link.path) ? 'text-primary' : 'text-white/60'}`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div layoutId="nav-active" className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary" />
                  )}
                </a>
              ) : (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all hover:text-primary relative group ${isActive(link.path) ? 'text-primary' : 'text-white/60'}`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div layoutId="nav-active" className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary" />
                  )}
                </Link>
              )
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Search Shortcut */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-md cursor-pointer hover:bg-white/10 transition-colors mr-4 group" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
              <Search size={14} className="text-white/40 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white/60 transition-colors">Search</span>
              <div className="flex items-center gap-0.5 ml-2">
                <Command size={10} className="text-white/20" />
                <span className="text-[9px] font-bold text-white/20">K</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 border-r border-white/10 pr-6 mr-2">
              <a href="https://x.com/goldeneggie" target="_blank" rel="noreferrer" className="text-white/40 hover:text-primary transition-colors">
                <Twitter size={16} />
              </a>
              <a href="https://discord.gg/ua5UUXZTyz" target="_blank" rel="noreferrer" className="text-white/40 hover:text-primary transition-colors">
                <Github size={16} />
              </a>
            </div>
            
            <a href="https://discord.gg/ua5UUXZTyz" target="_blank" rel="noreferrer" className="hidden md:block">
              <Button className="bg-white text-black hover:bg-primary font-bold uppercase tracking-widest text-[10px] h-11 px-8 rounded-none transition-all shadow-lg shadow-white/5">
                Join Discord
              </Button>
            </a>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 lg:hidden bg-[#0A0A0B] flex flex-col p-8 pt-32"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  {link.isAnchor ? (
                    <a 
                      href={link.path}
                      className={`text-4xl font-display font-black uppercase tracking-tighter ${isActive(link.path) ? 'text-primary' : 'text-white/40 hover:text-white'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link 
                      to={link.path}
                      className={`text-4xl font-display font-black uppercase tracking-tighter ${isActive(link.path) ? 'text-primary' : 'text-white/40 hover:text-white'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-auto space-y-8">
              <div className="h-px bg-white/10" />
              <div className="flex flex-col gap-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Connect with us</p>
                <div className="flex gap-6">
                  <a href="https://discord.gg/ua5UUXZTyz" className="text-white/60 flex items-center gap-2 text-sm font-medium">Discord <ExternalLink size={14} /></a>
                  <a href="https://x.com/goldeneggie" className="text-white/60 flex items-center gap-2 text-sm font-medium">Twitter <ExternalLink size={14} /></a>
                </div>
              </div>
              <a href="https://discord.gg/ua5UUXZTyz" target="_blank" rel="noreferrer" className="block">
                <Button className="w-full bg-primary text-black hover:bg-white font-bold uppercase tracking-widest text-[10px] h-14 rounded-none">
                  Join the Community
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="relative pt-20">
        <Breadcrumbs />
        <Outlet />
      </main>

      <footer className="relative z-10 pt-32 pb-12 px-6 border-t border-white/5 bg-[#0A0A0B]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
            <div className="lg:col-span-5 space-y-8">
              <Link to="/" className="flex items-center gap-2 text-primary">
                <Terminal size={32} />
                <span className="font-display font-black text-2xl tracking-tighter text-white">VIBES<span className="text-primary">&amp;</span>HIGHS</span>
              </Link>
              <p className="text-white/50 text-lg font-light leading-relaxed max-w-md">
                A casual meetup for people who make weird things. We champion a non-transactional, high-output community of builders, artists, and researchers.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0A0B] bg-white/10 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Community member" className="grayscale" />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Join 500+ members</span>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-primary">Navigation</h4>
                <ul className="space-y-4">
                  {navLinks.map(link => (
                    <li key={link.path}>
                      {link.isAnchor ? (
                        <a href={link.path} className="text-white/60 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group">
                          <ChevronRight size={12} className="text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                          {link.label}
                        </a>
                      ) : (
                        <Link to={link.path} className="text-white/60 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group">
                          <ChevronRight size={12} className="text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-primary">Socials</h4>
                <ul className="space-y-4">
                  <li><a href="https://discord.gg/ua5UUXZTyz" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">Discord</a></li>
                  <li><a href="https://x.com/goldeneggie" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">Twitter / X</a></li>
                  <li><a href="https://www.twitch.tv/eggwens" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">Twitch</a></li>
                  <li><a href="https://github.com/dreambees" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">GitHub</a></li>
                </ul>
              </div>

              <div className="space-y-6 col-span-2 md:col-span-1">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-primary">Legal</h4>
                <ul className="space-y-4">
                  <li><Link to="/privacy" className="text-white/60 hover:text-white transition-colors text-sm font-medium">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-white/60 hover:text-white transition-colors text-sm font-medium">Terms of Service</Link></li>
                  <li><Link to="/conduct" className="text-white/60 hover:text-white transition-colors text-sm font-medium">Code of Conduct</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-wrap justify-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-white/20">
              <div className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full"></div> Community Driven</div>
              <div className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full"></div> Non-Transactional</div>
              <div className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full"></div> Pure Output</div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">&copy; {new Date().getFullYear()} V&H COLLECTIVE</span>
              <div className="h-4 w-px bg-white/10 hidden md:block"></div>
              <div className="flex items-center gap-2 text-primary animate-pulse">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest">SYSTEM_LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}


