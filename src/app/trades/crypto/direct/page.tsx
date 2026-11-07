"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Coins, 
  ChevronRight, 
  Zap, 
  ShieldCheck,
  Activity
} from "lucide-react";
import { getPlatformStatus } from "@/lib/systemStatus";
import MaintenanceScreen from "@/components/common/MaintenanceScreen";
import TradingViewAdvancedChart from "@/components/trading/TradingViewAdvancedChart";
import { useBinanceLivePrices } from "@/hooks/useBinanceLivePrices";

const TRADINGVIEW_SYMBOLS: Record<string, string> = {
  BTC: "BINANCE:BTCUSDT",
  ETH: "BINANCE:ETHUSDT",
  SOL: "BINANCE:SOLUSDT",
  BNB: "BINANCE:BNBUSDT",
  XRP: "BINANCE:XRPUSDT",
};

type SupportedAsset = "BTC" | "ETH" | "SOL" | "BNB" | "XRP";

function DirectCryptoTradingContent() {
  const searchParams = useSearchParams();
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<SupportedAsset>("BTC");
  const [orderType, setOrderType] = useState<"limit" | "market" | "scaled">("limit");
  const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<number>(0.5);
  const [price, setPrice] = useState<number>(75780);

  const { coins, isConnected } = useBinanceLivePrices();
  const currentCoinData = coins.find((c) => c.symbol === selectedAsset);

  // Sync asset from query param ?pair=BTC_USD or ?pair=ETH_USD
  useEffect(() => {
    const pairParam = searchParams.get("pair");
    if (pairParam) {
      const base = pairParam.split("_")[0]?.toUpperCase() as SupportedAsset;
      if (base && TRADINGVIEW_SYMBOLS[base]) {
        setSelectedAsset(base);
      }
    }
  }, [searchParams]);

  // Sync price input with live market when asset changes
  useEffect(() => {
    if (currentCoinData?.price) {
      setPrice(currentCoinData.price);
    }
  }, [selectedAsset, currentCoinData?.price]);

  useEffect(() => {
    if (getPlatformStatus("crypto-direct") === "Maintenance") {
      setIsMaintenance(true);
    }
  }, []);

  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-[#060913] text-white">
        <header className="h-20 bg-[#090e1a]/90 border-b border-white/10 px-6 sm:px-12 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-white">
            Ekonnet<span className="text-orange-500">Trader</span>
          </Link>
          <Link href="/admin" className="text-xs text-orange-400 font-bold">Admin Console</Link>
        </header>
        <MaintenanceScreen 
          platformName="Direct Crypto Trades & Exchanges Platform"
          category="Crypto Sector [A]"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A14] text-gray-100 flex flex-col">
      
      {/* Top Header */}
      <header className="h-16 sm:h-20 bg-[#090e1a]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 lg:px-12 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full overflow-hidden p-[1px] shadow-sm shadow-orange-500/20 group-hover:scale-105 transition transform">
              <img
                src="/images/ekonnet-logo-96.webp"
                alt="Ekonnet Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-base font-black tracking-tight text-white hidden sm:inline">
              Ekonnet<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">DirectCrypto</span>
            </span>
          </Link>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          {/* Clean Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/trades" className="hover:text-white transition">Markets</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-orange-400 font-bold">Direct Exchange</span>
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
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 flex-1">
        
        {/* Banner with Isolation Badges & Asset Switchers */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-mono font-bold border border-orange-500/20">
              <Zap className="w-3 h-3 text-orange-400" />
              <span>Direct Order Book Engine • Official TradingView Advanced Charts</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Direct Cryptocurrency Trades & Market Charts
            </h1>
            <p className="text-xs text-slate-400">
              Institutional order routing with real-time TradingView technical indicators and live Binance liquidity.
            </p>
          </div>

          {/* Supported Asset Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {(["BTC", "ETH", "SOL", "BNB", "XRP"] as const).map((asset) => (
              <button
                key={asset}
                onClick={() => setSelectedAsset(asset)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 ${
                  selectedAsset === asset
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30 scale-105"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {asset} / USD
              </button>
            ))}
          </div>
        </div>

        {/* Orderbook and Terminal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left 8 Cols: Real TradingView Advanced Chart & Depth Book */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Chart Container Header & Embed */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-4 shadow-xl">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                    <span>Live Pair Index</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-medium">Binance WebSocket Active</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                    {selectedAsset}/USD
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                    {currentCoinData?.formattedPrice || `$${price.toLocaleString()}`}
                  </div>
                  <div className={`text-xs font-mono font-semibold ${currentCoinData?.isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                    {currentCoinData?.formattedChange || "+0.00%"} (24h)
                  </div>
                </div>
              </div>

              {/* TradingView Advanced Chart Web Component Embed */}
              <div className="w-full">
                <TradingViewAdvancedChart
                  symbol={TRADINGVIEW_SYMBOLS[selectedAsset] || "BINANCE:BTCUSDT"}
                  height="540px"
                  allowSymbolChange={true}
                  timeFrame="12M"
                />
              </div>
            </div>

            {/* Level 2 Orderbook */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-400" />
                  <span>Direct Order Book (Bids & Asks)</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Institutional Depth</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-emerald-400 font-bold block mb-1">BUY BIDS</span>
                  {[
                    { p: (price * 0.9998).toFixed(2), a: "1.42 " + selectedAsset, t: "$95,735" },
                    { p: (price * 0.9992).toFixed(2), a: "3.80 " + selectedAsset, t: "$256,177" },
                    { p: (price * 0.9985).toFixed(2), a: "8.25 " + selectedAsset, t: "$556,050" }
                  ].map((b, i) => (
                    <div key={i} className="flex justify-between p-2 rounded bg-emerald-500/5 text-emerald-300 border border-emerald-500/10">
                      <span>${b.p}</span>
                      <span className="text-slate-400">{b.a}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-rose-400 font-bold block mb-1">SELL ASKS</span>
                  {[
                    { p: (price * 1.0002).toFixed(2), a: "0.85 " + selectedAsset, t: "$57,308" },
                    { p: (price * 1.0008).toFixed(2), a: "2.40 " + selectedAsset, t: "$161,827" },
                    { p: (price * 1.0015).toFixed(2), a: "5.10 " + selectedAsset, t: "$343,918" }
                  ].map((a, i) => (
                    <div key={i} className="flex justify-between p-2 rounded bg-rose-500/5 text-rose-300 border border-rose-500/10">
                      <span>${a.p}</span>
                      <span className="text-slate-400">{a.a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right 4 Cols: Direct Order Form */}
          <div className="lg:col-span-4 rounded-2xl sm:rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Direct Exchange Order Form</h3>
                <p className="text-xs text-slate-400">Instant in-browser WebSocket dispatch</p>
              </div>

              {/* Buy / Sell Tab */}
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-black/40 border border-white/10">
                <button
                  onClick={() => setOrderSide("buy")}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    orderSide === "buy" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Buy {selectedAsset}
                </button>
                <button
                  onClick={() => setOrderSide("sell")}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    orderSide === "sell" ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sell {selectedAsset}
                </button>
              </div>

              {/* Order Technique */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 block font-semibold">Order Technique:</label>
                <select
                  value={orderType}
                  onChange={(e: any) => setOrderType(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
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
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm font-mono text-white focus:outline-none focus:border-orange-500"
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
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm font-mono text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              {/* Order Summary */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Total:</span>
                  <span className="text-white font-bold">${(amount * price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[10px]">
                  <span>Execution Fee (0.05%):</span>
                  <span>${((amount * price) * 0.0005).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Executed Direct ${orderSide.toUpperCase()} for ${amount} ${selectedAsset} at $${price}.`)}
              className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-xl transition-all ${
                orderSide === "buy" 
                  ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30" 
                  : "bg-rose-600 hover:bg-rose-500 shadow-rose-600/30"
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

export default function DirectCryptoTradingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070A14] flex items-center justify-center text-white font-mono text-sm">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse mr-2" />
        Loading Market Terminal...
      </div>
    }>
      <DirectCryptoTradingContent />
    </Suspense>
  );
}
