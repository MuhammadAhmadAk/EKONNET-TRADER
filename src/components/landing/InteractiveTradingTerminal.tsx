"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Shield,
  Radio,
  BookOpen,
  HelpCircle,
  BarChart2,
  Info,
  ChevronDown
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
  { symbol: "BTC/USD", name: "Bitcoin Core", category: "crypto", price: 76542.00, change24h: 2.39, high24h: 78420, low24h: 75900 },
  { symbol: "ETH/USD", name: "Ethereum", category: "crypto", price: 3480.20, change24h: 2.15, high24h: 3520, low24h: 3390 },
  { symbol: "SOL/USD", name: "Solana", category: "crypto", price: 184.60, change24h: -1.20, high24h: 191, low24h: 181 },
  { symbol: "EUR/USD", name: "Euro / US Dollar", category: "forex", price: 1.0865, change24h: 0.18, high24h: 1.0890, low24h: 1.0840 },
  { symbol: "AAPL", name: "Apple Inc.", category: "equity", price: 232.40, change24h: 1.85, high24h: 235, low24h: 229 },
];

// All 9 Order Types directly from Bitfinex 3 & 4 Screenshot (marked IMPORTANT by client)
type OrderTechnique = 
  | "Limit"
  | "Market"
  | "Stop"
  | "Stop Limit"
  | "Trailing Stop"
  | "Fill or Kill"
  | "Immediate or Cancel"
  | "Interactive Book"
  | "Scaled";

const ORDER_TECHNIQUES: { id: OrderTechnique; label: string; desc: string; benefit: string }[] = [
  {
    id: "Limit",
    label: "Limit Order",
    desc: "Executes buy/sell strictly at your specified price or better.",
    benefit: "Guarantees you never pay more than intended. Zero execution slippage."
  },
  {
    id: "Market",
    label: "Market Order",
    desc: "Executes immediately against best available bids/asks in the order book.",
    benefit: "Instant execution when getting in or out of a fast-moving market is critical."
  },
  {
    id: "Stop",
    label: "Stop Order",
    desc: "Triggers a market order once your designated stop trigger price is touched.",
    benefit: "Protects against deep drawdowns by cutting losing trades automatically."
  },
  {
    id: "Stop Limit",
    label: "Stop Limit",
    desc: "Places a limit order immediately after a designated stop barrier is breached.",
    benefit: "Prevents bad market fills during flash crashes by capping maximum slippage."
  },
  {
    id: "Trailing Stop",
    label: "Trailing Stop",
    desc: "Dynamic stop price that slides upward with market price by a fixed offset.",
    benefit: "Rides rallies to maximum profit without giving back winning gains on reversals."
  },
  {
    id: "Fill or Kill",
    label: "Fill or Kill (FOK)",
    desc: "Entire order must fill immediately and fully, or it is killed entirely.",
    benefit: "Prevents partial fills when executing specific all-or-nothing arbitrage setups."
  },
  {
    id: "Immediate or Cancel",
    label: "Immediate or Cancel (IOC)",
    desc: "Fills as much as possible right now, and cancels any remaining balance.",
    benefit: "Takes whatever immediate liquidity is available without leaving resting limit bids."
  },
  {
    id: "Interactive Book",
    label: "Interactive Book",
    desc: "Click directly on bids/asks inside the visual depth ladder to auto-fill price.",
    benefit: "Rapid ultra-fast scalping directly off market maker liquidity walls."
  },
  {
    id: "Scaled",
    label: "Scaled / Algorithmic Ladder",
    desc: "Splits a large order into multiple staggered limit orders across a price range.",
    benefit: "Institutional accumulation without alerting market makers or causing slippage."
  }
];

export default function InteractiveTradingTerminal({ onOpenRegister }: InteractiveTradingTerminalProps) {
  const [activeTab, setActiveTab] = useState<"Trading" | "Derivatives" | "Funding" | "Securities" | "OTC">("Trading");
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset>(ASSETS[0]);
  const [tradingMode, setTradingMode] = useState<"demo" | "live">("demo");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [selectedTechnique, setSelectedTechnique] = useState<OrderTechnique>("Limit");
  
  // Order Parameters
  const [tradeAmount, setTradeAmount] = useState<number>(1000);
  const [limitPrice, setLimitPrice] = useState<number>(ASSETS[0].price);
  const [stopTriggerPrice, setStopTriggerPrice] = useState<number>(ASSETS[0].price * 0.96);
  const [trailingDelta, setTrailingDelta] = useState<number>(500);
  const [scaledCount, setScaledCount] = useState<number>(5);
  
  // Modifiers
  const [isOco, setIsOco] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isPostOnly, setIsPostOnly] = useState(false);
  const [isTif, setIsTif] = useState(false);

  // Demo simulator balance
  const [demoBalance, setDemoBalance] = useState<number>(10000);
  const [executedTrades, setExecutedTrades] = useState<any[]>([]);
  const [lastExecuted, setLastExecuted] = useState<string | null>(null);

  // Live price jitter simulation
  const [currentPrice, setCurrentPrice] = useState<number>(selectedAsset.price);

  useEffect(() => {
    setCurrentPrice(selectedAsset.price);
    setLimitPrice(selectedAsset.price);
    setStopTriggerPrice(Number((selectedAsset.price * 0.96).toFixed(2)));
  }, [selectedAsset]);

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.49) * (currentPrice * 0.0006);
      setCurrentPrice((prev) => Number((prev + delta).toFixed(selectedAsset.category === "forex" ? 4 : 2)));
    }, 1500);
    return () => clearInterval(interval);
  }, [currentPrice, selectedAsset]);

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (tradingMode === "live") {
      if (onOpenRegister) onOpenRegister();
      return;
    }

    if (tradeAmount > demoBalance) {
      alert("Trade amount exceeds your demo simulator balance. Click Reset to reload $10,000.");
      return;
    }

    const fee = tradeAmount * 0.001;
    const executedUnits = Number((tradeAmount / (selectedTechnique === "Limit" ? limitPrice : currentPrice)).toFixed(5));
    const newTrade = {
      id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      symbol: selectedAsset.symbol,
      side: side,
      technique: selectedTechnique,
      amount: tradeAmount,
      units: executedUnits,
      price: selectedTechnique === "Limit" ? limitPrice : currentPrice,
      fee: fee,
      time: new Date().toLocaleTimeString(),
      status: "Filled (Instant Web Engine)"
    };

    setExecutedTrades([newTrade, ...executedTrades.slice(0, 4)]);
    setDemoBalance((prev) => Number((prev - (side === "buy" ? fee : -tradeAmount * 0.01)).toFixed(2)));
    setLastExecuted(`Success: Executed [${selectedTechnique}] ${side.toUpperCase()} ${newTrade.units} ${selectedAsset.symbol} @ $${newTrade.price}`);
    setTimeout(() => setLastExecuted(null), 5000);
  };

  const handleResetDemo = () => {
    setDemoBalance(10000);
    setExecutedTrades([]);
    setLastExecuted("Simulator reset to $10,000.00 virtual capital.");
    setTimeout(() => setLastExecuted(null), 3000);
  };

  const activeTechniqueObj = ORDER_TECHNIQUES.find((t) => t.id === selectedTechnique) || ORDER_TECHNIQUES[0];

  return (
    <section className="relative py-16 sm:py-24 bg-transparent border-t border-b border-slate-200/80 dark:border-white/[0.06] overflow-hidden transition-colors" id="web-terminal">
      {/* Background illumination */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 dark:from-blue-600/10 dark:via-emerald-600/10 dark:to-purple-600/10 blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-[11px] font-mono font-bold tracking-wider uppercase">
            <Radio className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 animate-pulse" />
            <span>Bitfinex • Bitpanda • CMC Markets Multi-Asset Architecture</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Institutional Web Trading & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 dark:from-blue-400 dark:via-indigo-300 dark:to-emerald-400">Advanced Order Suite</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
            All 9 institutional order techniques from Bitfinex, CMC Markets risk controls, and Bitpanda multi-asset liquidity — operating 100% in your browser with zero installation.
          </p>

          {/* Mode Switcher */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setTradingMode("demo")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                tradingMode === "demo"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20 ring-1 ring-emerald-400"
                  : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10"
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Practice Demo Mode ($10,000 Capital)</span>
            </button>

            <button
              type="button"
              onClick={() => setTradingMode("live")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                tradingMode === "live"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20 ring-1 ring-blue-400"
                  : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
              <span>Live Account Clearing</span>
            </button>

            <Link
              href="/tutorials"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 flex items-center gap-1.5 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-yellow-500 dark:text-yellow-400" />
              <span>Tutorial Guides</span>
            </Link>
          </div>
        </div>

        {/* Institutional Trading HUD Window */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#070B14]/95 backdrop-blur-2xl shadow-xl dark:shadow-2xl overflow-hidden ring-1 ring-slate-200/60 dark:ring-white/5 relative">
          
          {/* Top Platform Navigation Strip (Matches Bitfinex Screenshot 3 & 4) */}
          <div className="px-5 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
            {/* Navigation Tabs */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {(["Trading", "Derivatives", "Funding", "Securities", "OTC"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Live Websocket Status Indicator Badge (Matches Bitfinex Screenshot 5 Exactly) */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-600 dark:text-emerald-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Websocket connection is now online</span>
            </div>
          </div>

          {/* Subheader: Assets & Balance */}
          <div className="px-5 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/40 flex flex-wrap items-center justify-between gap-4 text-xs">
            {/* Asset selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {ASSETS.map((asset) => {
                const isSelected = selectedAsset.symbol === asset.symbol;
                return (
                  <button
                    key={asset.symbol}
                    type="button"
                    onClick={() => setSelectedAsset(asset)}
                    className={`px-3 py-1 rounded-lg font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      isSelected
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-blue-500/40 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/5"
                    }`}
                  >
                    <span>{asset.symbol}</span>
                    <span className={`text-[10px] ${asset.change24h >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {asset.change24h >= 0 ? "+" : ""}{asset.change24h}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Virtual Balance */}
            <div className="flex items-center gap-3">
              {tradingMode === "demo" ? (
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-mono text-[11px]">
                  <span>Demo Balance:</span>
                  <strong className="text-slate-900 dark:text-white font-bold">${demoBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
                  <button
                    type="button"
                    onClick={handleResetDemo}
                    title="Reload $10,000 simulator capital"
                    className="ml-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 font-mono text-[11px]">
                  <span>Live Brokerage Mode:</span>
                  <strong className="text-slate-900 dark:text-white font-bold">14 Payment Rails Active</strong>
                </div>
              )}
            </div>
          </div>

          {/* Toast Notification */}
          {lastExecuted && (
            <div className="px-5 py-2.5 bg-emerald-100 dark:bg-emerald-950/80 border-b border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fade-in font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{lastExecuted}</span>
            </div>
          )}

          {/* Main Terminal Grid: Chart Simulator (Left 8 Cols) + Bitfinex Order Form (Right 4 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 dark:divide-slate-800">
            
            {/* Left 8 Cols: Chart Visualizer & Market Depth */}
            <div className="lg:col-span-8 p-5 sm:p-6 space-y-5">
              
              {/* Asset Header Info */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-serif">{selectedAsset.name}</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-blue-600 dark:text-cyan-300 font-bold uppercase">
                      {selectedAsset.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                      {activeTab} Mode
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    24h High: ${selectedAsset.high24h.toLocaleString()} • 24h Low: ${selectedAsset.low24h.toLocaleString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                    ${currentPrice.toLocaleString("en-US", { minimumFractionDigits: selectedAsset.category === "forex" ? 4 : 2 })}
                  </div>
                  <div className={`text-xs font-mono font-bold flex items-center justify-end gap-1 ${selectedAsset.change24h >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                    {selectedAsset.change24h >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{selectedAsset.change24h >= 0 ? "+" : ""}{selectedAsset.change24h}% (24h)</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Visual Candlestick Chart */}
              <div className="relative h-64 rounded-2xl bg-slate-950 border border-slate-900 dark:border-slate-800 p-4 flex flex-col justify-between overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_24px] pointer-events-none" />

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{selectedAsset.symbol}</span>
                    <span className="text-slate-500">•</span>
                    <span>30m Candles</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-emerald-400 font-bold">Bitfinex Liquidity Bridge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px]">Indicators: RSI, MACD, Volume</span>
                  </div>
                </div>

                {/* Animated Candlesticks */}
                <div className="relative z-10 flex items-end justify-between h-40 gap-1.5 pt-4">
                  {[45, 52, 48, 60, 58, 65, 72, 68, 75, 82, 79, 88, 92, 86, 94, 91, 98, 95, 102, 108, 105, 114, 110, 118].map((val, idx) => {
                    const isGreen = idx % 3 !== 0;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div className={`w-[1px] h-2 ${isGreen ? "bg-emerald-500/60" : "bg-rose-500/60"}`} />
                        <div
                          style={{ height: `${(val / 120) * 100}%` }}
                          className={`w-full rounded-xs transition-all duration-500 ${
                            isGreen 
                              ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-sm shadow-emerald-500/20" 
                              : "bg-gradient-to-t from-rose-600 to-rose-400 shadow-sm shadow-rose-500/20"
                          }`}
                        />
                        <div className={`w-[1px] h-2 ${isGreen ? "bg-emerald-500/60" : "bg-rose-500/60"}`} />
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80 relative z-10">
                  <span>06:00 UTC</span>
                  <span>12:00 UTC</span>
                  <span>18:00 UTC</span>
                  <span>00:00 UTC</span>
                  <span className="text-emerald-400 font-bold">2ms WebSocket Tick</span>
                </div>
              </div>

              {/* CMC Markets Style Client Sentiment Gauge */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <BarChart2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Client Sentiment (CMC Markets Protocol):</span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">73% Long / 27% Short</span>
                </div>
                {/* Visual Bar */}
                <div className="w-full h-2 rounded-full bg-rose-500/30 overflow-hidden flex">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: "73%" }} />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>12,480 Active Accounts Long</span>
                  <span>4,610 Active Accounts Short</span>
                </div>
              </div>

              {/* Recent Executed Orders History */}
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                  <span>Active & Recent Orders</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Audit-Verified Order Ledger</span>
                </div>
                {executedTrades.length === 0 ? (
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 text-center text-xs text-slate-500 font-mono">
                    No orders submitted yet. Select an order technique on the right to test execution.
                  </div>
                ) : (
                  <div className="space-y-1.5 font-mono text-xs">
                    {executedTrades.map((t) => (
                      <div key={t.id} className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${t.side === "buy" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"}`}>
                            {t.side} {t.technique}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">{t.units} {t.symbol}</span>
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                          @ ${t.price.toLocaleString()} • Fee: ${t.fee.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{t.status}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right 4 Cols: Bitfinex-Style Comprehensive Order Form (Images 3, 4, 5) */}
            <div className="lg:col-span-4 p-5 sm:p-6 flex flex-col justify-between space-y-6 bg-slate-50/50 dark:bg-slate-900/30">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">Order Form</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-300 font-semibold">
                    {tradingMode === "demo" ? "DEMO SIMULATOR" : "LIVE CLEARING"}
                  </span>
                </div>

                {/* 1. ORDER TECHNIQUE DROPDOWN (Matches Bitfinex Images 4 & 5 marked IMPORTANT) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Order Technique:</span>
                    <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">Bitfinex Institutional Suite</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTechnique}
                      onChange={(e) => setSelectedTechnique(e.target.value as OrderTechnique)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-blue-500 appearance-none cursor-pointer pr-8 shadow-sm"
                    >
                      {ORDER_TECHNIQUES.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {tech.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Order Technique Benefit Explainer Banner */}
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold">
                    <Info className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                    <span>{activeTechniqueObj.label} Benefit:</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                    {activeTechniqueObj.benefit}
                  </p>
                </div>

                {/* Buy vs Sell Switcher */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSide("buy")}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      side === "buy"
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400"
                        : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Exchange Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => setSide("sell")}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      side === "sell"
                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-1 ring-rose-400"
                        : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Exchange Sell
                  </button>
                </div>

                {/* Dynamic Input Fields depending on Order Technique */}
                <form onSubmit={handleExecuteTrade} className="space-y-3 pt-1">
                  
                  {/* Amount Input */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Total Order Amount (USD)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <DollarSign className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="number"
                        min="10"
                        max={tradingMode === "demo" ? demoBalance : 1000000}
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-blue-500 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Limit Price Input (For Limit, Stop Limit, OCO) */}
                  {(selectedTechnique === "Limit" || selectedTechnique === "Stop Limit") && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Limit Price (USD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={limitPrice}
                        onChange={(e) => setLimitPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-blue-500 shadow-sm"
                      />
                    </div>
                  )}

                  {/* Stop Price Input (For Stop, Stop Limit) */}
                  {(selectedTechnique === "Stop" || selectedTechnique === "Stop Limit") && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Stop Trigger Price (USD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={stopTriggerPrice}
                        onChange={(e) => setStopTriggerPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-blue-500 shadow-sm"
                      />
                    </div>
                  )}

                  {/* Trailing Delta Input */}
                  {selectedTechnique === "Trailing Stop" && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Trailing Distance Delta ($)
                      </label>
                      <input
                        type="number"
                        step="10"
                        value={trailingDelta}
                        onChange={(e) => setTrailingDelta(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-blue-500 shadow-sm"
                      />
                    </div>
                  )}

                  {/* Scaled Orders Options */}
                  {selectedTechnique === "Scaled" && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Tranches (Orders)
                        </label>
                        <input
                          type="number"
                          min="2"
                          max="20"
                          value={scaledCount}
                          onChange={(e) => setScaledCount(Number(e.target.value))}
                          className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-blue-500 shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Distribution
                        </label>
                        <select className="w-full px-2 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono shadow-sm">
                          <option>Flat Weighted</option>
                          <option>Increasing Scale</option>
                          <option>Decreasing Scale</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Order Options Checkboxes (Matches Bitfinex Images 4 & 5) */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isOco}
                        onChange={(e) => setIsOco(e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-blue-600 focus:ring-0"
                      />
                      <span>OCO</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isHidden}
                        onChange={(e) => setIsHidden(e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-blue-600 focus:ring-0"
                      />
                      <span>Hidden</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPostOnly}
                        onChange={(e) => setIsPostOnly(e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-blue-600 focus:ring-0"
                      />
                      <span>Post-Only</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isTif}
                        onChange={(e) => setIsTif(e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-blue-600 focus:ring-0"
                      />
                      <span>TIF (GTC)</span>
                    </label>
                  </div>

                  {/* Order Calculation Preview */}
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/60 space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Execution Size:</span>
                      <strong className="text-slate-900 dark:text-white font-bold">
                        {(tradeAmount / (selectedTechnique === "Limit" ? limitPrice : currentPrice)).toFixed(5)} {selectedAsset.symbol.split("/")[0]}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Trading Fee (0.10%):</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">${(tradeAmount * 0.001).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                      side === "buy"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white shadow-emerald-600/30"
                        : "bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-90 text-white shadow-rose-600/30"
                    }`}
                  >
                    {tradingMode === "demo" ? (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Submit Demo {selectedTechnique} {side.toUpperCase()}</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Submit Live Clearing Order</span>
                      </>
                    )}
                  </button>
                </form>

              </div>

              {/* Bottom Information Link */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 text-center">
                <Link
                  href="/tutorials"
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center justify-center gap-1 transition"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>How to use these order techniques? View Full Guide</span>
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
