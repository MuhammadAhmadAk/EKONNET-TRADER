"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, Wrench, Shield, ArrowRight, Layers } from "lucide-react";

interface MaintenanceScreenProps {
  platformName: string;
  category: string;
}

export default function MaintenanceScreen({ platformName, category }: MaintenanceScreenProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-xl w-full rounded-3xl bg-[#090e1a]/90 border border-amber-500/30 p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6">
        
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <Wrench className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-[10px] uppercase font-bold tracking-wider border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Scheduled Maintenance & Optimization</span>
          </div>

          <h2 className="text-2xl font-black text-white">
            {platformName}
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            This sector is currently paused by platform operations for latency tuning and orderbook liquidity upgrades. 
            Thanks to our fault-isolated architecture, other Ekonnet trading markets remain fully operational.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-[11px] font-mono text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>Trading Engine Sector:</span>
            <span className="text-white font-bold">{category}</span>
          </div>
          <div className="flex justify-between">
            <span>Isolation Status:</span>
            <span className="text-emerald-400 font-bold">Uninterrupted Ecosystem</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/trades"
            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-1.5"
          >
            <span>Explore Active Markets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/"
            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition border border-white/10"
          >
            Return to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}
