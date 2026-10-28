"use client";

import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  ShieldCheck, 
  MessageSquare, 
  Database, 
  AlertOctagon, 
  ArrowLeft,
  Server,
  Lock
} from "lucide-react";

export type AdminTab = "overview" | "permissions" | "users" | "tickets" | "audit" | "security";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
}

export default function AdminSidebar({ activeTab, onSelectTab }: AdminSidebarProps) {
  const menuItems = [
    { id: "overview" as AdminTab, label: "System Overview", icon: LayoutDashboard },
    { id: "permissions" as AdminTab, label: "Staff Permissions Matrix", icon: ShieldCheck, badge: "Sec 27.2" },
    { id: "users" as AdminTab, label: "User Accounts & KYC", icon: Users, badge: "Review" },
    { id: "tickets" as AdminTab, label: "Support Tickets & AI", icon: MessageSquare, badge: "Live" },
    { id: "audit" as AdminTab, label: "Transaction Audit Ledger", icon: Database, badge: "Sec 60" },
    { id: "security" as AdminTab, label: "Threat Scanner & Lockout", icon: AlertOctagon },
  ];

  return (
    <aside className="w-64 bg-[#0E1424] border-r border-[#1F293D] flex flex-col justify-between shrink-0 min-h-screen">
      
      {/* Top Header */}
      <div className="p-6 space-y-6">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-lg font-black text-white tracking-tight">EKONNET</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono font-bold border border-rose-500/20">ROOT</span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono">MANAGEMENT ADMIN CONSOLE</p>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20" 
                    : "text-gray-400 hover:text-white hover:bg-[#161F33]"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-[#161F33] text-gray-400"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Node Health Status */}
      <div className="p-6 border-t border-[#1F293D] space-y-3">
        <div className="p-3 rounded-xl bg-[#111827] border border-gray-800 space-y-2 text-[11px] font-mono">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Node Status:</span>
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ONLINE</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-gray-500">
            <span>Server:</span>
            <span className="text-gray-300">VPS-Plesk-EU#01</span>
          </div>
          <div className="flex items-center justify-between text-gray-500">
            <span>2nd Backup Server:</span>
            <span className="text-emerald-400">SYNCED</span>
          </div>
        </div>

        <Link 
          href="/" 
          className="flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-[#161F33] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Public Landing Page</span>
        </Link>
      </div>

    </aside>
  );
}
