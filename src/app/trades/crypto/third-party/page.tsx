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
  CheckCircle2, 
  RefreshCw,
  Coins
} from "lucide-react";
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
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [selectedPool, setSelectedPool] = useState<string>("1");
  const [routedAmount, setRoutedAmount] = useState<number>(25000);

  useEffect(() => {
    if (getPlatformStatus("crypto-third-party") === "Maintenance") {
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
          platformName="Third Party Crypto Trades & Exchanges Platform"
          category="Crypto Sector [C]"
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
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-400 p-[1px] shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="text-base font-extrabold tracking-tight text-white hidden sm:inline">
              Ekonnet<span className="text-cyan-400">Aggregator</span>
            </span>
          </Link>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          {/* Clean Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/trades" className="hover:text-white transition">Ways to Invest</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-cyan-400 font-bold">Third-Party Liquidity Hub</span>
          </nav>
        </div>

        <Link
          href="/admin"
          className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-bold transition-all"
        >
          Admin Console
        </Link>
      </header>

      {/* Main Aggregator View */}
      <main className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8 flex-1">
        
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold border border-cyan-500/20">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Multi-Source Liquidity Aggregator • Independent Sector</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Third Party Cryptocurrency Trades & Exchanges
            </h1>
            <p className="text-xs text-slate-400">
              Consolidated deep book liquidity aggregated across leading global venues for block orders with minimal price impact.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Smart Order Routing: Active</span>
          </div>
        </div>

        {/* Aggregator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl space-y-4">
              <h3 className="text-base font-bold text-white">Connected Institutional Liquidity Venues</h3>
              <div className="space-y-3 font-mono text-xs">
                {MOCK_POOLS.map((pool) => (
                  <div
                    key={pool.id}
                    onClick={() => setSelectedPool(pool.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      selectedPool === pool.id
                        ? "bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                        : "bg-black/20 border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{pool.provider}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{pool.pair}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {pool.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 pt-2 border-t border-white/5">
                      <div>Available Depth: <span className="text-white font-bold">{pool.depthUSD}</span></div>
                      <div>Avg Slippage: <span className="text-emerald-400 font-bold">{pool.avgSlippage}</span></div>
                      <div>Latency: <span className="text-cyan-400 font-bold">{pool.executionSpeed}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl p-6 space-y-6 shadow-2xl">
            <div>
              <h3 className="text-base font-bold text-white">Aggregated Execution Route</h3>
              <p className="text-xs text-slate-400">Automated split-route smart matching</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 block font-semibold">Block Order Size (USD):</label>
              <input
                type="number"
                value={routedAmount}
                onChange={(e) => setRoutedAmount(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-lg font-mono font-bold text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-xs font-mono space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Routing Algorithm:</span>
                <span className="text-cyan-400 font-bold">Best Price Execution</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Slippage Protection:</span>
                <span className="text-emerald-400 font-bold">Strict 0.05% Cap</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1 border-t border-white/10">
                <span>Aggregator Fee:</span>
                <span className="text-white font-bold">0.08% Institutional</span>
              </div>
            </div>

            <button
              onClick={() => alert(`Routed block order of $${routedAmount} across optimized liquidity venues.`)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-600/30 transition-all"
            >
              Route Aggregated Order
            </button>
          </div>

        </div>

      </main>

    </div>
  );
}
