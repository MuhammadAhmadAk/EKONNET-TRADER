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
  Server
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
    <div className="min-h-screen bg-[#070A10] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background terminal matrix glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
      <div className="absolute top-1/3 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-lg rounded-3xl bg-[#0D121F] border border-[#1F293D] p-8 sm:p-10 shadow-2xl relative z-10 space-y-6 glow-blue">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[11px] font-mono font-bold text-gray-500 tracking-wider">
            SECTION 27.[1] PLESK-STYLE HOST GATEWAY
          </span>
        </div>

        {/* Branding & Warning */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>RESTRICTED HOST MANAGEMENT GATE</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Master Admin Access</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            This entry point is strictly isolated from standard user authentication channels. Accessible exclusively by platform owners and authorized systems management.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdminAuth} className="space-y-4">
          
          <div>
            <label className="text-xs font-mono font-semibold text-gray-300 block mb-1.5">
              Root Management ID (Section 48):
            </label>
            <div className="flex items-center rounded-xl bg-[#070A10] border border-gray-800 p-3 focus-within:border-blue-500">
              <Server className="w-4 h-4 text-gray-500 mr-2.5" />
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
            <label className="text-xs font-mono font-semibold text-gray-300 block mb-1.5">
              AES-256 Administrative Master Password:
            </label>
            <div className="flex items-center rounded-xl bg-[#070A10] border border-gray-800 p-3 focus-within:border-blue-500">
              <Lock className="w-4 h-4 text-gray-500 mr-2.5" />
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
            <label className="text-xs font-mono font-semibold text-gray-300 block mb-1.5">
              Hardware Security Token or 6-Digit TOTP:
            </label>
            <div className="flex items-center rounded-xl bg-[#070A10] border border-gray-800 p-3 focus-within:border-blue-500">
              <KeyRound className="w-4 h-4 text-gray-500 mr-2.5" />
              <input
                type="text"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="948201"
                className="w-full bg-transparent text-sm font-mono tracking-widest text-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isAuthorizing}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center space-x-2"
          >
            <span>{isAuthorizing ? "Authenticating Root Host..." : "Unlock Management Panel"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <span>IP Logged: Whitelisted</span>
          <Link href="/" className="text-blue-400 hover:underline">
            Return to Public Portal
          </Link>
        </div>

      </div>

    </div>
  );
}
