"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Coins, 
  TrendingUp, 
  Sliders, 
  Layers, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  BarChart2,
  Lock,
  ArrowRight
} from "lucide-react";
import { getPlatformStatus } from "@/lib/systemStatus";
import MaintenanceScreen from "@/components/common/MaintenanceScreen";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function DirectCryptoTradingPage() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<"BTC" | "ETH" | "SOL">("BTC");
  const [orderType, setOrderType] = useState<"limit" | "market" | "scaled">("limit");
  const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<number>(0.5);
  const [price, setPrice] = useState<number>(67420);

  useEffect(() => {
    if (getPlatformStatus("crypto-direct") === "Maintenance") {
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
          platformName="Direct Crypto Trades & Exchanges Platform"
          category="Crypto Sector [A]"
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
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-md shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Coins className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="text-base font-extrabold tracking-tight text-white hidden sm:inline">
              Ekonnet<span className="text-cyan-400">DirectCrypto</span>
            </span>
          </Link>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          {/* Clean Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/trades" className="hover:text-white transition">Ways to Invest</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-blue-400 font-bold">Direct Crypto Exchange</span>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/trades/crypto/p2p"
            className="hidden md:inline-flex px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs text-emerald-400 font-semibold transition"
          >
            P2P Settlement &rarr;
          </Link>
          <Link
            href="/admin"
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-bold transition-all"
          >
            Admin Console
          </Link>
        </div>
      </header>

      {/* Main Terminal View */}
      <main className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8 flex-1">
        
        {/* Banner with Isolation Badges */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-mono font-bold border border-blue-500/20">
              <Zap className="w-3 h-3 text-blue-400" />
              <span>Direct Order Book Engine • Independent Sub-System</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Direct Cryptocurrency Trades & Exchanges
            </h1>
            <p className="text-xs text-slate-400">
              High-frequency in-browser WebSocket order routing with institutional deep bids and asks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(["BTC", "ETH", "SOL"] as const).map(asset => (
              <button
                key={asset}
                onClick={() => setSelectedAsset(asset)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedAsset === asset
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
                }`}
              >
                {asset} / USD
              </button>
            ))}
          </div>
        </div>

        {/* Orderbook and Terminal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left 8 Cols: Chart & Depth Book */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-400 font-mono">Live Pair Index</div>
                  <div className="text-2xl font-black text-white font-mono">{selectedAsset}/USD</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {selectedAsset === "BTC" ? "$67,420.50" : selectedAsset === "ETH" ? "$2,540.80" : "$168.25"}
                  </div>
                  <div className="text-xs text-emerald-400 font-mono">+3.84% (24h)</div>
                </div>
              </div>

              {/* Simulated Candlestick Box */}
              <div className="h-64 rounded-2xl bg-black/40 border border-white/10 p-4 flex flex-col justify-between">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Level 2 Direct Matching Feed</span>
                  <span className="text-emerald-400">WebSocket Online</span>
                </div>
                <div className="flex items-end justify-between h-40 pt-4 px-2">
                  {[55, 60, 52, 68, 74, 70, 85, 92, 88, 102, 98, 115, 110, 125, 120, 135].map((h, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-0.5 bg-emerald-500/40 h-3" />
                      <div 
                        style={{ height: `${h}px` }} 
                        className={`w-3.5 rounded-sm ${i % 4 === 0 ? 'bg-rose-500' : 'bg-emerald-500'} shadow-sm`} 
                      />
                      <div className="w-0.5 bg-emerald-500/40 h-3" />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>00:00 UTC</span>
                  <span>06:00 UTC</span>
                  <span>12:00 UTC</span>
                  <span>18:00 UTC</span>
                </div>
              </div>
            </div>

            {/* Level 2 Orderbook */}
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Direct Order Book (Bids & Asks)
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-emerald-400 font-bold block mb-1">BUY BIDS</span>
                  {[
                    { p: "67,419.50", a: "1.42 BTC", t: "$95,735" },
                    { p: "67,415.00", a: "3.80 BTC", t: "$256,177" },
                    { p: "67,400.00", a: "8.25 BTC", t: "$556,050" }
                  ].map((b, i) => (
                    <div key={i} className="flex justify-between p-2 rounded bg-emerald-500/5 text-emerald-300">
                      <span>{b.p}</span>
                      <span className="text-slate-400">{b.a}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-rose-400 font-bold block mb-1">SELL ASKS</span>
                  {[
                    { p: "67,422.00", a: "0.85 BTC", t: "$57,308" },
                    { p: "67,428.00", a: "2.40 BTC", t: "$161,827" },
                    { p: "67,435.00", a: "5.10 BTC", t: "$343,918" }
                  ].map((a, i) => (
                    <div key={i} className="flex justify-between p-2 rounded bg-rose-500/5 text-rose-300">
                      <span>{a.p}</span>
                      <span className="text-slate-400">{a.a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right 4 Cols: Direct Order Form */}
          <div className="lg:col-span-4 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl p-6 space-y-6 shadow-2xl">
            <div>
              <h3 className="text-base font-bold text-white">Direct Exchange Order Form</h3>
              <p className="text-xs text-slate-400">Instant in-browser WebSocket dispatch</p>
            </div>

            {/* Buy / Sell Tab */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-black/30 border border-white/10">
              <button
                onClick={() => setOrderSide("buy")}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  orderSide === "buy" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Buy {selectedAsset}
              </button>
              <button
                onClick={() => setOrderSide("sell")}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  orderSide === "sell" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Sell {selectedAsset}
              </button>
            </div>

            {/* Order Type */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 block font-semibold">Order Technique:</label>
              <select
                value={orderType}
                onChange={(e: any) => setOrderType(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              >
                <option value="limit">Limit Order</option>
                <option value="market">Market Instant Fill</option>
                <option value="scaled">Algorithmic Scaled Order</option>
              </select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 block font-semibold">Amount ({selectedAsset}):</label>
              <input
                type="number"
                value={amount}
                step="0.01"
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Price for Limit */}
            {orderType !== "market" && (
              <div className="space-y-2">
                <label className="text-xs text-slate-400 block font-semibold">Price (USD):</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <button
              onClick={() => alert(`Executed Direct ${orderSide.toUpperCase()} for ${amount} ${selectedAsset}.`)}
              className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-xl transition-all ${
                orderSide === "buy" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-rose-600 hover:bg-rose-500"
              }`}
            >
              Submit Direct {orderSide.toUpperCase()} Order
            </button>
          </div>

        </div>

      </main>

    </div>
  );
}
