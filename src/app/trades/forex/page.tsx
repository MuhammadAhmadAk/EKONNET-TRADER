"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Globe2, 
  TrendingUp, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  BarChart2, 
  Lock,
  ArrowRight
} from "lucide-react";
import { getPlatformStatus } from "@/lib/systemStatus";
import MaintenanceScreen from "@/components/common/MaintenanceScreen";

interface ForexPair {
  symbol: string;
  name: string;
  bid: string;
  ask: string;
  spread: string;
  change24h: string;
  isPositive: boolean;
}

const FOREX_PAIRS: ForexPair[] = [
  { symbol: "EUR/USD", name: "Euro / US Dollar", bid: "1.08452", ask: "1.08460", spread: "0.8 pips", change24h: "+0.32%", isPositive: true },
  { symbol: "GBP/USD", name: "British Pound / US Dollar", bid: "1.29310", ask: "1.29322", spread: "1.2 pips", change24h: "+0.18%", isPositive: true },
  { symbol: "USD/JPY", name: "US Dollar / Japanese Yen", bid: "153.240", ask: "153.251", spread: "1.1 pips", change24h: "-0.45%", isPositive: false },
  { symbol: "AUD/USD", name: "Australian Dollar / US Dollar", bid: "0.65820", ask: "0.65830", spread: "1.0 pips", change24h: "+0.25%", isPositive: true },
  { symbol: "USD/CAD", name: "US Dollar / Canadian Dollar", bid: "1.38910", ask: "1.38924", spread: "1.4 pips", change24h: "-0.12%", isPositive: false },
  { symbol: "EUR/GBP", name: "Euro / British Pound", bid: "0.83850", ask: "0.83862", spread: "1.2 pips", change24h: "+0.08%", isPositive: true }
];

export default function ForexTradingPage() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [activePair, setActivePair] = useState<ForexPair>(FOREX_PAIRS[0]);
  const [lotSize, setLotSize] = useState<number>(1.0);
  const [leverage, setLeverage] = useState<number>(30);

  useEffect(() => {
    if (getPlatformStatus("forex") === "Maintenance") {
      setIsMaintenance(true);
    }
  }, []);

  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-[#060913] text-white">
        <header className="h-20 bg-[#090e1a]/90 border-b border-white/10 px-6 sm:px-12 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-white">Ekonnet<span className="text-cyan-400">Trader</span></Link>
          <Link href="/admin" className="text-xs text-blue-400 font-bold">Admin Console</Link>
        </header>
        <MaintenanceScreen 
          platformName="Forex Trades & Exchanges Platform"
          category="Forex Sector [2]"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060913] text-gray-100 flex flex-col">
      
      {/* Top Header */}
      <header className="h-20 bg-[#090e1a]/90 backdrop-blur-xl border-b border-white/10 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-400 p-[1px] shadow-md shadow-purple-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Globe2 className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <span className="text-base font-extrabold tracking-tight text-white hidden sm:inline">
              Ekonnet<span className="text-purple-400">Forex</span>
            </span>
          </Link>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          {/* Clean Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/trades" className="hover:text-white transition">Ways to Invest</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-purple-400 font-bold">Forex Trading Markets</span>
          </nav>
        </div>

        <Link
          href="/admin"
          className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-bold transition-all"
        >
          Admin Console
        </Link>
      </header>

      {/* Main Forex View */}
      <main className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8 flex-1">
        
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-mono font-bold border border-purple-500/20">
              <Globe2 className="w-3 h-3 text-purple-400" />
              <span>Sovereign Currencies Engine • Independent Sector</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Forex Trades & Exchanges Platforms
            </h1>
            <p className="text-xs text-slate-400">
              Trade 168+ sovereign currency pairs with institutional tight raw spreads from 0.0 pips and dynamic margin leverage.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-400">Active Pair:</span>
            <span className="px-3 py-1.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 font-bold">
              {activePair.symbol}
            </span>
          </div>
        </div>

        {/* Forex Terminal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl space-y-4">
              <h3 className="text-base font-bold text-white">Major & Cross Sovereign Currency Pairs</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-500 text-[10px] uppercase">
                      <th className="py-2.5 pr-4">Currency Pair</th>
                      <th className="py-2.5 px-3">Bid Price</th>
                      <th className="py-2.5 px-3">Ask Price</th>
                      <th className="py-2.5 px-3">Spread</th>
                      <th className="py-2.5 pl-3 text-right">24h Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {FOREX_PAIRS.map((pair) => (
                      <tr 
                        key={pair.symbol} 
                        onClick={() => setActivePair(pair)}
                        className={`cursor-pointer transition-colors ${
                          activePair.symbol === pair.symbol ? "bg-purple-500/10" : "hover:bg-white/[0.02]"
                        }`}
                      >
                        <td className="py-3.5 pr-4">
                          <div className="font-bold text-white text-sm">{pair.symbol}</div>
                          <div className="text-[10px] text-slate-400">{pair.name}</div>
                        </td>
                        <td className="py-3.5 px-3 text-rose-400 font-bold">{pair.bid}</td>
                        <td className="py-3.5 px-3 text-emerald-400 font-bold">{pair.ask}</td>
                        <td className="py-3.5 px-3 text-cyan-400">{pair.spread}</td>
                        <td className={`py-3.5 pl-3 text-right font-bold ${pair.isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                          {pair.change24h}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl p-6 space-y-6 shadow-2xl">
            <div>
              <h3 className="text-base font-bold text-white">Forex Order Execution</h3>
              <p className="text-xs text-slate-400">Direct STP/ECN Liquidity Bridge</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 flex justify-between items-center font-mono">
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Selected Pair</div>
                <div className="text-lg font-black text-white">{activePair.symbol}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase">Spread</div>
                <div className="text-xs font-bold text-cyan-400">{activePair.spread}</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 block font-semibold font-mono">Volume (Standard Lots):</label>
              <input
                type="number"
                step="0.1"
                value={lotSize}
                onChange={(e) => setLotSize(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-lg font-mono font-bold text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 block font-semibold font-mono">Leverage Tier:</label>
              <select
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              >
                <option value={10}>1:10 Conservative</option>
                <option value={30}>1:30 Retail Standard</option>
                <option value={50}>1:50 Pro Margin</option>
                <option value={100}>1:100 Institutional</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => alert(`Executed SELL ${lotSize} Lots on ${activePair.symbol} at ${activePair.bid}.`)}
                className="py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase font-mono shadow-lg shadow-rose-600/25 transition"
              >
                Sell (Bid) {activePair.bid}
              </button>
              <button
                onClick={() => alert(`Executed BUY ${lotSize} Lots on ${activePair.symbol} at ${activePair.ask}.`)}
                className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase font-mono shadow-lg shadow-emerald-600/25 transition"
              >
                Buy (Ask) {activePair.ask}
              </button>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
