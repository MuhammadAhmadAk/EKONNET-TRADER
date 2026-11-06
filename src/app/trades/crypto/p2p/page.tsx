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
  ArrowRight
} from "lucide-react";
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
      <div className="min-h-screen bg-[#060913] text-white">
        <header className="h-20 bg-[#090e1a]/90 border-b border-white/10 px-6 sm:px-12 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-white">Ekonnet<span className="text-cyan-400">Trader</span></Link>
          <Link href="/admin" className="text-xs text-blue-400 font-bold">Admin Console</Link>
        </header>
        <MaintenanceScreen 
          platformName="Peers to Peers Crypto Trades & Exchanges Platform"
          category="Crypto Sector [B]"
        />
      </div>
    );
  }

  const filteredOffers = MOCK_P2P_OFFERS.filter(o => {
    if (assetFilter === "ALL") return true;
    return o.asset === assetFilter;
  });

  return (
    <div className="min-h-screen bg-[#060913] text-gray-100 flex flex-col">
      
      {/* Top Header */}
      <header className="h-20 bg-[#090e1a]/90 backdrop-blur-xl border-b border-white/10 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-400 p-[1px] shadow-md shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <span className="text-base font-extrabold tracking-tight text-white hidden sm:inline">
              Ekonnet<span className="text-emerald-400">P2P</span>
            </span>
          </Link>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          {/* Clean Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/trades" className="hover:text-white transition">Ways to Invest</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-emerald-400 font-bold">Peer-to-Peer Crypto Settlement</span>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/trades/crypto/direct"
            className="hidden md:inline-flex px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-xs text-blue-400 font-semibold transition"
          >
            Direct Exchange &rarr;
          </Link>
          <Link
            href="/admin"
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-bold transition-all"
          >
            Admin Console
          </Link>
        </div>
      </header>

      {/* Main P2P View */}
      <main className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8 flex-1">
        
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Direct Peer-to-Peer Smart Settlement • Independent Sector</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Peers to Peers Cryptocurrency Trades & Exchanges
            </h1>
            <p className="text-xs text-slate-400">
              Trade local fiat directly with verified counterparties across 14 global payment rails with zero middleman dispute hold-ups.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSide("buy")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                side === "buy" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30" : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              Buy Crypto
            </button>
            <button
              onClick={() => setSide("sell")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                side === "sell" ? "bg-rose-600 text-white shadow-lg shadow-rose-500/30" : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              Sell Crypto
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Asset Filter:</span>
            {(["ALL", "BTC", "ETH", "USDT"] as const).map(asset => (
              <button
                key={asset}
                onClick={() => setAssetFilter(asset)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  assetFilter === asset ? "bg-blue-600 text-white font-bold" : "bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {asset}
              </button>
            ))}
          </div>

          <div className="text-slate-400 text-[11px]">
            <span>100% Non-Custodial Direct Settlement</span>
          </div>
        </div>

        {/* Offers Table */}
        <div className="rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl overflow-hidden p-6 space-y-4 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-500 text-[10px] uppercase">
                  <th className="py-3 pr-4">Advertiser / Trader</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Available / Limit</th>
                  <th className="py-3 px-4">Accepted Payment Rails</th>
                  <th className="py-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOffers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 pr-4">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{offer.trader}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{offer.ordersCount} orders</span>
                        <span className="text-emerald-400 font-bold">{offer.rating} completion</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-sm font-black text-white">{offer.fiatPrice}</div>
                      <div className="text-[10px] text-slate-400">Unit Rate ({offer.asset})</div>
                    </td>

                    <td className="py-4 px-4 text-slate-300">
                      <div>Available: <span className="text-white font-bold">{offer.available}</span></div>
                      <div className="text-[10px] text-slate-400">Limit: {offer.limit}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {offer.paymentMethods.map((pm, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300">
                            {pm}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 pl-4 text-right">
                      <button
                        onClick={() => alert(`Initiating direct P2P order with ${offer.trader} for ${offer.asset}. Smart settlement agreement prepared.`)}
                        className={`px-4 py-2 rounded-xl font-bold text-xs text-white transition-all shadow-md ${
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

    </div>
  );
}
