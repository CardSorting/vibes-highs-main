/**
 * [LAYER: UI]
 */
import { Link } from 'react-router-dom';
import { Zap, Globe, Cpu, ShieldCheck, School } from 'lucide-react';
import { partners } from '@/data/partners';

export function Ecosystem() {
  return (
    <section className="py-24 border-b border-white/5 bg-black/20">
      <div className="max-w-7xl mx-auto px-6">
         <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-2 text-center md:text-left">
              <div className="text-primary font-mono text-[10px] uppercase tracking-[0.4em] font-black">The Ecosystem</div>
              <div className="text-white/40 text-[10px] font-mono uppercase tracking-widest">Friends and tools that help us build</div>
            </div>
            <div className="flex flex-wrap justify-center gap-12 items-center">
              {partners.map(p => (
                <Link key={p.id} to={`/partners?partner=${p.id}`} className="group relative flex items-center gap-3 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-white/2 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                    {p.name === 'Modal' && <Zap size={16} className="text-primary" />}
                    {p.name === 'Cloudflare' && <Globe size={16} className="text-primary" />}
                    {p.name === 'NousResearch' && <Cpu size={16} className="text-primary" />}
                    {p.name === 'Google' && <ShieldCheck size={16} className="text-primary" />}
                    {p.name === 'Silicon Slopes' && <School size={16} className="text-primary" />}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white transition-colors">{p.name}</span>
                </Link>
              ))}
            </div>
         </div>
      </div>
    </section>
  );
}
