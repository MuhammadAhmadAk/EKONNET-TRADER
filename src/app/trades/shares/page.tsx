"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  TrendingUp, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  BarChart2, 
  DollarSign,
  PieChart,
  Layers,
  CheckCircle2
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import LiveTicker from "@/components/landing/LiveTicker";
import Footer from "@/components/landing/Footer";
import { getPlatformStatus } from "@/lib/systemStatus";
import MaintenanceScreen from "@/components/common/MaintenanceScreen";

interface EquityShare {
  ticker: string;
  name: string;
  price: string;
  peRatio: string;
  marketCap: string;
  dividendYield: string;
  change24h: string;
  isPositive: boolean;
}

const EQUITY_SHARES: EquityShare[] = [
  { ticker: "AAPL", name: "Apple Inc.", price: "$232.50", peRatio: "34.2", marketCap: "$3.52T", dividendYield: "0.52%", change24h: "+1.42%", isPositive: true },
  { ticker: "NVDA", name: "NVIDIA Corporation", price: "$138.80", peRatio: "58.1", marketCap: "$3.41T", dividendYield: "0.08%", change24h: "+3.85%", isPositive: true },
  { ticker: "MSFT", name: "Microsoft Corporation", price: "$412.20", peRatio: "31.8", marketCap: "$3.06T", dividendYield: "0.78%", change24h: "+0.65%", isPositive: true },
  { ticker: "TSLA", name: "Tesla, Inc.", price: "$251.40", peRatio: "68.4", marketCap: "$802B", dividendYield: "0.00%", change24h: "-2.10%", isPositive: false },
  { ticker: "AMZN", name: "Amazon.com, Inc.", price: "$195.80", peRatio: "42.5", marketCap: "$2.05T", dividendYield: "0.00%", change24h: "+1.15%", isPositive: true },
  { ticker: "SPY", name: "SPDR S&P 500 ETF Trust", price: "$574.60", peRatio: "26.4", marketCap: "$580B", dividendYield: "1.24%", change24h: "+0.48%", isPositive: true }
];

export default function SharesInvestmentPage() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [selectedStock, setSelectedStock] = useState<EquityShare>(EQUITY_SHARES[0]);
  const [investMode, setInvestMode] = useState<"fractional" | "shares">("fractional");
  const [investAmount, setInvestAmount] = useState<number>(250);

  useEffect(() => {
    if (getPlatformStatus("shares") === "Maintenance") {
      setIsMaintenance(true);
    }
  }, []);

  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col">
        <Navbar />
        <MaintenanceScreen 
          platformName="Shares & Investments Trades & Exchange Platforms"
          category="Equities Sector [3]"
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

      {/* Main Shares View */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 flex-1">
        
        {/* Banner */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs dark:shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-mono font-bold border border-orange-500/20">
              <Briefcase className="w-3 h-3 text-orange-500" />
              <span>International Equities & ETFs • Fractional Trading</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Global Shares & Equity Investments
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Invest in global Wall Street shares, fractional blue-chip equities from $10, and leading index ETFs with zero custodian markups.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setInvestMode("fractional")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                investMode === "fractional" 
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-xs" 
                  : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10"
              }`}
            >
              Fractional ($)
            </button>
            <button
              onClick={() => setInvestMode("shares")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                investMode === "shares" 
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-xs" 
                  : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10"
              }`}
            >
              Whole Units
            </button>
          </div>
        </div>

        {/* Shares Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-xs dark:shadow-xl space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">International Blue-Chip Equities & ETFs</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Direct settlement without middleman markups</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[10px] uppercase">
                      <th className="py-2.5 pr-4">Ticker / Company</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">P/E Ratio</th>
                      <th className="py-2.5 px-3">Market Cap</th>
                      <th className="py-2.5 px-3">Yield</th>
                      <th className="py-2.5 pl-3 text-right">24h Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {EQUITY_SHARES.map((stock) => (
                      <tr 
                        key={stock.ticker}
                        onClick={() => setSelectedStock(stock)}
                        className={`cursor-pointer transition-colors ${
                          selectedStock.ticker === stock.ticker ? "bg-orange-500/5 dark:bg-orange-500/10" : "hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                        }`}
                      >
                        <td className="py-3.5 pr-4">
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{stock.ticker}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">{stock.name}</div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-900 dark:text-white font-bold">{stock.price}</td>
                        <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">{stock.peRatio}</td>
                        <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">{stock.marketCap}</td>
                        <td className="py-3.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">{stock.dividendYield}</td>
                        <td className={`py-3.5 pl-3 text-right font-bold ${stock.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                          {stock.change24h}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl p-5 sm:p-6 space-y-6 shadow-xs dark:shadow-xl">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Share Investment Order</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Institutional direct stock custody</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 flex justify-between items-center font-mono">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-sans">Selected Equity</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">{selectedStock.ticker}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">{selectedStock.name}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase font-sans">Market Price</div>
                <div className="text-lg font-black text-orange-600 dark:text-orange-400">{selectedStock.price}</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-600 dark:text-slate-400 block font-semibold font-mono">
                {investMode === "fractional" ? "Investment Capital (USD):" : "Number of Shares:"}
              </label>
              <input
                type="number"
                value={investAmount}
                onChange={(e) => setInvestAmount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-lg font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 text-xs font-mono space-y-2">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Commission:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">$0.00 Free Trading</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Settlement Speed:</span>
                <span className="text-slate-900 dark:text-white font-bold">Instant T+0 Ledger</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-white/10">
                <span>Estimated Holdings:</span>
                <span className="text-orange-600 dark:text-orange-400 font-bold">
                  {investMode === "fractional" 
                    ? `${(investAmount / parseFloat(selectedStock.price.replace('$', ''))).toFixed(4)} Shares`
                    : `${investAmount} Shares`
                  }
                </span>
              </div>
            </div>

            <button
              onClick={() => alert(`Executed investment in ${selectedStock.ticker} for ${investAmount} (${investMode}). Direct custody confirmed.`)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs uppercase font-mono shadow-md shadow-orange-500/20 transition-all"
            >
              Confirm Equity Order
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-gray-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>SIPC Insured Custody Protection</span>
            </div>
          </div>

        </div>

      </main>

      {/* Universal Footer */}
      <Footer />

    </div>
  );
}
