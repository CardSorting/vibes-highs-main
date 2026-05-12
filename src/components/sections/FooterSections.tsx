import { Button } from '@/components/ui/button';

export function FAQ() {
  return (
    <section id="faq" className="py-32 border-b border-white/5 bg-black/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <div className="text-[10px] font-mono text-primary font-black uppercase tracking-[0.4em] mb-6">Curious?</div>
          <h2 className="font-display font-black text-6xl md:text-8xl tracking-tighter uppercase mb-6">Common<br/><span className="font-serif italic font-light text-white/40 lowercase">Questions.</span></h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-8 bg-white/2 border border-white/5 space-y-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">What is "Weird"?</h3>
            <p className="text-white/50 font-light leading-relaxed text-sm">Anything that doesn't have a clear commercial intent yet. Experiments, art, niche tools, or just exploring a new library. We like the unconventional.</p>
          </div>
          <div className="p-8 bg-white/2 border border-white/5 space-y-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Who can join?</h3>
            <p className="text-white/50 font-light leading-relaxed text-sm">Anyone who wants to build. We have high-school students, retired engineers, professional artists, and curious beginners.</p>
          </div>
          <div className="p-8 bg-white/2 border border-white/5 space-y-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">What do I bring?</h3>
            <p className="text-white/50 font-light leading-relaxed text-sm">Your laptop, your sketchbook, or just yourself. We are demo-first, so if you have something to show, bring it.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GlobalCTA() {
  return (
    <section className="relative py-48 px-6 bg-black overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#primary20,transparent_70%)] animate-pulse"></div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-none text-[10px] font-mono text-primary font-black uppercase tracking-[0.4em]">
           Community_Open // v1.0
        </div>
        <h2 className="font-display font-black text-6xl md:text-9xl tracking-tighter leading-[0.8] text-white uppercase">
          BUILD THE<br/>
          <span className="font-serif italic font-light text-primary pr-4 lowercase">Weird</span> WEB.
        </h2>
        <p className="text-white/60 text-xl font-light leading-relaxed max-w-2xl mx-auto">
          Ready to demo? Or just want to hang out in a high-output environment? Join the collective and let's make something cool together.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <a href="https://discord.gg/ua5UUXZTyz" target="_blank" rel="noreferrer">
            <Button className="bg-white text-black hover:bg-primary font-black uppercase tracking-widest text-[11px] h-20 px-16 rounded-none transition-all">
              Join the Group
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
