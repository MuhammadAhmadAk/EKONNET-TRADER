"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useBinanceLivePrices } from "@/hooks/useBinanceLivePrices";

export default function LiveMarketOverview() {
  const { coins, isConnected } = useBinanceLivePrices();

  return (
    <section className="py-8 sm:py-12 bg-transparent select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">
              <span className="w-5 h-[2px] bg-orange-500 inline-block" />
              <span>Market Overview</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Live Market Prices
              </h2>
              
              {/* Live WebSocket Status Pill */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-xs">
                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" : "bg-amber-500 animate-ping"}`} />
                <span>{isConnected ? "Binance WebSocket Live" : "Connecting Live Feed..."}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track real-time prices and market trends direct from institutional order books.
            </p>
          </div>

          <Link
            href="/trades/crypto/direct"
            className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition shrink-0"
          >
            <span>View All Markets</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 5 Coin Cards Grid (Browzzit Exact Style with Real-Time WebSocket Ticks) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {coins.map((coin) => {
            const isFlashUp = coin.priceDirection === "up";
            const isFlashDown = coin.priceDirection === "down";

            return (
              <Link
                key={coin.symbol}
                href={`/trades/crypto/direct?pair=${coin.symbol}_USD`}
                className="group p-4 rounded-2xl bg-white dark:bg-[#0c1222]/80 border border-slate-100 dark:border-white/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-orange-500/30 dark:hover:border-orange-500/30 transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Subtle top edge glow on active price tick */}
                <div 
                  className={`absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-500 ${
                    isFlashUp 
                      ? "bg-emerald-500 opacity-100" 
                      : isFlashDown 
                      ? "bg-rose-500 opacity-100" 
                      : "opacity-0"
                  }`} 
                />

                {/* Coin Info */}
                <div className="flex items-center justify-between gap-2.5 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-9 h-9 rounded-full ${coin.iconBg} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 group-hover:scale-105 transition transform`}>
                      {coin.iconText}
                    </div>
                    <div className="leading-tight truncate">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {coin.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {coin.symbol}
                      </div>
                    </div>
                  </div>

                  {/* High/Low 24h indicator pill */}
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 shrink-0">
                    24h
                  </span>
                </div>

                {/* Price & Sparkline */}
                <div className="flex items-end justify-between gap-2 mt-1">
                  <div>
                    {/* Live Ticking Price with Directional Flash */}
                    <div 
                      className={`text-base font-bold font-mono tracking-tight transition-all duration-300 inline-block px-1 -mx-1 rounded ${
                        isFlashUp
                          ? "text-emerald-500 bg-emerald-500/10 font-black scale-[1.02]"
                          : isFlashDown
                          ? "text-rose-500 bg-rose-500/10 font-black scale-[1.02]"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {coin.formattedPrice}
                    </div>

                    {/* 24h Percentage Change */}
                    <div 
                      className={`flex items-center text-[10px] font-semibold mt-0.5 ${
                        coin.isPositive ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      <span className="mr-0.5">{coin.isPositive ? "▲" : "▼"}</span>
                      <span>{coin.formattedChange}</span>
                    </div>
                  </div>

                  {/* Dynamic SVG Sparkline (Adaptive to 24h trend) */}
                  <div className="w-16 h-7 shrink-0">
                    <svg viewBox="0 0 64 28" className="w-full h-full overflow-visible">
                      {coin.isPositive ? (
                        <path
                          d="M 0,20 Q 14,24 22,14 T 44,10 T 64,3"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      ) : (
                        <path
                          d="M 0,6 Q 14,4 22,14 T 44,18 T 64,25"
                          fill="none"
                          stroke="#F43F5E"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      )}
                    </svg>
                  </div>
                </div>

              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
