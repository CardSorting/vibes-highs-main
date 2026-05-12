import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export type TimeLeft = { days: number, hours: number, minutes: number, seconds: number };
export type EventState = { isHappeningNow: boolean; isNext: boolean; timeLeft: TimeLeft | null };

export function useVibes() {
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

  return {
    wedState,
    friState,
    isWednesdayToday,
    isFridayToday,
    rsvps,
    hasRsvpd,
    handleRsvp,
    nextUpEvent
  };
}
