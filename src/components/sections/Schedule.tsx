/**
 * [LAYER: UI]
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, MapPin, Users, Check, CalendarPlus, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { EventState } from '@/hooks/use-vibes';

interface ScheduleProps {
  friState: EventState | null;
  isFridayToday: boolean;
  rsvps: { fri: number };
  hasRsvpd: { fri: boolean };
  onRsvp: (event: 'fri') => void;
  onCalendar: (event: 'fri') => void;
}

export function Schedule({
  friState,
  isFridayToday,
  rsvps,
  hasRsvpd,
  onRsvp,
  onCalendar
}: ScheduleProps) {
  const handleShare = async () => {
    const text = "Join the next Friday session at Woodbine in SLC! ⚡️";
    if (navigator.share) {
      try { await navigator.share({ title: 'SLC AI Town Hall', text, url: window.location.href }); } catch (err) { console.error(err); }
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
    }
  };

  return (
    <section id="schedule" className="relative py-32 bg-[#0A0A0B]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="text-[10px] font-mono text-primary font-black uppercase tracking-[0.4em]">Join the Sessions</div>
            <h2 className="font-display font-black text-6xl md:text-9xl tracking-tighter leading-[0.8] uppercase">WHERE WE<br/><span className="font-serif italic font-light text-white/40 lowercase">Gather.</span></h2>
            <p className="text-white/40 text-xs font-mono uppercase tracking-widest leading-relaxed">
              Join us downtown for creative coding, friendly conversations, and project demos.
            </p>
          </div>
          <div className="flex items-center gap-6 text-white/30 text-[10px] font-mono uppercase tracking-widest font-black">
             <Activity size={12} className="text-primary" /> Session Active
          </div>
        </div>

        <div className="grid gap-2">
          <SessionRow 
            day="Friday"
            time="5:00 PM — 8:00 PM"
            location="Woodbine SLC"
            address="545 West 700 S, Salt Lake City, UT 84101"
            state={friState}
            isToday={isFridayToday}
            onRsvp={() => onRsvp('fri')}
            onCalendar={() => onCalendar('fri')}
            onShare={() => handleShare()}
            attending={rsvps.fri}
            hasRsvpd={hasRsvpd.fri}
            mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.905477833056!2d-111.90692112341517!3d40.7631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8752f50c0c0c0c0c%3A0x0!2sWoodbine%20Food%20Hall!5e0!3m2!1sen!2sus!4v1714864433355!5m2!1sen!2sus"
          />
        </div>
      </div>
    </section>
  );
}

function SessionRow({ day, time, location, address, state, isToday, onRsvp, onCalendar, onShare, attending, hasRsvpd, mapUrl }: any) {
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <div className={`group relative border border-white/5 bg-white/2 transition-all duration-500 hover:bg-white/4 overflow-hidden ${state?.isNext ? 'border-primary/30 ring-1 ring-primary/10' : ''}`}>
      <div className="flex flex-col lg:flex-row items-stretch gap-px">
        {/* Main Info */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col md:flex-row gap-12 items-start md:items-center">
          <div className="shrink-0 w-36">
             <div className="text-[10px] font-mono text-primary font-black uppercase tracking-[0.4em] mb-2">{day}</div>
             <div className="text-3xl font-display font-black text-white uppercase tracking-tighter">{time.split(' — ')[0]}</div>
             <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1.5">Mountain Time</div>
             <span className="inline-block px-1.5 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[8px] font-mono font-black uppercase tracking-widest">
               Drop-ins Welcome
             </span>
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
             <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/5 text-[11px] text-white/50 leading-relaxed font-sans">
               <div className="flex items-start gap-2.5">
                 <Clock size={14} className="text-primary mt-0.5 shrink-0" />
                 <div>
                   <span className="text-white font-bold">{time.split(' — ')[0]} MST</span> — Drop-ins welcome from {time.split(' — ')[0]}. 
                   Ends at 8:00 PM (usually ~3 hours). 
                   Check in on our <a href="https://discord.gg/ua5UUXZTyz" target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold inline-flex items-center gap-0.5">Discord <MessageSquare size={10} /></a> for more info.
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full lg:w-96 p-8 lg:p-12 bg-white/2 border-l border-white/5 flex flex-col justify-center gap-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Users size={14} className="text-primary" />
                 <span className="text-[10px] font-bold text-white uppercase tracking-widest">{attending} Going</span>
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
                {hasRsvpd ? <span className="flex items-center gap-2"><Check size={12} /> I'M GOING</span> : 'SAVE A SEAT'}
              </Button>
              <Button 
                variant="outline" 
                onClick={onCalendar}
                className="h-12 rounded-none border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest text-[9px]"
              >
                <CalendarPlus size={12} className="mr-2" /> ADD TO CALENDAR
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
