"use client";

import React from "react";
import { TrendingUp } from "lucide-react";

export default function Hero3DVisual() {
  return (
    <div className="relative w-full max-w-[540px] mx-auto aspect-square flex items-center justify-center select-none pointer-events-none">
      
      {/* Background Ascending Candlestick Bars Wave */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40 dark:opacity-30">
        <svg viewBox="0 0 500 400" className="w-full h-full">
          <defs>
            <linearGradient id="barRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F87171" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="barGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34D399" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="waveGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#F43F5E" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Smooth curved chart trendline */}
          <path
            d="M 40,280 Q 140,240 220,180 T 380,90 T 480,50"
            fill="none"
            stroke="url(#waveGlow)"
            strokeWidth="3"
            strokeDasharray="4 4"
          />

          {/* Candlestick visual bars ascending */}
          <g opacity="0.65">
            {/* Bar 1 */}
            <line x1="80" y1="240" x2="80" y2="310" stroke="#EF4444" strokeWidth="1.5" />
            <rect x="74" y="255" width="12" height="40" rx="3" fill="url(#barRed)" />

            {/* Bar 2 */}
            <line x1="120" y1="210" x2="120" y2="290" stroke="#10B981" strokeWidth="1.5" />
            <rect x="114" y="225" width="12" height="50" rx="3" fill="url(#barGreen)" />

            {/* Bar 3 */}
            <line x1="160" y1="180" x2="160" y2="260" stroke="#EF4444" strokeWidth="1.5" />
            <rect x="154" y="195" width="12" height="45" rx="3" fill="url(#barRed)" />

            {/* Bar 4 */}
            <line x1="200" y1="150" x2="200" y2="230" stroke="#10B981" strokeWidth="1.5" />
            <rect x="194" y="165" width="12" height="50" rx="3" fill="url(#barGreen)" />

            {/* Bar 5 */}
            <line x1="390" y1="70" x2="390" y2="170" stroke="#10B981" strokeWidth="1.5" />
            <rect x="384" y="85" width="12" height="65" rx="3" fill="url(#barGreen)" />

            {/* Bar 6 */}
            <line x1="430" y1="50" x2="430" y2="150" stroke="#10B981" strokeWidth="1.5" />
            <rect x="424" y="65" width="12" height="60" rx="3" fill="url(#barGreen)" />

            {/* Bar 7 */}
            <line x1="470" y1="30" x2="470" y2="130" stroke="#10B981" strokeWidth="1.5" />
            <rect x="464" y="45" width="12" height="65" rx="3" fill="url(#barGreen)" />
          </g>
        </svg>
      </div>

      {/* Floating 3D Bitcoin (Top Left) */}
      <div className="absolute top-[8%] left-[12%] animate-float-slow z-20">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-[2px] shadow-[0_12px_30px_rgba(245,158,11,0.4)]">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-black font-sans shadow-inner">
            ₿
          </div>
        </div>
      </div>

      {/* Floating 3D Ethereum (Top Right) */}
      <div className="absolute top-[5%] right-[10%] animate-float-reverse z-20">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-blue-300 via-indigo-400 to-slate-100 p-[2px] shadow-[0_12px_30px_rgba(99,102,241,0.4)]">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-inner">
            Ξ
          </div>
        </div>
      </div>

      {/* Floating 3D Solana (Mid Right) */}
      <div className="absolute top-[48%] right-[2%] animate-float-slow z-20">
        <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-cyan-400 p-[2px] shadow-[0_12px_28px_rgba(168,85,247,0.4)]">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center text-cyan-300 text-lg font-black shadow-inner">
            ◎
          </div>
        </div>
      </div>

      {/* Center 3D Glowing Podium Base */}
      <div className="relative flex flex-col items-center justify-center mt-12 z-10">
        
        {/* Neon Orange Glowing Base Ring */}
        <div className="absolute -bottom-8 w-[280px] sm:w-[360px] h-[70px] rounded-[100%] border-2 border-orange-500/70 shadow-[0_0_40px_rgba(249,115,22,0.6)] bg-gradient-to-b from-orange-500/10 to-transparent blur-[1px]" />
        
        {/* Sleek Metallic Pedestal */}
        <div className="relative w-[220px] sm:w-[280px] h-[48px] rounded-[100%] bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600 dark:from-slate-700 dark:via-slate-850 dark:to-slate-900 shadow-[0_20px_40px_rgba(0,0,0,0.35)] border-t border-white/40 flex items-center justify-center">
          <div className="w-[85%] h-[75%] rounded-[100%] bg-gradient-to-b from-slate-100 to-slate-300 dark:from-slate-800 dark:to-slate-950 shadow-inner" />
        </div>

        {/* Central 3D Glowing Red/Orange Coin Emblem (Browzzit Coin Aesthetic) */}
        <div className="relative -mt-44 sm:-mt-52 w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 p-[3px] shadow-[0_25px_60px_-10px_rgba(244,63,94,0.65)] animate-float-slow">
          
          {/* Inner Coin Surface */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-red-600 via-rose-500 to-orange-500 p-3 sm:p-4 shadow-inner flex items-center justify-center relative overflow-hidden">
            
            {/* Top Gloss Light Reflection */}
            <div className="absolute -top-12 left-1/4 w-3/4 h-24 bg-white/35 rounded-full blur-md transform -rotate-12 pointer-events-none" />

            {/* Inner Concentric Core */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-rose-700 via-red-600 to-orange-600 border border-white/25 shadow-[inset_0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-center">
              
              {/* Center White Core Circle (Browzzit Logo Symbol) */}
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.9)] flex items-center justify-center">
                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-rose-600 to-orange-500" />
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
