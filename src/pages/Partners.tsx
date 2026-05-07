import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ExternalLink, ShieldCheck, Zap, Globe, Cpu, School, ArrowRight, Layers, 
  Command, Search, Github, Twitter, Linkedin, MapPin, Calendar, Info, 
  TrendingUp, TrendingDown, Minus, BookOpen, Activity, Link as LinkIcon, Sparkles, Terminal,
  Copy, Check, Filter, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { partners, Partner } from '../data/partners';
import { editorialPosts } from '../data/editorial';
import SEO from '../components/SEO';
import { toast } from 'sonner';

export default function Partners() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  const activeCategory = searchParams.get('category') || 'All';
  const activeTier = searchParams.get('tier') || 'All';
  const selectedPartnerId = searchParams.get('partner');

  const selectedPartner = useMemo(() => 
    partners.find(p => p.id === selectedPartnerId) || null, 
  [selectedPartnerId]);

  const categories = useMemo(() => 
    ['All', ...new Set(partners.filter(p => p.tier !== 'SPOTLIGHT').map(p => p.category))], 
  []);

  const tiers = ['All', 'TITAN', 'PLATINUM', 'GOLD'];
  
  const filteredPartners = useMemo(() => {
    return partners.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory || p.tier === 'SPOTLIGHT';
      const matchesTier = activeTier === 'All' || p.tier === activeTier || p.tier === 'SPOTLIGHT';
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesTier && matchesSearch && p.tier !== 'SPOTLIGHT';
    });
  }, [activeCategory, activeTier, searchQuery]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'All') params.delete(key);
    else params.set(key, value);
    setSearchParams(params);
  };

  const setSelectedPartner = (partner: Partner | null) => {
    const params = new URLSearchParams(searchParams);
    if (partner) params.set('partner', partner.id);
    else params.delete('partner');
    setSearchParams(params);
  };

  const handleCopyLink = () => {
    if (!selectedPartner) return;
    const url = `${window.location.origin}${window.location.pathname}?partner=${selectedPartner.id}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  // SEO Breadcrumbs
  const breadcrumbs = [
    { name: 'Home', item: '/' },
    { name: 'Partners', item: '/partners' }
  ];
  if (selectedPartner) {
    breadcrumbs.push({ name: selectedPartner.name, item: `/partners?partner=${selectedPartner.id}` });
  }

  // Dynamic Partner Schema
  const partnerSchema = selectedPartner ? {
    "@type": "Service",
    "name": selectedPartner.name,
    "description": selectedPartner.description,
    "provider": {
      "@type": "Organization",
      "name": selectedPartner.name,
      "url": selectedPartner.link
    }
  } : undefined;

  return (
    <div className="pt-24 min-h-screen bg-[#0A0A0B] selection:bg-primary selection:text-black">
      <SEO 
        title={selectedPartner ? `${selectedPartner.name} | Ecosystem Partner` : "Partners & Ecosystem"} 
        description={selectedPartner ? selectedPartner.description : "Explore the curated network of technical leaders and community pillars powering the Vibes & Highs ecosystem."}
        ogImage={selectedPartner?.logo}
        breadcrumbs={breadcrumbs}
        structuredData={partnerSchema}
        keywords={[...(selectedPartner?.features || []), "partners", "ecosystem", "AI infrastructure", "V&H network", "mariecoder"]}
      />
      
      {/* Background Decor */}
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
                <Layers size={12} /> Registry & Ecosystem
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display font-black text-6xl md:text-8xl tracking-tighter leading-none mb-8"
              >
                THE <br />
                <span className="font-serif italic font-light text-white/40">Backbone.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/60 text-xl font-light leading-relaxed"
              >
                Explore the technical registry of partners that provide the compute, intelligence, and networking substrate for the Vibes & Highs community.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Origin Spotlight */}
        <section className="mb-48">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <Sparkles size={14} /> Origin spotlight
            </h2>
            <div className="h-px flex-1 bg-primary/20"></div>
          </div>
          
          <div className="grid grid-cols-1">
            {partners.filter(p => p.tier === 'SPOTLIGHT').map((partner) => (
              <OriginCard key={partner.id} partner={partner} />
            ))}
          </div>
        </section>

        {/* Discovery & Filtering Interface */}
        <div className="sticky top-24 z-30 mb-16 py-8 bg-[#0A0A0B]/95 backdrop-blur-xl border-y border-white/5 space-y-8 px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <Input 
                placeholder="Search technical registry..." 
                className="pl-10 bg-white/5 border-white/10 text-white rounded-none focus-visible:ring-primary focus-visible:border-primary placeholder:text-white/20 font-mono text-[10px] uppercase tracking-widest h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-8 w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 lg:pb-0">
               <div className="flex items-center gap-3 shrink-0">
                  <Filter size={12} className="text-white/20" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Tiers:</span>
                  <div className="flex gap-2">
                    {tiers.map(tier => (
                      <button 
                        key={tier}
                        onClick={() => handleFilterChange('tier', tier)}
                        className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all ${
                          activeTier === tier ? 'bg-primary text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
               </div>
               <div className="h-4 w-px bg-white/10 shrink-0" />
               <div className="flex items-center gap-2 text-white/20 text-[10px] font-bold uppercase tracking-widest shrink-0">
                <Activity size={12} /> {filteredPartners.length} Nodes Online
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange('category', cat)}
                className={`group flex items-center gap-3 px-4 py-2 rounded-none text-[10px] font-bold uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-white/10 text-primary border border-primary/50' 
                    : 'text-white/40 hover:text-white'
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
                <p className="font-mono text-[10px] uppercase tracking-[0.2em]">No matching records found</p>
                <Button 
                  variant="ghost" 
                  onClick={() => {setSearchQuery(''); handleFilterChange('category', 'All'); handleFilterChange('tier', 'All')}}
                  className="text-primary hover:text-primary hover:bg-primary/5 text-[10px] font-bold uppercase tracking-widest"
                >
                  Reset Registry
                </Button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Partner Investigation Dialog */}
        <Dialog open={!!selectedPartner} onOpenChange={(open) => !open && setSelectedPartner(null)}>
          <DialogContent className="max-w-5xl bg-[#0C0C0D] border-white/10 text-white p-0 overflow-hidden rounded-none shadow-2xl">
            <AnimatePresence>
              {selectedPartner && (
                <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                  {/* Left Column: Profile */}
                  <div className="w-full md:w-80 bg-white/2 border-r border-white/5 p-8 flex flex-col justify-between">
                    <div>
                      <div className="w-20 h-20 bg-white/5 border border-white/10 flex items-center justify-center mb-8 relative group">
                        <PartnerIcon name={selectedPartner.name} size={40} className="text-primary" />
                        <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className="bg-primary text-black rounded-none font-mono text-[10px] uppercase tracking-widest">
                          {selectedPartner.tier}
                        </Badge>
                        <button 
                          onClick={handleCopyLink}
                          className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white/40 hover:text-white"
                          title="Copy Link"
                        >
                          {isCopied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <h2 className="text-3xl font-display font-black uppercase tracking-tighter mb-2">{selectedPartner.name}</h2>
                      <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest mb-8">{selectedPartner.category}</p>
                      
                      <div className="space-y-6">
                        {selectedPartner.location && (
                          <div className="flex items-center gap-3 text-white/60">
                            <MapPin size={14} className="text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{selectedPartner.location}</span>
                          </div>
                        )}
                        <div className="flex gap-4 pt-4 border-t border-white/5">
                          {selectedPartner.socials?.twitter && (
                            <a href={selectedPartner.socials.twitter} target="_blank" rel="noreferrer" className="text-white/40 hover:text-primary transition-colors">
                              <Twitter size={18} />
                            </a>
                          )}
                          {selectedPartner.socials?.github && (
                            <a href={selectedPartner.socials.github} target="_blank" rel="noreferrer" className="text-white/40 hover:text-primary transition-colors">
                              <Github size={18} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mt-12">
                      <a href={selectedPartner.link} target="_blank" rel="noreferrer" className="block">
                        <Button className="w-full bg-white text-black hover:bg-primary font-bold uppercase tracking-widest text-[10px] h-12 rounded-none">
                          Visit node <ExternalLink size={14} className="ml-2" />
                        </Button>
                      </a>
                      <button 
                        onClick={() => setSelectedPartner(null)}
                        className="w-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors py-2"
                      >
                        <X size={12} /> Exit investigation
                      </button>
                    </div>
                  </div>
                  
                  {/* Right Column: Content */}
                  <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-[#0C0C0D]">
                    <div className="space-y-16">
                      <section>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                          <Info size={12} /> Detailed Investigation
                        </h3>
                        <p className="text-white/70 text-lg font-light leading-relaxed max-w-2xl">
                          {selectedPartner.longDescription || selectedPartner.description}
                        </p>
                      </section>

                      {/* Ecosystem Pulse / Metrics */}
                      {selectedPartner.impactMetrics && (
                        <section>
                          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">
                            Ecosystem Pulse
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 border border-white/5">
                            {selectedPartner.impactMetrics.map(metric => (
                              <div key={metric.label} className="p-6 bg-[#0C0C0D]">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">{metric.label}</div>
                                <div className="flex items-end justify-between">
                                  <div className="text-2xl font-display font-black text-white tracking-tighter">{metric.value}</div>
                                  <div className={metric.trend === 'up' ? 'text-green-500' : metric.trend === 'down' ? 'text-red-500' : 'text-white/20'}>
                                    {metric.trend === 'up' ? <TrendingUp size={14} /> : metric.trend === 'down' ? <TrendingDown size={14} /> : <Minus size={14} />}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                      
                      <div className="grid md:grid-cols-2 gap-12">
                        {/* Capabilities */}
                        {selectedPartner.features && (
                          <section>
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                              <Zap size={12} /> Infrastructure Capabilities
                            </h3>
                            <div className="space-y-2">
                              {selectedPartner.features.map(feature => (
                                <div key={feature} className="flex items-center gap-3 p-3 bg-white/2 border border-white/5">
                                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}

                        {/* Integration Notes */}
                        {selectedPartner.integrationNotes && (
                          <section>
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                              <Terminal size={12} /> V&H Integration Notes
                            </h3>
                            <div className="p-4 bg-white/2 border border-dashed border-white/10 font-mono text-[10px] text-white/50 leading-relaxed">
                              {selectedPartner.integrationNotes}
                            </div>
                          </section>
                        )}
                      </div>

                      {/* Related Content */}
                      <section>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                          <BookOpen size={12} /> Related Knowledge
                        </h3>
                        <div className="grid gap-4">
                          {editorialPosts.slice(0, 1).map(post => (
                            <Link key={post.id} to="/editorial" className="group flex items-center justify-between p-6 bg-white/2 border border-white/5 hover:border-primary/50 transition-all">
                              <div>
                                <div className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">{post.category}</div>
                                <div className="text-white font-bold group-hover:text-primary transition-colors">{post.title}</div>
                              </div>
                              <ArrowRight size={16} className="text-white/20 group-hover:text-primary transition-all -translate-x-2 group-hover:translate-x-0" />
                            </Link>
                          ))}
                        </div>
                      </section>
                      
                      <section className="pt-8 border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-white/20">
                              <Calendar size={12} />
                              <span className="text-[9px] font-mono uppercase tracking-widest font-bold">Node Entry: 2024.Q1</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/20">
                              <LinkIcon size={12} />
                              <span className="text-[9px] font-mono uppercase tracking-widest font-bold">SHA_VERIFIED</span>
                            </div>
                         </div>
                         <Badge variant="outline" className="border-primary/30 text-primary/60 text-[8px] font-mono rounded-none">V&H_SYSLOG_REV_05</Badge>
                      </section>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>

        {/* Global CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-48 grid md:grid-cols-2 gap-12 items-center bg-white/2 border border-white/5 p-12 md:p-20 relative overflow-hidden"
        >
           <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>
           <div className="relative z-10">
            <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter mb-6 leading-none">
              JOIN THE<br />
              <span className="font-serif italic font-light text-primary">Collective.</span>
            </h2>
            <p className="text-white/60 text-lg font-light leading-relaxed mb-8">
              Are you building the future of internet culture, AI, or infrastructure? Join the mariecoder collective and help us build the weird web.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="mailto:willcruzdesigner@gmail.com">
                <Button className="bg-white text-black hover:bg-primary font-bold uppercase tracking-widest text-[10px] h-14 px-10 transition-all group rounded-none">
                  Registry protocol <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="https://discord.gg/ua5UUXZTyz" target="_blank" rel="noreferrer">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-bold uppercase tracking-widest text-[10px] h-14 px-10 rounded-none">
                  Enter Community
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
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-primary">Foundational Roots</span>
          <div className="h-px w-8 bg-primary/40"></div>
        </div>
        <h3 className="font-display font-black text-4xl md:text-7xl tracking-tighter text-white uppercase group-hover:text-primary transition-colors leading-none mb-6">
          {partner.name}
        </h3>
        <p className="text-white/70 text-lg md:text-2xl font-light leading-relaxed max-w-3xl mb-8">
          {partner.description}
        </p>
        <div className="flex items-center gap-4 text-primary font-mono text-[10px] uppercase tracking-widest font-black group-hover:gap-6 transition-all">
          Explore origin node <ArrowRight size={14} />
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
              <span className="text-white/30 group-hover:text-primary transition-colors">Role: {partner.tier}</span>
              <span className="text-white/20 group-hover:text-white/50 transition-colors flex items-center gap-2 font-black">
                Registry search <ArrowRight size={10} />
              </span>
            </div>
          </div>
        </div>
      </div>
      
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
