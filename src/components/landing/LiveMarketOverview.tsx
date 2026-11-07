"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

interface CryptoPriceCard {
  name: string;
  symbol: string;
  price: number;
  change: number;
  iconBg: string;
  iconText: string;
  color: string;
}

const FEATURED_COINS: CryptoPriceCard[] = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: 67245.32,
    change: 2.48,
    iconBg: "bg-orange-500",
    iconText: "₿",
    color: "#F97316",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: 3248.17,
    change: 1.87,
    iconBg: "bg-blue-600",
    iconText: "Ξ",
    color: "#2563EB",
  },
  {
    name: "Solana",
    symbol: "SOL",
    price: 142.67,
    change: 2.21,
    iconBg: "bg-purple-600",
    iconText: "◎",
    color: "#9333EA",
  },
  {
    name: "BNB",
    symbol: "BNB",
    price: 593.21,
    change: 1.32,
    iconBg: "bg-amber-500",
    iconText: "❖",
    color: "#F59E0B",
  },
  {
    name: "XRP",
    symbol: "XRP",
    price: 0.524,
    change: 1.12,
    iconBg: "bg-slate-900 dark:bg-white text-white dark:text-slate-900",
    iconText: "✕",
    color: "#0F172A",
  },
];

export default function LiveMarketOverview() {
  return (
    <section className="py-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
              <span className="w-5 h-[2px] bg-orange-500 inline-block" />
              <span>Market Overview</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Live Market Prices
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track real-time prices, 5 base settlement pairs, and market trends.
            </p>
          </div>

          <Link
            href="/trades/crypto/direct"
            className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition shrink-0"
          >
            <span>View All Markets</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 5 Coin Cards Grid (Browzzit Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {FEATURED_COINS.map((coin) => {
            const isPositive = coin.change >= 0;
            return (
              <Link
                key={coin.symbol}
                href={`/trades/crypto/direct?pair=${coin.symbol}_USD`}
                className="group p-4 rounded-2xl bg-white/85 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-lg hover:border-orange-500/40 transition-all duration-300 backdrop-blur-md flex flex-col justify-between"
              >
                {/* Coin Info */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={`w-9 h-9 rounded-full ${coin.iconBg} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 group-hover:scale-105 transition transform`}>
                    {coin.iconText}
                  </div>
                  <div className="leading-tight truncate">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {coin.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono font-semibold">
                      {coin.symbol}
                    </div>
                  </div>
                </div>

                {/* Price & Sparkline */}
                <div className="flex items-end justify-between gap-2 mt-1">
                  <div>
                    <div className="text-sm font-black font-mono text-slate-900 dark:text-white">
                      ${coin.price > 1 ? coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : coin.price.toFixed(4)}
                    </div>
                    <div className={`flex items-center text-[10px] font-bold mt-0.5 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                      <span>+{coin.change}%</span>
                    </div>
                  </div>

                  {/* Lightweight SVG Sparkline */}
                  <div className="w-16 h-8 shrink-0">
                    <svg viewBox="0 0 64 32" className="w-full h-full overflow-visible">
                      <path
                        d="M 0,22 Q 12,28 20,18 T 40,12 T 64,4"
                        fill="none"
                        stroke={isPositive ? "#10B981" : "#EF4444"}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
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
