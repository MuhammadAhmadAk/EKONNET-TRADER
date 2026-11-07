"use client";

import React, { useState } from "react";
import { 
  ArrowLeftRight, 
  Users, 
  Network, 
  ShieldCheck, 
  Coins, 
  Globe, 
  Briefcase,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function TradingPillars() {
  const [activeTab, setActiveTab] = useState<"crypto" | "forex" | "shares">("crypto");

  return (
    <section id="trading-pillars" className="py-14 sm:py-20 bg-transparent border-t border-slate-200/80 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading (Browzzit Modern Grotesque Style) */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold">
            <span>UNIFIED MULTI-ASSET TRADING ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Multi-Asset <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-red-600">Trading Engine</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
            Ekonnet unifies Direct Liquidity, Peer-to-Peer Direct Settlement, and 3rd-Party CEX Order Routing under one high-speed interface.
          </p>

          {/* Asset Category Tabs (Pill shaped) */}
          <div className="inline-flex p-1.5 rounded-full bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xs mt-3">
            <button
              onClick={() => setActiveTab("crypto")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition ${
                activeTab === "crypto" 
                  ? "bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/20" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Crypto (3,000+ Pairs)</span>
            </button>

            <button
              onClick={() => setActiveTab("forex")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition ${
                activeTab === "forex" 
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Forex (168+ Currencies)</span>
            </button>

            <button
              onClick={() => setActiveTab("shares")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition ${
                activeTab === "shares" 
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Shares & Equities</span>
            </button>
          </div>
        </div>

        {/* 3 Pillars Cards (Lightweight floating cards with subtle border & shadows) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Direct Internal Liquidity */}
          <div className="p-7 rounded-3xl bg-white/85 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 space-y-4 hover:border-orange-500/50 hover:shadow-xl transition-all duration-300 backdrop-blur-md flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <ArrowLeftRight className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] text-orange-600 dark:text-orange-400 font-mono font-bold uppercase tracking-wider">Mode 01 • Instant Clearing</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">Direct Exchange Trading</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Zero slippage execution executed directly against Ekonnet&apos;s proprietary institutional liquidity pools across 5 base pairs.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>0.15% Flat Automated Platform Fee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Instant Settlement in USD, BTC, ETH</span>
              </div>
              <Link 
                href="/trades/crypto/direct"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 pt-2"
              >
                <span>Launch Direct Book</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Pillar 2: Direct P2P Settlement Protocol */}
          <div className="p-7 rounded-3xl bg-white/85 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 space-y-4 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 backdrop-blur-md flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold uppercase tracking-wider">Mode 02 • Protected Settlement</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">Peer-to-Peer (P2P) Direct Exchange</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Automated smart settlement protocol locks seller crypto until buyer fiat transfer confirmation is cryptographically verified.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Encrypted Dispute Resolution Desk</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Handwritten Note Verification Required</span>
              </div>
              <Link 
                href="/trades/crypto/p2p"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 pt-2"
              >
                <span>Browse P2P Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Pillar 3: 3rd-Party CEX Order Routing */}
          <div className="p-7 rounded-3xl bg-white/85 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 space-y-4 hover:border-purple-500/50 hover:shadow-xl transition-all duration-300 backdrop-blur-md flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Network className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-bold uppercase tracking-wider">Mode 03 • Global Liquidity</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">10 CEX Exchange Routing</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Smart API aggregation bridges seamlessly route orders to external tier-1 exchanges (Binance, Kraken, Bybit, OKX) at best execution prices.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Smart Order Router (SOR)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Automated API Key Isolation</span>
              </div>
              <Link 
                href="/trades/crypto/third-party"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 pt-2"
              >
                <span>Open Aggregated Router</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
