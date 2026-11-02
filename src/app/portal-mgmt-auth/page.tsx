"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldAlert, 
  Lock, 
  KeyRound, 
  Terminal, 
  CheckCircle2, 
  ArrowRight,
  Server,
  Layers,
  Zap,
  ShieldCheck
} from "lucide-react";

export default function ManagementAuthGate() {
  const router = useRouter();
  const [adminToken, setAdminToken] = useState("");
  const [rootKey, setRootKey] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [error, setError] = useState("");
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!adminToken || !rootKey) {
      setError("Both Root Admin Token and Encryption Master Key are required.");
      return;
    }

    setIsAuthorizing(true);
    setTimeout(() => {
      // Simulate credential check
      setIsAuthorizing(false);
      router.push("/admin");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Background terminal matrix glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      <div className="absolute top-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Floating Suspended Glass HUD Container matching KonnetOne */}
      <div className="w-full max-w-5xl mx-auto rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-white/75 dark:bg-[#080c16]/85 ring-1 ring-white/10 relative z-10 my-4 sm:my-8">
        
        {/* LEFT COLUMN: High-End Showcase Deck */}
        <div className="hidden lg:flex lg:col-span-6 relative bg-gradient-to-br from-slate-900/90 via-[#0a0e1c]/80 to-slate-950/90 border-r border-white/10 p-8 xl:p-12 flex-col justify-between overflow-hidden text-white">
          
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-500/20 blur-[110px] rounded-full pointer-events-none -z-10" />
          <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-purple-500/15 blur-[90px] rounded-full pointer-events-none -z-10" />

          {/* Top Brand Header */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg">
                <Layers className="w-4 h-4 text-cyan-200" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-sm tracking-tight text-white leading-tight">
                  EKONNET<span className="text-cyan-400">ROOT</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Host Management Gate
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>TLS 1.3 Strict</span>
            </div>
          </div>

          {/* Center Value Prop */}
          <div className="relative z-10 my-auto py-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Lock className="w-3.5 h-3.5" />
              <span>Restricted Host Console</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight leading-tight text-white mb-3">
              Master Admin Control & Cluster Telemetry.
            </h1>

            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Accessible exclusively by platform engineers and root operations. Direct command interface over PostgreSQL 16 clusters, secondary failover mirrors, and KYC authorization queues.
            </p>

            <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs text-slate-300 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Section 27.[1] Isolation Layer</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Plesk Node VPS Direct Binding</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Section 45 Emergency Master Killswitch</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Info */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Actor IP Logged to Sec 60 Ledger</span>
            <span className="text-blue-400">Node #01 Synced</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Sleek Translucent Auth Form */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-center text-slate-900 dark:text-white">
          
          <div className="space-y-1.5 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[10px] font-mono text-slate-500 ml-2">PLESK HOST GATEWAY</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Master Admin Access</h2>
            <p className="text-xs text-slate-400">
              Provide hardware token signature and root encryption key to authenticate.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 mb-4">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-4">
            
            <div>
              <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">
                Root Management ID (Section 48):
              </label>
              <div className="flex items-center rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-3 focus-within:border-blue-500 transition">
                <Server className="w-4 h-4 text-slate-400 mr-2.5" />
                <input
                  type="text"
                  required
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  placeholder="EKON-ROOT-ADMIN"
                  className="w-full bg-transparent text-sm font-mono text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">
                Encryption Master Key:
              </label>
              <div className="flex items-center rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-3 focus-within:border-blue-500 transition">
                <KeyRound className="w-4 h-4 text-slate-400 mr-2.5" />
                <input
                  type="password"
                  required
                  value={rootKey}
                  onChange={(e) => setRootKey(e.target.value)}
                  placeholder="••••••••••••••••••••"
                  className="w-full bg-transparent text-sm font-mono text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">
                Proton / TOTP 2FA Token (Optional in Dev):
              </label>
              <div className="flex items-center rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-3 focus-within:border-blue-500 transition">
                <Terminal className="w-4 h-4 text-slate-400 mr-2.5" />
                <input
                  type="text"
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="6-Digit TOTP"
                  className="w-full bg-transparent text-sm font-mono text-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthorizing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs tracking-wider uppercase shadow-xl shadow-blue-600/25 transition flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              {isAuthorizing ? (
                <span>Validating Cryptographic Handshake...</span>
              ) : (
                <>
                  <span>Authenticate Management Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          <div className="pt-5 mt-4 border-t border-white/10 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition"
            >
              &larr; Return to Public Exchange Platform
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
