"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRightLeft, 
  ShieldCheck, 
  Search, 
  Filter, 
  ChevronRight, 
  DollarSign, 
  Coins, 
  CheckCircle2, 
  Star,
  Lock,
  ArrowRight,
  Zap
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import LiveTicker from "@/components/landing/LiveTicker";
import Footer from "@/components/landing/Footer";
import { getPlatformStatus } from "@/lib/systemStatus";
import MaintenanceScreen from "@/components/common/MaintenanceScreen";

interface P2POffer {
  id: string;
  trader: string;
  ordersCount: number;
  rating: string;
  asset: "BTC" | "ETH" | "USDT";
  fiatPrice: string;
  available: string;
  limit: string;
  paymentMethods: string[];
}

const MOCK_P2P_OFFERS: P2POffer[] = [
  {
    id: "p2p-1",
    trader: "CryptoWhale_Prime",
    ordersCount: 1420,
    rating: "99.8%",
    asset: "BTC",
    fiatPrice: "$67,200.00 USD",
    available: "4.50 BTC",
    limit: "$500 - $50,000",
    paymentMethods: ["Wise", "Bank Swift Wire", "Revolut"]
  },
  {
    id: "p2p-2",
    trader: "EuroFastSettle",
    ordersCount: 880,
    rating: "100%",
    asset: "BTC",
    fiatPrice: "€62,100.00 EUR",
    available: "2.10 BTC",
    limit: "€200 - €20,000",
    paymentMethods: ["SEPA Instant", "Revolut", "Skrill"]
  },
  {
    id: "p2p-3",
    trader: "GlobalPeer_Direct",
    ordersCount: 650,
    rating: "99.2%",
    asset: "ETH",
    fiatPrice: "$2,535.00 USD",
    available: "25.00 ETH",
    limit: "$100 - $15,000",
    paymentMethods: ["PayPal Direct", "Wise", "Card Transfer"]
  },
  {
    id: "p2p-4",
    trader: "SovereignLiquidity",
    ordersCount: 2310,
    rating: "99.9%",
    asset: "USDT",
    fiatPrice: "$1.00 USD",
    available: "150,000 USDT",
    limit: "$1,000 - $100,000",
    paymentMethods: ["Bank Swift Wire", "SEPA", "Wise"]
  }
];

export default function P2PCryptoTradingPage() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [assetFilter, setAssetFilter] = useState<"ALL" | "BTC" | "ETH" | "USDT">("ALL");

  useEffect(() => {
    if (getPlatformStatus("crypto-p2p") === "Maintenance") {
      setIsMaintenance(true);
    }
  }, []);

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

  const filteredOffers = MOCK_P2P_OFFERS.filter(o => {
    if (assetFilter === "ALL") return true;
    return o.asset === assetFilter;
  });

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
              <span>Direct Peer-to-Peer Smart Settlement • Independent Sector</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Peer-to-Peer Crypto Trading & Settlement
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Trade local fiat directly with verified counterparties across 14 global payment rails with zero middleman hold-ups.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSide("buy")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                side === "buy" ? "bg-emerald-600 text-white shadow-xs" : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10"
              }`}
            >
              Buy Crypto
            </button>
            <button
              onClick={() => setSide("sell")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                side === "sell" ? "bg-rose-600 text-white shadow-xs" : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10"
              }`}
            >
              Sell Crypto
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-sans font-medium">Asset Filter:</span>
            {(["ALL", "BTC", "ETH", "USDT"] as const).map(asset => (
              <button
                key={asset}
                onClick={() => setAssetFilter(asset)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  assetFilter === asset 
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold shadow-xs" 
                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10"
                }`}
              >
                {asset}
              </button>
            ))}
          </div>

          <div className="text-slate-500 dark:text-slate-400 text-[11px] font-sans flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>100% Non-Custodial Direct Settlement Protected</span>
          </div>
        </div>

        {/* Offers Table */}
        <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl overflow-hidden p-5 sm:p-6 space-y-4 shadow-xs dark:shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[10px] uppercase">
                  <th className="py-3 pr-4">Advertiser / Trader</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Available / Limit</th>
                  <th className="py-3 px-4">Accepted Payment Rails</th>
                  <th className="py-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredOffers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 pr-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{offer.trader}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{offer.ordersCount} orders</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{offer.rating} completion</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-sm font-black text-slate-900 dark:text-white">{offer.fiatPrice}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">Unit Rate ({offer.asset})</div>
                    </td>

                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                      <div>Available: <span className="text-slate-900 dark:text-white font-bold">{offer.available}</span></div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Limit: {offer.limit}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {offer.paymentMethods.map((pm, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] text-slate-700 dark:text-slate-300 font-sans">
                            {pm}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 pl-4 text-right">
                      <button
                        onClick={() => alert(`Initiating direct P2P order with ${offer.trader} for ${offer.asset}. Smart settlement agreement prepared.`)}
                        className={`px-4 py-2 rounded-xl font-bold text-xs text-white transition-all shadow-sm ${
                          side === "buy" ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20" : "bg-rose-600 hover:bg-rose-500 shadow-rose-500/20"
                        }`}
                      >
                        {side === "buy" ? `Buy ${offer.asset}` : `Sell ${offer.asset}`}
                      </button>
                    </td>
                  </tr>
                ))}
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
