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
import TradingViewCryptoScreener from "@/components/trading/TradingViewCryptoScreener";

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
  const [viewMode, setViewMode] = useState<"offers" | "screener" | "both">("both");

  // P2P Direct Settlement Modal State (Phase 2)
  const [selectedTradeOffer, setSelectedTradeOffer] = useState<P2POffer | null>(null);
  const [tradeAmount, setTradeAmount] = useState<number>(500);
  const [settlementStep, setSettlementStep] = useState<"details" | "locked" | "paid" | "completed">("details");
  const [isProcessingSettlement, setIsProcessingSettlement] = useState(false);

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

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/40 p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold">
            <button
              onClick={() => setViewMode("both")}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === "both" 
                  ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-xs" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Views
            </button>
            <button
              onClick={() => setViewMode("offers")}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === "offers" 
                  ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-xs" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              P2P Deals
            </button>
            <button
              onClick={() => setViewMode("screener")}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === "screener" 
                  ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-xs" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              TradingView Screener
            </button>
          </div>
        </div>

        {/* TradingView Market Intelligence Bar (Syncs with selected asset) */}
        {(viewMode === "both" || viewMode === "offers") && (
          <P2PTradingViewWidgets asset={asset} />
        )}

        {/* TradingView Official Live Crypto Screener Table */}
        {(viewMode === "both" || viewMode === "screener") && (
          <TradingViewCryptoScreener currency={fiat} />
        )}

        {/* Main P2P Offers Table Card */}
        {(viewMode === "both" || viewMode === "offers") && (
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
                          onClick={() => {
                            setSelectedTradeOffer(offer);
                            setTradeAmount(Math.max(Number(offer.minLimit) || 100, 250));
                            setSettlementStep("details");
                          }}
                          className={`inline-block rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer ${
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
        )}

        {/* ========================================================================= */}
        {/* DIRECT P2P SETTLEMENT VAULT MODAL (PHASE 2)                               */}
        {/* ========================================================================= */}
        {selectedTradeOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-7 space-y-5 text-slate-900 dark:text-white transition-all">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">
                      Direct P2P Settlement Contract
                    </h3>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      Counterparty: <span className="font-bold text-slate-800 dark:text-slate-200">{selectedTradeOffer.advertiserName}</span> ({selectedTradeOffer.monthFinishRate}% completion)
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTradeOffer(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold text-xs transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Step Progression Bar */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                <div className={`p-2 rounded-xl border ${
                  settlementStep === "details"
                    ? "bg-orange-500/15 border-orange-500/40 text-orange-600 dark:text-orange-400 font-bold"
                    : "bg-slate-100 dark:bg-white/5 border-transparent text-slate-400"
                }`}>
                  1. Order Specs
                </div>
                <div className={`p-2 rounded-xl border ${
                  settlementStep === "locked"
                    ? "bg-orange-500/15 border-orange-500/40 text-orange-600 dark:text-orange-400 font-bold"
                    : settlementStep === "paid" || settlementStep === "completed"
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold"
                    : "bg-slate-100 dark:bg-white/5 border-transparent text-slate-400"
                }`}>
                  2. Vault Locked
                </div>
                <div className={`p-2 rounded-xl border ${
                  settlementStep === "paid" || settlementStep === "completed"
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold"
                    : "bg-slate-100 dark:bg-white/5 border-transparent text-slate-400"
                }`}>
                  3. Settlement
                </div>
              </div>

              {/* STEP 1: Details & Vault Lock */}
              {settlementStep === "details" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-500">Fixed Unit Price:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {selectedTradeOffer.fiatSymbol}{selectedTradeOffer.price} {selectedTradeOffer.fiatUnit}
                      </span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-500">Merchant Limits:</span>
                      <span>{selectedTradeOffer.fiatSymbol}{selectedTradeOffer.minLimit} - {selectedTradeOffer.fiatSymbol}{selectedTradeOffer.maxLimit}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-500">Supported Rails:</span>
                      <span className="font-semibold text-orange-600 dark:text-orange-400">{selectedTradeOffer.tradeMethods.join(", ")}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      I want to pay ({selectedTradeOffer.fiatUnit}):
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400">
                        {selectedTradeOffer.fiatSymbol}
                      </span>
                      <input
                        type="number"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(Math.max(1, Number(e.target.value)))}
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-600 dark:text-slate-300">Estimated Crypto Yield:</span>
                    <span className="font-extrabold text-orange-600 dark:text-orange-400 text-sm">
                      {(tradeAmount / (Number(selectedTradeOffer.price.replace(/,/g, "")) || 1)).toFixed(6)} {selectedTradeOffer.asset}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setIsProcessingSettlement(true);
                      setTimeout(() => {
                        setIsProcessingSettlement(false);
                        setSettlementStep("locked");
                      }, 700);
                    }}
                    disabled={isProcessingSettlement}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs tracking-wide shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    {isProcessingSettlement ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Locking Crypto in Sovereign Vault...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Lock Sovereign Vault &amp; Confirm Contract</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* STEP 2: Vault Locked & Fiat Payment */}
              {settlementStep === "locked" && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>Crypto Locked! Vault Sovereign Node #82.165.10.77</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2.5 text-xs font-mono">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Seller Payment Destination:</div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Method:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedTradeOffer.tradeMethods[0] || "Bank Transfer"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Account Title:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedTradeOffer.advertiserName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Account / IBAN:</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">PK44SCBL0000003928192831</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount Due:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{selectedTradeOffer.fiatSymbol}{tradeAmount.toLocaleString()} {selectedTradeOffer.fiatUnit}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Please transfer the exact amount using your banking app or Wise. Once dispatched, click below to notify counterparty.
                  </p>

                  <button
                    onClick={() => setSettlementStep("paid")}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I Have Dispatched the Payment</span>
                  </button>
                </div>
              )}

              {/* STEP 3: Payment Dispatched -> Release Crypto */}
              {settlementStep === "paid" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                      <span>Payment Dispatched &bull; Awaiting Seller Confirmation</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Seller has been notified. Counterparty will check incoming bank credit and trigger release.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsProcessingSettlement(true);
                      setTimeout(() => {
                        setIsProcessingSettlement(false);
                        setSettlementStep("completed");
                      }, 800);
                    }}
                    disabled={isProcessingSettlement}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs tracking-wide shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    {isProcessingSettlement ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Bank Rail Settlement &amp; Crediting Wallet...</span>
                      </>
                    ) : (
                      <>
                        <Coins className="w-4 h-4" />
                        <span>Simulate Seller Confirm &amp; Release Crypto</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* STEP 4: Completed */}
              {settlementStep === "completed" && (
                <div className="space-y-4 text-center py-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      P2P Settlement Successfully Cleared!
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {(tradeAmount / (Number(selectedTradeOffer.price.replace(/,/g, "")) || 1)).toFixed(6)} {selectedTradeOffer.asset} has been credited to your verified Ekonnet custody wallet.
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTradeOffer(null)}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    Back to P2P Marketplace
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* Universal Footer */}
      <Footer />

    </div>
  );
}
