import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ExternalLink, ShieldCheck, Zap, Globe, Cpu, School, ArrowRight, Layers, 
  Command, Search, Github, Twitter, Linkedin, MapPin, Calendar, Info, 
  TrendingUp, TrendingDown, Minus, BookOpen, Activity, Link as LinkIcon, Sparkles, Terminal,
  Copy, Check, Filter, X, HelpCircle, Network, Share2, Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { partners, Partner } from '@/data/partners';
import SEO from '@/components/SEO';
import { toast } from 'sonner';

function SystemScanner() {
  return (
    <motion.div 
      initial={{ top: -100 }}
      animate={{ top: '100%' }}
      transition={{ duration: 2, ease: "linear" }}
      className="fixed left-0 right-0 h-1 bg-primary/20 z-100 pointer-events-none"
    >
      <div className="absolute inset-0 bg-primary blur-sm"></div>
    </motion.div>
  );
}

// Translate complex sponsor / registry tiers into clear, friendly roles
function getTierBadgeLabel(tier: string): string {
  switch (tier) {
    case 'TITAN': return 'TITAN // Core Infrastructure';
    case 'PLATINUM': return 'PLATINUM // Strategic Platform';
    case 'GOLD': return 'GOLD // Key Contributor';
    case 'SPOTLIGHT': return 'SPOTLIGHT // Foundational Roots';
    default: return tier;
  }
}

// Plain-English translations and helpful contexts for technical metrics
function getMetricExplanation(label: string): string {
  switch (label) {
    case 'Cold Start Time': 
      return 'Server response speed: Lower startup latency means the system boots up and handles spikes instantly.';
    case 'GPU Availability': 
      return 'Computing horsepower: Guarantees that our custom models and heavy AI processing run uninterrupted.';
    case 'Developer NPS': 
      return 'Developer satisfaction: A high score shows how productive and happy programmers are building here.';
    case 'Model Downloads': 
      return 'Global adoption: Reflects the total times these models are actively deployed and used by the community.';
    case 'Research Citations': 
      return 'Scientific impact: Measures how frequently other experts reference this technology in academic research.';
    case 'Community Devs': 
      return 'Collaboration density: Represents the size of the engineering team actively contributing to this software.';
    case 'Network Coverage': 
      return 'Global edge footprint: Distributed points of presence that keep load times low for visitors worldwide.';
    case 'Request Velocity': 
      return 'Network capability: The massive volume of active network traffic handled securely every second.';
    case 'Community Trust': 
      return 'Platform integrity: Assures high uptime, strict security compliance, and open-source stability.';
    default: 
      return 'Standard indicator of operational health, reliability, and community deployment.';
  }
}

// Map each partner to a clear, approachable, real-world use case
function getPartnerUseCase(id: string): string {
  switch (id) {
    case 'modal':
      return 'Best for: Running massive AI code and smart programs instantly on secure cloud servers.';
    case 'nousresearch':
      return 'Best for: Building open-source smart models and neural nets that rival ChatGPT.';
    case 'cloudflare':
      return 'Best for: Speeding up websites and protecting against global security threats.';
    case 'google':
      return 'Best for: Scalable data storage, enterprise tools, and global cloud hosting platforms.';
    case 'silicon-slopes':
      return 'Best for: Regional networking, mentorship, and building tech communities in Utah.';
    case 'forge-utah':
      return 'Best for: Collaborative workspaces, maker projects, and fostering physical engineering.';
    default:
      return 'Best for: Fostering innovative open digital experiences and community growth.';
  }
}

export default function Partners() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  // High-fidelity Approachable State Controls
  const [plainEnglishMode, setPlainEnglishMode] = useState(false);
  const [modalViewMode, setModalViewMode] = useState<'approachable' | 'developer'>('approachable');
  const [isGuideOpen, setIsGuideOpen] = useState(true);
  const [wizardAnswer, setWizardAnswer] = useState<string | null>(null);
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  const activeCategory = searchParams.get('category') || 'All';
  const activeTier = searchParams.get('tier') || 'All';
  const selectedPartnerId = searchParams.get('partner');

  const selectedPartner = useMemo(() => 
    partners.find(p => p.id === selectedPartnerId) || null, 
  [selectedPartnerId]);

  const categories = useMemo(() => 
    ['All', ...new Set(partners.map(p => p.category))], 
  []);

  const tiers = ['All', 'TITAN', 'PLATINUM', 'GOLD', 'SPOTLIGHT'];
  
  const filteredPartners = useMemo(() => {
    return partners.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesTier = activeTier === 'All' || p.tier === activeTier;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (p.eli5 && p.eli5.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesTier && matchesSearch;
    });
  }, [activeCategory, activeTier, searchQuery]);

  // Always reset to Plain English modal tab by default when selecting a new partner
  useEffect(() => {
    if (selectedPartner) {
      setModalViewMode('approachable');
    }
  }, [selectedPartnerId, selectedPartner]);

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
    toast.success("Registry link copied!");
    setTimeout(() => setIsCopied(false), 2000);
  };

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
    <TooltipProvider>
      <div className="pt-24 min-h-screen bg-[#0A0A0B] selection:bg-primary selection:text-black">
        <SEO 
          title={selectedPartner ? `${selectedPartner.name} | Community Map` : "Community Ecosystem | The Ecosystem"} 
          description={selectedPartner ? selectedPartner.description : "A directory of the friends, tools, and infrastructure powering the SLC AI Town Hall collective."}
          breadcrumbs={[
            { name: 'Home', item: '/' },
            { name: 'Community', item: '/partners' },
            ...(selectedPartner ? [{ name: selectedPartner.name, item: `/partners?partner=${selectedPartner.id}` }] : [])
          ]}
          structuredData={partnerSchema}
          keywords={[...(selectedPartner?.features || []), "community map", "ecosystem", "mariecoder", "AI infra"]}
        />
        
        <SystemScanner />
        
        {/* Background Decor */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
           <div className="fixed top-24 right-8 z-50 hidden xl:flex xl:flex-col items-end pointer-events-none opacity-20">
              <div className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Ecosystem_Sync</div>
              <div className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] font-black animate-pulse">Finding_Friends...</div>
           </div>

          {/* Hero Section */}
          <div className="pt-20 mb-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-[0.4em] mb-6"
                >
                  <Network size={12} /> Our Connections
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-display font-black text-6xl md:text-9xl tracking-tighter leading-none mb-8"
                >
                  THE <br />
                  <span className="font-serif italic font-light text-white/40 tracking-normal">Ecosystem.</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/60 text-xl font-light leading-relaxed max-w-2xl"
                >
                  A map of the friends, tools, and infrastructure powering the mariecoder collective and our shared experiments.
                </motion.p>
              </div>
            </div>
          </div>

          {/* Onboarding Assistant / Info Legend for Non-Technical Users */}
          <AnimatePresence>
            {isGuideOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-12 bg-white/1 border border-white/5 p-6 md:p-8 relative overflow-hidden rounded-none group"
              >
                <button 
                  onClick={() => setIsGuideOpen(false)}
                  className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
                  aria-label="Dismiss guide"
                >
                  <X size={16} />
                </button>
                
                <div className="absolute top-0 right-0 p-8 text-primary/5 pointer-events-none transition-transform duration-1000 group-hover:rotate-12 group-hover:scale-110">
                  <Info size={120} />
                </div>
                
                <div className="max-w-3xl space-y-4 relative z-10">
                  <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Sparkles size={14} className="animate-pulse" /> Registry Explorer Guide
                  </h3>
                  <p className="text-white/77 text-sm font-light leading-relaxed">
                    This registry organizes the core technologies, networks, and startup organizations driving our open-source experiments. Use the following guides to explore like a pro:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">1. Filter by Purpose</div>
                      <p className="text-[11px] text-white/40 leading-relaxed">Narrow down the list by Category to immediately isolate AI research, edge servers, or community roots.</p>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">2. Plain English Mode</div>
                      <p className="text-[11px] text-white/40 leading-relaxed">Flick the toggle below to instantly swap complex developer details for friendly, simple descriptions.</p>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">3. Switch Spec Sheets</div>
                      <p className="text-[11px] text-white/40 leading-relaxed">Click any partner card to open a profile with tabs for both standard summaries and technical blueprints.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Guided Recommender Assistant (Wizard) */}
          <div className="mb-12 bg-white/1 border border-white/5 p-8 relative overflow-hidden rounded-none">
            <div className="absolute top-0 right-0 p-6 text-primary/5 pointer-events-none">
              <Sparkles size={64} />
            </div>
            
            <div className="max-w-2xl space-y-6 relative z-10">
              <div className="space-y-2">
                <div className="text-[9px] font-mono text-primary font-bold uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={12} className="animate-pulse" /> WIZARD RECOMMENDER
                </div>
                <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">
                  Not sure where to start? Let us guide you.
                </h3>
                <p className="text-white/50 text-xs font-light leading-relaxed">
                  Select your primary interest below and our system will automatically configure your filters and highlight the ideal partners for your needs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setWizardAnswer('ai-infra');
                    handleFilterChange('category', 'AI Infrastructure');
                  }}
                  className={`p-4 border text-left transition-all duration-300 flex flex-col justify-between ${
                    wizardAnswer === 'ai-infra'
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-primary/50'
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest font-black mb-2 flex items-center gap-2">
                    <Zap size={10} /> Deploy AI Models
                  </span>
                  <span className="text-[11px] text-white/40 leading-relaxed font-light">I want serverless computing power and cloud GPUs to scale my intelligence apps.</span>
                </button>
                
                <button
                  onClick={() => {
                    setWizardAnswer('ai-research');
                    handleFilterChange('category', 'Intelligence & Research');
                  }}
                  className={`p-4 border text-left transition-all duration-300 flex flex-col justify-between ${
                    wizardAnswer === 'ai-research'
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-primary/50'
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest font-black mb-2 flex items-center gap-2">
                    <Cpu size={10} /> Open Intelligence
                  </span>
                  <span className="text-[11px] text-white/40 leading-relaxed font-light">I want to study open-source brains and next-generation large language models.</span>
                </button>

                <button
                  onClick={() => {
                    setWizardAnswer('security');
                    handleFilterChange('category', 'Security & Network');
                  }}
                  className={`p-4 border text-left transition-all duration-300 flex flex-col justify-between ${
                    wizardAnswer === 'security'
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-primary/50'
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest font-black mb-2 flex items-center gap-2">
                    <Globe size={10} /> Secure & Edge CDNs
                  </span>
                  <span className="text-[11px] text-white/40 leading-relaxed font-light">I want to optimize web requests, set up edge servers, and guard digital perimeters.</span>
                </button>

                <button
                  onClick={() => {
                    setWizardAnswer('community');
                    handleFilterChange('category', 'Community');
                  }}
                  className={`p-4 border text-left transition-all duration-300 flex flex-col justify-between ${
                    wizardAnswer === 'community'
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-primary/50'
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest font-black mb-2 flex items-center gap-2">
                    <School size={10} /> Local Tech Hubs
                  </span>
                  <span className="text-[11px] text-white/40 leading-relaxed font-light">I want to connect with local makers, startup accelerators, and community hubs in Utah.</span>
                </button>
              </div>

              {wizardAnswer && (
                <div className="p-4 bg-primary/5 border border-primary/20 flex items-center justify-between gap-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <Info size={14} className="text-primary shrink-0 animate-pulse" />
                    <p className="text-[11px] text-white/70 leading-relaxed">
                      {wizardAnswer === 'ai-infra' && "Wizard recommendation applied: Isolated AI Infrastructure. Check out Modal for serverless computing!"}
                      {wizardAnswer === 'ai-research' && "Wizard recommendation applied: Isolated Intelligence & Research. Nous Research models are active!"}
                      {wizardAnswer === 'security' && "Wizard recommendation applied: Isolated Security & Network. Cloudflare workers perimeter active!"}
                      {wizardAnswer === 'community' && "Wizard recommendation applied: Isolated Community nodes. Silicon Slopes and Forge Utah ready!"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setWizardAnswer(null);
                      handleFilterChange('category', 'All');
                      handleFilterChange('tier', 'All');
                    }}
                    className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary hover:text-white transition-colors"
                  >
                    Clear Guide
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Registry Interface (Clean, Industry-Standard Controls) */}
          <div className="sticky top-24 z-30 mb-12 py-6 bg-[#0A0A0B]/95 backdrop-blur-xl border-y border-white/5 space-y-6 px-6">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
              
              {/* Modern Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                <Input 
                  placeholder="Search Registry..." 
                  className="pl-10 bg-white/5 border-white/10 text-white rounded-none focus-visible:ring-primary focus-visible:border-primary placeholder:text-white/30 font-mono text-[10px] uppercase tracking-widest h-12 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              
              {/* Dynamic Telemetry Metric count */}
              <div className="flex items-center justify-between lg:justify-end gap-6 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 text-white/30 text-[10px] font-mono uppercase tracking-widest shrink-0 font-bold">
                  <Activity size={12} className="text-primary animate-pulse" /> {filteredPartners.length} Active Records
                </div>
                {(activeCategory !== 'All' || activeTier !== 'All' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setWizardAnswer(null);
                      handleFilterChange('category', 'All');
                      handleFilterChange('tier', 'All');
                    }}
                    className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary hover:text-white transition-colors shrink-0 underline decoration-primary decoration-1 underline-offset-4"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Structured Dual-Row Filter Controls */}
            <div className="space-y-4 pt-2 border-t border-white/5">
              
              {/* Row 1: Categories */}
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex items-center gap-2 shrink-0 text-white/30 text-[10px] font-mono uppercase tracking-widest font-bold md:w-36">
                  <Layers size={11} className="text-primary/70" /> CATEGORIES:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => {
                        handleFilterChange('category', cat);
                        setWizardAnswer(null); // Reset wizard selection when custom filtering
                      }}
                      className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest transition-all ${
                        activeCategory === cat ? 'bg-primary text-black font-black' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 2: Tiers */}
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex items-center gap-2 shrink-0 text-white/30 text-[10px] font-mono uppercase tracking-widest font-bold md:w-36">
                  <Network size={11} className="text-primary/70" /> REGISTRY TIERS:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tiers.map(tier => (
                    <button 
                      key={tier}
                      onClick={() => {
                        handleFilterChange('tier', tier);
                        setWizardAnswer(null);
                      }}
                      className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest transition-all ${
                        activeTier === tier ? 'bg-primary text-black font-black' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {tier === 'All' ? 'All Tiers' : tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Subheader Toolbar with Global Plain English Mode & Layout Switch */}
          <div className="flex flex-wrap items-center gap-4 pb-6 mb-8 border-b border-white/5">
            <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest font-bold flex-1 min-w-[200px]">
              Displaying {filteredPartners.length} of {partners.length} registered nodes
            </div>
            
            {/* Grid vs List View Selector (Familiar UI layout control) */}
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1 shrink-0">
              <button
                onClick={() => setViewLayout('grid')}
                className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest transition-all ${
                  viewLayout === 'grid' ? 'bg-primary text-black font-black' : 'text-white/40 hover:text-white'
                }`}
                title="Grid layout view"
              >
                Grid
              </button>
              <button
                onClick={() => setViewLayout('list')}
                className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest transition-all ${
                  viewLayout === 'list' ? 'bg-primary text-black font-black' : 'text-white/40 hover:text-white'
                }`}
                title="List layout view"
              >
                List
              </button>
            </div>

            <button
              onClick={() => {
                setPlainEnglishMode(prev => !prev);
                toast.success(plainEnglishMode ? "Technical descriptions restored" : "Plain English mode activated!");
              }}
              className={`flex items-center gap-2.5 px-4 py-2 border transition-all duration-300 shrink-0 ${
                plainEnglishMode 
                  ? 'bg-primary/10 border-primary text-primary font-black shadow-[0_0_15px_rgba(0,255,102,0.05)]' 
                  : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles size={12} className={plainEnglishMode ? 'animate-pulse' : ''} />
              <span className="text-[9px] font-mono uppercase tracking-widest">
                {plainEnglishMode ? 'Plain English: ON' : 'Plain English Mode'}
              </span>
            </button>
          </div>

          {/* Dynamic Partner Grid/List */}
          <div className={viewLayout === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5" 
            : "flex flex-col gap-3"
          }>
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
                    <PartnerEntry 
                      partner={partner} 
                      onClick={() => setSelectedPartner(partner)} 
                      searchQuery={searchQuery}
                      plainEnglishMode={plainEnglishMode}
                      viewLayout={viewLayout}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 py-32 flex flex-col items-center justify-center text-white/20 space-y-4">
                  <Search size={48} strokeWidth={1} />
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em]">No matching records found in system</p>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setSearchQuery('');
                      setWizardAnswer(null);
                      handleFilterChange('category', 'All');
                      handleFilterChange('tier', 'All');
                    }}
                    className="text-primary hover:text-primary hover:bg-primary/5 text-[10px] font-bold uppercase tracking-widest"
                  >
                    Reset Scanners
                  </Button>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Partner Investigation Dialog */}
          <Dialog open={!!selectedPartner} onOpenChange={(open) => !open && setSelectedPartner(null)}>
            <DialogContent className="max-w-6xl bg-[#0C0C0D] border-white/10 text-white p-0 overflow-hidden rounded-none shadow-2xl">
              <AnimatePresence>
                {selectedPartner && (
                  <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
                    {/* Profile & Controls Column */}
                    <div className="w-full lg:w-80 bg-white/2 border-r border-white/5 p-8 flex flex-col justify-between shrink-0">
                      <div>
                        <div className="w-20 h-20 bg-white/5 border border-white/10 flex items-center justify-center mb-8 relative group">
                          <PartnerIcon name={selectedPartner.name} size={40} className="text-primary" />
                          <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className="bg-primary text-black rounded-none font-mono text-[9px] uppercase tracking-widest font-black py-1 px-2.5">
                            {selectedPartner.tier}
                          </Badge>
                          <button 
                            onClick={handleCopyLink}
                            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white/40 hover:text-white flex items-center justify-center"
                            title="Copy registry link"
                          >
                            {isCopied ? <Check size={12} className="text-green-500 animate-pulse" /> : <Share2 size={12} />}
                          </button>
                        </div>
                        <h2 className="text-3xl font-display font-black uppercase tracking-tighter mb-2">{selectedPartner.name}</h2>
                        <div className="text-[9px] font-mono text-primary font-black uppercase tracking-widest mb-8">{selectedPartner.systemRole}</div>
                        
                        <div className="space-y-6">
                           <div className="p-4 bg-white/3 border border-white/5 relative group overflow-hidden">
                              <div className="absolute top-0 right-0 p-2 text-white/10 group-hover:text-primary transition-colors">
                                <HelpCircle size={14} />
                              </div>
                              <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-primary mb-2">In Simple Terms</div>
                              <p className="text-[11px] text-white/60 leading-relaxed italic">
                                "{selectedPartner.eli5}"
                              </p>
                           </div>
                           
                           {selectedPartner.location && (
                            <div className="flex items-center gap-3 text-white/60">
                              <MapPin size={14} className="text-primary" />
                              <span className="text-[10px] font-mono font-bold uppercase tracking-widest">{selectedPartner.location}</span>
                            </div>
                           )}
                        </div>
                      </div>
                      
                      <div className="space-y-4 mt-12">
                        <a href={selectedPartner.link} target="_blank" rel="noopener noreferrer" className="block">
                          <Button className="w-full bg-white text-black hover:bg-primary font-black uppercase tracking-widest text-[10px] h-12 rounded-none transition-all">
                            Visit official site <ExternalLink size={14} className="ml-2" />
                          </Button>
                        </a>
                      </div>
                    </div>
                    
                    {/* Deep Dynamic Dashboard Panel */}
                    <div className="flex-1 p-8 lg:p-16 overflow-y-auto custom-scrollbar bg-[#0C0C0D]">
                      <div className="space-y-12">
                        
                        {/* Tab Segment Selector (Approachable vs Developer Specs) */}
                        <div className="flex items-center gap-1 border-b border-white/5">
                          <button
                            onClick={() => setModalViewMode('approachable')}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-mono text-[10px] uppercase tracking-widest transition-all ${
                              modalViewMode === 'approachable'
                                ? 'border-primary text-primary font-black bg-primary/2'
                                : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <Sparkles size={12} className="text-primary" /> Plain English Summary
                          </button>
                          <button
                            onClick={() => setModalViewMode('developer')}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-mono text-[10px] uppercase tracking-widest transition-all ${
                              modalViewMode === 'developer'
                                ? 'border-primary text-primary font-black bg-primary/2'
                                : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <Terminal size={12} /> Developer Spec Sheet
                          </button>
                        </div>

                        {/* View Modes */}
                        {modalViewMode === 'approachable' ? (
                          /* ================= APPROACHABLE SUMMARY VIEW ================= */
                          <div className="space-y-12 animate-in fade-in duration-300">
                            
                            {/* Summary Story */}
                            <section className="space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="h-px w-8 bg-primary/40" />
                                <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-primary">Why We Collaborate</h3>
                              </div>
                              <p className="text-white/80 text-lg font-light leading-relaxed max-w-3xl font-sans">
                                {selectedPartner.longDescription || selectedPartner.description}
                              </p>
                            </section>

                            {/* Main ELI5 Summary Callout */}
                            <section className="p-6 bg-primary/2 border border-primary/20 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-4 text-primary/10">
                                <HelpCircle size={48} />
                              </div>
                              <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-primary mb-2">Plain English Breakdown</div>
                              <p className="text-white/90 text-sm font-sans leading-relaxed italic max-w-2xl">
                                "{selectedPartner.eli5}"
                              </p>
                            </section>

                            {/* Balanced Split Layout */}
                            <div className="grid md:grid-cols-2 gap-12 pt-4">
                              
                              {/* Friendly Capabilities */}
                              {selectedPartner.features && (
                                <section className="space-y-6">
                                  <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                                    <Sparkles size={12} className="text-primary" /> Key Contributions
                                  </h3>
                                  <div className="grid grid-cols-1 gap-2">
                                    {selectedPartner.features.map(feature => (
                                      <div key={feature} className="p-3.5 border border-white/5 text-[10px] font-medium text-white/70 bg-white/1 flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                        {feature}
                                      </div>
                                    ))}
                                  </div>
                                </section>
                              )}

                              {/* Approachable Metrics with Tooltips/Legends */}
                              {selectedPartner.impactMetrics && (
                                <section className="space-y-6">
                                  <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                                    <Activity size={12} /> Community Value Indicators
                                  </h3>
                                  <div className="space-y-3">
                                    {selectedPartner.impactMetrics.map(metric => (
                                      <div key={metric.label} className="p-4 bg-white/1 border border-white/5 space-y-2 group hover:bg-white/2 transition-colors">
                                        <div className="flex items-center justify-between">
                                          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/60">{metric.label}</div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-display font-black text-white">{metric.value}</span>
                                            <span className="text-green-400 text-xs">
                                              {metric.trend === 'up' ? '▲' : '■'}
                                            </span>
                                          </div>
                                        </div>
                                        <p className="text-[10px] text-white/40 leading-relaxed font-sans">
                                          {getMetricExplanation(metric.label)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </section>
                              )}

                            </div>
                          </div>
                        ) : (
                          /* ================= DEVELOPER SPEC SHEET VIEW ================= */
                          <div className="space-y-12 animate-in fade-in duration-300">
                            
                            {/* Visual Topology Diagram */}
                            <section className="p-8 bg-white/2 border border-white/5 relative overflow-hidden group">
                               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#primary10,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                               <div className="relative z-10 flex flex-col items-center text-center">
                                  <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/20 mb-8">Node Integration Map</div>
                                    <div className="flex items-center gap-4 sm:gap-16">
                                       <div className="flex flex-col items-center gap-3">
                                          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20"><Terminal size={16} /></div>
                                          <div className="text-[8px] font-mono uppercase text-white/40">Town Hall Core</div>
                                       </div>
                                       <div className="flex-1 h-px w-16 sm:w-24 bg-linear-to-r from-white/10 via-primary/50 to-white/10 relative">
                                          <motion.div 
                                            animate={{ x: [0, 96, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                            className="absolute -top-1 left-0 w-2 h-2 bg-primary blur-[2px] rounded-full"
                                          />
                                       </div>
                                       <div className="flex flex-col items-center gap-3">
                                          <div className="w-14 h-14 bg-primary/10 border border-primary/50 flex items-center justify-center text-primary animate-pulse shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                             <PartnerIcon name={selectedPartner.name} size={28} />
                                          </div>
                                          <div className="text-[9px] font-bold uppercase text-primary tracking-widest">{selectedPartner.systemRole}</div>
                                       </div>
                                       <div className="flex-1 h-px w-16 sm:w-24 bg-linear-to-r from-white/10 via-primary/50 to-white/10" />
                                       <div className="flex flex-col items-center gap-3">
                                          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20"><Globe size={16} /></div>
                                          <div className="text-[8px] font-mono uppercase text-white/40">The Internet</div>
                                       </div>
                                    </div>
                                    <div className="mt-8 text-[9px] font-mono text-white/30 tracking-widest">DATA_PIPELINE :: NOMINAL_STABLE</div>
                                 </div>
                            </section>

                            {/* Raw Integration Console */}
                            {selectedPartner.integrationNotes && (
                              <section className="space-y-4">
                                <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                                  <Terminal size={12} /> Chapter Integration Protocol
                                </h3>
                                <div className="p-6 bg-black border border-white/10 font-mono text-[11px] text-white/50 leading-relaxed relative group overflow-hidden">
                                   <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                   {selectedPartner.integrationNotes}
                                </div>
                              </section>
                            )}

                            {/* Telemetry metrics raw dashboard */}
                            {selectedPartner.impactMetrics && (
                              <section className="space-y-4">
                                <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                                  <Activity size={12} /> Ecosystem Pulse Telemetry
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                  {selectedPartner.impactMetrics.map(metric => (
                                    <div key={metric.label} className="p-4 bg-white/2 border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-colors">
                                      <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/40">{metric.label}</div>
                                      <div className="flex items-center gap-4">
                                        <div className="text-lg font-display font-black text-white">{metric.value}</div>
                                        <div className={metric.trend === 'up' ? 'text-green-500' : 'text-white/20'}>
                                          {metric.trend === 'up' ? <TrendingUp size={14} /> : <Minus size={14} />}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </section>
                            )}

                            {/* Capabilities checklist raw */}
                            {selectedPartner.features && (
                              <section className="space-y-4">
                                <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                                  <Zap size={12} /> Registry Capabilities Data
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                  {selectedPartner.features.map(feature => (
                                    <div key={feature} className="p-3 border border-white/5 text-[9px] font-mono font-bold uppercase tracking-widest text-white/60 bg-white/2">
                                      {feature}
                                    </div>
                                  ))}
                                </div>
                              </section>
                            )}

                            {/* Security Auditing Spec Panel */}
                            <section className="pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                               <div className="flex flex-wrap items-center gap-6">
                                  <div className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">SHA_VERIFIED_ENTRY_2024</div>
                                  <div className="h-4 w-px bg-white/5 hidden sm:block" />
                                  <div className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">REGISTRY_ID: {selectedPartner.id.toUpperCase()}</div>
                               </div>
                               <Badge variant="outline" className="border-primary/25 text-primary/50 text-[8px] font-mono rounded-none self-start sm:self-auto">SLC_AI_SYSLOG_REV_06</Badge>
                            </section>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </DialogContent>
          </Dialog>

          {/* Spotlight / Foundational Roots Section */}
          {partners.filter(p => p.tier === 'SPOTLIGHT').length > 0 && (
            <section className="mt-32 space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-[0.4em]">
                  <Sparkles size={12} className="animate-pulse" /> Foundational Roots
                </div>
                <h2 className="font-display font-black text-4xl md:text-7xl tracking-tighter uppercase leading-none">
                  Our Origin Spotlight
                </h2>
                <p className="text-white/40 text-xs font-mono uppercase tracking-widest leading-relaxed max-w-2xl">
                  Celebrating the community and organizations that helped grow SLC AI Town Hall from day one.
                </p>
              </div>

              <div className="space-y-6">
                {partners
                  .filter(p => p.tier === 'SPOTLIGHT')
                  .map(partner => (
                    <OriginCard key={partner.id} partner={partner} />
                  ))}
              </div>
            </section>
          )}

          {/* Join CTA */}
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-48 grid md:grid-cols-2 gap-12 items-center bg-white/2 border border-white/5 p-12 md:p-24 relative overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>
             <div className="relative z-10">
              <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter mb-6 leading-none uppercase">
                ENTER THE<br />
                <span className="font-serif italic font-light text-primary tracking-normal">Collective.</span>
              </h2>
              <p className="text-white/60 text-lg font-light leading-relaxed mb-8 max-w-md">
                Building the future of internet culture requires a robust foundation. Join mariecoder and help us define the next latent age.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="mailto:willcruzdesigner@gmail.com">
                  <Button className="bg-white text-black hover:bg-primary font-black uppercase tracking-widest text-[11px] h-14 px-10 transition-all group rounded-none">
                    Join the ecosystem <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>
             </div>
             <div className="relative aspect-square md:aspect-auto md:h-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group">
                <Network size={200} className="text-primary/10 group-hover:scale-110 transition-transform duration-1000 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-linear-to-t from-[#0A0A0B] via-transparent to-transparent"></div>
             </div>
          </motion.section>
        </div>
      </div>
    </TooltipProvider>
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
          {partner.id === 'silicon-slopes' ? (
            <School size={64} className="group-hover:scale-110 transition-transform duration-700" />
          ) : (
            <Command size={64} className="group-hover:scale-110 transition-transform duration-700" />
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-primary">
            {partner.id === 'silicon-slopes' ? 'Foundational Roots' : 'Technologist Ecosystem'}
          </span>
          <div className="h-px w-8 bg-primary/40"></div>
        </div>
        <h3 className="font-display font-black text-4xl md:text-7xl tracking-tighter text-white uppercase group-hover:text-primary transition-colors leading-none mb-6">
          {partner.name}
        </h3>
        <p className="text-white/70 text-lg md:text-2xl font-light leading-relaxed max-w-3xl mb-8 font-sans">
          {partner.description}
        </p>
        <div className="flex items-center gap-4 text-primary font-mono text-[10px] uppercase tracking-widest font-black group-hover:gap-6 transition-all">
          Explore origin node <ArrowRight size={14} />
        </div>
      </div>
    </motion.a>
  );
}

const Highlight = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? 
          <span key={i} className="text-primary bg-primary/10 px-0.5">{part}</span> : 
          part
      )}
    </>
  );
};

function PartnerEntry({ 
  partner, 
  onClick, 
  searchQuery, 
  plainEnglishMode,
  viewLayout = 'grid'
}: { 
  partner: Partner; 
  onClick: () => void; 
  searchQuery: string;
  plainEnglishMode: boolean;
  viewLayout?: 'grid' | 'list';
}) {
  const useCaseText = getPartnerUseCase(partner.id);
  
  if (viewLayout === 'list') {
    return (
      <div
        onClick={onClick}
        className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-[#0A0A0B] border border-white/5 p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden"
      >
        {/* Shimmer sweep */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left pointer-events-none" />
        
        <div className="flex items-start sm:items-center gap-6 flex-1 min-w-0 z-10">
          <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-primary group-hover:border-primary/20 transition-all shrink-0">
            <PartnerIcon name={partner.name} size={20} />
          </div>
          
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="text-xl font-display font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">
                <Highlight text={partner.name} query={searchQuery} />
              </h3>
              <span className="text-[8px] font-mono px-2 py-0.5 bg-primary/10 text-primary border border-primary/25 font-bold uppercase tracking-wider">
                {partner.category}
              </span>
            </div>
            
            <p className="text-white/60 text-sm font-light leading-relaxed truncate max-w-xl font-sans">
              <Highlight 
                text={plainEnglishMode ? (partner.eli5 || partner.description) : partner.description} 
                query={searchQuery} 
              />
            </p>
            
            <p className="text-[10px] text-white/30 font-mono italic">
              {useCaseText}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 justify-between sm:justify-end z-10">
          <span className="text-[9px] font-mono text-white/30">
            {getTierBadgeLabel(partner.tier)}
          </span>
          <span className="text-xs text-white/30 group-hover:text-white/60 flex items-center gap-1 font-bold">
            Explore <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    );
  }

  // Grid view (Standard)
  return (
    <div
      onClick={onClick}
      className="group relative block bg-[#0A0A0B] p-10 md:p-16 hover:bg-white/2 transition-all duration-500 h-full overflow-hidden cursor-pointer"
    >
      <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all z-20">
        <div className="flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-widest text-primary">
          Explore Details <Search size={12} />
        </div>
      </div>
      
      <div className="relative z-10 space-y-10">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="text-[9px] font-mono text-primary font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0"></span>
              <Highlight text={partner.category} query={searchQuery} />
            </div>
            <h3 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tighter group-hover:text-primary transition-colors leading-none">
              <Highlight text={partner.name} query={searchQuery} />
            </h3>
            <div className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">{partner.systemRole}</div>
          </div>
          <div className="text-white/20 group-hover:text-primary/40 transition-colors shrink-0">
             <PartnerIcon name={partner.name} size={32} />
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-white/50 text-base md:text-lg font-light leading-relaxed group-hover:text-white/70 transition-colors line-clamp-3 font-sans">
            <Highlight 
              text={plainEnglishMode ? (partner.eli5 || partner.description) : partner.description} 
              query={searchQuery} 
            />
          </p>
          
          <p className="text-[10px] text-white/35 font-mono italic">
            {useCaseText}
          </p>
          
          <div className="pt-8 border-t border-white/5">
            <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.2em] gap-4">
              <span className="text-white/30 group-hover:text-primary transition-colors truncate">
                {getTierBadgeLabel(partner.tier)}
              </span>
              <span className="text-white/20 group-hover:text-white/50 transition-colors flex items-center gap-2 font-black shrink-0">
                Explore <ArrowRight size={10} />
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/2 transition-colors duration-500 pointer-events-none"></div>
    </div>
  );
}

function PartnerIcon({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  if (name === 'Modal') return <Zap size={size} className={className} />;
  if (name === 'Cloudflare') return <Globe size={size} className={className} />;
  if (name === 'NousResearch') return <Cpu size={size} className={className} />;
  if (name === 'Google') return <ShieldCheck size={size} className={className} />;
  if (name === 'Silicon Slopes') return <School size={size} className={className} />;
  if (name === 'Forge Utah') return <Flame size={size} className={className} />;
  return <Layers size={size} className={className} />;
}
