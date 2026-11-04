"use client";

import React, { useState } from "react";
import {
  Zap,
  Globe,
  Coins,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  BarChart3,
  Flame,
  Clock,
  Sliders,
  DollarSign,
  HelpCircle,
  ExternalLink
} from "lucide-react";

interface BigFeatureAdvertisementsProps {
  onOpenRegister?: () => void;
  onOpenLogin?: () => void;
}

export default function BigFeatureAdvertisements({
  onOpenRegister,
  onOpenLogin,
}: BigFeatureAdvertisementsProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"speed" | "demo" | "unified">("speed");

  const comparisonData = [
    {
      feature: "Direct Browser Execution (No MT4/MT5 software install)",
      ekonnet: true,
      binance: false,
      bitfinex: false,
      traditional: false,
      note: "Connects straight to WebSockets. Zero software crashes during high volatility.",
    },
    {
      feature: "Instant $10,000 Risk-Free Demo Practice Mode",
      ekonnet: true,
      binance: false,
      bitfinex: true,
      traditional: false,
      note: "Practice with zero deposit and zero KYC friction before committing real capital.",
    },
    {
      feature: "Unified Multi-Asset Liquidity (Crypto + Forex + Equities)",
      ekonnet: true,
      binance: false,
      bitfinex: false,
      traditional: false,
      note: "Trade Bitcoin, EUR/USD and Apple from one single balance ledger.",
    },
    {
      feature: "Low-Bandwidth Adaptive Protocol (Works on Weak Internet)",
      ekonnet: true,
      binance: false,
      bitfinex: false,
      traditional: false,
      note: "Engineered specifically for unreliable internet connections without connection drops.",
    },
    {
      feature: "Direct Non-Custodial P2P Smart Settlement",
      ekonnet: true,
      binance: true,
      bitfinex: false,
      traditional: false,
      note: "Transparent peer-to-peer settlement without third-party escrow withholding.",
    },
  ];

  return (
    <section id="features-advertisements" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950/60 via-slate-900/40 to-slate-950/80 border-t border-b border-white/5">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* =====================================================================
            TOP BADGE & MAIN ADVERTISEMENT BILLBOARD HEADLINE
        ===================================================================== */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide uppercase shadow-lg shadow-blue-500/10">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            <span>Exclusive Platform Innovation • Built for Global High-Performance</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Stop Installing Clunky Softwares. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Trade Direct in Your Browser.
            </span>
          </h2>

          <p className="text-sm sm:text-lg text-slate-300 leading-relaxed font-normal">
            Legacy trading softwares like MT4/MT5 constantly freeze and disconnect during high customer demand and poor internet. 
            Ekonnet's proprietary web-native trading engine streams institutional candlestick data straight into your browser with zero latency, zero installation, and guaranteed uptime.
          </p>
        </div>

        {/* =====================================================================
            3 MASSIVE ADVERTISEMENT BILLBOARDS (INTERACTIVE SPOTLIGHT)
        ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Billboard 1 */}
          <div className="relative rounded-3xl p-8 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-blue-500/30 hover:border-blue-400 transition-all duration-300 shadow-2xl flex flex-col justify-between group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Zap className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">Innovation 01</span>
                <h3 className="text-2xl font-bold text-white mt-1">Direct In-Browser Engine</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                No third-party application downloads. No license fees. Our low-bandwidth data pipeline works seamlessly even on fluctuating 3G/4G connections without missing a tick.
              </p>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Execution Latency:</span>
                  <span className="text-emerald-400 font-bold">&lt; 8.4 milliseconds</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Network Footprint:</span>
                  <span className="text-blue-400 font-bold">14 KB/sec (Adaptive)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Software Required:</span>
                  <span className="text-white font-bold">None (Any Browser)</span>
                </div>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">Tested across 120+ countries</span>
              <span className="inline-flex items-center text-xs text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                Read Spec <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
          </div>

          {/* Billboard 2 */}
          <div className="relative rounded-3xl p-8 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-emerald-500/30 hover:border-emerald-400 transition-all duration-300 shadow-2xl flex flex-col justify-between group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Coins className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">Innovation 02</span>
                <h3 className="text-2xl font-bold text-white mt-1">Instant $10,000 Demo Practice</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Test trading strategies immediately without risking a single dollar or providing personal identity papers. Switch between Demo and Live with a single toggle.
              </p>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Virtual Demo Balance:</span>
                  <span className="text-emerald-400 font-bold">$10,000.00 USD</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Reset Capabilities:</span>
                  <span className="text-purple-400 font-bold">Instant 1-Click Reload</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Real Market Feeds:</span>
                  <span className="text-white font-bold">100% Identical to Live</span>
                </div>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">Zero deposit required</span>
              <button 
                onClick={onOpenRegister}
                className="inline-flex items-center text-xs text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform"
              >
                Try Demo <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>

          {/* Billboard 3 */}
          <div className="relative rounded-3xl p-8 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-purple-500/30 hover:border-purple-400 transition-all duration-300 shadow-2xl flex flex-col justify-between group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Layers className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">Innovation 03</span>
                <h3 className="text-2xl font-bold text-white mt-1">Cross-Asset Single Wallet</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Why juggle three different brokers? Hold one account balance and trade Crypto (Bitcoin/Solana), Forex pairs (EUR/USD, GBP/JPY), and US Blue-Chip stocks seamlessly.
              </p>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Available Markets:</span>
                  <span className="text-purple-400 font-bold">Crypto, Forex, Equities</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Cross-Collateral:</span>
                  <span className="text-emerald-400 font-bold">Enabled</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Currency Conversion:</span>
                  <span className="text-white font-bold">Real-Time Zero Spread</span>
                </div>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">Universal Liquidity Engine</span>
              <span className="inline-flex items-center text-xs text-purple-400 font-semibold group-hover:translate-x-1 transition-transform">
                Explore Markets <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
          </div>

        </div>

        {/* =====================================================================
            HOW TO USE IN 3 STEPS (SIMPLE WALKTHROUGH FOR GENERAL USERS)
        ===================================================================== */}
        <div className="rounded-3xl p-8 sm:p-12 bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Clear & Transparent User Guide</span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white">How to Trade on Ekonnet in 60 Seconds</h3>
            <p className="text-sm text-slate-300">
              Follow these three effortless steps to explore live market prices, execute orders, and settle profits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div 
              onClick={() => setActiveStep(1)}
              className={`cursor-pointer rounded-2xl p-6 border transition-all duration-300 ${
                activeStep === 1 
                  ? "bg-blue-600/10 border-blue-500 shadow-xl shadow-blue-500/10" 
                  : "bg-slate-950/40 border-white/5 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black text-blue-400 font-mono">01</span>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Globe className="w-5 h-5" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Select Your Market Asset</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Click on the asset switcher at the top of the terminal. Pick between BTC, ETH, SOL, EUR/USD or AAPL stocks to load live real-time chart candles.
              </p>
            </div>

            {/* Step 2 */}
            <div 
              onClick={() => setActiveStep(2)}
              className={`cursor-pointer rounded-2xl p-6 border transition-all duration-300 ${
                activeStep === 2 
                  ? "bg-emerald-600/10 border-emerald-500 shadow-xl shadow-emerald-500/10" 
                  : "bg-slate-950/40 border-white/5 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black text-emerald-400 font-mono">02</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Practice in Demo Mode</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Switch the mode toggle to "Demo Practice". Enter any order quantity and click Buy or Sell to immediately see execution prices without financial commitment.
              </p>
            </div>

            {/* Step 3 */}
            <div 
              onClick={() => setActiveStep(3)}
              className={`cursor-pointer rounded-2xl p-6 border transition-all duration-300 ${
                activeStep === 3 
                  ? "bg-purple-600/10 border-purple-500 shadow-xl shadow-purple-500/10" 
                  : "bg-slate-950/40 border-white/5 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black text-purple-400 font-mono">03</span>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Instant P2P Settlement</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                When you are satisfied with your trade gains, convert or settle your balance via direct peer-to-peer protocols with zero intermediate dispute hold-ups.
              </p>
            </div>

          </div>
        </div>

        {/* =====================================================================
            BENCHMARK COMPARISON TABLE (DEMAND 4 SAMPLE SITE PARITY)
        ===================================================================== */}
        <div className="rounded-3xl p-8 sm:p-10 bg-slate-900/40 border border-white/10 overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">Competitive Benchmark Matrix</span>
              <h3 className="text-xl sm:text-3xl font-extrabold text-white mt-1">Ekonnet vs Industry Giants</h3>
              <p className="text-xs text-slate-400 mt-1">Benchmarked against Binance, Bitfinex and traditional brokerage desktop software.</p>
            </div>
            <button 
              onClick={onOpenRegister}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all self-start sm:self-auto"
            >
              Open Free Account
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-4 pr-6">Platform Feature & Capability</th>
                  <th className="py-4 px-4 text-center bg-blue-500/10 text-blue-400 font-bold rounded-t-xl border-t border-l border-r border-blue-500/30">
                    Ekonnet Trader
                  </th>
                  <th className="py-4 px-4 text-center">Binance</th>
                  <th className="py-4 px-4 text-center">Bitfinex</th>
                  <th className="py-4 px-4 text-center">MT4 / Brokers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 pr-6">
                      <div className="font-semibold text-white">{row.feature}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{row.note}</div>
                    </td>
                    <td className="py-4 px-4 text-center bg-blue-500/5 border-l border-r border-blue-500/20 font-bold">
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.binance ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.bitfinex ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.traditional ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
