/**
 * [LAYER: UI]
 */
import { Link } from 'react-router-dom';
import { Zap, Globe, Cpu, ShieldCheck, School, Flame, Layers, LucideIcon } from 'lucide-react';
import { partners } from '@/data/partners';

// A dynamic icon helper mapping Lucide icons cleanly to partners
function getPartnerIcon(name: string): LucideIcon {
  switch (name) {
    case 'Modal':
      return Zap;
    case 'Cloudflare':
      return Globe;
    case 'NousResearch':
      return Cpu;
    case 'Google':
      return ShieldCheck;
    case 'Silicon Slopes':
      return School;
    case 'Forge Utah':
      return Flame;
    default:
      return Layers;
  }
}

export function Ecosystem() {
  return (
    <section className="py-24 border-b border-white/5 bg-gradient-to-b from-[#0A0A0B] via-[#0D0D0E] to-[#0A0A0B] relative overflow-hidden">
      {/* Decorative cyber grid background lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00FF66_1px,transparent_1px),linear-gradient(to_bottom,#00FF66_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col xl:flex-row items-start justify-between gap-16">
          
          {/* Header section with technical styling */}
          <div className="space-y-4 max-w-md shrink-0">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span className="text-primary font-mono text-[10px] uppercase tracking-[0.4em] font-black">
                CONNECTED NODES
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white uppercase leading-none">
              THE <br />
              <span className="font-serif italic font-light text-primary pr-4 lowercase">Ecosystem.</span>
            </h2>
            <p className="text-white/40 font-mono text-[11px] uppercase tracking-widest leading-relaxed">
              Friends, infrastructure, and toolsets powering our shared digital collective.
            </p>
          </div>
          
          {/* Nodes Grid */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((p, idx) => {
              const IconComponent = getPartnerIcon(p.name);
              const nodeNum = String(idx + 1).padStart(2, '0');
              
              return (
                <Link 
                  key={p.id} 
                  to={`/partners?partner=${p.id}`} 
                  className="group relative block bg-white/[0.01] border border-white/5 hover:border-primary/30 p-5 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                >
                  {/* Neon border glow effect */}
                  <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  
                  {/* Subtle noise/shimmer layer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
                  
                  <div className="flex items-start justify-between mb-8 relative z-10">
                    <span className="text-[9px] font-mono text-white/20 group-hover:text-primary/50 transition-colors font-bold tracking-widest">
                      [NODE_{nodeNum}]
                    </span>
                    <span className="text-[8px] font-mono px-2 py-0.5 border border-white/5 text-white/30 group-hover:text-primary group-hover:border-primary/20 transition-colors tracking-widest">
                      ACTIVE
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 border border-white/10 flex items-center justify-center bg-white/[0.02] text-white/40 group-hover:text-primary group-hover:border-primary/30 group-hover:bg-primary/[0.03] transition-all duration-300 relative">
                      <IconComponent size={20} className="transition-transform duration-500 group-hover:scale-110" />
                      {/* Corner cyber ticks */}
                      <div className="absolute top-0 left-0 w-1 h-[1px] bg-white/10 group-hover:bg-primary" />
                      <div className="absolute top-0 left-0 w-[1px] h-1 bg-white/10 group-hover:bg-primary" />
                      <div className="absolute bottom-0 right-0 w-1 h-[1px] bg-white/10 group-hover:bg-primary" />
                      <div className="absolute bottom-0 right-0 w-[1px] h-1 bg-white/10 group-hover:bg-primary" />
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-black uppercase tracking-[0.1em] text-white group-hover:text-primary transition-colors">
                        {p.name}
                      </h4>
                      <p className="text-[10px] font-mono text-white/30 tracking-wider">
                        {p.tier} // {p.category}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
        </div>
      </div>
    </section>
  );
}
