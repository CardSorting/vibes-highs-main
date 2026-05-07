import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from './components/SEO';
import { 
  Terminal, MapPin, Mail, Twitter, Linkedin, Send, Clock, Users, 
  CalendarPlus, Share2, AlertTriangle, ArrowUpRight, Activity, 
  Sparkles, Zap, Globe, Cpu, ShieldCheck, School, Layers, ChevronRight, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { partners } from './data/partners';

type TimeLeft = { days: number, hours: number, minutes: number, seconds: number };
type EventState = { isHappeningNow: boolean; isNext: boolean; timeLeft: TimeLeft | null };

export default function App() {
  const [wedState, setWedState] = useState<EventState | null>(null);
  const [friState, setFriState] = useState<EventState | null>(null);
  const [isWednesdayToday, setIsWednesdayToday] = useState(false);
  const [isFridayToday, setIsFridayToday] = useState(false);

  // RSVP State
  const [rsvps, setRsvps] = useState<{wed: number, fri: number}>({ wed: 12, fri: 8 });
  const [hasRsvpd, setHasRsvpd] = useState<{wed: boolean, fri: boolean}>({ wed: false, fri: false });

  useEffect(() => {
    const savedRsvps = localStorage.getItem('vibes-rsvps');
    const savedHasRsvpd = localStorage.getItem('vibes-has-rsvpd');
    if (savedRsvps) setRsvps(JSON.parse(savedRsvps));
    if (savedHasRsvpd) setHasRsvpd(JSON.parse(savedHasRsvpd));
  }, []);

  const handleRsvp = (event: 'wed' | 'fri') => {
    if (hasRsvpd[event]) return;
    const newRsvps = { ...rsvps, [event]: rsvps[event] + 1 };
    const newHasRsvpd = { ...hasRsvpd, [event]: true };
    setRsvps(newRsvps);
    setHasRsvpd(newHasRsvpd);
    localStorage.setItem('vibes-rsvps', JSON.stringify(newRsvps));
    localStorage.setItem('vibes-has-rsvpd', JSON.stringify(newHasRsvpd));
    toast.success("RSVP Confirmed! ✨", { description: `See you on ${event === 'wed' ? 'Wednesday' : 'Friday'}.` });
  };

  const handleCalendar = (type: 'wed' | 'fri') => {
    const text = type === 'wed' ? "GameHaven Herriman" : "WoodBine game night";
    const dates = type === 'wed' ? "20240508T160000/20240508T200000" : "20240510T160000/20240510T180000";
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(text)}&dates=${dates}&ctz=America/Denver&recur=${encodeURIComponent(`RRULE:FREQ=WEEKLY;BYDAY=${type === 'wed' ? 'WE' : 'FR'}`)}&location=${encodeURIComponent(type === 'wed' ? "5254 Anthem Peak Ln, Herriman, UT 84096" : "545 West 700 S, Salt Lake City, UT 84101")}`;
    window.open(url, '_blank');
  };

  const handleShare = async (type: 'wed' | 'fri') => {
    const text = type === 'wed' ? "Join the next Wednesday session at GameHaven Herriman! ⚡️" : "Join the next Friday session at WoodBine in SLC! ⚡️";
    if (navigator.share) {
      try { await navigator.share({ title: 'VIBES & HIGHS', text, url: window.location.href }); } catch (err) { console.error(err); }
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
    }
  };

  useEffect(() => {
    const computeEventState = (mtDate: Date, targetDayOfWeek: number, startHour: number, endHour: number) => {
      const mtHour = mtDate.getHours();
      const currentDayOfWeek = mtDate.getDay();
      let targetDayOffset = 0;
      let isHappeningNow = false;

      if (currentDayOfWeek === targetDayOfWeek) {
        if (mtHour >= startHour && mtHour < endHour) { isHappeningNow = true; targetDayOffset = 0; }
        else if (mtHour < startHour) targetDayOffset = 0;
        else targetDayOffset = 7;
      } else {
        targetDayOffset = targetDayOfWeek - currentDayOfWeek;
        if (targetDayOffset < 0) targetDayOffset += 7;
      }

      const targetMtDate = new Date(mtDate.getFullYear(), mtDate.getMonth(), mtDate.getDate() + targetDayOffset, startHour, 0, 0);
      const diffMs = targetMtDate.getTime() - mtDate.getTime();
      let timeLeft = null;
      if (diffMs > 0 && !isHappeningNow) {
        timeLeft = {
          days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diffMs / 1000 / 60) % 60),
          seconds: Math.floor((diffMs / 1000) % 60)
        };
      }
      return { isHappeningNow, diffMs: isHappeningNow ? 0 : diffMs, timeLeft };
    };

    const calculateTimeLeft = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Denver', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' });
      const parts = formatter.formatToParts(now);
      const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
      const mtDate = new Date(getPart('year'), getPart('month') - 1, getPart('day'), getPart('hour'), getPart('minute'), getPart('second'));
      
      setIsWednesdayToday(mtDate.getDay() === 3);
      setIsFridayToday(mtDate.getDay() === 5);
      
      const wedInfo = computeEventState(mtDate, 3, 16, 20);
      const friInfo = computeEventState(mtDate, 5, 16, 18);
      const isWedNext = wedInfo.isHappeningNow || (!friInfo.isHappeningNow && wedInfo.diffMs < friInfo.diffMs);
      
      setWedState({ isHappeningNow: wedInfo.isHappeningNow, isNext: isWedNext, timeLeft: wedInfo.timeLeft });
      setFriState({ isHappeningNow: friInfo.isHappeningNow, isNext: !isWedNext, timeLeft: friInfo.timeLeft });
    };
    
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const nextUpEvent = wedState?.isNext ? { name: 'Wednesday @ Herriman', state: wedState } : { name: 'Friday @ SLC', state: friState };

  return (
    <div className="selection:bg-primary selection:text-black">
      <SEO 
        title="Build Weird Things" 
        description="A casual, non-transactional meetup for people making weird internet projects, creative code, and AI explorations in Salt Lake City."
      />
      {/* Background Graphic Watermark */}
      <div className="fixed top-0 right-0 w-1/3 h-screen border-l border-white/5 pointer-events-none z-0 hidden lg:flex items-center justify-center">
        <span className="rotate-90 text-[140px] font-black text-white/2 tracking-tighter select-none whitespace-nowrap">CREATIVE_LAB // SYSTEM_01</span>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 pt-32 overflow-hidden">
        {/* Background Graphic */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=3540&auto=format&fit=crop" alt="" className="w-full h-full object-cover blur-sm" />
          <div className="absolute inset-0 bg-[#0A0A0B] bg-size-[40px_40px] opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #808080 1px, transparent 1px)' }}></div>
          <div className="absolute inset-0 bg-linear-to-t from-[#0A0A0B] via-[#0A0A0B]/90 to-transparent"></div>
          <div className="absolute inset-0 bg-linear-to-r from-[#0A0A0B] via-transparent to-[#0A0A0B]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="flex-1 space-y-8">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                <div className="h-px w-8 bg-primary"></div>
                <span className="text-[10px] uppercase tracking-[0.6em] text-primary font-bold">VIBES &AMP; HIGHS // COMMUNITY_LAB</span>
              </motion.div>
              
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display font-black text-[15vw] sm:text-[10vw] md:text-[9.5rem] leading-[0.8] tracking-tighter">
                BUILD<br/>
                <span className="font-serif italic font-light pr-4 text-primary">Weird</span> THINGS.
              </motion.h1>
              
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/60 text-xl md:text-3xl font-light leading-snug max-w-2xl">
                A casual, non-transactional meetup for people making weird internet projects, creative code, and latent space explorations.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-4 pt-4">
                <a href="https://discord.gg/ua5UUXZTyz" target="_blank" rel="noreferrer">
                  <Button className="bg-white text-black hover:bg-primary font-bold uppercase tracking-widest text-[10px] h-14 px-10 transition-all group">
                    Join the Discord <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
                <Link to="/editorial">
                  <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 font-bold uppercase tracking-widest text-[10px] h-14 px-10">
                    Explore Editorial
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Next Session Quick Nav */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="shrink-0 w-full lg:w-96">
              <div className="bg-white/5 border border-white/10 p-8 backdrop-blur-xl relative group">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                  <Activity size={24} className="text-primary animate-pulse" />
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-6 flex items-center gap-2">
                  <Clock size={12} /> Upcoming Session
                </div>
                <div className="space-y-6">
                  <h3 className="text-2xl font-display font-black text-white tracking-tighter leading-none">
                    {nextUpEvent.name.toUpperCase()}
                  </h3>
                  <div className="flex items-center gap-3 text-primary">
                    <MapPin size={16} />
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase">{nextUpEvent.name.includes('Herriman') ? 'GameHaven Herriman' : 'WoodBine SLC'}</span>
                  </div>
                  {renderCompactCountdown(nextUpEvent.state)}
                  <a href="#schedule" className="block pt-4 border-t border-white/5">
                    <Button variant="link" className="p-0 text-[10px] uppercase font-black text-white/40 hover:text-primary tracking-[0.3em]">
                      &gt; VIEW_DETAILS
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Ecosystem Strip - Trust & Industry Standards */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden border-t border-white/5 bg-black/40 backdrop-blur-md py-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 whitespace-nowrap">Supported by the Ecosystem:</div>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-12 opacity-40 hover:opacity-100 transition-opacity duration-700">
               {partners.map(p => (
                 <Link key={p.id} to="/partners" className="group flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
                    {p.name === 'Modal' && <Zap size={14} className="text-primary" />}
                    {p.name === 'Cloudflare' && <Globe size={14} className="text-primary" />}
                    {p.name === 'NousResearch' && <Cpu size={14} className="text-primary" />}
                    {p.name === 'Google' && <ShieldCheck size={14} className="text-primary" />}
                    {p.name === 'Silicon Slopes' && <School size={14} className="text-primary" />}
                    <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-primary transition-colors">{p.name}</span>
                 </Link>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Vision Section - Explain Vibes vs Highs */}
      <section id="about" className="relative py-48 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-[0.4em] mb-6">
                <Sparkles size={12} /> The Philosophy
              </div>
              <h2 className="font-display font-black text-6xl md:text-8xl tracking-tighter leading-none mb-8">
                CASUAL BY<br /> <span className="font-serif italic font-light text-white/40">Default.</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 p-8 bg-white/2 border border-white/5 relative group">
                <div className="text-4xl font-serif italic text-primary opacity-40 group-hover:opacity-100 transition-opacity">Vibes</div>
                <p className="text-white/60 font-light leading-relaxed">
                  The low-pressure environment where we talk about art, music, and ideas. No agenda, no pitch decks, just internet-energy IRL.
                </p>
                <div className="absolute top-0 right-0 p-4">
                  <Activity size={16} className="text-white/10" />
                </div>
              </div>
              <div className="space-y-4 p-8 bg-white/2 border border-white/5 relative group">
                <div className="text-4xl font-serif italic text-primary opacity-40 group-hover:opacity-100 transition-opacity">Highs</div>
                <p className="text-white/60 font-light leading-relaxed">
                  The excitement of the demo. The rush of seeing a weird project finally work (or crash perfectly). The peak of spontaneous collaboration.
                </p>
                <div className="absolute top-0 right-0 p-4">
                  <Zap size={16} className="text-white/10" />
                </div>
              </div>
            </div>
            
            <div className="pt-8 flex items-center gap-8 border-t border-white/5">
              <div>
                <div className="text-2xl font-display font-black text-white tracking-tighter leading-none mb-1">OPEN</div>
                <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold">To Everyone</div>
              </div>
              <Separator orientation="vertical" className="h-10 bg-white/10" />
              <div>
                <div className="text-2xl font-display font-black text-white tracking-tighter leading-none mb-1">0%</div>
                <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Startup Theater</div>
              </div>
              <Separator orientation="vertical" className="h-10 bg-white/10" />
              <div>
                <div className="text-2xl font-display font-black text-white tracking-tighter leading-none mb-1">100%</div>
                <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Pure Output</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-white/5 border border-white/10 p-1">
              <img 
                src="https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=3540&auto=format&fit=crop" 
                alt="Creative Workspace" 
                className="w-full h-full object-cover grayscale-[0.8] hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            {/* Floating Detail */}
            <div className="absolute -bottom-12 -left-12 bg-primary p-8 hidden md:block group hover:rotate-2 transition-transform duration-500">
               <div className="text-black font-display font-black text-4xl tracking-tighter leading-none mb-4 uppercase">
                 Bring<br/>Laptops.
               </div>
               <div className="text-black/60 text-[10px] font-mono font-black uppercase tracking-widest leading-none">
                 &gt; COFFEE_CONNECTED
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section - Industry Standard Directory Style */}
      <section id="schedule" className="relative py-32 bg-[#0A0A0B] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <div className="text-[10px] font-mono text-primary font-black uppercase tracking-[0.4em] mb-6">Weekly Operations</div>
              <h2 className="font-display font-black text-5xl md:text-8xl tracking-tighter leading-none mb-6">THE<br/><span className="font-serif italic font-light text-white/40">Schedule.</span></h2>
              <p className="text-white/60 text-lg font-light">We run two recurring sessions every week in the Salt Lake Valley. Each location offers a different vibe but the same commitment to creative output.</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="border-white/10 text-white/40 hover:text-white hover:bg-white/5 uppercase tracking-widest font-bold text-[10px] h-12 px-6">
                Download iCal
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <SessionRow 
              day="Wednesday" 
              time="4 PM — 8 PM" 
              location="GameHaven Herriman" 
              address="5254 Anthem Peak Ln, Herriman, UT 84096"
              state={wedState}
              isToday={isWednesdayToday}
              onRsvp={() => handleRsvp('wed')}
              onCalendar={() => handleCalendar('wed')}
              onShare={() => handleShare('wed')}
              attending={rsvps.wed}
              hasRsvpd={hasRsvpd.wed}
              mapUrl="https://maps.google.com/maps?q=5254%20Anthem%20Peak%20Ln,%20Herriman,%20UT%2084096&t=m&z=13&ie=UTF8&iwloc=&output=embed"
            />
            <SessionRow 
              day="Friday" 
              time="4 PM — 6 PM" 
              location="WoodBine SLC" 
              address="545 West 700 S, Salt Lake City, UT 84101"
              state={friState}
              isToday={isFridayToday}
              onRsvp={() => handleRsvp('fri')}
              onCalendar={() => handleCalendar('fri')}
              onShare={() => handleShare('fri')}
              attending={rsvps.fri}
              hasRsvpd={hasRsvpd.fri}
              mapUrl="https://maps.google.com/maps?q=545%20West%20700%20S,%20Salt%20Lake%20City,%20UT%2084101&t=m&z=14&ie=UTF8&iwloc=&output=embed"
            />
          </div>

          {/* Experimental Notice Integration */}
          <ExperimentalNotice />
        </div>
      </section>

      {/* Join the Discord / Call to Action */}
      <section id="location" className="relative py-48 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10">
           <Layers size={400} className="text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-12">
          <h2 className="font-display font-black text-6xl md:text-9xl tracking-tighter leading-none text-white uppercase">
            ENTER THE<br/><span className="font-serif italic font-light text-primary">Collective.</span>
          </h2>
          <p className="text-white/60 text-xl md:text-2xl font-light leading-relaxed max-w-2xl mx-auto">
            Our Discord is where the latent space becomes reality. Find the latest updates, share your weirdest projects, and connect with other builders.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="https://discord.gg/ua5UUXZTyz" target="_blank" rel="noreferrer">
              <Button className="bg-primary text-black hover:bg-white font-bold uppercase tracking-[0.2em] text-[11px] h-16 px-12 transition-all">
                Join our Discord Server
              </Button>
            </a>
            <div className="flex items-center gap-4 text-white/40 text-[10px] font-mono uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              450+ Builders Active
            </div>
          </div>
        </div>
      </section>

      {/* Reimagined Contact Section */}
      <section id="contact" className="relative py-32 px-6 bg-white/2 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-32">
          <div className="space-y-12">
            <div>
              <div className="text-[10px] font-mono text-primary font-black uppercase tracking-[0.4em] mb-6">Communication Bridge</div>
              <h2 className="font-display font-black text-5xl md:text-7xl tracking-tighter leading-none mb-8">GET IN<br/><span className="font-serif italic font-light text-white/40">Touch.</span></h2>
              <p className="text-white/60 text-lg font-light leading-relaxed">Whether you have questions about the meetup, want to sponsor the collective, or have a weird idea to share, our doors are open.</p>
            </div>
            
            <div className="space-y-4">
              <ContactLink icon={<Mail size={18}/>} label="Email" value="willcruzdesigner@gmail.com" href="mailto:willcruzdesigner@gmail.com" />
              <ContactLink icon={<Twitter size={18}/>} label="X (Twitter)" value="@goldeneggie" href="https://x.com/goldeneggie" />
              <ContactLink icon={<MessageSquare size={18}/>} label="Discord" value="Vibes & Highs Server" href="https://discord.gg/ua5UUXZTyz" />
            </div>
          </div>

          <div className="bg-[#0A0A0B] border border-white/10 p-10 relative">
             <div className="absolute top-0 right-0 p-8 text-primary/10 select-none">
               <ArrowUpRight size={100} />
             </div>
             <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}

function renderCompactCountdown(state: EventState | null) {
  if (!state || state.isHappeningNow) return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-widest animate-pulse">
      <Activity size={10} /> Active Deployment Now
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

function SessionRow({ day, time, location, address, state, isToday, onRsvp, onCalendar, onShare, attending, hasRsvpd, mapUrl }: any) {
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <div className={`group relative border border-white/5 bg-white/2 transition-all duration-500 hover:bg-white/4 overflow-hidden ${state?.isNext ? 'border-primary/30 ring-1 ring-primary/10' : ''}`}>
      <div className="flex flex-col lg:flex-row items-stretch gap-px">
        {/* Main Info */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col md:flex-row gap-12 items-start md:items-center">
          <div className="shrink-0 w-32">
             <div className="text-[10px] font-mono text-primary font-black uppercase tracking-[0.4em] mb-2">{day}</div>
             <div className="text-3xl font-display font-black text-white uppercase tracking-tighter">{time.split(' — ')[0]}</div>
             <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Weekly Session</div>
          </div>
          
          <Separator orientation="vertical" className="h-16 hidden md:block bg-white/10" />
          
          <div className="flex-1 space-y-4">
             <div className="flex items-center gap-3">
                <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">{location}</h3>
                {state?.isNext && (
                  <span className="px-2 py-0.5 bg-primary/20 border border-primary/40 text-primary text-[8px] font-black uppercase tracking-widest">
                    {isToday ? 'LIVE TODAY' : 'NEXT UP'}
                  </span>
                )}
             </div>
             <div className="flex items-center gap-2 text-white/50 text-xs font-light">
                <MapPin size={14} className="text-primary/50" />
                {address}
             </div>
             {state?.timeLeft && !state.isHappeningNow && (
               <div className="flex items-center gap-4 pt-2">
                  <div className="text-[9px] font-mono font-black uppercase text-white/40 tracking-widest">Starts in:</div>
                  <div className="flex gap-2 text-[10px] font-mono text-white">
                    <span>{state.timeLeft.days}d</span>
                    <span className="text-white/20">/</span>
                    <span>{state.timeLeft.hours}h</span>
                    <span className="text-white/20">/</span>
                    <span>{state.timeLeft.minutes}m</span>
                  </div>
               </div>
             )}
          </div>

          <div className="flex items-center gap-8 shrink-0">
             <div className="text-center">
                <div className="text-xl font-display font-black text-white leading-none">{attending}</div>
                <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Attending</div>
             </div>
             <div className="flex flex-col gap-2">
                <Button 
                  onClick={onRsvp}
                  disabled={hasRsvpd}
                  className={`text-[10px] uppercase font-black tracking-widest h-10 px-8 rounded-none transition-all ${
                    hasRsvpd ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white text-black hover:bg-primary'
                  }`}
                >
                  {hasRsvpd ? '✓ SECURED' : 'RSVP NOW'}
                </Button>
                <div className="flex gap-1 justify-between">
                   <button onClick={onCalendar} className="p-2 text-white/30 hover:text-white transition-colors border border-white/5 hover:border-white/20"><CalendarPlus size={14}/></button>
                   <button onClick={onShare} className="p-2 text-white/30 hover:text-white transition-colors border border-white/5 hover:border-white/20"><Share2 size={14}/></button>
                   <button onClick={() => setIsMapOpen(!isMapOpen)} className={`p-2 transition-colors border border-white/5 hover:border-white/20 ${isMapOpen ? 'text-primary border-primary/30' : 'text-white/30 hover:text-white'}`}><MapPin size={14}/></button>
                </div>
             </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMapOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 250 }} exit={{ height: 0 }} className="border-t border-white/5 grayscale invert contrast-125 opacity-80 overflow-hidden">
            <iframe src={mapUrl} width="100%" height="250" style={{ border: 0 }} allowFullScreen loading="lazy" title={`Map of ${location}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactLink({ icon, label, value, href }: any) {
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="flex items-center gap-4 p-6 bg-white/2 border border-white/5 hover:bg-white/5 hover:border-primary/50 transition-all group">
      <div className="w-10 h-10 flex items-center justify-center bg-white/5 text-white group-hover:text-primary transition-colors">
        {icon}
      </div>
      <div>
        <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-1">{label}</div>
        <div className="text-white font-mono text-sm">{value}</div>
      </div>
    </a>
  );
}

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("https://formsubmit.co/ajax/willcruzdesigner@gmail.com", {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ ...data, _subject: "New Message from VIBES & HIGHS" })
      });
      if (response.ok) {
        toast.success("Message sent! ✨");
        e.target.reset();
      }
    } catch (error) {
      toast.error("Failed to send.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Full Name</label>
        <Input name="name" required placeholder="Jane Doe" className="bg-transparent border-white/10 text-white rounded-none h-12 focus-visible:ring-primary focus-visible:border-primary" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Email Address</label>
        <Input name="email" type="email" required placeholder="jane@example.com" className="bg-transparent border-white/10 text-white rounded-none h-12 focus-visible:ring-primary focus-visible:border-primary" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Message</label>
        <Textarea name="message" required placeholder="Tell us about your weird project..." className="bg-transparent border-white/10 text-white rounded-none min-h-[120px] focus-visible:ring-primary focus-visible:border-primary resize-none" />
      </div>
      <Button disabled={isSubmitting} type="submit" className="w-full bg-white text-black hover:bg-primary font-black uppercase tracking-widest text-[11px] h-14 transition-all">
        {isSubmitting ? 'SENDING...' : 'TRANSMIT MESSAGE'}
      </Button>
    </form>
  );
}

function ExperimentalNotice() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-24 p-10 border border-dashed border-primary/30 bg-primary/2 relative overflow-hidden">
      <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
        <div className="shrink-0">
          <AlertTriangle size={48} className="text-primary animate-pulse" />
        </div>
        <div className="flex-1 space-y-6">
          <h3 className="text-2xl md:text-4xl font-display font-black text-white uppercase tracking-tighter">System Notice // Experimental_v0.1</h3>
          <p className="text-white/60 font-light text-lg max-w-3xl leading-relaxed">Vibes & Highs is operating in <strong>Pre-Alpha Community Mode</strong>. Expect experiments, side quests, and spontaneous collaborations. We are build-first, theater-second. Check Discord for active deployment status before arrival.</p>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-white/5 text-white/40 text-[9px] font-mono uppercase tracking-widest border border-white/10">In-Person_Default</div>
             <div className="flex items-center gap-2 px-3 py-1 bg-white/5 text-white/40 text-[9px] font-mono uppercase tracking-widest border border-white/10">Virtual_Fallback</div>
          </div>
        </div>
        <a href="https://discord.gg/ua5UUXZTyz" target="_blank" rel="noreferrer" className="shrink-0 w-full md:w-auto">
          <Button variant="outline" className="w-full md:w-auto border-primary/30 text-primary hover:bg-primary hover:text-black font-black uppercase tracking-widest text-[10px] h-12 px-8">Verify Status</Button>
        </a>
      </div>
    </motion.div>
  );
}


