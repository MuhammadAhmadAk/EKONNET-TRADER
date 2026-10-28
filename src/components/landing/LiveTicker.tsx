"use client";

import React from "react";
import { INITIAL_MARKET_TICKERS } from "@/lib/mockData";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function LiveTicker() {
  return (
    <div className="w-full bg-slate-950 border-b border-slate-800/80 py-2 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
          
          <div className="flex items-center gap-2 pr-3 border-r border-slate-800 text-[11px] font-bold text-slate-400 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wider uppercase">Live Markets</span>
          </div>
          
          {INITIAL_MARKET_TICKERS.map((ticker) => {
            const isPositive = ticker.change24h >= 0;
            return (
              <div 
                key={ticker.symbol} 
                className="flex items-center gap-2.5 shrink-0 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/30 transition cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">
                    {ticker.symbol}
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                    {ticker.category}
                  </span>
                </div>

                <span className="text-xs font-mono font-semibold text-slate-200">
                  {formatCurrency(ticker.price, ticker.category === 'Forex' ? '' : 'USD')}
                </span>

                <div className={`flex items-center text-[10px] font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  <span>{formatPercent(ticker.change24h)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
