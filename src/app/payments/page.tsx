"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  CreditCard, 
  Send, 
  ShieldCheck, 
  ArrowDownLeft, 
  History,
  Lock,
  Building,
  Smartphone
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function PaymentsPage() {
  const [selectedMethod, setSelectedMethod] = useState("wise");
  const [amount, setAmount] = useState(2500);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col">
      
      {/* Header */}
      <header className="h-20 bg-[#0E1424] border-b border-[#1F293D] px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="p-2 rounded-xl bg-[#161F33] text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white flex items-center space-x-2">
              <span>Universal Payments Gateway</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                SECTION 11.[B] PROCESSORS
              </span>
            </h1>
            <p className="text-xs text-gray-400">14 Payment rails with dual Netcode & SMS confirmation</p>
          </div>
        </div>

        <Link
          href="/portal-mgmt-auth"
          className="px-4 py-2 rounded-xl bg-[#161F33] border border-blue-500/20 text-xs text-blue-400 font-bold hover:bg-[#1E2B47] transition-all"
        >
          Management Console
        </Link>
      </header>

      {/* Main Body */}
      <main className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8 flex-1">
        
        {/* Top Wallet Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#111827] border border-[#1F293D] space-y-2">
            <span className="text-xs text-gray-400 font-semibold">Available Fiat Balance:</span>
            <div className="text-3xl font-black text-white font-mono">$18,450.00 USD</div>
            <span className="text-[11px] text-emerald-400 font-bold">Ready for instant cross-border payout</span>
          </div>

          <div className="p-6 rounded-3xl bg-[#111827] border border-[#1F293D] space-y-2">
            <span className="text-xs text-gray-400 font-semibold">Crypto Treasury Balance:</span>
            <div className="text-3xl font-black text-white font-mono">1.4580 BTC</div>
            <span className="text-[11px] text-gray-400 font-mono">≈ $98,300.00 USD</span>
          </div>

          <div className="p-6 rounded-3xl bg-[#111827] border border-[#1F293D] space-y-2">
            <span className="text-xs text-gray-400 font-semibold">Security Level:</span>
            <div className="text-2xl font-black text-emerald-400 font-mono flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6" />
              <span>Netcode Enforced</span>
            </div>
            <span className="text-[11px] text-gray-400">SMS + Email 2-Step Gate</span>
          </div>
        </div>

        {/* Transfer Action Center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 rounded-3xl bg-[#111827] border border-[#1F293D] p-7 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Select Deposit / Payment Method</h3>
              <p className="text-xs text-gray-400">Consolidated rails from Section 11.[B]</p>
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
                      ? "bg-[#161F33] border-blue-500 shadow-md" 
                      : "bg-[#0B0F19] border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <span className="text-xl mb-1 block">{method.icon}</span>
                  <div className="font-bold text-white text-xs">{method.name}</div>
                  <div className="text-[10px] text-gray-400">{method.speed}</div>
                </button>
              ))}
            </div>

            {/* Transfer Amount Input */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 block font-semibold">Payment Amount (USD):</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-full bg-[#0B0F19] border border-[#1F293D] rounded-xl p-3 text-xl font-bold font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={() => alert(`Initiated transfer of $${amount} via ${selectedMethod.toUpperCase()}. Confirmation code dispatched to your registered mobile and primary email (Section 25).`)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Payment</span>
            </button>
          </div>

          <div className="lg:col-span-5 rounded-3xl bg-[#111827] border border-[#1F293D] p-7 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <History className="w-4 h-4 text-gray-400" />
              <span>Recent Payment Transactions</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#0B0F19] rounded-xl border border-gray-800 space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>Wise Outbound (EUR)</span>
                  <span className="text-rose-400">-$1,250.00</span>
                </div>
                <div className="text-[10px] text-gray-500 flex justify-between">
                  <span>Tx: #EK-94812</span>
                  <span className="text-emerald-400">CONFIRMED</span>
                </div>
              </div>

              <div className="p-3 bg-[#0B0F19] rounded-xl border border-gray-800 space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>Stripe Card Deposit</span>
                  <span className="text-emerald-400">+$5,000.00</span>
                </div>
                <div className="text-[10px] text-gray-500 flex justify-between">
                  <span>Tx: #EK-94799</span>
                  <span className="text-emerald-400">CLEARED</span>
                </div>
              </div>

              <div className="p-3 bg-[#0B0F19] rounded-xl border border-gray-800 space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>Bitcoin Settlement</span>
                  <span className="text-emerald-400">+0.25 BTC</span>
                </div>
                <div className="text-[10px] text-gray-500 flex justify-between">
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
