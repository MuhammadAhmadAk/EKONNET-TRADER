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
      <div className="min-h-screen bg-[#060913] text-white">
        <header className="h-20 bg-[#090e1a]/90 border-b border-white/10 px-6 sm:px-12 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-white">Ekonnet<span className="text-cyan-400">Trader</span></Link>
          <Link href="/admin" className="text-xs text-blue-400 font-bold">Admin Console</Link>
        </header>
        <MaintenanceScreen 
          platformName="Shares & Investments Trades & Exchange Platforms"
          category="Equities Sector [3]"
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
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-600 to-yellow-400 p-[1px] shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <span className="text-base font-extrabold tracking-tight text-white hidden sm:inline">
              Ekonnet<span className="text-amber-400">Invest</span>
            </span>
          </Link>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          {/* Clean Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/trades" className="hover:text-white transition">Ways to Invest</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-amber-400 font-bold">Shares & Investment Portfolios</span>
          </nav>
        </div>

        <Link
          href="/admin"
          className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-bold transition-all"
        >
          Admin Console
        </Link>
      </header>

      {/* Main Shares View */}
      <main className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8 flex-1">
        
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/20">
              <Briefcase className="w-3 h-3 text-amber-400" />
              <span>International Equities & ETFs • Independent Sector</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Shares & Investments Trades & Exchange Platforms
            </h1>
            <p className="text-xs text-slate-400">
              Invest in global Wall Street shares, fractional blue-chip equities from $10, and leading index ETFs with zero custodian markups.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setInvestMode("fractional")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                investMode === "fractional" ? "bg-amber-600 text-white shadow-lg shadow-amber-500/30" : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              Fractional Shares ($)
            </button>
            <button
              onClick={() => setInvestMode("shares")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                investMode === "shares" ? "bg-amber-600 text-white shadow-lg shadow-amber-500/30" : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              Whole Shares (Units)
            </button>
          </div>
        </div>

        {/* Shares Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl space-y-4">
              <h3 className="text-base font-bold text-white">International Blue-Chip Equities & ETFs</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-500 text-[10px] uppercase">
                      <th className="py-2.5 pr-4">Ticker / Company</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">P/E Ratio</th>
                      <th className="py-2.5 px-3">Market Cap</th>
                      <th className="py-2.5 px-3">Yield</th>
                      <th className="py-2.5 pl-3 text-right">24h Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {EQUITY_SHARES.map((stock) => (
                      <tr 
                        key={stock.ticker}
                        onClick={() => setSelectedStock(stock)}
                        className={`cursor-pointer transition-colors ${
                          selectedStock.ticker === stock.ticker ? "bg-amber-500/10" : "hover:bg-white/[0.02]"
                        }`}
                      >
                        <td className="py-3.5 pr-4">
                          <div className="font-bold text-white text-sm">{stock.ticker}</div>
                          <div className="text-[10px] text-slate-400">{stock.name}</div>
                        </td>
                        <td className="py-3.5 px-3 text-white font-bold">{stock.price}</td>
                        <td className="py-3.5 px-3 text-slate-300">{stock.peRatio}</td>
                        <td className="py-3.5 px-3 text-slate-300">{stock.marketCap}</td>
                        <td className="py-3.5 px-3 text-emerald-400">{stock.dividendYield}</td>
                        <td className={`py-3.5 pl-3 text-right font-bold ${stock.isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                          {stock.change24h}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl p-6 space-y-6 shadow-2xl">
            <div>
              <h3 className="text-base font-bold text-white">Share Investment Order</h3>
              <p className="text-xs text-slate-400">Institutional direct stock custody</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 flex justify-between items-center font-mono">
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Selected Equity</div>
                <div className="text-lg font-black text-white">{selectedStock.ticker}</div>
                <div className="text-[11px] text-slate-400">{selectedStock.name}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase">Market Price</div>
                <div className="text-lg font-black text-amber-400">{selectedStock.price}</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 block font-semibold font-mono">
                {investMode === "fractional" ? "Investment Capital (USD):" : "Number of Shares:"}
              </label>
              <input
                type="number"
                value={investAmount}
                onChange={(e) => setInvestAmount(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-lg font-mono font-bold text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-xs font-mono space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Commission:</span>
                <span className="text-emerald-400 font-bold">$0.00 Free Trading</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Settlement Speed:</span>
                <span className="text-white font-bold">Instant T+0 Ledger</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1 border-t border-white/10">
                <span>Estimated Holdings:</span>
                <span className="text-amber-400 font-bold">
                  {investMode === "fractional" 
                    ? `${(investAmount / parseFloat(selectedStock.price.replace('$', ''))).toFixed(4)} Shares`
                    : `${investAmount} Shares`
                  }
                </span>
              </div>
            </div>

            <button
              onClick={() => alert(`Executed investment in ${selectedStock.ticker} for ${investAmount} (${investMode}). Direct custody confirmed.`)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold text-xs uppercase font-mono shadow-lg shadow-amber-600/30 transition-all"
            >
              Confirm Equity Order
            </button>
          </div>

        </div>

      </main>

    </div>
  );
}
