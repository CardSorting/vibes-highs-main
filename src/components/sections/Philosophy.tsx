import { motion } from 'motion/react';
import { Sparkles, Terminal } from 'lucide-react';

export function Philosophy() {
  return (
    <section id="about" className="relative py-48 px-6 border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-24 items-start">
          <div className="lg:col-span-7 space-y-24">
            <div>
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-[0.4em] mb-8">
                <Sparkles size={12} /> The Philosophy
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display font-black text-6xl md:text-9xl tracking-tighter leading-[0.8] mb-12 uppercase">
                CASUAL BY<br /> <span className="font-serif italic font-light text-white/40 lowercase">Default.</span>
              </motion.h2>
              <p className="text-white/50 text-xl font-light leading-relaxed max-w-2xl">
                We champion a non-transactional community where the only metric that matters is the quality of the output. No networking events, just builders building.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-1">
              <div className="p-12 bg-white/2 border border-white/5 space-y-6 group hover:bg-white/4 transition-colors">
                <div className="text-4xl font-serif italic text-primary">Vibes</div>
                <p className="text-white/60 font-light leading-relaxed text-lg">
                  The low-pressure environment where we talk about art, music, and ideas. No agenda, no pitch decks, just internet-energy IRL.
                </p>
              </div>
              <div className="p-12 bg-white/2 border border-white/5 space-y-6 group hover:bg-white/4 transition-colors">
                <div className="text-4xl font-serif italic text-primary">Highs</div>
                <p className="text-white/60 font-light leading-relaxed text-lg">
                  The excitement of the demo. The rush of seeing a weird project finally work. The peak of spontaneous collaboration.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 sticky top-32">
             <div className="space-y-1">
                <div className="bg-primary p-12 text-black">
                   <div className="text-[10px] font-mono font-black uppercase tracking-[0.4em] mb-12 opacity-40">System_Metrics // Output_v1</div>
                   <div className="space-y-8">
                      <div>
                         <div className="text-7xl font-display font-black tracking-tighter leading-none">0%</div>
                         <div className="text-xs uppercase font-black tracking-widest opacity-60">Startup Theater</div>
                      </div>
                      <div className="h-px bg-black/10" />
                      <div>
                         <div className="text-7xl font-display font-black tracking-tighter leading-none">100%</div>
                         <div className="text-xs uppercase font-black tracking-widest opacity-60">Pure Output</div>
                      </div>
                   </div>
                </div>
                <div className="bg-white/2 border border-white/5 p-12 overflow-hidden relative group">
                   <div className="relative z-10">
                      <div className="text-4xl font-display font-black text-white tracking-tighter leading-none mb-4 uppercase">Bring<br/>Laptops.</div>
                      <p className="text-white/40 text-sm font-light">We are build-first. Show up ready to demo or start a new side quest.</p>
                   </div>
                   <Terminal className="absolute -bottom-10 -right-10 text-white/5 size-48 group-hover:scale-110 transition-transform duration-1000" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
