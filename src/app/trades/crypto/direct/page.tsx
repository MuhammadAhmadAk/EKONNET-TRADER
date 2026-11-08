"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Zap, 
  Activity,
  ArrowRight,
  ShieldCheck,
  Lock
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import LiveTicker from "@/components/landing/LiveTicker";
import Footer from "@/components/landing/Footer";
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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<SupportedAsset>("BTC");
  const [orderType, setOrderType] = useState<"limit" | "market" | "scaled">("limit");
  const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<number>(0.5);
  const [price, setPrice] = useState<number>(75780);

  const { coins } = useBinanceLivePrices();
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

  // Auth check
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (getPlatformStatus("crypto-direct") === "Maintenance") {
      setIsMaintenance(true);
    }
  }, []);

  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col">
        <Navbar />
        <MaintenanceScreen 
          platformName="Direct Crypto Trades & Exchanges Platform"
          category="Crypto Sector [A]"
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-gray-100 flex flex-col transition-colors duration-300">
      
      {/* Universal High-Tech Navbar matching Homepage */}
      <Navbar />

      {/* Real-time Ticker Bar matching Homepage */}
      <LiveTicker />

      {/* Main Terminal View */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 flex-1">
        
        {/* Banner with Isolation Badges & Asset Switchers */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs dark:shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-mono font-bold border border-orange-500/20">
              <Zap className="w-3 h-3 text-orange-500" />
              <span>Direct Order Book Engine • Official TradingView Advanced Charts</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Direct Cryptocurrency Trades & Market Charts
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Institutional order routing with real-time TradingView technical indicators and live Binance liquidity.
            </p>
          </div>

          {/* Supported Asset Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {(["BTC", "ETH", "SOL", "BNB", "XRP"] as const).map((asset) => (
              <button
                key={asset}
                onClick={() => setSelectedAsset(asset)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 ${
                  selectedAsset === asset
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/25 scale-[1.02]"
                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10"
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
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl space-y-4 shadow-xs dark:shadow-xl">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2">
                    <span>Live Pair Index</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Binance WebSocket Active</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                    {selectedAsset}/USD
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {currentCoinData?.formattedPrice || `$${price.toLocaleString()}`}
                  </div>
                  <div className={`text-xs font-mono font-semibold ${currentCoinData?.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
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
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl space-y-4 shadow-xs dark:shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-500" />
                  <span>Direct Order Book (Bids & Asks)</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Institutional Depth</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mb-1">BUY BIDS</span>
                  {[
                    { p: (price * 0.9998).toFixed(2), a: "1.42 " + selectedAsset, t: "$95,735" },
                    { p: (price * 0.9992).toFixed(2), a: "3.80 " + selectedAsset, t: "$256,177" },
                    { p: (price * 0.9985).toFixed(2), a: "8.25 " + selectedAsset, t: "$556,050" }
                  ].map((b, i) => (
                    <div key={i} className="flex justify-between p-2 rounded-xl bg-emerald-500/5 text-emerald-600 dark:text-emerald-300 border border-emerald-500/10">
                      <span>${b.p}</span>
                      <span className="text-slate-500 dark:text-slate-400">{b.a}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold block mb-1">SELL ASKS</span>
                  {[
                    { p: (price * 1.0002).toFixed(2), a: "0.85 " + selectedAsset, t: "$57,308" },
                    { p: (price * 1.0008).toFixed(2), a: "2.40 " + selectedAsset, t: "$161,827" },
                    { p: (price * 1.0015).toFixed(2), a: "5.10 " + selectedAsset, t: "$343,918" }
                  ].map((a, i) => (
                    <div key={i} className="flex justify-between p-2 rounded-xl bg-rose-500/5 text-rose-600 dark:text-rose-300 border border-rose-500/10">
                      <span>${a.p}</span>
                      <span className="text-slate-500 dark:text-slate-400">{a.a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right 4 Cols: Direct Order Form */}
          <div className="lg:col-span-4 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl p-6 space-y-6 shadow-xs dark:shadow-xl flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Direct Exchange Order Form</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Instant in-browser WebSocket dispatch</p>
              </div>

              {/* Buy / Sell Tab */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10">
                <button
                  onClick={() => setOrderSide("buy")}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    orderSide === "buy" ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Buy {selectedAsset}
                </button>
                <button
                  onClick={() => setOrderSide("sell")}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    orderSide === "sell" ? "bg-rose-600 text-white shadow-sm shadow-rose-600/30" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Sell {selectedAsset}
                </button>
              </div>

              {/* Order Technique */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-600 dark:text-slate-400 block font-semibold">Order Technique:</label>
                <select
                  value={orderType}
                  onChange={(e: any) => setOrderType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="limit">Limit Order</option>
                  <option value="market">Market Instant Fill</option>
                  <option value="scaled">Algorithmic Scaled Order</option>
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-600 dark:text-slate-400 block font-semibold">Amount ({selectedAsset}):</label>
                <input
                  type="number"
                  value={amount}
                  step="0.01"
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Price for Limit */}
              {orderType !== "market" && (
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-600 dark:text-slate-400 block font-semibold">Price (USD):</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              {/* Order Summary */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Estimated Total:</span>
                  <span className="text-slate-900 dark:text-white font-bold">${(amount * price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-400 dark:text-slate-500 text-[10px]">
                  <span>Execution Fee (0.05%):</span>
                  <span>${((amount * price) * 0.0005).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {!currentUser ? (
              <Link
                href="/?auth=login&from=/trades/crypto/direct"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 shadow-orange-500/25 flex items-center justify-center gap-2 transition"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In to Place Orders</span>
              </Link>
            ) : (
              <button
                onClick={() => alert(`Executed Direct ${orderSide.toUpperCase()} for ${amount} ${selectedAsset} at $${price}.`)}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md transition-all ${
                  orderSide === "buy" 
                    ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25" 
                    : "bg-rose-600 hover:bg-rose-500 shadow-rose-600/25"
                }`}
              >
                Submit Direct {orderSide.toUpperCase()} Order
              </button>
            )}
          </div>

        </div>

      </main>

      {/* Universal Footer matching Homepage */}
      <Footer />
    </div>
  );
}

export default function DirectCryptoTradingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent flex items-center justify-center text-slate-800 dark:text-white font-mono text-sm">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse mr-2" />
        Loading Market Terminal...
      </div>
    }>
      <DirectCryptoTradingContent />
    </Suspense>
  );
}
