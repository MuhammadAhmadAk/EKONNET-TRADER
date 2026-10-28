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
  CheckCircle2
} from "lucide-react";

export default function TradingPillars() {
  const [activeTab, setActiveTab] = useState<"crypto" | "forex" | "shares">("crypto");

  return (
    <section id="trading-pillars" className="py-16 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold">
            <span>SECTION 14 COMPLIANT: 3 MAIN TRADING MODES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Multi-Asset <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Trading Engine</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Ekonnet unifies Direct Liquidity, Peer-to-Peer Escrow Settlement, and 3rd-Party CEX Order Routing under one high-speed interface.
          </p>

          {/* Asset Category Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 mt-2">
            <button
              onClick={() => setActiveTab("crypto")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "crypto" 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Crypto (3,000+ Pairs)</span>
            </button>

            <button
              onClick={() => setActiveTab("forex")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "forex" 
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Forex (168+ Currencies)</span>
            </button>

            <button
              onClick={() => setActiveTab("shares")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "shares" 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Shares & Equities</span>
            </button>
          </div>
        </div>

        {/* 3 Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Pillar 1: Direct Internal Liquidity */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-blue-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-blue-400 font-mono font-bold uppercase">Mode 01 &bull; Instant Clearing</div>
              <h3 className="text-base font-bold text-white mt-1">Direct Exchange Trading</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Zero slippage execution executed directly against Ekonnet&apos;s proprietary institutional liquidity pools across 5 base pairs.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>0.15% Flat Automated Platform Fee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant Settlement in USD, BTC, ETH</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Remitano-Style P2P Escrow */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-purple-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-purple-400 font-mono font-bold uppercase">Mode 02 &bull; Escrow Protection</div>
              <h3 className="text-base font-bold text-white mt-1">Peer-to-Peer (P2P) Escrow</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Remitano-modeled automated smart escrow locks seller crypto until buyer fiat transfer confirmation is cryptographically verified.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted Dispute Resolution Desk</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Handwritten Note Verification Required</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: 3rd-Party CEX Order Routing */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-cyan-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-cyan-400 font-mono font-bold uppercase">Mode 03 &bull; Global Liquidity</div>
              <h3 className="text-base font-bold text-white mt-1">10 CEX Exchange Routing</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Smart API aggregation bridges seamlessly route orders to external tier-1 exchanges (Binance, Kraken, Bybit, OKX) at best execution prices.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Smart Order Router (SOR)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Automated API Key Isolation</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
