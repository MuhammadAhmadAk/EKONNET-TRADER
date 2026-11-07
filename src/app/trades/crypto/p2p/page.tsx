"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRightLeft, 
  ShieldCheck, 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  Zap,
  RefreshCw,
  Coins,
  DollarSign
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import LiveTicker from "@/components/landing/LiveTicker";
import Footer from "@/components/landing/Footer";
import { getPlatformStatus } from "@/lib/systemStatus";
import MaintenanceScreen from "@/components/common/MaintenanceScreen";
import P2PTradingViewWidgets from "@/components/trading/P2PTradingViewWidgets";

interface P2POffer {
  advNo: string;
  advertiserName: string;
  monthOrderCount: number;
  monthFinishRate: string;
  price: string;
  fiatUnit: string;
  fiatSymbol: string;
  asset: string;
  availableAmount: string;
  minLimit: string;
  maxLimit: string;
  tradeMethods: string[];
}

export default function P2PCryptoTradingPage() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [offers, setOffers] = useState<P2POffer[]>([]);
  const [asset, setAsset] = useState<"BTC" | "ETH" | "USDT">("BTC");
  const [fiat, setFiat] = useState<string>("USD");
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Maintenance check
  useEffect(() => {
    if (getPlatformStatus("crypto-p2p") === "Maintenance") {
      setIsMaintenance(true);
    }
  }, []);

  // Fetch live P2P offers from backend proxy
  const fetchOffers = async (isBackground = false) => {
    if (!isBackground) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const res = await fetch(`/api/p2p?asset=${asset}&fiat=${fiat}&tradeType=${tradeType}`);
      const data = await res.json();
      if (data && Array.isArray(data.offers) && data.offers.length > 0) {
        setOffers(data.offers);
      }
    } catch (err) {
      console.error("Error loading P2P offers:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial fetch and 15-second background auto-refresh
  useEffect(() => {
    fetchOffers(false);
    const interval = setInterval(() => {
      fetchOffers(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [asset, fiat, tradeType]);

  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col">
        <Navbar />
        <MaintenanceScreen 
          platformName="Peers to Peers Crypto Trades & Exchanges Platform"
          category="Crypto Sector [B]"
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-gray-100 flex flex-col transition-colors duration-300">
      
      {/* Universal Navbar */}
      <Navbar />

      {/* Real-time Ticker Bar */}
      <LiveTicker />

      {/* Main P2P View */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 flex-1">
        
        {/* Banner */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs dark:shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-mono font-bold border border-orange-500/20">
              <ShieldCheck className="w-3 h-3 text-orange-500" />
              <span>Direct Peer-to-Peer Smart Settlement • Live Binance Network</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Peer-to-Peer Crypto Trading & Settlement
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Trade local fiat directly with verified counterparties across 14 global payment rails with zero middleman hold-ups.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto refresh status pill */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10">
              <RefreshCw className={`w-3 h-3 text-emerald-500 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Live 15s Feed</span>
            </div>

            {/* Buy / Sell switch */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-black/30 p-1 border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setTradeType("BUY")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tradeType === "BUY" 
                    ? "bg-emerald-600 text-white shadow-xs" 
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Buy Crypto
              </button>
              <button
                onClick={() => setTradeType("SELL")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tradeType === "SELL" 
                    ? "bg-rose-600 text-white shadow-xs" 
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Sell Crypto
              </button>
            </div>
          </div>
        </div>

        {/* Top Dropdowns & Filters Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3 shadow-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Asset Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Crypto:</span>
              <div className="flex bg-slate-100 dark:bg-black/40 p-1 rounded-xl border border-slate-200 dark:border-white/10 gap-1">
                {(["BTC", "ETH", "USDT"] as const).map((coin) => (
                  <button
                    key={coin}
                    onClick={() => setAsset(coin)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      asset === coin
                        ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-xs"
                        : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {coin}
                  </button>
                ))}
              </div>
            </div>

            {/* Fiat Currency Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Fiat Currency:</span>
              <select
                value={fiat}
                onChange={(e) => setFiat(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 px-3 py-1.5 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="PKR">PKR (₨)</option>
                <option value="AED">AED</option>
                <option value="CAD">CAD (C$)</option>
              </select>
            </div>
          </div>

          <div className="text-slate-500 dark:text-slate-400 text-[11px] font-sans flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>100% Non-Custodial Multi-Sig Protection</span>
          </div>
        </div>

        {/* TradingView Market Intelligence Bar (Syncs with selected asset) */}
        <P2PTradingViewWidgets asset={asset} />

        {/* Main P2P Offers Table Card */}
        <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl overflow-hidden p-5 sm:p-6 space-y-4 shadow-xs dark:shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live {tradeType === "BUY" ? "Buy" : "Sell"} {asset} Offers
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct counterparty settlements filtered for {fiat} payments
              </p>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Showing <span className="font-bold text-slate-900 dark:text-white">{offers.length}</span> Active Merchants
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 text-[10px] font-mono uppercase tracking-wider">
                  <th className="py-3 pr-4">ADVERTISER / TRADER</th>
                  <th className="py-3 px-4">PRICE</th>
                  <th className="py-3 px-4">AVAILABLE / LIMIT</th>
                  <th className="py-3 px-4">ACCEPTED PAYMENT RAILS</th>
                  <th className="py-3 pl-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-5 h-5 text-orange-500 animate-spin" />
                        <span className="font-medium text-xs">Loading live P2P rates from institutional liquidity books...</span>
                      </div>
                    </td>
                  </tr>
                ) : offers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="font-medium text-xs">No active offers found for {asset}/{fiat}. Please try another currency pair.</div>
                    </td>
                  </tr>
                ) : (
                  offers.map((offer) => (
                    <tr
                      key={offer.advNo}
                      className="transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.02]"
                    >
                      {/* 1. Advertiser / Trader */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                          <span>{offer.advertiserName}</span>
                          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-500/10 text-[10px] text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                            ✓
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {offer.monthOrderCount} orders{" "}
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {offer.monthFinishRate}% completion
                          </span>
                        </div>
                      </td>

                      {/* 2. Price */}
                      <td className="py-4 px-4 font-mono">
                        <div className="text-base font-black text-slate-900 dark:text-white">
                          {offer.fiatSymbol}{offer.price} {offer.fiatUnit}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-400 font-sans">
                          Unit Rate ({offer.asset})
                        </div>
                      </td>

                      {/* 3. Available / Limit */}
                      <td className="py-4 px-4 font-mono">
                        <div className="text-slate-700 dark:text-slate-300">
                          <span className="text-slate-400 font-sans text-xs">Available: </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {offer.availableAmount} {offer.asset}
                          </span>
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 font-sans">
                          Limit: {offer.fiatSymbol}{offer.minLimit} - {offer.fiatSymbol}{offer.maxLimit}
                        </div>
                      </td>

                      {/* 4. Accepted Payment Rails */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {offer.tradeMethods.map((method, idx) => (
                            <span
                              key={idx}
                              className="rounded-md border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                            >
                              {method}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* 5. Action */}
                      <td className="py-4 pl-4 text-right">
                        <button
                          onClick={() => alert(`Starting P2P ${tradeType} trade with ${offer.advertiserName} for ${offer.asset}. Smart settlement agreement prepared.`)}
                          className={`inline-block rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all ${
                            tradeType === "BUY"
                              ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20"
                              : "bg-rose-600 hover:bg-rose-500 shadow-rose-600/20"
                          }`}
                        >
                          {tradeType === "BUY" ? "Buy" : "Sell"} {offer.asset}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Universal Footer */}
      <Footer />

    </div>
  );
}
