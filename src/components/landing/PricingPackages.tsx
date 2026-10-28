"use client";

import React, { useState } from "react";
import { PRICING_PACKAGES } from "@/lib/mockData";
import { Check, Sparkles, ArrowRight } from "lucide-react";

interface PricingPackagesProps {
  onSelectPackage: (packageName: string) => void;
}

export default function PricingPackages({ onSelectPackage }: PricingPackagesProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing-packages" className="py-16 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold">
            <span>SECTION 55 & 56 COMPLIANT: ACCOUNT FEES & DEALS PACKAGES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Flexible Account Tiers & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Deals Packages</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Choose the ideal toolkit for your trading and cross-border payment requirements. Upgrade or adjust anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 mt-2">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                billingCycle === "monthly" 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                billingCycle === "yearly" 
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">SAVE 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRICING_PACKAGES.map((pkg) => {
            const isPopular = pkg.popular;

            return (
              <div
                key={pkg.name}
                className={`rounded-2xl p-6 transition flex flex-col justify-between ${
                  isPopular
                    ? "bg-slate-900/90 border-2 border-blue-500 shadow-2xl relative"
                    : "bg-slate-900/60 border border-slate-800 hover:border-slate-700"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" />
                    MOST POPULAR
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{pkg.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{pkg.description}</p>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black font-mono text-white">{pkg.price}</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {pkg.price === "$0" ? "Forever Free" : "/month"}
                      </span>
                    </div>
                    {billingCycle === "yearly" && pkg.price !== "$0" && (
                      <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">
                        Discounted on Annual Billing
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => onSelectPackage(pkg.name)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                      isPopular
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                    }`}
                  >
                    <span>{pkg.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
