"use client";

import React from "react";
import { 
  Search, 
  ShieldAlert, 
  Bell, 
  Lock, 
  UserCheck, 
  AlertTriangle,
  RefreshCw
} from "lucide-react";

interface AdminHeaderProps {
  onTriggerEmergencyLock: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function AdminHeader({ onTriggerEmergencyLock, searchQuery, setSearchQuery }: AdminHeaderProps) {
  return (
    <header className="h-20 bg-[#0E1424] border-b border-[#1F293D] px-8 flex items-center justify-between shrink-0">
      
      {/* Search Bar with Multi-Filter Support (Section 50) */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search user ID, username, staff ID, transaction hash..."
          className="w-full bg-[#111827] border border-[#1F293D] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Header Actions & Admin Status */}
      <div className="flex items-center space-x-4">
        
        {/* Section 45: Emergency System Freeze / Lockdown Button */}
        <button
          onClick={onTriggerEmergencyLock}
          className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center space-x-2 transition-colors"
          title="Emergency Lockdown (Section 45)"
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span className="hidden sm:inline">Emergency System Freeze</span>
        </button>

        {/* Master Admin Profile Indicator (Section 48) */}
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs font-mono shadow-md">
            ROOT
          </div>
          <div className="hidden md:block text-left text-xs">
            <div className="font-bold text-white flex items-center space-x-1.5">
              <span>Master Admin</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[10px] text-gray-400 font-mono">ID: EKON-ROOT-01</div>
          </div>
        </div>

      </div>

    </header>
  );
}
