"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Sparkles,
  Sliders,
  TrendingUp,
  ShieldCheck,
  Zap,
  Coins,
  Globe,
  DollarSign,
  Layers,
  ArrowRight,
  CheckCircle2,
  Video,
  ExternalLink,
  HelpCircle,
  BarChart2,
  Cpu,
  Lock,
  ChevronRight
} from "lucide-react";
import TutorialVideoShowcase from "@/components/landing/TutorialVideoShowcase";

interface FeatureGuide {
  id: string;
  name: string;
  sourceInspiration: "Bitfinex" | "Bitpanda" | "CMC Markets" | "Unified Sovereign";
  category: "Trading Techniques" | "Risk Protocols" | "Multi-Asset" | "Liquidity & Yield";
  shortDesc: string;
  customerBenefits: string[];
  howToUseSteps: string[];
  proTip: string;
}

const GUIDES: FeatureGuide[] = [
  {
    id: "scaled-orders",
    name: "Algorithmic Scaled Orders (Bitfinex Style)",
    sourceInspiration: "Bitfinex",
    category: "Trading Techniques",
    shortDesc: "Automate large volume entries and exits across customizable price ladders without moving the market against yourself.",
    customerBenefits: [
      "Prevents slippage when buying or selling large quantities of crypto or stocks.",
      "Averages your entry price systematically across support/resistance bands.",
      "Eliminates emotional impulse buying during market flash crashes."
    ],
    howToUseSteps: [
      "Navigate to the Trading Terminal and open the Order Type dropdown.",
      "Select 'Scaled' from the list of advanced techniques.",
      "Enter Lower Price Bound, Upper Price Bound, Total Capital Amount, and Order Count (Tranches).",
      "Choose distribution weighting (Flat, Increasing, or Decreasing).",
      "Click Submit. The WebSocket matching engine automatically places graduated limit bids across the order book."
    ],
    proTip: "Use increasing distribution when accumulating during panic dips so the largest orders trigger at the lowest price."
  },
  {
    id: "trailing-stop",
    name: "Dynamic Trailing Stop (Bitfinex Style)",
    sourceInspiration: "Bitfinex",
    category: "Trading Techniques",
    shortDesc: "A floating stop order that automatically follows market gains at a set distance, locking in profits during strong rallies.",
    customerBenefits: [
      "Automatically locks in capital gains as market price surges upward.",
      "Never gives back an entire winning trade during sudden market reversals.",
      "Zero manual adjustments required while you are asleep or away from the screen."
    ],
    howToUseSteps: [
      "Open the order ticket and select 'Trailing Stop'.",
      "Define your Trailing Delta (either a fixed Dollar distance like $500 or percentage like 3.5%).",
      "Execute the trade. As market climbs, your stop trigger slides upward in real-time.",
      "If the price retraces by your specified delta, a market order executes instantly to protect profits."
    ],
    proTip: "Set trailing distances beyond the standard 1-hour Average True Range (ATR) to avoid getting shaken out by normal market noise."
  },
  {
    id: "oco-orders",
    name: "One-Cancels-Other (OCO) Orders (Bitfinex Style)",
    sourceInspiration: "Bitfinex",
    category: "Trading Techniques",
    shortDesc: "Pair a Take-Profit Limit order and a Stop-Loss order simultaneously; when one fills, the other cancels automatically.",
    customerBenefits: [
      "Set your profit target and maximum acceptable loss at the exact same moment.",
      "Eliminates the danger of having orphaned open orders left on the exchange.",
      "Perfect for high-volatility breakouts around central bank announcements."
    ],
    howToUseSteps: [
      "In the order form, check the 'OCO' modifier checkbox.",
      "Input your desired Take-Profit Price above the current market.",
      "Input your Stop-Loss Trigger Price below the current market.",
      "Submit order. Both orders appear in your live order book.",
      "Whichever level price touches first fills immediately and automatically cancels the companion order."
    ],
    proTip: "Ideal for trading technical consolidation triangles where price could aggressively break either up or down."
  },
  {
    id: "guaranteed-stop-loss",
    name: "Guaranteed Stop-Loss Orders (GSLO - CMC Markets Style)",
    sourceInspiration: "CMC Markets",
    category: "Risk Protocols",
    shortDesc: "Institutional-grade slippage immunity that guarantees trade closure at your exact price regardless of weekend gaps or flash crashes.",
    customerBenefits: [
      "100% protection against market gapping and flash crash slippage.",
      "Full premium fee refund if the market never touches your stop level.",
      "Mandatory risk control tool for volatile forex and earnings announcements."
    ],
    howToUseSteps: [
      "On the order ticket, tick the 'GSLO (Guaranteed Stop)' toggle.",
      "Set your maximum loss threshold.",
      "A nominal guarantee reserve fee is calculated and locked in automated smart protocol reserve.",
      "If macroeconomic data causes market to gap down 500 pips, your exit is honored at your exact requested price."
    ],
    proTip: "Always deploy GSLO when holding leveraged positions over weekend market closes or before CPI/Fed rate releases."
  },
  {
    id: "client-sentiment",
    name: "Client Sentiment & Position Projection Matrix (CMC Markets Style)",
    sourceInspiration: "CMC Markets",
    category: "Risk Protocols",
    shortDesc: "Real-time crowd intelligence showing the percentage of live platform traders holding long vs short positions on every instrument.",
    customerBenefits: [
      "Spot extreme crowd euphoria or panic before major market reversals.",
      "Filter sentiment by 'Top 10% Profitable Traders' vs general retail accounts.",
      "Combine sentiment data with support/resistance levels for high-conviction trades."
    ],
    howToUseSteps: [
      "Open the Market Intelligence drawer on any asset.",
      "View the live Sentiment Bar (e.g. BTC/USD: 72% Long, 28% Short).",
      "Toggle 'Top Clients' to see what seasoned institutional accounts are doing.",
      "Align your technical analysis with the prevailing institutional flow."
    ],
    proTip: "When retail sentiment reaches 85%+ Long, look for bearish exhaustion divergence for high-probability contrarian short setups."
  },
  {
    id: "one-wallet-multi-asset",
    name: "Single-Collateral Multi-Asset Trading (Bitpanda Style)",
    sourceInspiration: "Bitpanda",
    category: "Multi-Asset",
    shortDesc: "Hold Crypto, Forex, Physical Gold, and US Equities in one unified account with cross-collateral margin capabilities.",
    customerBenefits: [
      "No need to register and deposit funds into 3 separate brokerage firms.",
      "Use Bitcoin profits to purchase fractional shares of Apple, Nvidia or Gold instantly.",
      "Zero internal conversion fees between digital assets and traditional markets."
    ],
    howToUseSteps: [
      "Deposit any supported currency via Card, Wire, SEPA, Wise, or Crypto.",
      "Navigate to the Asset Switcher at the top of the terminal.",
      "Select across Crypto, Forex, or Fractional Stocks.",
      "Execute buy/sell orders. Your centralized balance automatically updates across all asset classes."
    ],
    proTip: "Diversify across non-correlated asset classes (e.g., hold 50% Tech Equities and 50% Gold/Bitcoin) to cushion portfolio drawdowns."
  },
  {
    id: "peer-funding-yield",
    name: "Margin Funding & Lending Protocol (Bitfinex Style)",
    sourceInspiration: "Bitfinex",
    category: "Liquidity & Yield",
    shortDesc: "Provide USD or Crypto liquidity to margin traders and earn daily compound interest with 100% collateralized risk protection.",
    customerBenefits: [
      "Earn consistent passive daily yield on idle USD, USDT, or Bitcoin holdings.",
      "Zero market directional risk — borrower's collateral automatically liquidates if margin drops.",
      "Automated auto-renew compounding keeps your capital working 24/7."
    ],
    howToUseSteps: [
      "Open the 'Funding' tab in the top navigation bar.",
      "Select your lending asset (e.g. USD or USDT).",
      "Specify your desired daily interest rate (e.g. 0.045% / day = 16.4% APY) and loan duration.",
      "Click 'Provide Funding'. The engine matches your capital with active margin traders."
    ],
    proTip: "Enable 'Auto-Renew' at the Flash Return Rate (FRR) to automatically lend at the prevailing market volume-weighted average rate."
  },
  {
    id: "direct-p2p-settlement",
    name: "Non-Custodial Direct Peer Settlement Protocol",
    sourceInspiration: "Unified Sovereign",
    category: "Liquidity & Yield",
    shortDesc: "Direct buyer-to-seller smart settlement supporting 14 local and international payment rails with zero middleman holding.",
    customerBenefits: [
      "Direct settlement without third-party intermediary withholding or administrative dispute delays.",
      "Zero platform processing fees for peer-to-peer liquidity makers.",
      "Support for Wise, Bank Transfer, Neteller, Skrill, Revolut, SEPA, and Cash Rails."
    ],
    howToUseSteps: [
      "Go to the Payments / P2P section from the top navigation.",
      "Select 'Buy' or 'Sell' with your chosen fiat payment method.",
      "Initiate trade. Verify banking payment details directly with your verified counterparty.",
      "Confirm receipt in your banking app and trigger instant asset release."
    ],
    proTip: "Only transact with counterparties with 98%+ completion rates and 50+ completed orders for optimal execution speed."
  }
];

export default function TutorialsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Trading Techniques", "Risk Protocols", "Multi-Asset", "Liquidity & Yield"];

  const filteredGuides = GUIDES.filter((guide) => {
    const matchesCategory = selectedCategory === "All" || guide.category === selectedCategory;
    const matchesSearch =
      guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.sourceInspiration.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 selection:bg-blue-600 selection:text-white">
      
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-blue-400 font-bold">Trading Academy</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-white">
              Ekonnet<span className="text-blue-400">Academy</span>
            </span>
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Bitfinex • Bitpanda • CMC Style
            </span>
          </div>

          <Link
            href="/#web-terminal"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
          >
            <span>Launch Web Terminal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 bg-gradient-to-b from-slate-900/60 to-slate-950/80">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Master Institutional Trading Tools & Techniques</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How to Use Every Trading Tool & Feature
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Comprehensive written instructions, visual video walkthroughs, and trader benefit breakdowns. Learn how to execute institutional order types, hedge with guaranteed stops, and maximize capital efficiency.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search tools (e.g. Scaled, Trailing Stop, GSLO, Sentiment, Funding)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Embedded Interactive Video Showcase */}
      <TutorialVideoShowcase />

      {/* Category Filter Pills */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8" id="documentation-guides">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Full Written Tool Documentation</h2>
            <p className="text-xs text-slate-400">Step-by-step instructions with trader benefits and pro execution tips.</p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              id={guide.id}
              className="rounded-3xl p-6 sm:p-8 bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition shadow-xl space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono font-bold uppercase">
                    Inspired by {guide.sourceInspiration}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{guide.category}</span>
                </div>

                <h3 className="text-xl font-bold text-white">{guide.name}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{guide.shortDesc}</p>

                {/* Benefits to Customer */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2">
                  <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                    What Benefits Customers Obtain:
                  </span>
                  <ul className="space-y-1.5">
                    {guide.customerBenefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Step-by-Step Instructions */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    How To Use (Step-by-Step Instructions):
                  </span>
                  <div className="space-y-2">
                    {guide.howToUseSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro Tip */}
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Pro Trader Strategy: </strong>
                    {guide.proTip}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">Available on Web Terminal</span>
                <Link
                  href="/#web-terminal"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-semibold hover:text-blue-300 transition"
                >
                  <span>Practice in Terminal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-10 text-center text-xs text-slate-500 font-mono">
        <div>EkonnetTrader Academy • Proprietary Non-Custodial Multi-Asset Ecosystem</div>
      </footer>

    </div>
  );
}
