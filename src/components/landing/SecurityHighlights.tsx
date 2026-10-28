"use client";

import React from "react";
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Fingerprint, 
  FileWarning, 
  ServerCrash,
  UserCheck
} from "lucide-react";

export default function SecurityHighlights() {
  const securityPillars = [
    {
      icon: Lock,
      title: "3-Attempt Account Auto-Lockout",
      section: "Section 25",
      desc: "3 failed authentication attempts trigger an automated 30-minute account quarantine with email and SMS unlocking challenges.",
    },
    {
      icon: KeyRound,
      title: "Mandatory Hardware 2FA",
      section: "Section 28",
      desc: "TOTP authenticator integration and Proton-compatible hardware key tokens required for all withdrawals and password changes.",
    },
    {
      icon: UserCheck,
      title: "18+ KYC Handwritten Note Gate",
      section: "Section 27 & 63",
      desc: "Strict DOB age verification plus high-resolution photo holding official ID and a handwritten note with Full Name, Ekonnet, and Date.",
    },
    {
      icon: Fingerprint,
      title: "5 Mandatory Security Questions",
      section: "Section 30",
      desc: "Required multi-question security challenge setup gating secondary password resets and high-value currency liquidations.",
    },
    {
      icon: ServerCrash,
      title: "Emergency Master Killswitch",
      section: "Section 45",
      desc: "Instant platform-wide transaction suspension isolating cold wallets from rogue external CEX API calls and wire bridges.",
    },
    {
      icon: FileWarning,
      title: "Section 60 Immutable Audit Ledger",
      section: "Section 60",
      desc: "Cryptographically verifiable timestamped audit trail recording actor ID, IP addresses, geolocations, and transaction signatures.",
    },
  ];

  return (
    <section id="security-protocols" className="py-16 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL SECURITY & RISK MITIGATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Cryptographic Vault & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Compliance Hardening</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Hand-crafted security protocols engineered from the ground up without third-party template vulnerabilities.
          </p>
        </div>

        {/* Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {securityPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-emerald-500/30 transition"
              >
                <div className="flex justify-between items-center">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {item.section}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
