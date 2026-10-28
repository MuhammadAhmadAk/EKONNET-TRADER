"use client";

import React from "react";
import { MOCK_AUDIT_LOGS } from "@/lib/mockData";
import { ShieldCheck, MapPin, Laptop, Clock, Database } from "lucide-react";

export default function AuditLogViewer() {
  return (
    <div className="rounded-3xl bg-[#111827] border border-[#1F293D] overflow-hidden shadow-2xl space-y-4">
      
      <div className="p-6 border-b border-[#1F293D] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-400 uppercase">
            <Database className="w-3.5 h-3.5" />
            <span>SECTION 28 & 60 COMPLIANT: IMMUTABLE TRANSACTION AUDIT TRAIL</span>
          </div>
          <h3 className="text-base font-bold text-white mt-1">Platform Security & Activity Records</h3>
          <p className="text-xs text-gray-400">
            Records all IP addresses, physical city/country geo-coordinates, user IDs, and timestamps.
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Cryptographically Signed Logs
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#0B0F19] border-b border-[#1F293D] text-gray-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-4 px-5">Event ID & Action</th>
              <th className="py-4 px-4">Originator (User / Staff)</th>
              <th className="py-4 px-5">Description</th>
              <th className="py-4 px-4">Network IP & Location</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-5 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-gray-300 font-medium">
            {MOCK_AUDIT_LOGS.map(log => (
              <tr key={log.id} className="hover:bg-[#161F33]/60 transition-colors">
                
                {/* Event ID */}
                <td className="py-4 px-5 font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20 mr-2">
                    {log.actionType}
                  </span>
                  <span className="text-gray-500">{log.id}</span>
                </td>

                {/* User */}
                <td className="py-4 px-4">
                  <div className="font-bold text-white">{log.userName}</div>
                  <div className="text-[10px] text-gray-500 font-mono">{log.userId} ({log.role})</div>
                </td>

                {/* Description */}
                <td className="py-4 px-5 text-gray-200 max-w-xs">
                  {log.description}
                </td>

                {/* IP & Location */}
                <td className="py-4 px-4 font-mono text-[11px]">
                  <div className="flex items-center space-x-1 text-gray-300">
                    <Laptop className="w-3 h-3 text-gray-500 shrink-0" />
                    <span>{log.ipAddress}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500 text-[10px]">
                    <MapPin className="w-3 h-3 text-gray-600 shrink-0" />
                    <span>{log.location}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-4 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {log.status}
                  </span>
                </td>

                {/* Time */}
                <td className="py-4 px-5 text-right font-mono text-[11px] text-gray-400">
                  {log.timestamp}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
