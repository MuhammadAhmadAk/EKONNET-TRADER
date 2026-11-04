"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Play,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Sliders,
  DollarSign,
  Activity,
  Layers,
  Zap,
  Globe,
  Coins,
  Shield
} from "lucide-react";

interface InteractiveTradingTerminalProps {
  onOpenRegister?: () => void;
}

interface MarketAsset {
  symbol: string;
  name: string;
  category: "crypto" | "forex" | "equity";
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
}

const ASSETS: MarketAsset[] = [
  { symbol: "BTC/USD", name: "Bitcoin Core", category: "crypto", price: 67420.50, change24h: 3.42, high24h: 68100, low24h: 65900 },
  { symbol: "ETH/USD", name: "Ethereum", category: "crypto", price: 3480.20, change24h: 2.15, high24h: 3520, low24h: 3390 },
  { symbol: "SOL/USD", name: "Solana", category: "crypto", price: 184.60, change24h: -1.20, high24h: 191, low24h: 181 },
  { symbol: "EUR/USD", name: "Euro / US Dollar", category: "forex", price: 1.0865, change24h: 0.18, high24h: 1.0890, low24h: 1.0840 },
  { symbol: "AAPL", name: "Apple Inc.", category: "equity", price: 232.40, change24h: 1.85, high24h: 235, low24h: 229 },
];

export default function InteractiveTradingTerminal({ onOpenRegister }: InteractiveTradingTerminalProps) {
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset>(ASSETS[0]);
  const [tradingMode, setTradingMode] = useState<"demo" | "live">("demo");
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [tradeAmount, setTradeAmount] = useState<number>(500);
  const [demoBalance, setDemoBalance] = useState<number>(10000);
  const [executedTrades, setExecutedTrades] = useState<any[]>([]);
  const [lastExecuted, setLastExecuted] = useState<string | null>(null);

  // Live price jitter simulation
  const [currentPrice, setCurrentPrice] = useState<number>(selectedAsset.price);

  useEffect(() => {
    setCurrentPrice(selectedAsset.price);
  }, [selectedAsset]);

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.49) * (currentPrice * 0.0008);
      setCurrentPrice((prev) => Number((prev + delta).toFixed(selectedAsset.category === "forex" ? 4 : 2)));
    }, 1800);
    return () => clearInterval(interval);
  }, [currentPrice, selectedAsset]);

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (tradingMode === "live") {
      if (onOpenRegister) onOpenRegister();
      return;
    }

    if (tradeAmount > demoBalance) {
      alert("Trade amount exceeds your demo simulator balance.");
      return;
    }

    const fee = tradeAmount * 0.0015;
    const executedUnits = Number((tradeAmount / currentPrice).toFixed(5));
    const newTrade = {
      id: "DEMO-" + Math.floor(100000 + Math.random() * 900000),
      symbol: selectedAsset.symbol,
      type: orderType,
      amount: tradeAmount,
      units: executedUnits,
      price: currentPrice,
      fee: fee,
      time: new Date().toLocaleTimeString(),
    };

    setExecutedTrades([newTrade, ...executedTrades.slice(0, 4)]);
    setDemoBalance((prev) => Number((prev - (orderType === "buy" ? fee : -tradeAmount * 0.01)).toFixed(2)));
    setLastExecuted(`Success: Executed ${orderType.toUpperCase()} ${newTrade.units} ${selectedAsset.symbol} @ $${currentPrice}`);
    setTimeout(() => setLastExecuted(null), 4500);
  };

  const handleResetDemo = () => {
    setDemoBalance(10000);
    setExecutedTrades([]);
    setLastExecuted("Demo balance reset to $10,000.00 virtual capital.");
    setTimeout(() => setLastExecuted(null), 3000);
  };

  return (
    <section className="relative py-16 sm:py-20 bg-transparent border-t border-b border-white/[0.06] overflow-hidden" id="web-terminal">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-500/10 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-mono font-bold tracking-wider uppercase">
            <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>Interactive Web Platform Feature</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Direct Web Trading & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">Demo Simulator</span>
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Trade directly in your browser with zero software downloads or lag. Test your strategies risk-free with our $10,000 instant virtual demo simulator, or switch to verified live clearing.
          </p>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setTradingMode("demo")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                tradingMode === "demo"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 ring-1 ring-emerald-400"
                  : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Free Demo Simulator ($10,000 Capital)</span>
            </button>

            <button
              type="button"
              onClick={() => setTradingMode("live")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                tradingMode === "live"
                  ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-600/20 ring-1 ring-purple-400"
                  : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Web Trading Engine</span>
            </button>
          </div>
        </div>

        {/* Interactive HUD Container */}
        <div className="rounded-3xl border border-slate-800 bg-[#070B14]/90 backdrop-blur-2xl shadow-2xl overflow-hidden ring-1 ring-white/5">
          
          {/* Top Asset & Balance Strip */}
          <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/40 flex flex-wrap items-center justify-between gap-4 text-xs">
            {/* Asset selector tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {ASSETS.map((asset) => {
                const isSelected = selectedAsset.symbol === asset.symbol;
                return (
                  <button
                    key={asset.symbol}
                    type="button"
                    onClick={() => setSelectedAsset(asset)}
                    className={`px-3 py-1.5 rounded-lg font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    <span>{asset.symbol}</span>
                    <span className={`text-[10px] ${asset.change24h >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {asset.change24h >= 0 ? "+" : ""}{asset.change24h}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Virtual Demo Balance / Status */}
            <div className="flex items-center gap-3">
              {tradingMode === "demo" ? (
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
                  <span>Virtual Demo Balance:</span>
                  <strong className="text-white font-bold">${demoBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
                  <button
                    type="button"
                    onClick={handleResetDemo}
                    title="Reset Simulator Balance"
                    className="ml-1 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-[11px]">
                  <span>Live Account Mode:</span>
                  <strong className="text-white font-bold">14 Payment Rails Active</strong>
                </div>
              )}
            </div>
          </div>

          {/* Toast Notification inside Terminal */}
          {lastExecuted && (
            <div className="px-5 py-2.5 bg-emerald-950/80 border-b border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{lastExecuted}</span>
            </div>
          )}

          {/* Main Terminal Grid: Chart Simulator (Left) + Order Entry (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            
            {/* Left 8 Cols: Chart Visualizer & Market Depth */}
            <div className="lg:col-span-8 p-5 sm:p-6 space-y-5">
              
              {/* Asset Header Info */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white font-serif">{selectedAsset.name}</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-cyan-300 font-bold uppercase">
                      {selectedAsset.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    24h High: ${selectedAsset.high24h.toLocaleString()} • 24h Low: ${selectedAsset.low24h.toLocaleString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black font-mono text-white tracking-tight">
                    ${currentPrice.toLocaleString("en-US", { minimumFractionDigits: selectedAsset.category === "forex" ? 4 : 2 })}
                  </div>
                  <div className={`text-xs font-mono font-bold flex items-center justify-end gap-1 ${selectedAsset.change24h >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {selectedAsset.change24h >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{selectedAsset.change24h >= 0 ? "+" : ""}{selectedAsset.change24h}% (24h)</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Visual Price Chart Simulation */}
              <div className="relative h-64 rounded-2xl bg-[#03060C] border border-slate-800 p-4 flex flex-col justify-between overflow-hidden">
                {/* Background grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_24px] pointer-events-none" />

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 relative z-10">
                  <span>Web-Streaming Candlestick Canvas</span>
                  <span>Zero-Lag WebSocket Feed: 2ms Latency</span>
                </div>

                {/* Animated Mock Waveform Bars */}
                <div className="relative z-10 flex items-end justify-between h-40 gap-1.5 pt-4">
                  {[45, 52, 48, 60, 58, 65, 72, 68, 75, 82, 79, 88, 92, 86, 94, 91, 98, 95, 102, 108, 105, 114, 110, 118].map((val, idx) => {
                    const isGreen = idx % 3 !== 0;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                        {/* Upper wick */}
                        <div className={`w-[1px] h-2 ${isGreen ? "bg-emerald-500/60" : "bg-rose-500/60"}`} />
                        {/* Candlestick body */}
                        <div
                          style={{ height: `${(val / 120) * 100}%` }}
                          className={`w-full rounded-xs transition-all duration-500 ${
                            isGreen 
                              ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-sm shadow-emerald-500/20" 
                              : "bg-gradient-to-t from-rose-600 to-rose-400 shadow-sm shadow-rose-500/20"
                          }`}
                        />
                        {/* Lower wick */}
                        <div className={`w-[1px] h-2 ${isGreen ? "bg-emerald-500/60" : "bg-rose-500/60"}`} />
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80 relative z-10">
                  <span>09:00</span>
                  <span>12:00</span>
                  <span>15:00</span>
                  <span>18:00</span>
                  <span>21:00</span>
                  <span className="text-emerald-400 font-bold">LIVE CURRENT</span>
                </div>
              </div>

              {/* Recent Simulator Trades */}
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>Recent Executed Simulator Orders</span>
                  <span className="text-[10px] text-slate-500">Automated Ledger Logging</span>
                </div>
                {executedTrades.length === 0 ? (
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/30 text-center text-xs text-slate-500 font-mono">
                    No orders executed yet in this session. Use the panel on the right to place a test trade.
                  </div>
                ) : (
                  <div className="space-y-1.5 font-mono text-xs">
                    {executedTrades.map((t) => (
                      <div key={t.id} className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${t.type === "buy" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                            {t.type}
                          </span>
                          <span className="font-bold text-white">{t.units} {t.symbol}</span>
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          @ ${t.price.toLocaleString()} • Fee: ${t.fee.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-500">{t.time}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right 4 Cols: Order Execution Desk */}
            <div className="lg:col-span-4 p-5 sm:p-6 flex flex-col justify-between space-y-6 bg-slate-900/20">
              
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-mono font-bold uppercase text-slate-400">Order Execution</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 font-semibold">
                    {tradingMode === "demo" ? "DEMO MODE" : "LIVE CLEARING"}
                  </span>
                </div>

                {/* Buy vs Sell Switcher */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setOrderType("buy")}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      orderType === "buy"
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400"
                        : "bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    Buy / Long
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType("sell")}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      orderType === "sell"
                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-1 ring-rose-400"
                        : "bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    Sell / Short
                  </button>
                </div>

                {/* Trade Form */}
                <form onSubmit={handleExecuteTrade} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Order Amount (USD)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <input
                        type="number"
                        min="10"
                        max={tradingMode === "demo" ? demoBalance : 1000000}
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(Number(e.target.value))}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                    {[100, 250, 500, 1000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTradeAmount(amt)}
                        className={`py-1 rounded-lg border text-[11px] transition ${
                          tradeAmount === amt
                            ? "bg-blue-600/30 border-blue-500 text-white"
                            : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white"
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>

                  {/* Execution Breakdown */}
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Units To Receive:</span>
                      <strong className="text-white font-bold">
                        {(tradeAmount / currentPrice).toFixed(5)} {selectedAsset.symbol.split("/")[0]}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Platform Fee (0.15%):</span>
                      <span className="text-slate-300">${(tradeAmount * 0.0015).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Execution Speed:</span>
                      <span className="text-emerald-400 font-bold">Instant (Web-Engine)</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                      orderType === "buy"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white shadow-emerald-600/30"
                        : "bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-90 text-white shadow-rose-600/30"
                    }`}
                  >
                    {tradingMode === "demo" ? (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Execute Instant Demo {orderType.toUpperCase()} Order</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Launch Live Trading Account</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Bottom Guarantee Badge */}
              <div className="pt-4 border-t border-slate-800 text-center">
                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>Direct Web Engine • Zero Desktop Software Required</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
