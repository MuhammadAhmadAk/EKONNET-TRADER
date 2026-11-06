"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  CreditCard, 
  Send, 
  ShieldCheck, 
  ArrowDownLeft, 
  History,
  Lock,
  Building,
  Smartphone,
  ChevronRight,
  Layers
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function PaymentsPage() {
  const [selectedMethod, setSelectedMethod] = useState("wise");
  const [amount, setAmount] = useState(2500);

  return (
    <div className="min-h-screen bg-[#060913] text-gray-100 flex flex-col">
      
      {/* Top Header */}
      <header className="h-20 bg-[#090e1a]/90 backdrop-blur-xl border-b border-white/10 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-md shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Layers className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="text-base font-extrabold tracking-tight text-white hidden sm:inline">
              Ekonnet<span className="text-cyan-400">Trader</span>
            </span>
          </Link>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          {/* Clean Web Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-blue-400 font-bold">Payments & Transfers</span>
          </nav>
        </div>

        <Link
          href="/admin"
          className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-bold transition-all"
        >
          Admin Console
        </Link>
      </header>

      {/* Main Body */}
      <main className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8 flex-1">
        
        {/* Top Wallet Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
            <span className="text-xs text-slate-400 font-semibold">Available Fiat Balance:</span>
            <div className="text-3xl font-black text-white font-mono">$18,450.00 USD</div>
            <span className="text-[11px] text-emerald-400 font-bold">Ready for instant cross-border payout</span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
            <span className="text-xs text-slate-400 font-semibold">Crypto Treasury Balance:</span>
            <div className="text-3xl font-black text-white font-mono">1.4580 BTC</div>
            <span className="text-[11px] text-slate-400 font-mono">≈ $98,300.00 USD</span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
            <span className="text-xs text-slate-400 font-semibold">Security Level:</span>
            <div className="text-2xl font-black text-emerald-400 font-mono flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6" />
              <span>Netcode Enforced</span>
            </div>
            <span className="text-[11px] text-slate-400">SMS + Email 2-Step Gate</span>
          </div>
        </div>

        {/* Transfer Action Center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl p-7 space-y-6 shadow-2xl">
            <div>
              <h3 className="text-base font-bold text-white">Select Deposit / Payment Method</h3>
              <p className="text-xs text-slate-400">Global multi-rail payment processors with instant verification</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: "wise", name: "Wise Transfer", speed: "Instant", icon: "🌐" },
                { id: "paypal", name: "PayPal Direct", speed: "Immediate", icon: "💳" },
                { id: "wire", name: "Bank Swift Wire", speed: "1-2 Days", icon: "🏦" },
                { id: "cards", name: "Visa / Mastercard", speed: "Instant", icon: "💳" },
                { id: "crypto", name: "Crypto Transfer", speed: "10 mins", icon: "⛓️" },
                { id: "skrill", name: "Skrill Wallet", speed: "Instant", icon: "⚡" },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedMethod === method.id 
                      ? "bg-blue-600/20 border-blue-500/60 shadow-md" 
                      : "bg-white/[0.02] border-white/10 hover:border-blue-500/30"
                  }`}
                >
                  <span className="text-xl mb-1 block">{method.icon}</span>
                  <div className="font-bold text-white text-xs">{method.name}</div>
                  <div className="text-[10px] text-slate-400">{method.speed}</div>
                </button>
              ))}
            </div>

            {/* Transfer Amount Input */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 block font-semibold">Payment Amount (USD):</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-xl font-bold font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={() => alert(`Initiated transfer of $${amount} via ${selectedMethod.toUpperCase()}. Confirmation code dispatched to your registered mobile and primary email.`)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Payment</span>
            </button>
          </div>

          <div className="lg:col-span-5 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl p-7 space-y-5 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <History className="w-4 h-4 text-slate-400" />
              <span>Recent Payment Transactions</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-black/20 rounded-xl border border-white/10 space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>Wise Outbound (EUR)</span>
                  <span className="text-rose-400">-$1,250.00</span>
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>Tx: #EK-94812</span>
                  <span className="text-emerald-400">CONFIRMED</span>
                </div>
              </div>

              <div className="p-3 bg-black/20 rounded-xl border border-white/10 space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>Stripe Card Deposit</span>
                  <span className="text-emerald-400">+$5,000.00</span>
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>Tx: #EK-94799</span>
                  <span className="text-emerald-400">CLEARED</span>
                </div>
              </div>

              <div className="p-3 bg-black/20 rounded-xl border border-white/10 space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>Bitcoin Settlement</span>
                  <span className="text-emerald-400">+0.25 BTC</span>
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>Tx: #EK-94750</span>
                  <span className="text-emerald-400">CONFIRMED</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
