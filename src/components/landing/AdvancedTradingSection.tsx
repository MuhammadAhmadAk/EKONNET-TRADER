"use client";

import React, { useState } from "react";
import { ArrowRight, TrendingUp, RefreshCw } from "lucide-react";

interface AdvancedTradingSectionProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export default function AdvancedTradingSection({
  onOpenRegister,
  onOpenLogin,
}: AdvancedTradingSectionProps) {
  const [activeSide, setActiveSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"market" | "limit" | "stop">("market");
  const [timeframe, setTimeframe] = useState("1D");
  const [tradeAmount, setTradeAmount] = useState<number | string>("1000");

  return (
    <section className="py-10 sm:py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (Browzzit Headline & Copy) */}
          <div className="lg:col-span-5 space-y-5 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-orange-600 dark:text-orange-400">
              <span className="w-5 h-[2px] bg-orange-500 inline-block" />
              <span>Powerful Trading Tools</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.18]">
              Advanced Trading<br />
              Made Easy
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto lg:mx-0">
              Professional-grade tools, real-time data and a seamless trading experience across 5 base pairs, 14 payment rails, and 168+ global currencies.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold text-sm shadow-sm hover:shadow hover:scale-[1.02] transition inline-flex items-center justify-center gap-2"
              >
                <span>Start Trading Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Browzzit Advanced Trading Terminal Card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white dark:bg-[#0c1222]/90 border border-slate-200/70 dark:border-white/[0.08] p-5 sm:p-6">
              
              {/* Header: BTC/USDT + Timeframe Pills */}
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.06] gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    ₿
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">BTC/USDT</span>
                  <span className="text-xs font-semibold text-emerald-500 flex items-center gap-0.5">
                    <span>▲</span>
                    <span>+2.48%</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-[11px] font-semibold text-slate-500">
                  {["1D", "1W", "1M", "3M", "1Y"].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-2 py-0.5 rounded-md transition ${
                        timeframe === tf
                          ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold"
                          : "hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart + Order Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4">
                
                {/* Left side: Candlestick Chart SVG Visual */}
                <div className="md:col-span-7 flex flex-col justify-between min-h-[220px]">
                  <div className="h-full w-full flex items-center justify-center">
                    <svg viewBox="0 0 320 180" className="w-full h-full">
                      {/* Grid lines */}
                      <line x1="0" y1="30" x2="320" y2="30" stroke="currentColor" strokeOpacity="0.05" />
                      <line x1="0" y1="75" x2="320" y2="75" stroke="currentColor" strokeOpacity="0.05" />
                      <line x1="0" y1="120" x2="320" y2="120" stroke="currentColor" strokeOpacity="0.05" />

                      {/* Candlesticks Sequence (Browzzit visual reproduction) */}
                      {/* 1 Red */}
                      <line x1="20" y1="100" x2="20" y2="140" stroke="#EF4444" strokeWidth="1" />
                      <rect x="17" y="110" width="6" height="20" rx="1" fill="#EF4444" />

                      {/* 2 Red */}
                      <line x1="36" y1="115" x2="36" y2="155" stroke="#EF4444" strokeWidth="1" />
                      <rect x="33" y="122" width="6" height="22" rx="1" fill="#EF4444" />

                      {/* 3 Green */}
                      <line x1="52" y1="105" x2="52" y2="145" stroke="#10B981" strokeWidth="1" />
                      <rect x="49" y="112" width="6" height="24" rx="1" fill="#10B981" />

                      {/* 4 Green */}
                      <line x1="68" y1="90" x2="68" y2="135" stroke="#10B981" strokeWidth="1" />
                      <rect x="65" y="98" width="6" height="26" rx="1" fill="#10B981" />

                      {/* 5 Green */}
                      <line x1="84" y1="70" x2="84" y2="120" stroke="#10B981" strokeWidth="1" />
                      <rect x="81" y="80" width="6" height="30" rx="1" fill="#10B981" />

                      {/* 6 Red */}
                      <line x1="100" y1="85" x2="100" y2="130" stroke="#EF4444" strokeWidth="1" />
                      <rect x="97" y="92" width="6" height="24" rx="1" fill="#EF4444" />

                      {/* 7 Red */}
                      <line x1="116" y1="100" x2="116" y2="145" stroke="#EF4444" strokeWidth="1" />
                      <rect x="113" y="108" width="6" height="25" rx="1" fill="#EF4444" />

                      {/* 8 Green */}
                      <line x1="132" y1="85" x2="132" y2="130" stroke="#10B981" strokeWidth="1" />
                      <rect x="129" y="92" width="6" height="28" rx="1" fill="#10B981" />

                      {/* 9 Green */}
                      <line x1="148" y1="65" x2="148" y2="115" stroke="#10B981" strokeWidth="1" />
                      <rect x="145" y="75" width="6" height="30" rx="1" fill="#10B981" />

                      {/* 10 Green */}
                      <line x1="164" y1="50" x2="164" y2="100" stroke="#10B981" strokeWidth="1" />
                      <rect x="161" y="60" width="6" height="32" rx="1" fill="#10B981" />

                      {/* 11 Red */}
                      <line x1="180" y1="65" x2="180" y2="110" stroke="#EF4444" strokeWidth="1" />
                      <rect x="177" y="72" width="6" height="26" rx="1" fill="#EF4444" />

                      {/* 12 Red */}
                      <line x1="196" y1="80" x2="196" y2="125" stroke="#EF4444" strokeWidth="1" />
                      <rect x="193" y="88" width="6" height="28" rx="1" fill="#EF4444" />

                      {/* 13 Green */}
                      <line x1="212" y1="65" x2="212" y2="110" stroke="#10B981" strokeWidth="1" />
                      <rect x="209" y="72" width="6" height="28" rx="1" fill="#10B981" />

                      {/* 14 Green */}
                      <line x1="228" y1="50" x2="228" y2="95" stroke="#10B981" strokeWidth="1" />
                      <rect x="225" y="58" width="6" height="30" rx="1" fill="#10B981" />

                      {/* 15 Green */}
                      <line x1="244" y1="35" x2="244" y2="85" stroke="#10B981" strokeWidth="1" />
                      <rect x="241" y="44" width="6" height="32" rx="1" fill="#10B981" />

                      {/* 16 Red */}
                      <line x1="260" y1="45" x2="260" y2="95" stroke="#EF4444" strokeWidth="1" />
                      <rect x="257" y="54" width="6" height="28" rx="1" fill="#EF4444" />

                      {/* 17 Green */}
                      <line x1="276" y1="30" x2="276" y2="80" stroke="#10B981" strokeWidth="1" />
                      <rect x="273" y="38" width="6" height="32" rx="1" fill="#10B981" />

                      {/* 18 Green (Highest) */}
                      <line x1="292" y1="20" x2="292" y2="70" stroke="#10B981" strokeWidth="1" />
                      <rect x="289" y="28" width="6" height="35" rx="1" fill="#10B981" />
                    </svg>
                  </div>

                  {/* Price Summary strip */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                    <span>24h High: <strong className="text-slate-700 dark:text-slate-200">$68,120.00</strong></span>
                    <span>24h Low: <strong className="text-slate-700 dark:text-slate-200">$65,940.50</strong></span>
                    <span>Vol: <strong className="text-slate-700 dark:text-slate-200">14.2K BTC</strong></span>
                  </div>
                </div>

                {/* Right side: Browzzit Order Widget */}
                <div className="md:col-span-5 space-y-3.5 bg-slate-50/70 dark:bg-black/20 p-4 rounded-xl border border-slate-100 dark:border-white/[0.06]">
                  
                  {/* Buy / Sell Switcher Pills */}
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 text-xs font-bold">
                    <button
                      onClick={() => setActiveSide("buy")}
                      className={`py-1.5 rounded-md transition ${
                        activeSide === "buy"
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => setActiveSide("sell")}
                      className={`py-1.5 rounded-md transition ${
                        activeSide === "sell"
                          ? "bg-rose-500 text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      Sell
                    </button>
                  </div>

                  {/* Order Type Pills */}
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 px-1">
                    {(["market", "limit", "stop"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setOrderType(type)}
                        className={`capitalize py-0.5 px-2 rounded transition ${
                          orderType === type
                            ? "text-slate-900 dark:text-white font-bold bg-white dark:bg-slate-700 shadow-xs"
                            : "hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Amount</label>
                    <div className="flex items-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 px-3 py-2 text-xs">
                      <input
                        type="text"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        className="w-full bg-transparent font-bold font-mono text-slate-900 dark:text-white focus:outline-none"
                        placeholder="0.00"
                      />
                      <span className="text-[11px] font-bold text-slate-500 shrink-0">USDT ▾</span>
                    </div>
                  </div>

                  {/* Execution CTA Button (Browzzit Solid Green Pill) */}
                  <button
                    onClick={onOpenRegister}
                    className="w-full py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm hover:shadow transition flex items-center justify-center gap-1.5 mt-2"
                  >
                    <span>Buy BTC</span>
                  </button>

                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-mono">
                      0.15% fee • Direct Clearing Rails
                    </span>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
