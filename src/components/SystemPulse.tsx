import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, ShieldCheck, Cpu, Zap } from 'lucide-react';

export function SystemPulse() {
  const [metrics, setMetrics] = useState([
    { 
      label: 'Ecosystem Integrity', 
      value: 99.98, 
      unit: '%', 
      icon: ShieldCheck, 
      color: 'text-[#00FF66]', 
      history: [99.98, 99.97, 99.99, 99.98, 99.98, 99.99, 99.97, 99.98, 99.99, 99.98]
    },
    { 
      label: 'Compute Latency', 
      value: 14, 
      unit: 'ms', 
      icon: Cpu, 
      color: 'text-[#00FF66]',
      history: [14, 15, 13, 16, 14, 12, 15, 14, 16, 14]
    },
    { 
      label: 'Network Throughput', 
      value: 842, 
      unit: 'mb/s', 
      icon: Zap, 
      color: 'text-[#00FF66]',
      history: [842, 860, 830, 855, 840, 875, 850, 862, 845, 842]
    },
    { 
      label: 'Substrate Uptime', 
      value: 12480, 
      unit: 'hrs', 
      icon: Terminal, 
      color: 'text-white/40',
      history: [12480, 12480, 12480, 12480, 12480, 12480, 12480, 12480, 12480, 12480]
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => {
        let newValue = m.value;
        const newHistory = [...m.history];

        if (m.label === 'Ecosystem Integrity') {
          const delta = (Math.random() - 0.5) * 0.01;
          newValue = Math.min(100, Math.max(99.9, m.value + delta));
        } else if (m.label === 'Compute Latency') {
          const delta = (Math.random() - 0.5) * 2;
          newValue = Math.min(25, Math.max(8, m.value + delta));
        } else if (m.label === 'Network Throughput') {
          const delta = (Math.random() - 0.5) * 50;
          newValue = Math.min(1000, Math.max(500, m.value + delta));
        }

        if (m.label !== 'Substrate Uptime') {
          newHistory.push(newValue);
          if (newHistory.length > 10) newHistory.shift();
        }

        return { ...m, value: newValue, history: newHistory };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getMinMax = (label: string) => {
    switch (label) {
      case 'Ecosystem Integrity': return { min: 99.8, max: 100 };
      case 'Compute Latency': return { min: 5, max: 30 };
      case 'Network Throughput': return { min: 400, max: 1100 };
      default: return { min: 12400, max: 12500 };
    }
  };

  const getSparklinePath = (history: number[], min: number, max: number) => {
    const width = 100;
    const height = 30;
    const padding = 2;
    
    if (history.every(v => v === history[0])) {
      return `M 0 ${height / 2} L ${width} ${height / 2}`;
    }

    const points = history.map((val, index) => {
      const x = (index / (history.length - 1)) * width;
      const range = max - min || 1;
      const y = padding + (1 - (val - min) / range) * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${points.join(' L ')}`;
  };

  return (
    <section className="py-12 border-b border-white/5 bg-[#0A0A0B] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => {
            const { min, max } = getMinMax(m.label);
            const path = getSparklinePath(m.history, min, max);
            
            const formattedVal = typeof m.value === 'number' 
              ? m.value.toFixed(m.label === 'Ecosystem Integrity' ? 2 : 0) 
              : m.value;
              
            return (
              <div 
                key={i} 
                className="bg-white/[0.01] border border-white/5 p-6 space-y-4 hover:border-primary/20 transition-all duration-300 relative overflow-hidden group select-none"
              >
                {/* Subtle cyber background pulse */}
                <motion.div 
                  animate={{ opacity: [0, 0.03, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                  className="absolute inset-0 bg-primary pointer-events-none"
                />
                
                {/* Micro glow effect */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                {/* Layout header */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <m.icon size={14} className="text-primary/70 group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors">
                      {m.label}
                    </span>
                  </div>
                  <span className="text-[8px] font-mono text-primary/50 flex items-center gap-1 font-bold">
                    <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                    LIVE
                  </span>
                </div>
                
                {/* Content middle: value and sparkline */}
                <div className="flex items-end justify-between gap-4 pt-2 relative z-10">
                  <div className="space-y-1">
                    <div className="text-3xl font-display font-black tracking-tight text-white flex items-baseline gap-1">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={formattedVal}
                          initial={{ opacity: 0.5, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0.5, y: 2 }}
                          transition={{ duration: 0.15 }}
                        >
                          {formattedVal}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-xs text-white/30 uppercase font-mono font-bold">{m.unit}</span>
                    </div>
                    <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest font-bold">
                      {m.label === 'Substrate Uptime' ? 'CONTINUOUS_SYSTEM_RUN' : 'SYS_TELEMETRY_OK'}
                    </div>
                  </div>
                  
                  {/* SVG Sparkline */}
                  <div className="w-24 h-10 overflow-hidden relative">
                    <svg className="w-full h-full animate-pulse" viewBox="0 0 100 30">
                      <defs>
                        <linearGradient id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00FF66" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#00FF66" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      
                      {/* Fill area */}
                      {m.label !== 'Substrate Uptime' && (
                        <path
                          d={`${path} L 100 30 L 0 30 Z`}
                          fill={`url(#gradient-${i})`}
                          className="transition-all duration-300"
                        />
                      )}
                      
                      {/* Line path */}
                      <path
                        d={path}
                        fill="none"
                        stroke="#00FF66"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-300 opacity-60 group-hover:opacity-100"
                      />
                      
                      {/* Active blinking point at the end */}
                      {m.label !== 'Substrate Uptime' && m.history.length > 0 && (
                        <circle
                          cx="100"
                          cy={2 + (1 - (m.history[m.history.length - 1] - min) / (max - min || 1)) * 26}
                          r="2"
                          fill="#00FF66"
                        />
                      )}
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
