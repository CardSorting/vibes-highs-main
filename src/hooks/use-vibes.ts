import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export type TimeLeft = { days: number, hours: number, minutes: number, seconds: number };
export type EventState = { isHappeningNow: boolean; isNext: boolean; timeLeft: TimeLeft | null };

const DEFAULT_RSVPS = { wed: 12, fri: 8 };
const DEFAULT_HAS_RSVPD = { wed: false, fri: false };

export function useVibes() {
  const [wedState, setWedState] = useState<EventState | null>(null);
  const [friState, setFriState] = useState<EventState | null>(null);
  const [isWednesdayToday, setIsWednesdayToday] = useState(false);
  const [isFridayToday, setIsFridayToday] = useState(false);

  // RSVP State
  const [rsvps, setRsvps] = useState<{wed: number, fri: number}>(DEFAULT_RSVPS);
  const [hasRsvpd, setHasRsvpd] = useState<{wed: boolean, fri: boolean}>(DEFAULT_HAS_RSVPD);

  useEffect(() => {
    const savedRsvps = localStorage.getItem('vibes-rsvps');
    const savedHasRsvpd = localStorage.getItem('vibes-has-rsvpd');
    if (savedRsvps) setRsvps({ ...DEFAULT_RSVPS, ...JSON.parse(savedRsvps) });
    if (savedHasRsvpd) setHasRsvpd({ ...DEFAULT_HAS_RSVPD, ...JSON.parse(savedHasRsvpd) });
  }, []);

  const handleRsvp = useCallback((event: 'wed' | 'fri') => {
    if (hasRsvpd[event]) return;
    setRsvps(prev => {
      const next = { ...prev, [event]: prev[event] + 1 };
      localStorage.setItem('vibes-rsvps', JSON.stringify(next));
      return next;
    });
    setHasRsvpd(prev => {
      const next = { ...prev, [event]: true };
      localStorage.setItem('vibes-has-rsvpd', JSON.stringify(next));
      return next;
    });
    toast.success("RSVP Confirmed! ✨", { 
      description: `See you on ${event === 'wed' ? 'Wednesday' : 'Friday'}.`,
      className: "bg-black border-primary/20 text-white font-mono"
    });
  }, [hasRsvpd]);

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
      const formatter = new Intl.DateTimeFormat('en-US', { 
        timeZone: 'America/Denver', 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric', 
        hourCycle: 'h23' 
      });
      const parts = formatter.formatToParts(now);
      const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
      const mtDate = new Date(getPart('year'), getPart('month') - 1, getPart('day'), getPart('hour'), getPart('minute'), getPart('second'));
      
      setIsWednesdayToday(mtDate.getDay() === 3);
      setIsFridayToday(mtDate.getDay() === 5);
      
      const wedInfo = computeEventState(mtDate, 3, 13, 15);
      const friInfo = computeEventState(mtDate, 5, 13, 15);
      const isWedNext = wedInfo.isHappeningNow || (!friInfo.isHappeningNow && wedInfo.diffMs < friInfo.diffMs);
      
      setWedState({ isHappeningNow: wedInfo.isHappeningNow, isNext: isWedNext, timeLeft: wedInfo.timeLeft });
      setFriState({ isHappeningNow: friInfo.isHappeningNow, isNext: !isWedNext, timeLeft: friInfo.timeLeft });
    };
    
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCalendar = useCallback((type: 'wed' | 'fri') => {
    const now = new Date();
    const dayOfWeek = type === 'wed' ? 3 : 5;
    const startHour = 13;
    const endHour = 15;

    // Find next occurrence
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + (dayOfWeek + 7 - now.getDay()) % 7);
    nextDate.setHours(startHour, 0, 0, 0);

    const endDate = new Date(nextDate);
    endDate.setHours(endHour, 0, 0, 0);

    const formatISO = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const text = type === 'wed' ? "GameHaven Builder Session" : "Woodbine Creative Hangout";
    const dates = `${formatISO(nextDate)}/${formatISO(endDate)}`;
    const location = type === 'wed' ? "5254 Anthem Peak Ln, Herriman, UT 84096" : "545 West 700 S, Salt Lake City, UT 84101";
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(text)}&dates=${dates}&ctz=America/Denver&recur=${encodeURIComponent(`RRULE:FREQ=WEEKLY;BYDAY=${type === 'wed' ? 'WE' : 'FR'}`)}&location=${encodeURIComponent(location)}`;
    window.open(url, '_blank');
  }, []);

  // Simulated live registration drift
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setRsvps(prev => ({
          ...prev,
          wed: prev.wed + (Math.random() > 0.5 ? 1 : 0),
          fri: prev.fri + (Math.random() > 0.5 ? 1 : 0),
        }));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextUpEvent = wedState?.isNext ? { name: 'Wednesday @ Herriman', state: wedState } : { name: 'Friday @ SLC', state: friState };

  return {
    wedState,
    friState,
    isWednesdayToday,
    isFridayToday,
    rsvps,
    hasRsvpd,
    handleRsvp,
    handleCalendar,
    nextUpEvent
  };
}
