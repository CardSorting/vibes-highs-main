/**
 * [LAYER: UI]
 */
import { motion } from 'motion/react';
import { ChevronRight, Activity, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { EventState } from '@/hooks/use-vibes';

import { GlitchText } from '@/components/GlitchText';

interface HeroProps {
  nextUpEvent: {
    name: string;
    state: EventState | null;
  };
}

export function Hero({ nextUpEvent }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-32 overflow-hidden border-b border-white/5">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=3540&auto=format&fit=crop" 
          alt="Vibes & Highs creative collective meetup in Salt Lake City" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-[#0A0A0B] bg-size-[40px_40px] opacity-90"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[40px_40px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-8 space-y-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
              <div className="h-px w-8 bg-primary"></div>
              <span className="text-[10px] uppercase font-mono tracking-[0.6em] text-primary font-bold">VIBES &AMP; HIGHS // COMMUNITY_LAB</span>
            </motion.div>
            
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }} 
                className="font-display font-black text-7xl md:text-9xl leading-[0.8] tracking-tighter uppercase"
              >
                BUILD<br/>
                <span className="font-serif italic font-light text-primary pr-4 lowercase">
                  <GlitchText text="Weird" />
                </span> THINGS.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.2 }} 
                className="text-white/60 text-xl md:text-2xl font-light leading-snug max-w-2xl"
              >
                A friendly, non-transactional meetup for people making weird internet projects, creative code, and latent space explorations.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }} 
              className="flex flex-wrap gap-4"
            >
              <a href="https://discord.gg/ua5UUXZTyz" target="_blank" rel="noreferrer">
                <Button className="bg-primary text-black hover:bg-white font-black uppercase tracking-widest text-[10px] h-16 px-10 rounded-none transition-all group">
                  Join Community <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <Link to="/editorial">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest text-[10px] h-16 px-10 rounded-none">
                  Read Editorial
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.4 }} 
            className="lg:col-span-4"
          >
            <div className="bg-white/2 border border-white/10 p-10 backdrop-blur-xl relative group">
              <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
                <Activity size={24} className="text-primary animate-pulse" />
              </div>
              <div className="text-[10px] uppercase font-mono tracking-[0.3em] text-white/30 font-bold mb-8">Upcoming :: Session</div>
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-display font-black text-white tracking-tighter leading-none mb-2 uppercase">
                    {nextUpEvent.name.split(' @ ')[0]}
                  </h3>
                  <div className="text-primary font-mono text-[10px] uppercase tracking-widest font-black">
                    @{nextUpEvent.name.split(' @ ')[1]}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <MapPin size={16} className="text-primary" />
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase">GameHaven Herriman</span>
                </div>
                <div className="pt-8 border-t border-white/5">
                  {renderCompactCountdown(nextUpEvent.state)}
                </div>
                <a href="#schedule" className="block pt-4">
                  <Button variant="link" className="p-0 text-[10px] uppercase font-black text-primary hover:text-white tracking-[0.3em] h-auto">
                    &gt; SEE_FULL_SCHEDULE
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function renderCompactCountdown(state: EventState | null) {
  if (!state || state.isHappeningNow) return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-widest animate-pulse">
      <Activity size={10} /> We're Gathered Now
    </div>
  );
  if (!state.timeLeft) return null;
  const { timeLeft } = state;
  return (
    <div className="flex gap-4 font-mono">
      <div className="flex flex-col">
        <span className="text-2xl font-black text-white leading-none">{timeLeft.days.toString().padStart(2, '0')}</span>
        <span className="text-[8px] text-white/40 uppercase tracking-widest font-bold">Days</span>
      </div>
      <div className="text-xl text-white/20 mt-1">:</div>
      <div className="flex flex-col">
        <span className="text-2xl font-black text-white leading-none">{timeLeft.hours.toString().padStart(2, '0')}</span>
        <span className="text-[8px] text-white/40 uppercase tracking-widest font-bold">Hrs</span>
      </div>
      <div className="text-xl text-white/20 mt-1">:</div>
      <div className="flex flex-col">
        <span className="text-2xl font-black text-white leading-none">{timeLeft.minutes.toString().padStart(2, '0')}</span>
        <span className="text-[8px] text-white/40 uppercase tracking-widest font-bold">Min</span>
      </div>
    </div>
  );
}
