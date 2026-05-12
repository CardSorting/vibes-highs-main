import { motion } from 'motion/react';
import { Sparkles, Terminal, Laptop, Coffee, Rocket } from 'lucide-react';

export function Philosophy() {
  return (
    <section id="about" className="relative py-48 px-6 border-b border-white/5 overflow-hidden">
      {/* Soft background aura for approachability */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-7 space-y-16 md:space-y-24">
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-[0.4em]"
              >
                <Sparkles size={12} className="animate-pulse" /> The Collective Intent
              </motion.div>
              
              <div className="space-y-12">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.1 }} 
                  className="font-display font-black text-6xl md:text-9xl tracking-tighter leading-[0.85] uppercase"
                >
                  COME AS YOU<br /> 
                  <span className="font-serif italic font-light text-white/30 lowercase">Are.</span>
                </motion.h2>
                
                <p className="text-white/70 text-xl md:text-2xl font-light leading-relaxed max-w-2xl font-sans">
                  We’re a home for <span className="text-white font-medium italic">pure creativity</span>—a sanctuary from the pitch decks and networking events. No transactions, no pressure, just builders making cool stuff together.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-10 bg-white/[0.03] border border-white/10 space-y-6 group hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <Coffee size={120} />
                </div>
                <div className="text-4xl font-serif italic text-primary flex items-center gap-3">
                  Vibes
                </div>
                <p className="text-white/60 font-light leading-relaxed text-lg relative z-10">
                  A low-pressure space to talk about art, music, and the weird corners of the web. No agendas—just good energy and great conversations.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="p-10 bg-white/[0.03] border border-white/10 space-y-6 group hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <Rocket size={120} />
                </div>
                <div className="text-4xl font-serif italic text-primary">Highs</div>
                <p className="text-white/60 font-light leading-relaxed text-lg relative z-10">
                  The magic of the breakthrough. That feeling when a side project finally clicks, and the rush of showing it to people who get it.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-32">
             <div className="space-y-6">
                <div className="bg-primary/90 p-10 md:p-12 text-black shadow-2xl shadow-primary/10 relative overflow-hidden group">
                   {/* Decorative circle */}
                   <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-black/5 rounded-full" />
                   
                   <div className="text-[10px] font-mono font-black uppercase tracking-[0.4em] mb-12 opacity-40">Substrate_Pulse // v1.0</div>
                   <div className="space-y-10 relative z-10">
                      <div className="group/metric">
                         <div className="text-7xl md:text-8xl font-display font-black tracking-tighter leading-none group-hover/metric:translate-x-2 transition-transform">0%</div>
                         <div className="text-[10px] uppercase font-black tracking-[0.2em] opacity-60">Performance Theater</div>
                      </div>
                      <div className="h-px bg-black/10 w-full" />
                      <div className="group/metric">
                         <div className="text-7xl md:text-8xl font-display font-black tracking-tighter leading-none group-hover/metric:translate-x-2 transition-transform">100%</div>
                         <div className="text-[10px] uppercase font-black tracking-[0.2em] opacity-60">Creative Heart</div>
                      </div>
                   </div>
                </div>

                <div className="bg-white/[0.03] border border-white/10 p-10 md:p-12 overflow-hidden relative group hover:bg-white/[0.05] hover:border-primary/20 transition-all">
                   <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-3 text-primary mb-2">
                        <Laptop size={20} />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Protocol :: Participation</span>
                      </div>
                      <div className="text-4xl font-display font-black text-white tracking-tighter leading-none uppercase">
                        Bring your<br/>Side Quests.
                      </div>
                      <p className="text-white/40 text-base font-light leading-relaxed">
                        We’re build-first by nature. Come ready to demo a weird idea or start a new experiment with the group.
                      </p>
                   </div>
                   <Terminal className="absolute -bottom-10 -right-10 text-white/5 size-48 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-1000" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
