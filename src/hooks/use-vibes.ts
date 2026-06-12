import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export type TimeLeft = { days: number, hours: number, minutes: number, seconds: number };
export type EventState = { isHappeningNow: boolean; isNext: boolean; timeLeft: TimeLeft | null };

const DEFAULT_RSVPS = { fri: 8 };
const DEFAULT_HAS_RSVPD = { fri: false };

export function useVibes() {
  const [friState, setFriState] = useState<EventState | null>(null);
  const [isFridayToday, setIsFridayToday] = useState(false);

  // RSVP State
  const [rsvps, setRsvps] = useState<{ fri: number }>(DEFAULT_RSVPS);
  const [hasRsvpd, setHasRsvpd] = useState<{ fri: boolean }>(DEFAULT_HAS_RSVPD);

  useEffect(() => {
    const savedRsvps = localStorage.getItem('vibes-rsvps');
    const savedHasRsvpd = localStorage.getItem('vibes-has-rsvpd');
    if (savedRsvps) setRsvps({ ...DEFAULT_RSVPS, ...JSON.parse(savedRsvps) });
    if (savedHasRsvpd) setHasRsvpd({ ...DEFAULT_HAS_RSVPD, ...JSON.parse(savedHasRsvpd) });
  }, []);

  const handleRsvp = useCallback((event: 'fri') => {
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
      description: `See you on Friday.`,
      className: "bg-black border-primary/20 text-white font-mono"
    });
  }, [hasRsvpd]);

  useEffect(() => {
    const getFirstFridayOfMonth = (year: number, month: number, hour: number) => {
      const date = new Date(year, month, 1, hour, 0, 0, 0);
      while (date.getDay() !== 5) {
        date.setDate(date.getDate() + 1);
      }
      return date;
    };

    const computeEventState = (mtDate: Date, startHour: number, endHour: number) => {
      const currentFirstFriday = getFirstFridayOfMonth(mtDate.getFullYear(), mtDate.getMonth(), startHour);
      const currentFirstFridayEnd = new Date(currentFirstFriday);
      currentFirstFridayEnd.setHours(endHour);

      let targetMtDate: Date;
      let isHappeningNow = false;

      if (mtDate.getTime() < currentFirstFriday.getTime()) {
        targetMtDate = currentFirstFriday;
      } else if (mtDate.getTime() >= currentFirstFriday.getTime() && mtDate.getTime() < currentFirstFridayEnd.getTime()) {
        isHappeningNow = true;
        targetMtDate = currentFirstFriday;
      } else {
        const nextMonth = mtDate.getMonth() + 1;
        const nextYear = mtDate.getFullYear() + (nextMonth > 11 ? 1 : 0);
        targetMtDate = getFirstFridayOfMonth(nextYear, nextMonth % 12, startHour);
      }

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
      
      const firstFriday = getFirstFridayOfMonth(mtDate.getFullYear(), mtDate.getMonth(), 17);
      const isMeetupToday = mtDate.getDate() === firstFriday.getDate() && mtDate.getMonth() === firstFriday.getMonth();
      setIsFridayToday(isMeetupToday);
      
      const friInfo = computeEventState(mtDate, 17, 20);
      
      setFriState({ isHappeningNow: friInfo.isHappeningNow, isNext: true, timeLeft: friInfo.timeLeft });
    };
    
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCalendar = useCallback((type: 'fri') => {
    const getFirstFridayOfMonth = (year: number, month: number, hour: number) => {
      const date = new Date(year, month, 1, hour, 0, 0, 0);
      while (date.getDay() !== 5) {
        date.setDate(date.getDate() + 1);
      }
      return date;
    };

    const now = new Date();
    let nextDate = getFirstFridayOfMonth(now.getFullYear(), now.getMonth(), 17);
    const currentFirstFridayEnd = new Date(nextDate);
    currentFirstFridayEnd.setHours(20);

    if (now.getTime() >= currentFirstFridayEnd.getTime()) {
      const nextMonth = now.getMonth() + 1;
      const nextYear = now.getFullYear() + (nextMonth > 11 ? 1 : 0);
      nextDate = getFirstFridayOfMonth(nextYear, nextMonth % 12, 17);
    }

    const endDate = new Date(nextDate);
    endDate.setHours(20, 0, 0, 0);

    const formatISO = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const text = "Woodbine Creative Hangout";
    const dates = `${formatISO(nextDate)}/${formatISO(endDate)}`;
    const location = "545 West 700 S, Salt Lake City, UT 84101";
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(text)}&dates=${dates}&ctz=America/Denver&recur=${encodeURIComponent(`RRULE:FREQ=MONTHLY;BYDAY=1FR`)}&location=${encodeURIComponent(location)}`;
    window.open(url, '_blank');
  }, []);

  // Simulated live registration drift
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setRsvps(prev => ({
          ...prev,
          fri: prev.fri + (Math.random() > 0.5 ? 1 : 0),
        }));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextUpEvent = { name: 'Friday @ SLC', state: friState };

  return {
    friState,
    isFridayToday,
    rsvps,
    hasRsvpd,
    handleRsvp,
    handleCalendar,
    nextUpEvent
  };
}
