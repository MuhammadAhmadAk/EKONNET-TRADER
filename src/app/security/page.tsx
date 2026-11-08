"use client";

import React, { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import SecurityHighlights from "@/components/landing/SecurityHighlights";
import Footer from "@/components/landing/Footer";
import UserLoginModal from "@/components/auth/UserLoginModal";
import UserRegisterModal from "@/components/auth/UserRegisterModal";
import { Shield, Lock, FileCheck, Server, AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function SecurityPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-white">
      {/* Top Navbar */}
      <Navbar 
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Clean Web Breadcrumbs */}
          <nav className="mb-8 flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-emerald-400 font-bold">Security & Compliance Portal</span>
          </nav>

          {/* Dedicated Page Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-bold tracking-wider uppercase">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dedicated Security & Compliance Portal</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Institutional Security, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Compliance & Custody
              </span>
            </h1>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Detailed technical specification of our hand-crafted cryptographic vaults, immutable audit logging, multi-tier hardware authentication, and risk mitigation architecture.
            </p>
          </div>

          {/* Full Security Protocols Component */}
          <SecurityHighlights />

          {/* Additional In-Depth Compliance Architecture Details */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/40 space-y-3">
              <Lock className="w-6 h-6 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Automated Account Quarantine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Any 3 failed authentication challenges trigger an immediate 30-minute system freeze with dual-channel email and SMS unlocking challenges.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/40 space-y-3">
              <Server className="w-6 h-6 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Isolated Cold Storage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                98.5% of all digital reserves are kept in air-gapped hardware vaults requiring multi-signature threshold approval for outbound settlement.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/40 space-y-3">
              <FileCheck className="w-6 h-6 text-purple-400" />
              <h3 className="text-base font-bold text-white">Immutable Ledger Audit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cryptographically verifiable timestamped audit trail recording actor ID, IP addresses, geolocations, and sha-256 transaction signatures.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />

      <UserLoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <UserRegisterModal 
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
}
