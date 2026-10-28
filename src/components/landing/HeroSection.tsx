"use client";

import React, { useState } from "react";
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  CheckCircle2, 
  TrendingUp,
  Cpu,
  Globe2,
  RefreshCw,
  Lock
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface HeroSectionProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export default function HeroSection({ onOpenRegister, onOpenLogin }: HeroSectionProps) {
  const [payAmount, setPayAmount] = useState<number>(1000);
  const [payCurrency, setPayCurrency] = useState<string>("USD");
  const [receiveCurrency, setReceiveCurrency] = useState<string>("BTC");

  // Conversion logic (Section 19: 0.15% fee deduction)
  const btcPrice = 67420.50;
  const platformFeeRate = 0.0015; // 0.15%
  const feeAmount = payAmount * platformFeeRate;
  const netAmount = Math.max(0, payAmount - feeAmount);
  const estimatedCrypto = Number((netAmount / btcPrice).toFixed(6));

  return (
    <section className="relative pt-10 pb-16 overflow-hidden bg-slate-950">
      {/* Background ambient decorative spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/15 to-cyan-500/15 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Status Pill */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>HYBRID ECOSYSTEM: 10 EXCHANGES & 14 PAYMENT PROCESSORS COMBINED</span>
            <ChevronRight className="w-3 h-3 text-blue-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Sleek Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Global Multi-Asset <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
                Trading & Payments
              </span> <br />
              All In One Architecture.
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Unified power of <strong className="text-slate-200">Direct Liquidity</strong>, <strong className="text-slate-200">P2P Escrow Exchange</strong>, and <strong className="text-slate-200">168+ Global Currency Transfers</strong>. Built on hand-crafted high-security architecture with isolated modular resilience.
            </p>

            {/* Core Feature Badges */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
                <Cpu className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="truncate">
                  <div className="text-[11px] font-bold text-white truncate">5 Base Pairs</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">USD, BTC, XRP, ETH, BCH</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
                <Globe2 className="w-4 h-4 text-purple-400 shrink-0" />
                <div className="truncate">
                  <div className="text-[11px] font-bold text-white truncate">14 Payment Rails</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">Wise, Cards, Wire, P2P</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <div className="text-[11px] font-bold text-white truncate">Hardware 2FA</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">Proton / TOTP Guard</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2"
              >
                <span>Open Trader Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenLogin}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <span>Live Market Terminal</span>
              </button>
            </div>

            {/* Compliance Guarantee Bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[11px] text-slate-400 pt-1 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Strict 18+ KYC Gate</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>3-Attempt Auto Lockout</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>AES-256-GCM Vault</span>
              </span>
            </div>

          </div>

          {/* Right Column: Sleek Quick Swap / Order Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl p-5 sm:p-6 backdrop-blur-xl">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span>Instant Market Swap</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Automated fee deduction engine (Section 19)</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-bold">
                  0.15% Flat Fee
                </span>
              </div>

              {/* Pay Input */}
              <div className="space-y-3 pt-4">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                    <span className="font-semibold">You Deposit / Send</span>
                    <span>Min: $50.00</span>
                  </div>
                  <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-2.5 focus-within:border-blue-500 transition">
                    <input 
                      type="number"
                      value={payAmount}
                      onChange={(e) => setPayAmount(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-transparent text-base font-bold font-mono text-white focus:outline-none"
                      placeholder="0.00"
                    />
                    <select
                      value={payCurrency}
                      onChange={(e) => setPayCurrency(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs font-bold text-slate-200 focus:outline-none ml-2"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </div>
                </div>

                {/* Calculation breakdown */}
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1 text-[10px] font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Base Amount:</span>
                    <span>${payAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Platform Fee (0.15%):</span>
                    <span className="text-amber-400">-${feeAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-200 font-bold border-t border-slate-800 pt-1">
                    <span>Net Swapped Principal:</span>
                    <span className="text-emerald-400">${netAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Receive Input */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                    <span className="font-semibold">You Receive</span>
                    <span>1 BTC = ${btcPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-2.5 focus-within:border-blue-500 transition">
                    <input 
                      type="text"
                      readOnly
                      value={estimatedCrypto}
                      className="w-full bg-transparent text-base font-bold font-mono text-cyan-400 focus:outline-none"
                    />
                    <select
                      value={receiveCurrency}
                      onChange={(e) => setReceiveCurrency(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs font-bold text-slate-200 focus:outline-none ml-2"
                    >
                      <option value="BTC">BTC</option>
                      <option value="XRP">XRP</option>
                      <option value="ETH">ETH</option>
                      <option value="BCH">BCH</option>
                    </select>
                  </div>
                </div>

                {/* Swap CTA */}
                <button
                  onClick={onOpenRegister}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-1.5 mt-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Execute Instant Swap</span>
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
