"use client";

import React, { useState } from "react";
import { 
  CreditCard, 
  Send, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Globe2,
  Building2
} from "lucide-react";

const PAYMENT_RAILS = [
  { name: "Wise", type: "Low-Fee FX Transfer", speed: "Instant", icon: "🌐" },
  { name: "PayPal", type: "Digital Wallet", speed: "Immediate", icon: "💳" },
  { name: "Airwallex", type: "Cross-Border Business API", speed: "< 1 hr", icon: "🏢" },
  { name: "Skrill", type: "Digital Merchant Wallet", speed: "Instant", icon: "⚡" },
  { name: "Neteller", type: "Online Payments Rail", speed: "Instant", icon: "💰" },
  { name: "Payoneer", type: "Global Freelance Rail", speed: "Same-Day", icon: "🌍" },
  { name: "Remitly", type: "International Remittance", speed: "Minutes", icon: "🚀" },
  { name: "OFX", type: "Institutional Forex Wire", speed: "1-2 Days", icon: "🏛️" },
  { name: "Google Wallet", type: "Contactless NFC & Mobile", speed: "Instant", icon: "📱" },
  { name: "Crypto Transfer", type: "Blockchain Native (BTC/ETH)", speed: "1-3 Blocks", icon: "⛓️" },
  { name: "Visa / Mastercard", type: "Credit & Debit Direct", speed: "Instant", icon: "💳" },
  { name: "Swift / SEPA Wire", type: "Direct Bank-to-Bank", speed: "1-3 Days", icon: "🏦" },
];

export default function PaymentRailSection() {
  const [transferAmount, setTransferAmount] = useState<number>(5000);
  const [sourceCurr, setSourceCurr] = useState<string>("USD");
  const [destCurr, setDestCurr] = useState<string>("EUR");

  const fxRate = sourceCurr === "USD" && destCurr === "EUR" ? 0.92 : 1.08;
  const convertedAmount = (transferAmount * fxRate).toFixed(2);
  const feeRate = 0.003; // 0.3%
  const fee = (transferAmount * feeRate).toFixed(2);

  return (
    <section id="payments-section" className="py-12 sm:py-16 bg-transparent border-t border-slate-100 dark:border-white/[0.06] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-semibold">
            <span>GLOBAL PAYMENT GATEWAY & 14 PROCESSORS COMBINED</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-red-600">Payment Rails</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
            Ekonnet combines 14 leading payment processors and multi-currency banking rails into one unified gateway.
          </p>
        </div>

        {/* 14 Rails Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {PAYMENT_RAILS.map((rail) => (
            <div 
              key={rail.name} 
              className="p-3.5 rounded-2xl bg-white dark:bg-[#0c1222]/80 border border-slate-100 dark:border-white/[0.08] hover:border-orange-500/40 hover:shadow-xs transition-all text-center space-y-1"
            >
              <div className="text-xl">{rail.icon}</div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">{rail.name}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{rail.type}</div>
              <div className="text-[10px] font-mono font-bold text-emerald-500 pt-1 border-t border-slate-100 dark:border-white/[0.06]">
                {rail.speed}
              </div>
            </div>
          ))}
        </div>

        {/* FX Transfer Calculator Widget (Rounded-2xl with clean border) */}
        <div className="rounded-2xl bg-white dark:bg-[#0c1222]/90 border border-slate-200/70 dark:border-white/[0.08] p-5 sm:p-7 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-orange-500" />
                <span>Instant Multi-Currency FX Engine</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Real-time cross-currency routing with automated platform clearing</p>
            </div>
            <span className="text-[11px] font-mono font-semibold text-emerald-500 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-500/30">
              Mid-Market FX Rate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div>
              <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">Send Amount</label>
              <div className="flex items-center rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 p-2.5 focus-within:border-orange-500">
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent text-sm font-bold font-mono text-slate-900 dark:text-white focus:outline-none"
                />
                <select
                  value={sourceCurr}
                  onChange={(e) => setSourceCurr(e.target.value)}
                  className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">Recipient Receives</label>
              <div className="flex items-center rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 p-2.5 focus-within:border-orange-500">
                <input
                  type="text"
                  readOnly
                  value={convertedAmount}
                  className="w-full bg-transparent text-sm font-bold font-mono text-orange-600 dark:text-orange-400 focus:outline-none"
                />
                <select
                  value={destCurr}
                  onChange={(e) => setDestCurr(e.target.value)}
                  className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex justify-between items-center text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Estimated Fee (0.3%): <strong className="text-slate-900 dark:text-white font-semibold">${fee}</strong></span>
            <span className="text-emerald-500 font-bold">Guaranteed Delivery: &lt; 15 mins</span>
          </div>
        </div>

      </div>
    </section>
  );
}
