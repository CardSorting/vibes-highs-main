import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal, ShieldCheck, Cpu, Zap } from 'lucide-react';

export function SystemPulse() {
  const [metrics, setMetrics] = useState([
    { label: 'Ecosystem Integrity', value: 99.98, unit: '%', icon: ShieldCheck, color: 'text-primary' },
    { label: 'Compute Latency', value: 14, unit: 'ms', icon: Cpu, color: 'text-primary' },
    { label: 'Network Throughput', value: 842, unit: 'mb/s', icon: Zap, color: 'text-primary' },
    { label: 'Substrate Uptime', value: 12480, unit: 'hrs', icon: Terminal, color: 'text-primary' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => {
        if (m.label === 'Ecosystem Integrity') {
          const delta = (Math.random() - 0.5) * 0.01;
          return { ...m, value: Math.min(100, Math.max(99.9, m.value + delta)) };
        }
        if (m.label === 'Compute Latency') {
          const delta = (Math.random() - 0.5) * 2;
          return { ...m, value: Math.min(25, Math.max(8, m.value + delta)) };
        }
        if (m.label === 'Network Throughput') {
          const delta = (Math.random() - 0.5) * 50;
          return { ...m, value: Math.min(1000, Math.max(500, m.value + delta)) };
        }
        return m;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 border-t border-b border-white/5 bg-white/2">
      {metrics.map((m, i) => (
        <div key={i} className="p-6 space-y-3 group hover:bg-white/4 transition-colors relative overflow-hidden">
          {/* Subtle background pulse */}
          <motion.div 
            animate={{ opacity: [0, 0.05, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
            className="absolute inset-0 bg-primary pointer-events-none"
          />
          
          <div className="flex items-center gap-2 relative z-10">
            <m.icon size={12} className={`${m.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
            <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-white/30">{m.label}</span>
          </div>
          
          <div className="text-xl font-display font-black tracking-tighter text-white relative z-10 flex items-baseline gap-1">
            <motion.span
              key={m.value}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
            >
              {typeof m.value === 'number' ? m.value.toFixed(m.label === 'Ecosystem Integrity' ? 2 : 0) : m.value}
            </motion.span>
            <span className="text-[10px] text-white/20 uppercase font-mono">{m.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
