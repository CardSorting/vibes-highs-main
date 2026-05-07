import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, ShieldCheck, Zap, Globe, Cpu, School, ArrowRight, Layers, Command, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { partners, Partner } from '../data/partners';

export default function Partners() {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', ...new Set(partners.filter(p => p.tier !== 'SPOTLIGHT').map(p => p.category))];
  
  const displayPartners = activeCategory === 'All'
    ? partners.filter(p => p.tier !== 'SPOTLIGHT')
    : partners.filter(p => p.category === activeCategory);

  return (
    <div className="pt-24 min-h-screen bg-[#0A0A0B] selection:bg-primary selection:text-black">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        {/* Hero Section */}
        <div className="pt-20 mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-[0.4em] mb-6"
              >
                <Layers size={12} /> Ecosystem & Foundation
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display font-black text-6xl md:text-8xl tracking-tighter leading-none mb-8"
              >
                OUR <br />
                <span className="font-serif italic font-light text-white/40">Network.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/60 text-xl font-light leading-relaxed"
              >
                Vibes & Highs is powered by a curated network of technical leaders and community pillars. We partner with organizations that champion open-source innovation and creative experimentation.
              </motion.p>
            </div>
            
            {/* Quick Stats or Meta Info */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-12 border-l border-white/10 pl-12 py-4"
            >
              <div>
                <div className="text-2xl font-display font-black text-white">{partners.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Total Allies</div>
              </div>
              <div>
                <div className="text-2xl font-display font-black text-primary">{categories.length - 1}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Domains</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Origin Section - More Story-driven */}
        <section className="mb-48">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <Command size={14} /> Foundational Roots
            </h2>
            <div className="h-px flex-1 bg-primary/20"></div>
          </div>
          
          <div className="grid grid-cols-1">
            {partners.filter(p => p.tier === 'SPOTLIGHT').map((partner) => (
              <OriginCard key={partner.id} partner={partner} />
            ))}
          </div>
        </section>

        {/* Navigation & Filtering - Approachable Pattern */}
        <div className="sticky top-24 z-30 mb-16 py-4 bg-[#0A0A0B]/80 backdrop-blur-xl border-y border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
            <Search size={12} /> Browse by Domain:
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-none text-[10px] font-bold uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-primary text-black' 
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Partner Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
          <AnimatePresence mode="popLayout">
            {displayPartners.map((partner, idx) => (
              <motion.div
                key={partner.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <PartnerEntry partner={partner} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Industry Standard Join CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-48 grid md:grid-cols-2 gap-12 items-center bg-white/2 border border-white/5 p-12 md:p-20 relative overflow-hidden"
        >
           <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>
           <div>
            <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter mb-6 leading-none">
              JOIN THE<br />
              <span className="font-serif italic font-light text-primary">Ecosystem.</span>
            </h2>
            <p className="text-white/60 text-lg font-light leading-relaxed mb-8">
              Are you building the future of internet culture, AI, or infrastructure? We're looking for partners who want to support a new kind of creative collective.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="mailto:willcruzdesigner@gmail.com">
                <Button className="bg-white text-black hover:bg-primary font-bold uppercase tracking-widest text-[10px] h-14 px-10 transition-all group">
                  Become a Sponsor <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="https://discord.gg/ua5UUXZTyz" target="_blank" rel="noreferrer">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-bold uppercase tracking-widest text-[10px] h-14 px-10">
                  Join Community
                </Button>
              </a>
            </div>
           </div>
           <div className="relative aspect-square md:aspect-auto md:h-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group">
              <Cpu size={160} className="text-primary/20 group-hover:scale-125 transition-transform duration-1000 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-linear-to-t from-[#0A0A0B] via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <div className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest mb-2">Technical Registry</div>
                <div className="text-white/40 text-[10px] font-mono leading-none">V&H_SYSLOG :: CONNECTION_READY</div>
              </div>
           </div>
        </motion.section>
      </div>
    </div>
  );
}

function OriginCard({ partner }: { partner: Partner; key?: any }) {
  return (
    <motion.a
      href={partner.link}
      target="_blank"
      rel="noreferrer"
      className="group relative flex flex-col md:flex-row gap-12 bg-white/3 border border-white/10 p-8 md:p-16 hover:bg-white/5 hover:border-primary/50 transition-all duration-700 overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
        <ExternalLink size={24} className="text-primary" />
      </div>

      <div className="shrink-0">
        <div className="w-24 h-24 md:w-40 md:h-40 rounded-none border border-white/10 flex items-center justify-center bg-white/5 text-primary group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-700">
          <School size={64} className="group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-primary">Where it all began</span>
          <div className="h-px w-8 bg-primary/40"></div>
        </div>
        <h3 className="font-display font-black text-4xl md:text-7xl tracking-tighter text-white uppercase group-hover:text-primary transition-colors leading-none mb-6">
          {partner.name}
        </h3>
        <p className="text-white/70 text-lg md:text-2xl font-light leading-relaxed max-w-3xl mb-8">
          {partner.description}
        </p>
        <div className="flex items-center gap-4 text-primary font-mono text-[10px] uppercase tracking-widest font-black group-hover:gap-6 transition-all">
          Explore the Network <ArrowRight size={14} />
        </div>
      </div>
    </motion.a>
  );
}

function PartnerEntry({ partner }: { partner: Partner; key?: any }) {
  return (
    <a
      href={partner.link}
      target="_blank"
      rel="noreferrer"
      className="group relative block bg-[#0A0A0B] p-10 md:p-16 hover:bg-white/2 transition-all duration-500 h-full overflow-hidden"
    >
      <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all">
        <ExternalLink size={18} className="text-primary" />
      </div>
      
      <div className="relative z-10 space-y-10">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              {partner.category}
            </div>
            <h3 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tighter group-hover:text-primary transition-colors">
              {partner.name}
            </h3>
          </div>
          <div className="text-white/20 group-hover:text-primary/40 transition-colors">
             {partner.name === 'Modal' && <Zap size={32} />}
             {partner.name === 'Cloudflare' && <Globe size={32} />}
             {partner.name === 'NousResearch' && <Cpu size={32} />}
             {partner.name === 'Google' && <ShieldCheck size={32} />}
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-white/50 text-lg font-light leading-relaxed group-hover:text-white/70 transition-colors">
            {partner.description}
          </p>
          
          <div className="pt-6 border-t border-white/5">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em]">
              <span className="text-white/30 group-hover:text-primary transition-colors">Role: {partner.tier === 'TITAN' ? 'Strategic Infrastructure' : 'Ecosystem Ally'}</span>
              <span className="text-white/20 group-hover:text-white/50 transition-colors flex items-center gap-2">
                Details <ArrowRight size={10} />
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/2 transition-colors duration-500"></div>
    </a>
  );
}

