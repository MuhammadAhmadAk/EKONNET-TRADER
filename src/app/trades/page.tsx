"use client";

import React, { useState } from "react";
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
  BarChart2,
  ChevronRight,
  Layers
} from "lucide-react";
import { INITIAL_MARKET_TICKERS, BASE_PAIRS } from "@/lib/mockData";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function TradesPage() {
  const [selectedBasePair, setSelectedBasePair] = useState<string>("USD");
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [orderAmount, setOrderAmount] = useState<number>(500);

  return (
    <div className="min-h-screen bg-[#060913] text-gray-100 flex flex-col">
      
      {/* Top Professional Header */}
      <header className="h-20 bg-[#090e1a]/90 backdrop-blur-xl border-b border-white/10 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-md shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Layers className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="text-base font-extrabold tracking-tight text-white hidden sm:inline">
              Ekonnet<span className="text-cyan-400">Trader</span>
            </span>
          </Link>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          {/* Clean Web Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/trades" className="hover:text-white transition">Markets</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-blue-400 font-bold">Multi-Asset Terminal</span>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/trades/crypto/direct"
            className="hidden md:inline-flex px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-xs text-blue-400 font-semibold transition"
          >
            Direct Crypto Orderbook
          </Link>
          <Link
            href="/admin"
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-bold transition-all"
          >
            Admin Console
          </Link>
        </div>
      </header>

      {/* Main Terminal View */}
      <main className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8 flex-1">
        
        {/* Base Pairs Selector Bar */}
        <div className="p-4 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-400">Institutional Base Currencies:</span>
            <div className="flex space-x-2">
              {BASE_PAIRS.map(pair => (
                <button
                  key={pair}
                  onClick={() => setSelectedBasePair(pair)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedBasePair === pair 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                      : "bg-white/[0.03] text-gray-400 hover:text-white border border-white/10"
                  }`}
                >
                  {pair} Markets
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-mono text-emerald-400 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Order Matching Engine: Active (0.15% Fee)</span>
          </div>
        </div>

        {/* Trading Terminal Layout: Charts & Order Book */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 8 Columns: Live Candlestick Simulation & Market Table */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Chart Container */}
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="text-xl font-black font-mono text-cyan-400 mr-1">
                    BTC
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">BTC / {selectedBasePair} — Real-Time Index</h3>
                    <div className="text-xs text-gray-400">TradingView API Streaming Integration</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-white font-mono">$67,420.50</div>
                  <div className="text-xs text-emerald-400 font-bold font-mono">+3.42% (24h)</div>
                </div>
              </div>

              {/* Graphic Chart Display Canvas */}
              <div className="h-64 rounded-2xl bg-black/30 border border-white/10 p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="flex space-x-2 text-[11px] font-mono text-gray-500">
                  <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-200">1H</span>
                  <span className="px-2 py-0.5 rounded hover:bg-gray-800 cursor-pointer">4H</span>
                  <span className="px-2 py-0.5 rounded hover:bg-gray-800 cursor-pointer">1D</span>
                  <span className="px-2 py-0.5 rounded hover:bg-gray-800 cursor-pointer">1W</span>
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

                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>06:00 UTC</span>
                  <span>12:00 UTC</span>
                  <span>18:00 UTC</span>
                  <span>Live Feed</span>
                </div>
              </div>
            </div>

            {/* Markets List */}
            <div className="rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl overflow-hidden p-6 space-y-4 shadow-xl">
              <h4 className="text-base font-bold text-white">Live Market Pairs Overview</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-500 font-mono uppercase text-[10px]">
                      <th className="py-2.5">Pair</th>
                      <th className="py-2.5">Category</th>
                      <th className="py-2.5">Price</th>
                      <th className="py-2.5">24h Change</th>
                      <th className="py-2.5">24h Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/80 font-mono">
                    {INITIAL_MARKET_TICKERS.map(t => (
                      <tr key={t.symbol} className="hover:bg-white/[0.03] transition-colors cursor-pointer">
                        <td className="py-3 font-bold text-white">{t.symbol}</td>
                        <td className="py-3 text-gray-400">{t.category}</td>
                        <td className="py-3 text-gray-200">{formatCurrency(t.price, t.category === 'Forex' ? '' : 'USD')}</td>
                        <td className={`py-3 font-bold ${t.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {formatPercent(t.change24h)}
                        </td>
                        <td className="py-3 text-gray-400">{t.volume24h}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right 4 Columns: Buy/Sell Execution Form */}
          <div className="lg:col-span-4 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl p-6 space-y-6 shadow-2xl">
            <div>
              <h3 className="text-base font-bold text-white">Order Execution Panel</h3>
              <p className="text-xs text-slate-400">Direct High-Speed Liquidity Execution</p>
            </div>

            {/* Buy / Sell switch */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-black/30 border border-white/10">
              <button
                onClick={() => setOrderType("buy")}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  orderType === "buy" ? "bg-emerald-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Buy BTC
              </button>
              <button
                onClick={() => setOrderType("sell")}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  orderType === "sell" ? "bg-rose-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Sell BTC
              </button>
            </div>

            {/* Amount input */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 block">Order Amount (USD):</label>
              <input
                type="number"
                value={orderAmount}
                onChange={(e) => setOrderAmount(Math.max(0, Number(e.target.value)))}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-lg font-bold font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Order Summary */}
            <div className="p-4 rounded-2xl bg-black/20 border border-white/10 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-gray-400">
                <span>Estimated Crypto:</span>
                <span className="text-emerald-400 font-bold">{(orderAmount / 67420.50).toFixed(6)} BTC</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Fee Deducted (0.15%):</span>
                <span className="text-gray-300">-${(orderAmount * 0.0015).toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-gray-400 pt-1 border-t border-white/10">
                <span>Liquidity Mode:</span>
                <span className="text-blue-400">Ekonnet Internal Pool</span>
              </div>
            </div>

            <button
              onClick={() => alert(`Executed ${orderType.toUpperCase()} order for $${orderAmount}. Ekonnet fee of 0.15% deducted automatically.`)}
              className={`w-full py-4 rounded-xl font-bold text-sm text-white shadow-xl transition-all ${
                orderType === "buy" 
                  ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25" 
                  : "bg-rose-600 hover:bg-rose-500 shadow-rose-600/25"
              }`}
            >
              Confirm {orderType.toUpperCase()} Order
            </button>

            <p className="text-[11px] text-gray-500 text-center font-mono">
              Protected by TLS 1.3 & Multi-Sig Smart Settlement
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}
