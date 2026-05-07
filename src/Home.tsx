import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { 
  Terminal, MapPin, Mail, Twitter, Linkedin, Send, Clock, Users, 
  CalendarPlus, Share2, AlertTriangle, ArrowUpRight, Activity, 
  Sparkles, Zap, Globe, Cpu, ShieldCheck, School, Layers, ChevronRight, MessageSquare, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { partners } from '@/data/partners';

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
    <div className="selection:bg-primary selection:text-black bg-[#0A0A0B]">
      <SEO 
        title="Build Weird Things" 
        description="A casual, non-transactional meetup for people making weird internet projects, creative code, and AI explorations in Salt Lake City."
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 pt-32 overflow-hidden border-b border-white/5">
        {/* Background Graphic */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=3540&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
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
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display font-black text-7xl md:text-9xl leading-[0.8] tracking-tighter uppercase">
                  BUILD<br/>
                  <span className="font-serif italic font-light text-primary pr-4 lowercase">Weird</span> THINGS.
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/60 text-xl md:text-2xl font-light leading-snug max-w-2xl">
                  A casual, non-transactional meetup for people making weird internet projects, creative code, and latent space explorations.
                </motion.p>
              </div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-4">
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

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="lg:col-span-4">
              <div className="bg-white/2 border border-white/10 p-10 backdrop-blur-xl relative group">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
                  <Activity size={24} className="text-primary animate-pulse" />
                </div>
                <div className="text-[10px] uppercase font-mono tracking-[0.3em] text-white/30 font-bold mb-8">System :: Next_Session</div>
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
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase">{nextUpEvent.name.includes('Herriman') ? 'GameHaven Herriman' : 'WoodBine SLC'}</span>
                  </div>
                  <div className="pt-8 border-t border-white/5">
                    {renderCompactCountdown(nextUpEvent.state)}
                  </div>
                  <a href="#schedule" className="block pt-4">
                    <Button variant="link" className="p-0 text-[10px] uppercase font-black text-primary hover:text-white tracking-[0.3em] h-auto">
                      &gt; VIEW_LOGS
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section - High Visibility */}
      <section className="py-24 border-b border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="space-y-2 text-center md:text-left">
                <div className="text-primary font-mono text-[10px] uppercase tracking-[0.4em] font-black">Ecosystem Infrastructure</div>
                <div className="text-white/40 text-[10px] font-mono uppercase tracking-widest">Technical registry supporting the collective</div>
              </div>
              <div className="flex flex-wrap justify-center gap-12 items-center">
                {partners.map(p => (
                  <Link key={p.id} to={`/partners?partner=${p.id}`} className="group relative flex items-center gap-3 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-white/2 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                      {p.name === 'Modal' && <Zap size={16} className="text-primary" />}
                      {p.name === 'Cloudflare' && <Globe size={16} className="text-primary" />}
                      {p.name === 'NousResearch' && <Cpu size={16} className="text-primary" />}
                      {p.name === 'Google' && <ShieldCheck size={16} className="text-primary" />}
                      {p.name === 'Silicon Slopes' && <School size={16} className="text-primary" />}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white transition-colors">{p.name}</span>
                  </Link>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* Philosophy Section - World Class Clarity */}
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

      {/* Schedule Section - Industry Standard Directory Style */}
      <section id="schedule" className="relative py-32 bg-[#0A0A0B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <div className="text-[10px] font-mono text-primary font-black uppercase tracking-[0.4em] mb-6">Weekly Operations</div>
              <h2 className="font-display font-black text-6xl md:text-9xl tracking-tighter leading-[0.8] mb-6 uppercase">THE<br/><span className="font-serif italic font-light text-white/40 lowercase">Schedule.</span></h2>
            </div>
            <div className="flex items-center gap-6 text-white/30 text-[10px] font-mono uppercase tracking-widest font-black">
               <Activity size={12} className="text-primary" /> System Online
            </div>
          </div>

          <div className="grid gap-2">
            <SessionRow 
              day="Wednesday"
              time="16:00 — 20:00"
              location="GameHaven Herriman"
              address="5254 Anthem Peak Ln, Herriman, UT 84096"
              state={wedState}
              isToday={isWednesdayToday}
              onRsvp={() => handleRsvp('wed')}
              onCalendar={() => handleCalendar('wed')}
              onShare={() => handleShare('wed')}
              attending={rsvps.wed}
              hasRsvpd={hasRsvpd.wed}
              mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3034.908447833056!2d-112.0154817234293!3d40.47728445230983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87528f97159f81d1%3A0xc48c90352932f91b!2sGameHaven%20Herriman!5e0!3m2!1sen!2sus!4v1714864433355!5m2!1sen!2sus"
            />
            <SessionRow 
              day="Friday"
              time="16:00 — 18:00"
              location="WoodBine SLC"
              address="545 West 700 S, Salt Lake City, UT 84101"
              state={friState}
              isToday={isFridayToday}
              onRsvp={() => handleRsvp('fri')}
              onCalendar={() => handleCalendar('fri')}
              onShare={() => handleShare('fri')}
              attending={rsvps.fri}
              hasRsvpd={hasRsvpd.fri}
              mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.905477833056!2d-111.90692112341517!3d40.7631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8752f50c0c0c0c0c%3A0x0!2sWoodbine%20Food%20Hall!5e0!3m2!1sen!2sus!4v1714864433355!5m2!1sen!2sus"
            />
          </div>
        </div>
      </section>

      {/* Global CTA */}
      <section className="relative py-48 px-6 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#primary20,transparent_70%)] animate-pulse"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-none text-[10px] font-mono text-primary font-black uppercase tracking-[0.4em]">
             System_Ready // Transmission_Start
          </div>
          <h2 className="font-display font-black text-6xl md:text-9xl tracking-tighter leading-[0.8] text-white uppercase">
            BUILD THE<br/>
            <span className="font-serif italic font-light text-primary pr-4 lowercase">Weird</span> WEB.
          </h2>
          <p className="text-white/60 text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Ready to demo? Or just want to hang out in a high-output environment? Join the collective and let's make things.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="https://discord.gg/ua5UUXZTyz" target="_blank" rel="noreferrer">
              <Button className="bg-white text-black hover:bg-primary font-black uppercase tracking-widest text-[11px] h-20 px-16 rounded-none transition-all">
                Access Collective
              </Button>
            </a>
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
             <div className="flex items-center gap-4 text-white/40 text-[10px] font-mono uppercase tracking-widest">
                <MapPin size={12} className="text-primary" /> {address}
             </div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full lg:w-96 p-8 lg:p-12 bg-white/2 border-l border-white/5 flex flex-col justify-center gap-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Users size={14} className="text-primary" />
                 <span className="text-[10px] font-bold text-white uppercase tracking-widest">{attending} Registered</span>
              </div>
              <button 
                onClick={() => setIsMapOpen(!isMapOpen)}
                className="text-[10px] font-bold text-white/40 hover:text-primary uppercase tracking-widest transition-colors"
              >
                {isMapOpen ? 'Close Map' : 'View Location'}
              </button>
           </div>
           
           <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={onRsvp}
                disabled={hasRsvpd}
                className={`h-12 rounded-none font-black uppercase tracking-widest text-[9px] transition-all ${hasRsvpd ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-white text-black hover:bg-primary'}`}
              >
                {hasRsvpd ? <span className="flex items-center gap-2"><Check size={12} /> CONFIRMED</span> : 'RSVP PROTOCOL'}
              </Button>
              <Button 
                variant="outline" 
                onClick={onCalendar}
                className="h-12 rounded-none border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest text-[9px]"
              >
                <CalendarPlus size={12} className="mr-2" /> CALENDAR
              </Button>
           </div>
        </div>
      </div>
      
      {/* Map Embed */}
      <AnimatePresence>
        {isMapOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 250 }} exit={{ height: 0 }} className="border-t border-white/5 overflow-hidden">
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
