import { motion } from 'motion/react';
import { Terminal, ShieldCheck, Cpu, Zap } from 'lucide-react';

export function SystemPulse() {
  const metrics = [
    { label: 'Ecosystem Integrity', value: '99.98%', icon: ShieldCheck, color: 'text-primary' },
    { label: 'Compute Latency', value: '14ms', icon: Cpu, color: 'text-primary' },
    { label: 'Network Throughput', value: 'High', icon: Zap, color: 'text-primary' },
    { label: 'System Uptime', value: '∞', icon: Terminal, color: 'text-primary' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 border-t border-b border-white/5 bg-white/2">
      {metrics.map((m, i) => (
        <div key={i} className="p-6 space-y-3 group hover:bg-white/4 transition-colors">
          <div className="flex items-center gap-2">
            <m.icon size={12} className={`${m.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
            <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-white/30">{m.label}</span>
          </div>
          <div className="text-xl font-display font-black tracking-tighter text-white">
            {m.value}
          </div>
        </div>
      ))}
    </div>
  );
}
