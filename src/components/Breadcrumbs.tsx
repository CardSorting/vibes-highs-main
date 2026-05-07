import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'motion/react';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (location.pathname === '/') return null;

  return (
    <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
      <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
        <Home size={12} />
        <span>V&H</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const label = value.replace(/-/g, ' ');

        return (
          <div key={to} className="flex items-center gap-2">
            <ChevronRight size={10} className="text-white/10" />
            {last ? (
              <motion.span 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-primary font-bold"
              >
                {label}
              </motion.span>
            ) : (
              <Link to={to} className="hover:text-white transition-colors">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
