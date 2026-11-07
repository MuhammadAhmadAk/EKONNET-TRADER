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
import Navbar from "@/components/landing/Navbar";
import LiveTicker from "@/components/landing/LiveTicker";
import Footer from "@/components/landing/Footer";
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
      <div className="min-h-screen bg-transparent flex flex-col">
        <Navbar />
        <MaintenanceScreen 
          platformName="Forex Trades & Exchanges Platform"
          category="Forex Sector [2]"
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-gray-100 flex flex-col transition-colors duration-300">
      
      {/* Universal Navbar */}
      <Navbar />

      {/* Real-time Ticker Bar */}
      <LiveTicker />

      {/* Main Forex View */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 flex-1">
        
        {/* Banner */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs dark:shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-mono font-bold border border-orange-500/20">
              <Globe2 className="w-3 h-3 text-orange-500" />
              <span>Sovereign Currencies Engine • Low Latency STP</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Forex Trading & Sovereign Currency Rails
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Trade 168+ sovereign currency pairs with institutional tight raw spreads from 0.0 pips and dynamic margin leverage.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-sans font-medium">Selected Pair:</span>
            <span className="px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 font-bold">
              {activePair.symbol}
            </span>
          </div>
        </div>

        {/* Forex Terminal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-xs dark:shadow-xl space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Major & Cross Sovereign Currency Pairs</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Real-time interbank quote feeds</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[10px] uppercase">
                      <th className="py-2.5 pr-4">Currency Pair</th>
                      <th className="py-2.5 px-3">Bid Price</th>
                      <th className="py-2.5 px-3">Ask Price</th>
                      <th className="py-2.5 px-3">Spread</th>
                      <th className="py-2.5 pl-3 text-right">24h Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {FOREX_PAIRS.map((pair) => (
                      <tr 
                        key={pair.symbol} 
                        onClick={() => setActivePair(pair)}
                        className={`cursor-pointer transition-colors ${
                          activePair.symbol === pair.symbol ? "bg-orange-500/5 dark:bg-orange-500/10" : "hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                        }`}
                      >
                        <td className="py-3.5 pr-4">
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{pair.symbol}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">{pair.name}</div>
                        </td>
                        <td className="py-3.5 px-3 text-rose-600 dark:text-rose-400 font-bold">{pair.bid}</td>
                        <td className="py-3.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">{pair.ask}</td>
                        <td className="py-3.5 px-3 text-orange-600 dark:text-orange-400 font-semibold">{pair.spread}</td>
                        <td className={`py-3.5 pl-3 text-right font-bold ${pair.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                          {pair.change24h}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl p-5 sm:p-6 space-y-6 shadow-xs dark:shadow-xl">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Forex Order Execution</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Direct STP/ECN Liquidity Bridge</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 flex justify-between items-center font-mono">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-sans">Selected Pair</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">{activePair.symbol}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase font-sans">Spread</div>
                <div className="text-xs font-bold text-orange-600 dark:text-orange-400">{activePair.spread}</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-600 dark:text-slate-400 block font-semibold">Volume (Standard Lots):</label>
              <input
                type="number"
                step="0.1"
                value={lotSize}
                onChange={(e) => setLotSize(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-lg font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-600 dark:text-slate-400 block font-semibold">Leverage Tier:</label>
              <select
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
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
                className="py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase font-mono shadow-sm shadow-rose-600/20 transition"
              >
                Sell (Bid) {activePair.bid}
              </button>
              <button
                onClick={() => alert(`Executed BUY ${lotSize} Lots on ${activePair.symbol} at ${activePair.ask}.`)}
                className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase font-mono shadow-sm shadow-emerald-600/20 transition"
              >
                Buy (Ask) {activePair.ask}
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-gray-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>STP Order Routing • Zero Requotes</span>
            </div>
          </div>

        </div>

      </main>

      {/* Universal Footer */}
      <Footer />

    </div>
  );
}
