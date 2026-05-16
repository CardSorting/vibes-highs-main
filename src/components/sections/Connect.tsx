import { motion } from 'motion/react';
import { Mail, MessageSquare, Twitter, Github, ArrowUpRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function Connect() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const email = "willcruzdesigner@gmail.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    toast.success("Email copied to clipboard");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const channels = [
    {
      name: "Discord",
      handle: "The Collective Hub",
      url: "https://discord.gg/ua5UUXZTyz",
      icon: <MessageSquare className="size-5" />,
      description: "Join 500+ builders for real-time logic and vibes.",
      color: "hover:text-[#5865F2] hover:border-[#5865F2]/30"
    },
    {
      name: "Twitter / X",
      handle: "@goldeneggie",
      url: "https://x.com/goldeneggie",
      icon: <Twitter className="size-5" />,
      description: "Daily updates on the weird side of the internet.",
      color: "hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30"
    },
    {
      name: "GitHub",
      handle: "cardsorting",
      url: "https://github.com/cardsorting",
      icon: <Github className="size-5" />,
      description: "Explore the codebase and our open-source experiments.",
      color: "hover:text-[#F0F0F0] hover:border-white/30"
    }
  ];

  return (
    <section id="contact" className="relative py-48 px-6 bg-[#0A0A0B] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-20">
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-[0.4em] font-black">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Connectivity :: Uplink
              </div>
              <h2 className="font-display font-black text-6xl md:text-8xl tracking-tighter leading-[0.85] uppercase">
                Let's<br/>
                <span className="font-serif italic font-light text-white/40 lowercase">talk.</span>
              </h2>
              <p className="text-white/60 text-xl font-light leading-relaxed max-w-md">
                Whether you have a weird project to demo, a question about the collective, or just want to say hi—we're always listening.
              </p>
            </div>

            <div className="p-8 bg-white/3 border border-white/10 space-y-6 group hover:bg-white/5 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white/40">
                  <Mail size={18} />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Direct Email</span>
                </div>
                <button 
                  onClick={copyEmail}
                  className="p-2 hover:bg-white/10 transition-colors text-white/40 hover:text-primary"
                >
                  {copiedEmail ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <div className="space-y-2">
                <a 
                  href={`mailto:${email}`}
                  className="text-2xl md:text-3xl font-display font-black text-white hover:text-primary transition-colors tracking-tighter break-all"
                >
                  {email}
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid gap-4">
            {channels.map((channel, idx) => (
              <motion.a
                key={channel.name}
                href={channel.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`group relative flex flex-col md:flex-row md:items-center justify-between p-8 md:p-10 bg-white/2 border border-white/5 ${channel.color} transition-all duration-500 overflow-hidden`}
              >
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-14 h-14 flex items-center justify-center bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                    {channel.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">
                      {channel.name}
                    </div>
                    <div className="text-2xl md:text-3xl font-display font-black text-white tracking-tighter uppercase">
                      {channel.handle}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0 md:max-w-[200px] text-[11px] font-light text-white/40 leading-relaxed group-hover:text-white/70 transition-colors relative z-10">
                  {channel.description}
                </div>

                <div className="absolute right-6 top-6 md:top-auto opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <ArrowUpRight size={24} className="text-primary" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
