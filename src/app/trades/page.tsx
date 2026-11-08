"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Coins, 
  Globe, 
  Briefcase, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck, 
  Zap, 
  Lock,
  BarChart2, 
  ChevronRight, 
  Layers
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import LiveTicker from "@/components/landing/LiveTicker";
import Footer from "@/components/landing/Footer";
import { INITIAL_MARKET_TICKERS, BASE_PAIRS } from "@/lib/mockData";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function TradesPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedBasePair, setSelectedBasePair] = useState<string>("USD");
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [orderAmount, setOrderAmount] = useState<number>(500);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-gray-100 flex flex-col transition-colors duration-300">
      
      {/* Universal Navbar */}
      <Navbar />

      {/* Real-time Ticker Bar */}
      <LiveTicker />

      {/* Main Terminal View */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 flex-1">
        
        {/* Banner with Breadcrumbs & Base Pairs Selector */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs dark:shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-mono font-bold border border-orange-500/20">
              <Zap className="w-3 h-3 text-orange-500" />
              <span>Multi-Asset Liquidity Terminal • Ultra-Low Latency</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Global Multi-Asset Markets
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct institutional order execution across crypto, forex, and equities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">Base Currency:</span>
            <div className="flex bg-slate-100 dark:bg-black/40 p-1 rounded-xl border border-slate-200 dark:border-white/10 gap-1">
              {BASE_PAIRS.map(pair => (
                <button
                  key={pair}
                  onClick={() => setSelectedBasePair(pair)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedBasePair === pair 
                      ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-xs" 
                      : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {pair}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trading Terminal Layout: Charts & Order Book */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left 8 Columns: Live Candlestick Simulation & Market Table */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Chart Container */}
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-xs dark:shadow-xl space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-black font-mono text-base border border-orange-500/20">
                    BTC
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">BTC / {selectedBasePair} — Real-Time Index</h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Institutional Aggregated Pricing Feed</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">$67,420.50</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold font-mono">+3.42% (24h)</div>
                </div>
              </div>

              {/* Graphic Chart Display Canvas */}
              <div className="h-64 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="flex space-x-2 text-[11px] font-mono text-slate-500 dark:text-gray-400">
                  <span className="px-2.5 py-1 rounded-md bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-200 shadow-xs border border-slate-200 dark:border-white/10">1H</span>
                  <span className="px-2.5 py-1 rounded-md hover:bg-white dark:hover:bg-gray-800 cursor-pointer">4H</span>
                  <span className="px-2.5 py-1 rounded-md hover:bg-white dark:hover:bg-gray-800 cursor-pointer">1D</span>
                  <span className="px-2.5 py-1 rounded-md hover:bg-white dark:hover:bg-gray-800 cursor-pointer">1W</span>
                </div>

                {/* Simulated candlesticks */}
                <div className="flex items-end justify-between h-40 pt-4 px-2">
                  {[45, 52, 48, 60, 58, 70, 65, 80, 75, 88, 82, 95, 92, 110, 105, 120].map((h, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-0.5 bg-emerald-500/40 h-3" />
                      <div 
                        style={{ height: `${h}px` }} 
                        className={`w-3.5 rounded-sm ${i % 3 === 0 ? 'bg-rose-500' : 'bg-emerald-500'} shadow-sm`} 
                      />
                      <div className="w-0.5 bg-emerald-500/40 h-3" />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 dark:text-gray-500 font-mono">
                  <span>06:00 UTC</span>
                  <span>12:00 UTC</span>
                  <span>18:00 UTC</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Live Matching Feed</span>
                </div>
              </div>
            </div>

            {/* Markets List */}
            <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl overflow-hidden p-5 sm:p-6 space-y-4 shadow-xs dark:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Live Market Pairs Overview</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Institutional order routing across all supported pairs</p>
                </div>
                <Link
                  href="/trades/crypto/direct"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline"
                >
                  <span>Advanced Terminal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-gray-800 text-slate-500 dark:text-gray-400 font-mono uppercase text-[10px]">
                      <th className="py-2.5">Pair</th>
                      <th className="py-2.5">Category</th>
                      <th className="py-2.5">Price</th>
                      <th className="py-2.5">24h Change</th>
                      <th className="py-2.5">24h Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-gray-800/80 font-mono">
                    {INITIAL_MARKET_TICKERS.map(t => (
                      <tr key={t.symbol} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer">
                        <td className="py-3 font-bold text-slate-900 dark:text-white">{t.symbol}</td>
                        <td className="py-3 text-slate-500 dark:text-gray-400">{t.category}</td>
                        <td className="py-3 text-slate-900 dark:text-gray-200">{formatCurrency(t.price, t.category === 'Forex' ? '' : 'USD')}</td>
                        <td className={`py-3 font-bold ${t.change24h >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {formatPercent(t.change24h)}
                        </td>
                        <td className="py-3 text-slate-500 dark:text-gray-400">{t.volume24h}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right 4 Columns: Buy/Sell Execution Form */}
          <div className="lg:col-span-4 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl p-5 sm:p-6 space-y-6 shadow-xs dark:shadow-xl">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Order Execution Panel</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Direct High-Speed Liquidity Execution</p>
            </div>

            {/* Buy / Sell switch */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setOrderType("buy")}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  orderType === "buy" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Buy BTC
              </button>
              <button
                onClick={() => setOrderType("sell")}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  orderType === "sell" ? "bg-rose-600 text-white shadow-xs" : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Sell BTC
              </button>
            </div>

            {/* Amount input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600 dark:text-gray-400 block">Order Amount (USD):</label>
              <input
                type="number"
                value={orderAmount}
                onChange={(e) => setOrderAmount(Math.max(0, Number(e.target.value)))}
                className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-lg font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* Order Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-600 dark:text-gray-400">
                <span>Estimated Crypto:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{(orderAmount / 67420.50).toFixed(6)} BTC</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-gray-400">
                <span>Fee Deducted (0.15%):</span>
                <span className="text-slate-800 dark:text-gray-300 font-medium">-${(orderAmount * 0.0015).toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-gray-400 pt-1 border-t border-slate-200 dark:border-white/10">
                <span>Liquidity Mode:</span>
                <span className="text-orange-600 dark:text-orange-400 font-semibold">Ekonnet Internal Pool</span>
              </div>
            </div>

            {!currentUser ? (
              <Link
                href="/?auth=login&from=/trades"
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 shadow-orange-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>Sign In to Place Trade</span>
              </Link>
            ) : (
              <button
                onClick={() => alert(`Executed ${orderType.toUpperCase()} order for $${orderAmount}. Ekonnet fee of 0.15% deducted automatically.`)}
                className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all ${
                  orderType === "buy" 
                    ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20" 
                    : "bg-rose-600 hover:bg-rose-500 shadow-rose-600/20"
                }`}
              >
                Confirm {orderType.toUpperCase()} Order
              </button>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-gray-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>TLS 1.3 & Multi-Sig Smart Settlement</span>
            </div>
          </div>

        </div>

      </main>

      {/* Universal Footer */}
      <Footer />

    </div>
  );
}
