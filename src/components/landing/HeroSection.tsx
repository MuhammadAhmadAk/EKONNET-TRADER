"use client";

import React from "react";
import { 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Headphones, 
  Globe2 
} from "lucide-react";
import Hero3DVisual from "./Hero3DVisual";

interface HeroSectionProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export default function HeroSection({ onOpenRegister, onOpenLogin }: HeroSectionProps) {
  return (
    <section className="relative pt-6 sm:pt-10 pb-12 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Modern Sleek Typography (Browzzit Hierarchy) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Pill Chip */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-500/30 text-xs font-semibold text-orange-600 dark:text-orange-400 shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>Next-Gen Trading Platform</span>
              <ChevronRight className="w-3 h-3 text-orange-500" />
            </div>

            {/* Main Headline (Refined font weight, not chunky/bloated) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Trade Smarter.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-red-600">
                Grow Bigger.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Buy, sell and explore 100+ cryptocurrencies with low fees and high security. Direct Liquidity, Direct P2P Trading Rails, and 168+ Global Currency Transfers.
            </p>

            {/* Action Buttons (Pills) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold text-sm shadow-sm hover:shadow hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
              >
                <span>Start Trading</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenLogin}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/15 text-slate-800 dark:text-slate-200 font-semibold text-sm shadow-xs transition flex items-center justify-center gap-2"
              >
                <span>Explore Markets</span>
              </button>
            </div>

            {/* Stats Row with Thin Dividers */}
            <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-8 pt-4 text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">10M+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Global Users</div>
              </div>
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">$500B+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Trading Volume</div>
              </div>
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">&lt; 0.1%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lowest Fees</div>
              </div>
            </div>

          </div>

          {/* Right Column: Browzzit 3D Coin Podium & Floating Tokens */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <Hero3DVisual />
          </div>

        </div>

        {/* Row of 4 Quick Feature Cards (Browzzit Exact Placement & Rounded-2xl Style) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-12">
          
          <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#0c1222]/80 border border-slate-200/60 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 transition-colors">
            <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-orange-500" />
            </div>
            <div className="leading-tight">
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Top-Notch Security</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Cold Vault & 2FA</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#0c1222]/80 border border-slate-200/60 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 transition-colors">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div className="leading-tight">
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Instant Transactions</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Sub-second Clearing</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#0c1222]/80 border border-slate-200/60 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 transition-colors">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-rose-500" />
            </div>
            <div className="leading-tight">
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">24/7 Support</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Dedicated Desk</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#0c1222]/80 border border-slate-200/60 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 transition-colors">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center shrink-0">
              <Globe2 className="w-5 h-5 text-blue-500" />
            </div>
            <div className="leading-tight">
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Global Access</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">14 Payment Rails</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
