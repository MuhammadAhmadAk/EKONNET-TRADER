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
    <section id="pricing-packages" className="py-12 sm:py-16 bg-transparent border-t border-slate-100 dark:border-white/[0.06] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-semibold">
            <span>TRANSPARENT ACCOUNT TIERS & DEALS PACKAGES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Flexible Account Tiers & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-red-600">Deals Packages</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
            Choose the ideal toolkit for your trading and cross-border payment requirements. Upgrade or adjust anytime.
          </p>

          {/* Billing Toggle (Pill style) */}
          <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/10 shadow-xs mt-3">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                billingCycle === "monthly" 
                  ? "bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-xs" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                billingCycle === "yearly" 
                  ? "bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-xs" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-mono font-bold">SAVE 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards (Clean rounded-2xl cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRICING_PACKAGES.map((pkg) => {
            const isPopular = pkg.popular;
            return (
              <div
                key={pkg.name}
                className={`p-6 rounded-2xl transition-all duration-200 flex flex-col justify-between ${
                  isPopular
                    ? "bg-white dark:bg-[#0c1222] border-2 border-orange-500 relative"
                    : "bg-white dark:bg-[#0c1222]/80 border border-slate-100 dark:border-white/[0.08] hover:border-orange-500/30 hover:shadow-sm shadow-xs"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-600 text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    MOST POPULAR
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{pkg.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{pkg.description}</p>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">{pkg.price}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {pkg.price === "$0" ? "Forever Free" : "/month"}
                      </span>
                    </div>
                    {billingCycle === "yearly" && pkg.price !== "$0" && (
                      <span className="text-[10px] text-emerald-500 font-mono font-bold block mt-0.5">
                        Discounted on Annual Billing
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => onSelectPackage(pkg.name)}
                    className={`w-full py-2.5 rounded-full font-semibold text-xs transition flex items-center justify-center gap-1.5 ${
                      isPopular
                        ? "bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10"
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
