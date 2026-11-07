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
  Lock,
  Headphones,
  Sparkles
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
    <section className="relative pt-8 sm:pt-12 pb-16 overflow-hidden bg-transparent">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Status Pill (Browzzit Style) */}
        <div className="flex items-center justify-center lg:justify-start mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-500/30 text-xs font-bold text-orange-600 dark:text-orange-400 shadow-xs backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span>Next-Gen Multi-Asset Platform • 10 Exchanges & 14 Payment Processors</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Sleek Modern Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              Trade Smarter. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-red-600">
                Scale Global.
              </span> <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-700 dark:text-slate-300">
                All In One Architecture.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Unified power of <strong className="text-slate-900 dark:text-white font-semibold">Direct Liquidity</strong>, <strong className="text-slate-900 dark:text-white font-semibold">Direct P2P Trading Rails</strong>, and <strong className="text-slate-900 dark:text-white font-semibold">168+ Global Currency Transfers</strong>. Built on hand-crafted high-security architecture with isolated modular resilience.
            </p>

            {/* Core Feature Badges */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-left shadow-xs backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">5 Base Pairs</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">USD, BTC, XRP, ETH, BCH</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-left shadow-xs backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">14 Payment Rails</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">Wise, Cards, Wire, P2P</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-left shadow-xs backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Hardware 2FA</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">Proton / TOTP Guard</div>
                </div>
              </div>
            </div>

            {/* CTAs (Browzzit Rounded Pill Buttons) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-sm shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
              >
                <span>Start Trading Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenLogin}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-white/15 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-xs transition flex items-center justify-center gap-2"
              >
                <span>Explore Live Markets</span>
              </button>
            </div>

            {/* Stats with Vertical Dividers (Browzzit Aesthetic) */}
            <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-8 pt-4 border-t border-slate-200/80 dark:border-white/10 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">10M+</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Global Users</div>
              </div>
              <div className="h-8 w-[1px] bg-slate-300 dark:bg-white/15" />
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">$500B+</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Trading Volume</div>
              </div>
              <div className="h-8 w-[1px] bg-slate-300 dark:bg-white/15" />
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">&lt; 0.15%</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Lowest Fees</div>
              </div>
            </div>

            {/* Compliance Guarantee Bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Strict 18+ KYC Gate</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>3-Attempt Auto Lockout</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>AES-256-GCM Vault</span>
              </span>
            </div>

          </div>

          {/* Right Column: Sleek Quick Swap / Order Card (Light & Dark Responsive) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-white/90 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-2xl p-6 backdrop-blur-2xl transition-all">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span>Instant Market Swap</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Automated fee deduction engine (Section 19)</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-mono font-bold">
                  0.15% Flat Fee
                </span>
              </div>

              {/* Pay Input */}
              <div className="space-y-3 pt-4">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                    <span className="font-semibold">You Deposit / Send</span>
                    <span>Min: $50.00</span>
                  </div>
                  <div className="flex items-center rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2.5 focus-within:border-orange-500 transition">
                    <input 
                      type="number"
                      value={payAmount}
                      onChange={(e) => setPayAmount(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-transparent text-base font-bold font-mono text-slate-900 dark:text-white focus:outline-none"
                      placeholder="0.00"
                    />
                    <select
                      value={payCurrency}
                      onChange={(e) => setPayCurrency(e.target.value)}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none ml-2 shadow-xs"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </div>
                </div>

                {/* Calculation breakdown */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/10 space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Base Amount:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">${payAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Platform Fee (0.15%):</span>
                    <span className="text-orange-500 font-bold">-${feeAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 dark:text-white font-bold border-t border-slate-200 dark:border-white/10 pt-1.5">
                    <span>Net Swapped Principal:</span>
                    <span className="text-emerald-500 font-black">${netAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Receive Input */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                    <span className="font-semibold">You Receive</span>
                    <span>1 BTC = ${btcPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2.5 focus-within:border-orange-500 transition">
                    <input 
                      type="text"
                      readOnly
                      value={estimatedCrypto}
                      className="w-full bg-transparent text-base font-bold font-mono text-orange-600 dark:text-orange-400 focus:outline-none"
                    />
                    <select
                      value={receiveCurrency}
                      onChange={(e) => setReceiveCurrency(e.target.value)}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none ml-2 shadow-xs"
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
                  className="w-full py-3 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-xs shadow-md shadow-orange-500/25 transition flex items-center justify-center gap-2 mt-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Execute Instant Swap</span>
                </button>

              </div>
            </div>
          </div>

        </div>

        {/* 4 Quick Feature Cards Row (Browzzit Exact Feature Row) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-10">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Top-Notch Security</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">Cold Vault & 2FA</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Instant Transactions</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">Sub-second Clearing</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">24/7 Support</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">Dedicated Desk</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Global Access</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">14 Payment Rails</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
