import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, ShieldCheck, Zap, Globe, Cpu, School, ArrowRight, Layers, Command, Search, Github, Twitter, Linkedin, MapPin, Calendar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { partners, Partner } from '../data/partners';
import SEO from '../components/SEO';

export default function Partners() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  
  const categories = useMemo(() => ['All', ...new Set(partners.filter(p => p.tier !== 'SPOTLIGHT').map(p => p.category))], []);
  
  const filteredPartners = useMemo(() => {
    return partners.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory || p.tier === 'SPOTLIGHT';
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch && p.tier !== 'SPOTLIGHT';
    });
  }, [activeCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All': partners.filter(p => p.tier !== 'SPOTLIGHT').length };
    partners.filter(p => p.tier !== 'SPOTLIGHT').forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-[#0A0A0B] selection:bg-primary selection:text-black">
      <SEO 
        title="Partners & Ecosystem" 
        description="Explore the curated network of technical leaders and community pillars powering the Vibes & Highs ecosystem."
        keywords={["partners", "ecosystem", "AI infrastructure", "Cloudflare", "Modal", "Nous Research", "technical network"]}
      />
      
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
            
            {/* Quick Stats */}
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

        {/* Origin Section */}
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
        <div className="sticky top-24 z-30 mb-16 py-6 bg-[#0A0A0B]/80 backdrop-blur-xl border-y border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8 px-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <Input 
                placeholder="Search partners..." 
                className="pl-10 bg-white/5 border-white/10 text-white rounded-none focus-visible:ring-primary focus-visible:border-primary placeholder:text-white/20 font-mono text-[10px] uppercase tracking-widest h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="hidden sm:flex items-center gap-2 text-white/20 text-[10px] font-bold uppercase tracking-widest">
              <Info size={12} /> {filteredPartners.length} matches
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-none text-[10px] font-bold uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-primary text-black' 
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                   activeCategory === cat ? 'bg-black/10 text-black' : 'bg-white/5 text-white/30 group-hover:text-white'
                }`}>
                  {categoryCounts[cat]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Partner Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
          <AnimatePresence mode="popLayout">
            {filteredPartners.length > 0 ? (
              filteredPartners.map((partner, idx) => (
                <motion.div
                  key={partner.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <PartnerEntry partner={partner} onClick={() => setSelectedPartner(partner)} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 py-32 flex flex-col items-center justify-center text-white/20 space-y-4">
                <Search size={48} strokeWidth={1} />
                <p className="font-mono text-[10px] uppercase tracking-[0.2em]">No matching partners found in this domain</p>
                <Button 
                  variant="ghost" 
                  onClick={() => {setSearchQuery(''); setActiveCategory('All')}}
                  className="text-primary hover:text-primary hover:bg-primary/5 text-[10px] font-bold uppercase tracking-widest"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Partner Investigation Dialog */}
        <Dialog open={!!selectedPartner} onOpenChange={(open) => !open && setSelectedPartner(null)}>
          <DialogContent className="max-w-4xl bg-[#0C0C0D] border-white/10 text-white p-0 overflow-hidden rounded-none shadow-2xl">
            <AnimatePresence>
              {selectedPartner && (
                <div className="flex flex-col md:flex-row h-full">
                  <div className="w-full md:w-1/3 bg-white/2 border-r border-white/5 p-8 flex flex-col justify-between">
                    <div>
                      <div className="w-20 h-20 bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                        <PartnerIcon name={selectedPartner.name} size={40} className="text-primary" />
                      </div>
                      <Badge className="bg-primary text-black rounded-none font-mono text-[10px] uppercase tracking-widest mb-4">
                        {selectedPartner.tier}
                      </Badge>
                      <h2 className="text-3xl font-display font-black uppercase tracking-tighter mb-2">{selectedPartner.name}</h2>
                      <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest mb-8">{selectedPartner.category}</p>
                      
                      <div className="space-y-6">
                        {selectedPartner.location && (
                          <div className="flex items-center gap-3 text-white/60">
                            <MapPin size={14} className="text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{selectedPartner.location}</span>
                          </div>
                        )}
                        {selectedPartner.socials && (
                          <div className="flex gap-4 pt-4">
                            {selectedPartner.socials.twitter && (
                              <a href={selectedPartner.socials.twitter} target="_blank" rel="noreferrer" className="text-white/40 hover:text-primary transition-colors">
                                <Twitter size={18} />
                              </a>
                            )}
                            {selectedPartner.socials.github && (
                              <a href={selectedPartner.socials.github} target="_blank" rel="noreferrer" className="text-white/40 hover:text-primary transition-colors">
                                <Github size={18} />
                              </a>
                            )}
                            {selectedPartner.socials.linkedin && (
                              <a href={selectedPartner.socials.linkedin} target="_blank" rel="noreferrer" className="text-white/40 hover:text-primary transition-colors">
                                <Linkedin size={18} />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <a href={selectedPartner.link} target="_blank" rel="noreferrer" className="mt-12">
                      <Button className="w-full bg-white text-black hover:bg-primary font-bold uppercase tracking-widest text-[10px] h-12 rounded-none">
                        Visit Website <ExternalLink size={14} className="ml-2" />
                      </Button>
                    </a>
                  </div>
                  
                  <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[80vh]">
                    <div className="space-y-12">
                      <section>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                          <Info size={12} /> Detailed Investigation
                        </h3>
                        <p className="text-white/70 text-lg font-light leading-relaxed">
                          {selectedPartner.longDescription || selectedPartner.description}
                        </p>
                      </section>
                      
                      {selectedPartner.features && (
                        <section>
                          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                            <Zap size={12} /> Key Capabilities
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedPartner.features.map(feature => (
                              <div key={feature} className="flex items-center gap-3 p-4 bg-white/3 border border-white/5">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                      
                      <section className="pt-8 border-t border-white/5">
                        <div className="flex items-center justify-between text-white/20">
                          <div className="flex items-center gap-2">
                            <Calendar size={12} />
                            <span className="text-[9px] font-mono uppercase tracking-widest">Ecosystem Entry: 2024.01</span>
                          </div>
                          <span className="text-[9px] font-mono uppercase tracking-widest">Status: INTEGRATED_READY</span>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>

        {/* Join CTA */}
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
                <Button className="bg-white text-black hover:bg-primary font-bold uppercase tracking-widest text-[10px] h-14 px-10 transition-all group rounded-none">
                  Become a Sponsor <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="https://discord.gg/ua5UUXZTyz" target="_blank" rel="noreferrer">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-bold uppercase tracking-widest text-[10px] h-14 px-10 rounded-none">
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

function OriginCard({ partner }: { partner: Partner; key?: string }) {
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

function PartnerEntry({ partner, onClick }: { partner: Partner; onClick: () => void; key?: string }) {
  return (
    <div
      onClick={onClick}
      className="group relative block bg-[#0A0A0B] p-10 md:p-16 hover:bg-white/2 transition-all duration-500 h-full overflow-hidden cursor-pointer"
    >
      <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all">
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
          Investigate <Search size={14} />
        </div>
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
             <PartnerIcon name={partner.name} size={32} />
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-white/50 text-lg font-light leading-relaxed group-hover:text-white/70 transition-colors line-clamp-3">
            {partner.description}
          </p>
          
          <div className="pt-6 border-t border-white/5">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em]">
              <span className="text-white/30 group-hover:text-primary transition-colors">Role: {partner.tier === 'TITAN' ? 'Strategic Infrastructure' : 'Ecosystem Ally'}</span>
              <span className="text-white/20 group-hover:text-white/50 transition-colors flex items-center gap-2">
                Dig Deeper <ArrowRight size={10} />
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/2 transition-colors duration-500"></div>
    </div>
  );
}

function PartnerIcon({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  if (name === 'Modal') return <Zap size={size} className={className} />;
  if (name === 'Cloudflare') return <Globe size={size} className={className} />;
  if (name === 'NousResearch') return <Cpu size={size} className={className} />;
  if (name === 'Google') return <ShieldCheck size={size} className={className} />;
  return <Layers size={size} className={className} />;
}


