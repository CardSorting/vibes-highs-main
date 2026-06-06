import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'motion/react';
import { partners } from '../data/partners';

export default function Breadcrumbs() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (location.pathname === '/') return null;

  const labelMap: Record<string, string> = {
    'partners': 'Community',
    'editorial': 'Journal',
    'privacy': 'Privacy Policy',
    'terms': 'Terms',
    'conduct': 'Code of Conduct'
  };

  const activePartnerId = searchParams.get('partner');
  const activePartner = activePartnerId ? partners.find(p => p.id === activePartnerId) : null;

  return (
    <div className="max-w-7xl mx-auto px-6 pt-6">
      <nav 
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-white/40 shadow-lg shadow-black/20"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
          <Home size={10} className="group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">SLC AI TOWN HALL</span>
        </Link>
        
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1 && !activePartner;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label = labelMap[value] || value.replace(/-/g, ' ');

          return (
            <div key={to} className="flex items-center gap-2">
              <ChevronRight size={10} className="text-white/10" />
              {last ? (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-primary font-black"
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

        {/* Dynamic Query Parameter Appending */}
        {activePartner && (
          <div className="flex items-center gap-2">
            <ChevronRight size={10} className="text-white/10" />
            <motion.span 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-primary font-black"
            >
              {activePartner.name}
            </motion.span>
          </div>
        )}
      </nav>
    </div>
  );
}
