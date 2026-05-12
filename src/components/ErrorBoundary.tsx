import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 text-white font-mono">
          <div className="max-w-md w-full border border-red-500/30 bg-red-500/5 p-8 space-y-6">
            <div className="flex items-center gap-3 text-red-500">
              <AlertTriangle size={24} />
              <h2 className="text-xl font-black uppercase tracking-widest">System Failure</h2>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              An unexpected error has occurred within the community substrate. The forensic engine has logged the incident.
            </p>
            <div className="p-4 bg-black/40 border border-white/5 text-[10px] overflow-auto max-h-32 text-red-400">
              {this.state.error?.toString()}
            </div>
            <Button 
              onClick={() => window.location.reload()}
              className="w-full bg-red-500 text-white hover:bg-red-600 rounded-none font-black uppercase tracking-widest text-[10px]"
            >
              <RefreshCcw size={14} className="mr-2" /> Reboot Substrate
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
