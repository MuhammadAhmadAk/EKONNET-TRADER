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
    <section id="payments-section" className="py-16 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold">
            <span>SECTION 11.[B] SPECIFICATIONS: 14 PAYMENT PROCESSORS COMBINED</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Payment Rails</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Ekonnet combines 14 leading payment processors and multi-currency banking rails into one unified gateway.
          </p>
        </div>

        {/* 14 Rails Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {PAYMENT_RAILS.map((rail) => (
            <div 
              key={rail.name} 
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition text-center space-y-1.5"
            >
              <div className="text-2xl">{rail.icon}</div>
              <div className="font-bold text-xs text-white">{rail.name}</div>
              <div className="text-[10px] text-slate-400 leading-tight">{rail.type}</div>
              <div className="text-[9px] font-mono font-bold text-emerald-400 pt-1 border-t border-slate-800/80">
                {rail.speed}
              </div>
            </div>
          ))}
        </div>

        {/* FX Transfer Calculator Widget */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-blue-400" />
                <span>Instant Multi-Currency FX Engine</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Real-time cross-currency routing with automated platform clearing</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              Mid-Market FX Rate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Send Amount</label>
              <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-2 focus-within:border-blue-500">
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent text-sm font-bold font-mono text-white focus:outline-none"
                />
                <select
                  value={sourceCurr}
                  onChange={(e) => setSourceCurr(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-xs font-bold text-slate-200"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Recipient Receives</label>
              <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-2">
                <input
                  type="text"
                  readOnly
                  value={convertedAmount}
                  className="w-full bg-transparent text-sm font-bold font-mono text-cyan-400 focus:outline-none"
                />
                <select
                  value={destCurr}
                  onChange={(e) => setDestCurr(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-xs font-bold text-slate-200"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-mono text-slate-400">
            <span>Estimated Fee (0.3%): <strong className="text-slate-200">${fee}</strong></span>
            <span className="text-emerald-400 font-bold">Guaranteed Delivery: &lt; 15 mins</span>
          </div>
        </div>

      </div>
    </section>
  );
}
