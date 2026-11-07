"use client";

import React from "react";
import { INITIAL_MARKET_TICKERS } from "@/lib/mockData";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useBinanceLivePrices } from "@/hooks/useBinanceLivePrices";

export default function LiveTicker() {
  const { coins, isConnected } = useBinanceLivePrices();

  // Merge live Binance crypto prices with static Forex pairs
  const tickers = INITIAL_MARKET_TICKERS.map((ticker) => {
    const liveMatch = coins.find((c) => ticker.symbol.startsWith(c.symbol));
    if (liveMatch) {
      return {
        ...ticker,
        price: liveMatch.price,
        change24h: liveMatch.changePercent,
        priceDirection: liveMatch.priceDirection,
      };
    }
    return ticker;
  });

  return (
    <div className="w-full bg-white/60 dark:bg-black/20 border-b border-slate-200/80 dark:border-white/5 py-2 overflow-hidden select-none backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
          
          <div className="flex items-center gap-2 pr-4 border-r border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-300 shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" : "bg-amber-500"}`} />
            <span className="tracking-wider uppercase">Binance Live</span>
          </div>
          
          {tickers.map((ticker) => {
            const isPositive = ticker.change24h >= 0;
            const isFlashUp = (ticker as any).priceDirection === "up";
            const isFlashDown = (ticker as any).priceDirection === "down";

            return (
              <div 
                key={ticker.symbol} 
                className="flex items-center gap-2.5 shrink-0 px-3 py-0.5 hover:text-orange-500 transition cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {ticker.symbol}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono">
                    {ticker.category}
                  </span>
                </div>

                <span className={`text-xs font-mono font-semibold transition-colors duration-300 ${
                  isFlashUp ? "text-emerald-500 font-bold" : isFlashDown ? "text-rose-500 font-bold" : "text-slate-800 dark:text-slate-200"
                }`}>
                  {formatCurrency(ticker.price, ticker.category === 'Forex' ? '' : 'USD')}
                </span>

                <div className={`flex items-center text-[10px] font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
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
