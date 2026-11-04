'use client';

import React from 'react';
import { Layers } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Connecting to Institutional Liquidity Engine...',
  subMessage = 'Multi-Asset Clearing Rails • TLS Encrypted',
  fullScreen = true,
}) => {
  return (
    <div
      className={`${
        fullScreen ? 'fixed inset-0 z-[99999]' : 'w-full h-full min-h-[300px]'
      } flex flex-col items-center justify-center bg-[#070b16] text-white overflow-hidden select-none transition-opacity duration-500`}
    >
      {/* Ambient background glow */}
      <div className="absolute w-[420px] h-[420px] rounded-full bg-radial from-blue-600/20 via-cyan-500/10 to-transparent blur-[70px] pointer-events-none animate-pulse" />

      {/* Logo container with orbital ring */}
      <div className="relative w-20 h-20 flex items-center justify-center mb-6">
        {/* Orbital rotating ring */}
        <div className="absolute -inset-1.5 rounded-[26px] border-2 border-dashed border-blue-500/40 animate-[spin_10s_linear_infinite]" />
        
        {/* Outer glowing shield box */}
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-slate-900/95 to-slate-800/90 border border-blue-400/50 shadow-[0_0_35px_rgba(37,99,235,0.35)] flex items-center justify-center relative">
          <Layers className="w-9 h-9 text-cyan-400" />
        </div>
      </div>

      {/* Brand Title & Core Badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
          Ekonnet<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Trader</span>
        </span>
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/40 text-blue-400">
          PRO
        </span>
      </div>

      {/* Subtitle / Status Message */}
      <p className="text-xs text-slate-400 font-medium tracking-wide mb-5 animate-pulse">
        {message}
      </p>

      {/* Shimmering Progress Bar */}
      <div className="w-52 h-1 bg-white/10 rounded-full overflow-hidden relative">
        <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full animate-[shimmer_1.4s_ease-in-out_infinite]" />
      </div>

      {/* Security Badge in Footer */}
      {subMessage && (
        <div className="absolute bottom-7 flex items-center gap-2 text-[11px] font-mono text-slate-500 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span>{subMessage}</span>
        </div>
      )}
    </div>
  );
};
