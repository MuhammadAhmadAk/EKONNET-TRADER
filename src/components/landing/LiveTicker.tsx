"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useBinanceLivePrices, LiveTickerItem } from "@/hooks/useBinanceLivePrices";

export default function LiveTicker() {
  const { allTickers } = useBinanceLivePrices();

  // Helper renderer for a single ticker item
  const renderTickerCard = (ticker: LiveTickerItem, index: number, isDuplicate = false) => {
    const isPositive = ticker.change24h >= 0;
    const isFlashUp = ticker.priceDirection === "up";
    const isFlashDown = ticker.priceDirection === "down";

    // Format target trade link
    const targetLink =
      ticker.category === "Crypto"
        ? `/trades/crypto/direct?pair=${ticker.pair.replace("USDT", "_USD")}`
        : ticker.category === "Forex"
        ? `/trades/forex?pair=${ticker.symbol.replace("/", "_")}`
        : `/trades/shares`;

    return (
      <Link
        key={`${ticker.symbol}-${index}-${isDuplicate ? "dup" : "orig"}`}
        href={targetLink}
        className="flex items-center gap-2.5 shrink-0 px-4 py-1.5 hover:bg-orange-500/5 dark:hover:bg-white/5 rounded-lg transition-all duration-200 group cursor-pointer"
      >
        {/* Symbol & Category */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-orange-500 transition-colors">
            {ticker.symbol}
          </span>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-mono font-medium tracking-tight px-1 py-0.2 rounded bg-slate-100 dark:bg-white/5">
            {ticker.category}
          </span>
        </div>

        {/* Live Price with Real-Time Directional Flash */}
        <span
          className={`text-xs font-mono font-semibold transition-all duration-300 px-1 rounded ${
            isFlashUp
              ? "text-emerald-500 bg-emerald-500/10 font-bold scale-105"
              : isFlashDown
              ? "text-rose-500 bg-rose-500/10 font-bold scale-105"
              : "text-slate-900 dark:text-slate-200"
          }`}
        >
          {ticker.formattedPrice}
        </span>

        {/* 24h Percentage Change */}
        <div
          className={`flex items-center text-[10px] font-bold ${
            isPositive ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3 mr-0.5 shrink-0" />
          ) : (
            <ArrowDownRight className="w-3 h-3 mr-0.5 shrink-0" />
          )}
          <span>{ticker.formattedChange}</span>
        </div>

        {/* Micro Divider */}
        <span className="text-slate-200 dark:text-white/10 ml-2 select-none">•</span>
      </Link>
    );
  };

  return (
    <div className="w-full relative bg-white/80 dark:bg-[#070b14]/90 border-b border-slate-200/80 dark:border-white/10 h-10 overflow-hidden select-none backdrop-blur-md transition-colors z-30 flex items-center">
      
      {/* Left Gradient Fade Edge */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white/95 dark:from-[#070b14]/95 to-transparent pointer-events-none z-10" />

      {/* Full-Width Infinite Seamless Scrolling Track */}
      <div className="w-full overflow-hidden">
        <div className="animate-ticker-marquee flex items-center">
          {/* First set of full-market items */}
          {allTickers.map((ticker, idx) => renderTickerCard(ticker, idx, false))}
          {/* Second duplicate set for perfectly seamless, infinite marquee loop */}
          {allTickers.map((ticker, idx) => renderTickerCard(ticker, idx, true))}
        </div>
      </div>

      {/* Right Gradient Fade Edge */}
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white/95 dark:from-[#070b14]/95 to-transparent pointer-events-none z-10" />
    </div>
  );
}
