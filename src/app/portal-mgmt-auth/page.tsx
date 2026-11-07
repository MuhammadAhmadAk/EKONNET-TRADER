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
  Layers
} from "lucide-react";

export default function ManagementAuthGate() {
  const router = useRouter();
  const [adminToken, setAdminToken] = useState("");
  const [rootKey, setRootKey] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [error, setError] = useState("");
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!adminToken || !rootKey) {
      setError("Both Admin Token / Username and Master Key / Password are required.");
      return;
    }

    setIsAuthorizing(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: adminToken.trim(),
          password: rootKey,
          twoFactorCode: twoFactorCode.trim() || undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Access denied to Management Root.");
        setIsAuthorizing(false);
        return;
      }

      if (data.user?.role !== "master_admin" && data.user?.role !== "management") {
        setError("Access Restricted: This gate requires Master Admin or Management Sub-Admin credentials (Section 27).");
        setIsAuthorizing(false);
        return;
      }

      localStorage.setItem("ekonnet_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-changed"));
      router.push("/admin");
    } catch (err) {
      setError("Network error connecting to management auth service.");
      setIsAuthorizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-orange-500 selection:text-white transition-colors duration-300">
      
      {/* Background terminal matrix glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      <div className="absolute top-1/4 w-[500px] h-[500px] bg-orange-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Floating Suspended Glass HUD Container */}
      <div className="w-full max-w-5xl mx-auto rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-[#0c1222]/95 ring-1 ring-slate-900/5 dark:ring-white/10 relative z-10 my-4 sm:my-8 transition-colors duration-300">
        
        {/* LEFT COLUMN: High-End Showcase Deck */}
        <div className="hidden lg:flex lg:col-span-6 relative bg-gradient-to-br from-orange-500/10 via-rose-500/5 to-amber-500/10 dark:from-slate-900/90 dark:via-[#0c1222]/80 dark:to-slate-950/90 border-r border-slate-200/80 dark:border-white/10 p-8 xl:p-12 flex-col justify-between overflow-hidden text-slate-900 dark:text-white transition-colors duration-300">
          
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-orange-500/15 dark:bg-orange-500/20 blur-[110px] rounded-full pointer-events-none -z-10" />
          <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-rose-500/15 dark:bg-rose-500/15 blur-[90px] rounded-full pointer-events-none -z-10" />

          {/* Top Brand Header */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white leading-tight">
                  EKONNET<span className="text-orange-500">ROOT</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  Host Management Gate
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>TLS 1.3 Strict</span>
            </div>
          </div>

          {/* Center Value Prop */}
          <div className="relative z-10 my-auto py-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Lock className="w-3.5 h-3.5" />
              <span>Restricted Host Console</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight leading-tight text-slate-900 dark:text-white mb-3">
              Master Admin Control & Cluster Telemetry.
            </h1>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Accessible exclusively by platform engineers and root operations. Direct command interface over database clusters, secondary failover mirrors, and KYC authorization queues.
            </p>

            <div className="space-y-2.5 pt-2 border-t border-slate-200/80 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Isolated Sandbox Network Layer</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Direct Host Gateway Binding</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Emergency Platform Master Killswitch</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Info */}
          <div className="relative z-10 pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>Actor IP Logged to Immutable Ledger</span>
            <span className="text-orange-600 dark:text-orange-400 font-semibold">Node #01 Synced</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Sleek Translucent Auth Form */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-center text-slate-900 dark:text-white">
          
          <div className="space-y-1.5 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[10px] font-mono text-slate-500 ml-2">HOST GATEWAY</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Master Admin Access</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Provide hardware token signature and root encryption key to authenticate.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2 mb-4">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-4">
            
            <div>
              <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Root Management Identifier:
              </label>
              <div className="flex items-center rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition">
                <Server className="w-4 h-4 text-slate-400 mr-2.5" />
                <input
                  type="text"
                  required
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  placeholder="EKON-ROOT-ADMIN"
                  className="w-full bg-transparent text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Encryption Master Key:
              </label>
              <div className="flex items-center rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition">
                <KeyRound className="w-4 h-4 text-slate-400 mr-2.5" />
                <input
                  type="password"
                  required
                  value={rootKey}
                  onChange={(e) => setRootKey(e.target.value)}
                  placeholder="••••••••••••••••••••"
                  className="w-full bg-transparent text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Hardware 2FA TOTP Token (Optional in Dev):
              </label>
              <div className="flex items-center rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition">
                <Terminal className="w-4 h-4 text-slate-400 mr-2.5" />
                <input
                  type="text"
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="6-Digit TOTP"
                  className="w-full bg-transparent text-sm font-mono text-emerald-600 dark:text-emerald-400 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthorizing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs tracking-wider uppercase shadow-md shadow-orange-500/25 transition flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
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

          <div className="pt-5 mt-4 border-t border-slate-200/80 dark:border-white/10 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition font-medium"
            >
              Return to Public Platform Home
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
