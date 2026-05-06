import { motion } from 'motion/react';
import { ExternalLink, ShieldCheck, Zap, Globe, Cpu, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { partners, Partner } from '../data/partners';

export default function Partners() {
  return (
    <div className="pt-24 min-h-screen bg-[#0A0A0B]">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        {/* Header Section */}
        <div className="text-center mb-32 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.6em] text-primary font-bold mb-6"
          >
            SYSTEM_ALLIES / PARTNERSHIPS
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-6xl md:text-9xl tracking-tighter leading-none mb-12"
          >
            POWERED<br />
            <span className="font-serif italic font-light text-white/50">By Vision.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-xl font-light max-w-2xl mx-auto leading-relaxed"
          >
            We are built on the foundations provided by those who believe in the power of weird projects and community-driven output.
          </motion.p>
        </div>

        {/* Titan Tiers */}
        <div className="space-y-32">
          <section>
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px flex-1 bg-white/10"></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <Zap size={14} /> TITAN_TIER
              </div>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {partners.filter(p => p.tier === 'TITAN').map((partner, idx) => (
                <PartnerCard key={partner.id} partner={partner} delay={idx * 0.1} />
              ))}
            </div>
          </section>

          {/* Platinum Tiers */}
          <section>
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px flex-1 bg-white/10"></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                <ShieldCheck size={14} /> PLATINUM_ALLIES
              </div>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {partners.filter(p => p.tier === 'PLATINUM').map((partner, idx) => (
                <PartnerCard key={partner.id} partner={partner} delay={idx * 0.1} />
              ))}
            </div>
          </section>
        </div>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-48 border border-white/10 bg-white/5 p-12 md:p-24 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Cpu size={200} className="text-primary" />
          </div>
          <div className="relative z-10">
            <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter mb-8 leading-none">
              SUPPORT THE<br />
              <span className="font-serif italic font-light text-white/50">Collective.</span>
            </h2>
            <p className="text-white/60 text-lg max-w-lg mx-auto mb-12">
              Want to help us keep the servers running and the coffee brewing? We're always looking for partners who vibe with our mission.
            </p>
            <a href="mailto:willcruzdesigner@gmail.com">
              <Button className="bg-white text-black hover:bg-primary font-bold uppercase tracking-widest text-[10px] h-16 px-12 transition-colors">
                Become a Sponsor
              </Button>
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

function PartnerCard({ partner, delay }: { key?: string; partner: Partner; delay: number }) {
  return (
    <motion.a
      href={partner.link}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group relative block bg-white/5 border border-white/10 p-12 hover:border-primary/50 transition-all duration-500 overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink size={20} className="text-primary" />
      </div>
      
      <div className="space-y-8">
        <div className="h-16 flex items-center">
          {/* Logo Placeholder / Name Display */}
          <div className="text-3xl font-black tracking-tighter group-hover:text-primary transition-colors flex items-center gap-3">
             {partner.name === 'Modal' && <Zap size={24} className="text-primary" />}
             {partner.name === 'Cloudflare' && <Globe size={24} className="text-primary" />}
             {partner.name === 'NousResearch' && <Cpu size={24} className="text-primary" />}
             {partner.name === 'Google' && <ShieldCheck size={24} className="text-primary" />}
             {partner.name === 'Silicon Slopes' && <School size={24} className="text-primary" />}
             {partner.name.toUpperCase()}
          </div>
        </div>
        
        <p className="text-white/50 text-lg font-light leading-relaxed max-w-md">
          {partner.description}
        </p>
        
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 group-hover:text-primary transition-colors">
          &gt; CONNECT_ESTABLISHED
        </div>
      </div>

      {/* Decorative corner */}
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary/0 border-r border-b border-primary/0 group-hover:bg-primary/5 group-hover:border-primary/50 transition-all duration-500"></div>
    </motion.a>
  );
}
