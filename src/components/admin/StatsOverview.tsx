"use client";

import React from "react";
import { 
  Users, 
  TrendingUp, 
  FileCheck, 
  MessageSquare, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock,
  Server
} from "lucide-react";

export default function StatsOverview() {
  const stats = [
    {
      title: "Total Registered Users",
      value: "48,920",
      change: "+12.4% this month",
      subtext: "18+ Verified accounts",
      icon: Users,
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "24h Multi-Asset Volume",
      value: "$4,812,490",
      change: "+8.2% vs yesterday",
      subtext: "Fee yield: $7,218.73 (0.15%)",
      icon: TrendingUp,
      color: "from-purple-600 to-indigo-600",
    },
    {
      title: "Pending KYC Submissions",
      value: "24",
      change: "Average review: 8 mins",
      subtext: "Photo + Handwritten note check",
      icon: FileCheck,
      color: "from-amber-600 to-orange-600",
    },
    {
      title: "Open Support Tickets",
      value: "14",
      change: "AI Summaries Active",
      subtext: "Gorelo-style NLP enabled",
      icon: MessageSquare,
      color: "from-emerald-600 to-teal-600",
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/20 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
            MASTER ADMIN DASHBOARD — PLESK NODE 01
          </span>
          <h2 className="text-2xl font-black text-white mt-1">Platform Operations & Risk Control</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Real-time monitoring across 10 Exchange bridges, 14 Payment rails, and multi-tier staff activity in compliance with Ekonnet Master Requirements.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-[#111827] border border-gray-800 text-xs font-mono text-gray-300">
            <span className="text-gray-500">Latency: </span>
            <span className="text-emerald-400 font-bold">14ms</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#111827] border border-gray-800 text-xs font-mono text-gray-300">
            <span className="text-gray-500">Threat Level: </span>
            <span className="text-emerald-400 font-bold">CLEAN</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i}
              className="p-6 rounded-3xl bg-[#111827] border border-[#1F293D] shadow-xl space-y-4 hover:border-gray-700 transition-all"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-400">{stat.title}</span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-black text-white font-mono">{stat.value}</div>
                <div className="text-xs text-emerald-400 font-semibold flex items-center mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  <span>{stat.change}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-800/80 text-[11px] text-gray-500 font-mono">
                {stat.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Status Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Module 1: Base Pairs Liquidity */}
        <div className="p-6 rounded-3xl bg-[#111827] border border-[#1F293D] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">5 Core Base Pairs Balance</h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">Sec 23</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-gray-800">
              <span className="text-gray-400">USD Reserve</span>
              <span className="text-white font-bold">$2,840,250.00</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-800">
              <span className="text-gray-400">BTC Reserve</span>
              <span className="text-white font-bold">142.85 BTC</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-800">
              <span className="text-gray-400">ETH Reserve</span>
              <span className="text-white font-bold">850.40 ETH</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-800">
              <span className="text-gray-400">XRP Reserve</span>
              <span className="text-white font-bold">1,250,000 XRP</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-gray-400">BCH Reserve</span>
              <span className="text-white font-bold">2,450.00 BCH</span>
            </div>
          </div>
        </div>

        {/* Module 2: Security & Lockout Alerts */}
        <div className="p-6 rounded-3xl bg-[#111827] border border-[#1F293D] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Security & Lockout Engine</h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono">Sec 25</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#0B0F19] border border-gray-800 space-y-1">
              <div className="flex items-center justify-between text-gray-300 font-semibold">
                <span>Active 30-Min Lockout</span>
                <span className="text-rose-400 font-mono font-bold">1 Account</span>
              </div>
              <p className="text-[11px] text-gray-500">
                User EKON-604812 (Marcus Vance) triggered 3 consecutive failed password submissions.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#0B0F19] border border-gray-800 space-y-1">
              <div className="flex items-center justify-between text-gray-300 font-semibold">
                <span>Proton 2FA Enforced</span>
                <span className="text-emerald-400 font-mono font-bold">98.4%</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Staff & User accounts equipped with multi-device TOTP rolling secrets.
              </p>
            </div>
          </div>
        </div>

        {/* Module 3: Secondary Server Backup Sync */}
        <div className="p-6 rounded-3xl bg-[#111827] border border-[#1F293D] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Dual-Server Geo Backup</h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">Sec 32</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#0B0F19] border border-gray-800 space-y-1">
              <div className="flex items-center justify-between text-gray-300 font-semibold">
                <span>Primary Hosting Node:</span>
                <span className="text-blue-400 font-mono">VPS-Root-01</span>
              </div>
              <div className="flex items-center justify-between text-gray-300 font-semibold">
                <span>Secondary Backup Node:</span>
                <span className="text-emerald-400 font-mono">VPS-Replica-02</span>
              </div>
              <p className="text-[11px] text-gray-500 pt-1">
                Last snapshot: 12 minutes ago (Daily incremental backup encrypted with AES-256).
              </p>
            </div>

            <button 
              onClick={() => alert("Manual snapshot initiated: Syncing database to 2nd server in accordance with Section 32.")}
              className="w-full py-2.5 rounded-xl bg-[#161F33] hover:bg-[#1E2B47] text-gray-200 text-xs font-bold border border-gray-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Server className="w-3.5 h-3.5 text-blue-400" />
              <span>Trigger Manual Backup Sync</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
