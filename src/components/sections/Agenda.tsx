/**
 * [LAYER: UI]
 * Agenda Section - Nous Research SLC Chapter
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Terminal, Settings, Sparkles, ChevronRight, PlayCircle, BookOpen, HelpCircle, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgendaPillar {
  id: string;
  number: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  details: string[];
  terminalCommand: string;
  terminalOutput: string[];
}

const AGENDA_PILLARS: AgendaPillar[] = [
  {
    id: 'setup',
    number: '01',
    title: 'Easy Local Setup',
    icon: Settings,
    description: 'Get your friendly Nous Hermes AI helper running right on your own computer. We keep it simple, skip the confusion, and show you exactly what to do step-by-step.',
    details: [
      'Helping you choose the best model settings for your machine',
      'Setting up your command line and computer settings',
      'Testing a simple, guaranteed setup to get you going',
      'Fixing common setup errors and package issues'
    ],
    terminalCommand: 'hermes setup --chapter-slc',
    terminalOutput: [
      '❯ Initializing local workspace...',
      '❯ Linking to the Salt Lake City Chapter guide...',
      '✔ Selected Model: Nous-Hermes-2-Theta (Native)',
      '✔ Configured Terminal Backend: Secure SSH/Local Shell',
      '✔ Persona definition [SOUL.md] synchronized successfully.',
      '🎉 SETUP COMPLETE: Ready to build weird things!'
    ]
  },
  {
    id: 'walkthroughs',
    number: '02',
    title: 'Guided Walkthroughs',
    icon: PlayCircle,
    description: 'We show you exactly how AI assistants think. Watch them work in real-time, see how they solve problems, and learn how to guide their actions.',
    details: [
      'Learning how to guide AI answers to get exactly what you need',
      'Watching and understanding how different AI tools talk to each other',
      'Keeping your AI safe from hackers and fixing errors',
      'Creating custom shortcuts and custom tools for your AI companion'
    ],
    terminalCommand: 'hermes run --demo-trace',
    terminalOutput: [
      '❯ Injecting Prompt: "Synthesize the week\'s agentic trends..."',
      '🧠 [Hermes Reasoning] Thinking Process Initiated:',
      '  ├─ Analyzing current open-source model releases...',
      '  ├─ Activating tools: git_pull, web_search, file_audit',
      '  └─ Formulating agentic strategy...',
      '✔ Walkthrough completed in 1.45s. Your AI helper is ready!'
    ]
  },
  {
    id: 'breakdown',
    number: '03',
    title: 'Weekly Tech Breakdowns',
    icon: BookOpen,
    description: 'Artificial intelligence moves incredibly fast. Each week, we gather, play with, and explain the newest free models, smart tools, and exciting tech.',
    details: [
      'Exploring the newest free models released by Nous Research',
      'Breaking down top prompt designs and how smart new models are',
      'Looking at cool AI art, music, and creative web projects',
      'Helping you build your own fun side projects and ideas'
    ],
    terminalCommand: 'hermes analyze --week-latest',
    terminalOutput: [
      '❯ Scraping the open intelligence frontier...',
      '🔥 TRENDING THIS WEEK IN AGENTIC DEVELOPMENT:',
      '  1. Nous Hermes 3 Preview (Open weights benchmark crusher)',
      '  2. Local-first distributed agent runtimes',
      '  3. Structured JSON output schema engines',
      '💡 Chapter tip: Leverage local context databases to bypass heavy cloud fees.'
    ]
  }
];

export function Agenda() {
  const [activeTab, setActiveTab] = useState<string>('setup');

  const activePillar = AGENDA_PILLARS.find(p => p.id === activeTab) || AGENDA_PILLARS[0];
  const ActiveIcon = activePillar.icon;

  return (
    <section id="agenda" className="relative py-32 px-6 border-b border-white/5 overflow-hidden bg-black/40">
      {/* Background glow behind centerpiece */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00FF66]/5 blur-[130px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-[0.4em] mb-4">
              <Cpu size={12} className="animate-pulse" /> The Unified Curriculum
            </div>
            <h2 className="font-display font-black text-5xl md:text-8xl tracking-tighter leading-[0.9] mb-6 uppercase">
              ONE WEEKLY<br />
              <span className="font-serif italic font-light text-white/30 lowercase">agenda.</span>
            </h2>
            <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed font-sans max-w-2xl">
              We host weekly learning sessions in Herriman centered around free, open-source AI tools. As the local <span className="text-white font-medium underline decoration-primary decoration-2 underline-offset-4">Nous Research Chapter of SLC</span>, we host weekly learning sessions centered around free, open-source AI tools.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/2 rounded-none text-white/50 text-[10px] font-mono uppercase tracking-widest font-black">
            <span>Focus: Open AI Tools &amp; Local Helpers</span>
          </div>
        </div>

        {/* Unified Banner for Nous Research Chapter Identity */}
        <div className="relative p-8 md:p-12 border border-primary/20 bg-primary/[0.02] backdrop-blur-md mb-16 overflow-hidden rounded-none">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-[8px] font-bold tracking-widest uppercase">
            Official Chapter
          </div>
          <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="font-mono text-xs text-primary font-black uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={14} /> NOUS RESEARCH CHAPTER // SALT LAKE CITY
              </div>
              <h3 className="text-3xl font-display font-black text-white uppercase tracking-tight">
                Empowering Everyone with Free AI
              </h3>
              <p className="text-white/60 font-light text-base leading-relaxed max-w-4xl">
                We focus heavily on the <span className="text-white font-semibold">Hermes Agent</span>, an amazing open-weight AI built by Nous Research. While professional enterprise scaling is supported via premium portal plans, the core model weights are fully open and accessible—ensuring everyone in our local community can run, fine-tune, and build with state-of-the-art models entirely on local, cost-effective hardware.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <a href="https://github.com/NousResearch" target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary text-black hover:bg-white font-black uppercase tracking-widest text-[9px] h-12 px-8 rounded-none transition-all group">
                  Explore Nous Models <ChevronRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Tab / Interactive Section */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Tabs Selector list */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              {AGENDA_PILLARS.map((pillar) => {
                const PillarIcon = pillar.icon;
                const isActive = pillar.id === activeTab;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => setActiveTab(pillar.id)}
                    className={`w-full text-left p-6 border transition-all duration-300 relative overflow-hidden group rounded-none flex items-center gap-6 ${
                      isActive
                        ? 'bg-white/5 border-primary/40 ring-1 ring-primary/10'
                        : 'bg-white/2 border-white/5 hover:bg-white/3 hover:border-white/10'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    )}
                    <div className={`w-12 h-12 border flex items-center justify-center transition-all ${
                      isActive ? 'border-primary/40 bg-primary/10 text-primary' : 'border-white/10 text-white/30 group-hover:border-white/20'
                    }`}>
                      <PillarIcon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono text-primary font-black uppercase tracking-wider">{pillar.number} // SECTION</span>
                        <span className="text-[10px] font-mono text-white/20 font-bold uppercase tracking-widest group-hover:text-white/40 transition-colors">Select</span>
                      </div>
                      <h4 className="text-lg font-display font-black text-white uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                        {pillar.title}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom info alert box */}
            <div className="p-6 bg-white/2 border border-white/5 text-white/40 font-mono text-[11px] leading-relaxed rounded-none space-y-2">
              <div className="flex items-center gap-2 text-white/60 font-bold">
                <HelpCircle size={14} className="text-primary" /> HOW WE GATHER
              </div>
              <p>
                Join us in Herriman every Wednesday. We cover friendly topics, skipping the confusion, to get you running and building with open-weight AI tools.
              </p>
            </div>
          </div>

          {/* Interactive Output / Detail Terminal Box */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex-1 bg-[#050506] border border-white/10 flex flex-col relative overflow-hidden rounded-none shadow-2xl shadow-black/80">
              
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0B0B0D]">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/35" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/35" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66]/20 border border-[#00FF66]/35" />
                  </div>
                  <Separator orientation="vertical" className="h-4 bg-white/10" />
                  <div className="flex items-center gap-1.5 text-white/40 text-[9px] font-mono uppercase tracking-[0.2em] font-black">
                    <Terminal size={10} className="text-primary" /> term :: nous-slc-node
                  </div>
                </div>
                <div className="text-[8px] font-mono text-white/20 font-bold uppercase tracking-widest">
                  Live Agent Console
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-8 font-mono text-sm leading-relaxed flex-1 space-y-8 select-none">
                
                {/* Simulated CLI Command */}
                <div className="space-y-2">
                  <div className="text-white/30 text-xs">slc-chapter@nous ~ %</div>
                  <div className="flex items-center gap-2 text-primary font-black text-sm">
                    $ <span className="text-white">{activePillar.terminalCommand}</span>
                  </div>
                </div>

                {/* Simulated Terminal Output */}
                <div className="space-y-2 text-xs md:text-sm">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePillar.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2.5 text-white/80"
                    >
                      {activePillar.terminalOutput.map((line, idx) => {
                        const isSuccess = line.startsWith('✔') || line.startsWith('🎉');
                        const isBullet = line.startsWith('  ├─') || line.startsWith('  └─');
                        return (
                          <div 
                            key={idx} 
                            className={`${isSuccess ? 'text-primary font-black' : isBullet ? 'text-white/40' : 'text-white/80'}`}
                          >
                            {line}
                          </div>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Pillar Specific Curricular Details */}
                <div className="pt-8 border-t border-white/5 space-y-4">
                  <div className="text-[10px] text-white/30 uppercase tracking-widest font-black flex items-center gap-2">
                    <ActiveIcon size={12} className="text-primary" /> What we cover
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.ul 
                      key={activePillar.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid md:grid-cols-2 gap-3"
                    >
                      {activePillar.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-[11px] md:text-xs text-white/60 leading-snug">
                          <span className="text-primary select-none mt-0.5">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </motion.ul>
                  </AnimatePresence>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Location Vibes & Host Guarantees */}
        <div className="mt-24 pt-20 border-t border-white/5 grid lg:grid-cols-2 gap-12 lg:gap-20 relative">
          
          {/* Column 1: Locations & Vibes */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-[0.4em]">
                <Compass size={12} className="text-primary" /> Our Gathering Spot
              </div>
              <h3 className="text-3xl font-display font-black text-white uppercase tracking-tight">
                Gather and Learn at GameHaven Herriman
              </h3>
              <p className="text-white/60 font-light leading-relaxed text-base">
                We meet weekly in Herriman to build and explore together. Join us for a friendly, supportive environment with plenty of table space, snacks, and collaborative learning.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="p-6 bg-white/2 border border-white/5 hover:border-primary/20 transition-all duration-300 relative group rounded-none">
                <div className="text-[10px] font-mono text-primary font-black uppercase tracking-widest mb-3 flex items-center justify-between">
                  <span>WEDNESDAY</span>
                  <span className="px-1.5 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[8px] font-bold">6:00 PM MST</span>
                </div>
                <h4 className="text-lg font-display font-black text-white uppercase tracking-tight mb-2">GameHaven Herriman</h4>
                <p className="text-white/40 text-[11px] font-light leading-relaxed">
                  A comfortable, fun board game and tabletop shop. Perfect for relaxed evening learning, snacks, friendly focus, and plenty of table space. Drop-ins welcome from 6:00 PM MST; concludes usually after ~2 hours but can run longer sometimes.
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Host William Spotlight */}
          <div className="relative p-8 md:p-10 bg-primary/[0.01] border border-white/10 hover:border-primary/30 transition-all duration-500 rounded-none flex flex-col justify-between overflow-hidden group">
            {/* Visual glow behind avatar info */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                {/* Custom geometric premium avatar representation */}
                <div className="w-16 h-16 border-2 border-primary bg-black flex items-center justify-center font-mono font-black text-2xl text-primary shrink-0 relative">
                  W
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary border-2 border-black" />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-primary font-black uppercase tracking-wider">SLC Chapter Host</div>
                  <h4 className="text-2xl font-display font-black text-white uppercase tracking-tight">William</h4>
                  <div className="text-[9px] text-white/40 font-mono uppercase tracking-widest">Nous Research Local Coordinator</div>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-primary">
                  Our Onboarding Promise
                </h5>
                <p className="text-white/60 font-light leading-relaxed text-sm">
                  William, the host of our Salt Lake City Chapter, makes setting up your AI companion simple and fun. He will help guide you step-by-step and make sure you feel confident on your learning journey.
                </p>
                
                <p className="text-white/40 text-[11px] font-light leading-relaxed">
                  William has helped people of all backgrounds get set up: from professional software developers and researchers to complete beginners who have never written code or are opening a terminal for the very first time on a brand-new computer. He is friendly, patient, has seen it all, and is excited to help you succeed!
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5 flex flex-wrap gap-2 items-center text-[10px] font-mono uppercase tracking-widest text-white/40">
              <span className="text-primary font-black">Guiding success for:</span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/60">Developers</span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/60">Researchers</span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/60">Absolute Beginners</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

// Simple Helper Divider
function Separator({ orientation, className }: { orientation: 'horizontal' | 'vertical'; className?: string }) {
  return (
    <div 
      className={`bg-white/10 ${orientation === 'vertical' ? 'w-px h-full' : 'h-px w-full'} ${className}`} 
    />
  );
}
