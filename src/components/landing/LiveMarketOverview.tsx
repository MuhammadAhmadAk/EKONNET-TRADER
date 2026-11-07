"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface CryptoPriceCard {
  name: string;
  symbol: string;
  price: string;
  change: string;
  iconBg: string;
  iconText: string;
}

const FEATURED_COINS: CryptoPriceCard[] = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: "$67,245.32",
    change: "+2.48%",
    iconBg: "bg-amber-500",
    iconText: "₿",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: "$3,248.17",
    change: "+1.87%",
    iconBg: "bg-blue-600",
    iconText: "Ξ",
  },
  {
    name: "Solana",
    symbol: "SOL",
    price: "$142.67",
    change: "+2.21%",
    iconBg: "bg-slate-900 dark:bg-purple-600 text-cyan-300",
    iconText: "◎",
  },
  {
    name: "BNB",
    symbol: "BNB",
    price: "$593.21",
    change: "+1.32%",
    iconBg: "bg-yellow-500",
    iconText: "❖",
  },
  {
    name: "XRP",
    symbol: "XRP",
    price: "$0.52",
    change: "+1.12%",
    iconBg: "bg-slate-900 dark:bg-slate-800",
    iconText: "✕",
  },
];

export default function LiveMarketOverview() {
  return (
    <section className="py-8 sm:py-12 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">
              <span className="w-5 h-[2px] bg-orange-500 inline-block" />
              <span>Market Overview</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Live Market Prices
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track real-time prices and market trends.
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

        {/* 5 Coin Cards Grid (Browzzit Exact Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {FEATURED_COINS.map((coin) => (
            <Link
              key={coin.symbol}
              href={`/trades/crypto/direct?pair=${coin.symbol}_USD`}
              className="group p-4 rounded-2xl bg-white dark:bg-[#0c1222]/80 border border-slate-100 dark:border-white/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              {/* Coin Info */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`w-9 h-9 rounded-full ${coin.iconBg} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}>
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

              {/* Price & Sparkline */}
              <div className="flex items-end justify-between gap-2 mt-1">
                <div>
                  <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                    {coin.price}
                  </div>
                  <div className="flex items-center text-[10px] font-semibold text-emerald-500 mt-0.5">
                    <span className="mr-0.5">▲</span>
                    <span>{coin.change}</span>
                  </div>
                </div>

                {/* Smooth Green SVG Sparkline */}
                <div className="w-16 h-7 shrink-0">
                  <svg viewBox="0 0 64 28" className="w-full h-full overflow-visible">
                    <path
                      d="M 0,20 Q 14,24 22,14 T 44,10 T 64,3"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
