"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  TrendingUp, 
  Coins, 
  Globe, 
  Briefcase, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Zap,
  BarChart2
} from "lucide-react";
import { INITIAL_MARKET_TICKERS, BASE_PAIRS } from "@/lib/mockData";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function TradesPage() {
  const [selectedBasePair, setSelectedBasePair] = useState<string>("USD");
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [orderAmount, setOrderAmount] = useState<number>(500);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col">
      
      {/* Top Navbar */}
      <header className="h-20 bg-[#0E1424] border-b border-[#1F293D] px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="p-2 rounded-xl bg-[#161F33] text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white flex items-center space-x-2">
              <span>Ekonnet Trading Terminal</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                SECTION 12 & 14 MODULAR ROUTE
              </span>
            </h1>
            <p className="text-xs text-gray-400">Independent fault-tolerant sub-page architecture</p>
          </div>
        </div>

        <Link
          href="/portal-mgmt-auth"
          className="px-4 py-2 rounded-xl bg-[#161F33] border border-blue-500/20 text-xs text-blue-400 font-bold hover:bg-[#1E2B47] transition-all"
        >
          Management Console
        </Link>
      </header>

      {/* Main Terminal View */}
      <main className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8 flex-1">
        
        {/* Base Pairs Selector Bar (Section 23) */}
        <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F293D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-gray-400">5 Main Trading Base Pairs (Section 23):</span>
            <div className="flex space-x-2">
              {BASE_PAIRS.map(pair => (
                <button
                  key={pair}
                  onClick={() => setSelectedBasePair(pair)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedBasePair === pair 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                      : "bg-[#0B0F19] text-gray-400 hover:text-white border border-gray-800"
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
            <div className="p-6 rounded-3xl bg-[#111827] border border-[#1F293D] shadow-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold font-mono">
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
              <div className="h-64 rounded-2xl bg-[#0B0F19] border border-gray-800/80 p-4 flex flex-col justify-between relative overflow-hidden">
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
            <div className="rounded-3xl bg-[#111827] border border-[#1F293D] overflow-hidden p-6 space-y-4">
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
                      <tr key={t.symbol} className="hover:bg-[#161F33] cursor-pointer">
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
          <div className="lg:col-span-4 rounded-3xl bg-[#111827] border border-[#1F293D] p-6 space-y-6 shadow-2xl">
            <div>
              <h3 className="text-base font-bold text-white">Order Execution Panel</h3>
              <p className="text-xs text-gray-400">Direct exchange settlement (Section 14.[1][A])</p>
            </div>

            {/* Buy / Sell switch */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-[#0B0F19] border border-gray-800">
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
                className="w-full bg-[#0B0F19] border border-[#1F293D] rounded-xl p-3 text-lg font-bold font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Order Summary */}
            <div className="p-4 rounded-2xl bg-[#0B0F19] border border-gray-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-gray-400">
                <span>Estimated Crypto:</span>
                <span className="text-emerald-400 font-bold">{(orderAmount / 67420.50).toFixed(6)} BTC</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Fee Deducted (0.15%):</span>
                <span className="text-gray-300">-${(orderAmount * 0.0015).toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-gray-400 pt-1 border-t border-gray-800">
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
              Protected by TLS 1.3 & Multi-Sig Escrow
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}
