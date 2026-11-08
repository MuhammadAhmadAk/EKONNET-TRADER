"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Cpu, 
  Globe, 
  ExternalLink, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Lock,
  CheckCircle2, 
  RefreshCw,
  Coins
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import LiveTicker from "@/components/landing/LiveTicker";
import Footer from "@/components/landing/Footer";
import { getPlatformStatus } from "@/lib/systemStatus";
import MaintenanceScreen from "@/components/common/MaintenanceScreen";

interface LiquidityPool {
  id: string;
  provider: string;
  pair: string;
  depthUSD: string;
  avgSlippage: string;
  executionSpeed: string;
  status: "Connected" | "Optimal";
}

const MOCK_POOLS: LiquidityPool[] = [
  { id: "1", provider: "Global Institutional Pool Alpha", pair: "BTC / USDT", depthUSD: "$142,500,000", avgSlippage: "< 0.01%", executionSpeed: "1.2 ms", status: "Optimal" },
  { id: "2", provider: "Cross-Venue Liquidity Bridge", pair: "ETH / USD", depthUSD: "$88,200,000", avgSlippage: "< 0.02%", executionSpeed: "2.1 ms", status: "Optimal" },
  { id: "3", provider: "Ekonnet Tier-1 Aggregator Hub", pair: "SOL / USDC", depthUSD: "$34,100,000", avgSlippage: "< 0.03%", executionSpeed: "1.8 ms", status: "Optimal" },
  { id: "4", provider: "High-Volume Block Routing", pair: "XRP / USD", depthUSD: "$25,600,000", avgSlippage: "< 0.04%", executionSpeed: "3.5 ms", status: "Connected" }
];

export default function ThirdPartyCryptoPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [selectedPool, setSelectedPool] = useState<string>("1");
  const [routedAmount, setRoutedAmount] = useState<number>(25000);

  useEffect(() => {
    if (getPlatformStatus("crypto-third-party") === "Maintenance") {
      setIsMaintenance(true);
    }

    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col">
        <Navbar />
        <MaintenanceScreen 
          platformName="Third Party Crypto Trades & Exchanges Platform"
          category="Crypto Sector [C]"
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

      {/* Main Aggregator View */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 flex-1">
        
        {/* Banner */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs dark:shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-mono font-bold border border-orange-500/20">
              <Zap className="w-3 h-3 text-orange-500" />
              <span>Multi-Source Liquidity Aggregator • Independent Sector</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Third-Party Liquidity Hub & Smart Routing
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Consolidated deep book liquidity aggregated across leading global venues for block orders with minimal price impact.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20 font-semibold">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
            <span>Smart Routing: Active</span>
          </div>
        </div>

        {/* Aggregator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-xs dark:shadow-xl space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Connected Institutional Liquidity Venues</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Select a venue pool to route liquidity through</p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {MOCK_POOLS.map((pool) => (
                  <div
                    key={pool.id}
                    onClick={() => setSelectedPool(pool.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      selectedPool === pool.id
                        ? "bg-orange-500/5 dark:bg-orange-500/10 border-orange-500 shadow-sm"
                        : "bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                        <span>{pool.provider}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-semibold">{pool.pair}</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {pool.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-white/5 font-sans">
                      <div>Available Depth: <span className="text-slate-900 dark:text-white font-bold font-mono">{pool.depthUSD}</span></div>
                      <div>Avg Slippage: <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">{pool.avgSlippage}</span></div>
                      <div>Latency: <span className="text-orange-600 dark:text-orange-400 font-bold font-mono">{pool.executionSpeed}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl p-5 sm:p-6 space-y-6 shadow-xs dark:shadow-xl">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Aggregated Execution Route</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Automated split-route smart matching</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-600 dark:text-slate-400 block font-semibold">Block Order Size (USD):</label>
              <input
                type="number"
                value={routedAmount}
                onChange={(e) => setRoutedAmount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-lg font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-xs font-mono space-y-2">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Routing Algorithm:</span>
                <span className="text-orange-600 dark:text-orange-400 font-bold">Best Price Execution</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Slippage Protection:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Strict 0.05% Cap</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-white/10">
                <span>Aggregator Fee:</span>
                <span className="text-slate-900 dark:text-white font-bold">0.08% Institutional</span>
              </div>
            </div>

            {!currentUser ? (
              <Link
                href="/?auth=login&from=/trades/crypto/third-party"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In to Route Order</span>
              </Link>
            ) : (
              <button
                onClick={() => alert(`Routed block order of $${routedAmount} across optimized liquidity venues.`)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all"
              >
                Route Aggregated Order
              </button>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-gray-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Multi-Source Verified Routing</span>
            </div>
          </div>

        </div>

      </main>

      {/* Universal Footer */}
      <Footer />

    </div>
  );
}
