'use client';

import React from 'react';

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
      } flex flex-col items-center justify-center bg-white/95 dark:bg-[#070b16] text-slate-900 dark:text-white backdrop-blur-2xl overflow-hidden select-none transition-colors duration-500`}
    >
      {/* Ambient background glow */}
      <div className="absolute w-[420px] h-[420px] rounded-full bg-radial from-orange-500/20 via-rose-500/10 to-transparent blur-[70px] pointer-events-none animate-pulse" />

      {/* Logo container with orbital ring */}
      <div className="relative w-24 h-24 flex items-center justify-center mb-6">
        {/* Orbital rotating ring */}
        <div className="absolute -inset-1.5 rounded-full border-2 border-dashed border-orange-500/40 animate-[spin_10s_linear_infinite]" />
        
        {/* Glowing Official Ekonnet Emblem */}
        <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-900/90 border border-orange-500/30 shadow-[0_0_35px_rgba(249,115,22,0.35)] flex items-center justify-center p-2 relative overflow-hidden">
          <img
            src="/images/ekonnet-hero-emblem.png"
            alt="Ekonnet Logo"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(249,115,22,0.5)]"
          />
        </div>
      </div>

      {/* Brand Title & Core Badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Ekonnet<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Trader</span>
        </span>
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400">
          PRO
        </span>
      </div>

      {/* Subtitle / Status Message */}
      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium tracking-wide mb-5 animate-pulse">
        {message}
      </p>

      {/* Shimmering Progress Bar */}
      <div className="w-52 h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden relative">
        <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full animate-[shimmer_1.4s_ease-in-out_infinite]" />
      </div>

      {/* Security Badge in Footer */}
      {subMessage && (
        <div className="absolute bottom-7 flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span>{subMessage}</span>
        </div>
      )}
    </div>
  );
};
