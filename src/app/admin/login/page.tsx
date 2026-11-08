"use client";

import React, { useState, useEffect } from "react";
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
  ShieldCheck,
  Zap,
  Sun,
  Moon,
  Loader2,
  AlertOctagon,
  UserCheck
} from "lucide-react";

export default function AdminManagementLoginPage() {
  const router = useRouter();
  const [adminToken, setAdminToken] = useState("");
  const [rootKey, setRootKey] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [error, setError] = useState("");
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Theme sync
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    // Check if already authenticated as admin
    try {
      const stored = localStorage.getItem("ekonnet_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.role === "master_admin" || u.role === "management" || u.role === "staff") {
          router.push("/admin");
        }
      }
    } catch (e) {}
  }, [router]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ekonnet_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ekonnet_theme", "light");
    }
    window.dispatchEvent(new CustomEvent("theme-changed", { detail: { theme: next } }));
  };

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!adminToken || !rootKey) {
      setError("Both Staff / Admin Identifier and Master Passphrase are required.");
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

      // STRICT ENFORCEMENT: Traders / Normal Users are strictly forbidden from this gate!
      if (data.user?.role === "user") {
        setError("ACCESS DENIED: Trader accounts do not possess administrative clearance. Please sign in via the Customer Trading Portal.");
        setIsAuthorizing(false);
        return;
      }

      if (data.user?.role !== "master_admin" && data.user?.role !== "management" && data.user?.role !== "staff") {
        setError("Access Restricted: This gate requires Master Admin or Management Staff clearance (Section 27).");
        setIsAuthorizing(false);
        return;
      }

      // Store authenticated session
      localStorage.setItem("ekonnet_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-changed"));
      router.push("/admin");
    } catch (err) {
      setError("Network error connecting to management auth service.");
      setIsAuthorizing(false);
    }
  };

  const fillQuickDemo = (demoId: string, demoPass: string) => {
    setAdminToken(demoId);
    setRootKey(demoPass);
    setTwoFactorCode("123456");
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-orange-500 selection:text-white transition-colors duration-300">
      
      {/* Background radial matrix glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      <div className="absolute top-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-orange-500/10 to-rose-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Top Floating Security Header */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between py-3 mb-2 relative z-20">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white leading-tight">
              EKONNET<span className="text-orange-500">ADMIN</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              Management & Compliance Gate
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono text-[11px] font-bold border border-orange-500/20">
            <Lock className="w-3 h-3" />
            <span>CLEARANCE LEVEL 3+</span>
          </span>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 transition"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {/* Main Glass HUD Container */}
      <div className="w-full max-w-5xl mx-auto rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-[#0c1222]/95 ring-1 ring-slate-900/5 dark:ring-white/10 relative z-10 my-2 transition-colors duration-300">
        
        {/* LEFT COLUMN: Executive Governance Deck */}
        <div className="hidden lg:flex lg:col-span-6 relative bg-gradient-to-br from-orange-500/10 via-rose-500/5 to-amber-500/10 dark:from-slate-900/90 dark:via-[#0c1222]/80 dark:to-slate-950/90 border-r border-slate-200/80 dark:border-white/10 p-8 xl:p-12 flex-col justify-between overflow-hidden text-slate-900 dark:text-white transition-colors duration-300">
          
          <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-orange-500/15 dark:bg-orange-500/20 blur-[110px] rounded-full pointer-events-none -z-10" />

          {/* Core Clearance Banner */}
          <div className="space-y-4 my-auto py-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-mono font-bold tracking-wider uppercase">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Restricted Root Console</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-black tracking-tight leading-tight">
              Administrative &amp; <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500">
                Staff Governance Portal
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              This terminal provides privileged access to Ekonnet Core Systems: User RBAC (Section 50), KYC Dossier Approvals, Staff Permission Matrices (Section 27), Liquidity Reserves, and Immutable Audit Trails (Section 60).
            </p>

            {/* Protocol Checklist */}
            <div className="space-y-2.5 pt-3">
              {[
                "Hardware-enforced 2FA Token Verification (RFC 6238 TOTP)",
                "Full IP & Geolocation Security Clearance Binding",
                "Automated Multi-sig Role Separation (Zero Single Point of Failure)",
                "Real-time Python Engine & PostgreSQL Cluster Sync"
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Node Footer */}
          <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>CLUSTER NODE: VPS-DE-01 (82.165.10.77)</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              SYSTEMS 100% HEALTHY
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN: Dedicated Admin Login Form */}
        <div className="lg:col-span-6 p-6 sm:p-10 xl:p-12 flex flex-col justify-between">
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-orange-600 dark:text-orange-400 font-bold">
                Admin Authentication
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                TLS 1.3 SECURED
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign In to Management
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your authorized staff credentials to initialize root session.
            </p>

            {/* Error Banner */}
            {error && (
              <div className="mt-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertOctagon className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAdminAuth} className="mt-5 space-y-4">
              
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Administrator / Staff ID
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400">
                    <UserCheck className="w-4 h-4 text-orange-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={adminToken}
                    onChange={(e) => setAdminToken(e.target.value)}
                    placeholder="e.g. master_admin / manager_sarah"
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Master Passphrase / Key
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400">
                    <Lock className="w-4 h-4 text-orange-500" />
                  </div>
                  <input
                    type="password"
                    required
                    value={rootKey}
                    onChange={(e) => setRootKey(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  />
                </div>
              </div>

              {/* 2FA Token Code */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    2FA Authenticator Code (Section 16)
                  </label>
                  <span className="text-[10px] text-orange-600 dark:text-orange-400 font-mono">
                    Demo: 123456
                  </span>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400">
                    <KeyRound className="w-4 h-4 text-orange-500" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-sm tracking-[0.25em] text-emerald-600 dark:text-emerald-400 font-bold font-mono focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthorizing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isAuthorizing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Security Clearance...</span>
                  </>
                ) : (
                  <>
                    <span>Authorize Management Session</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Quick Demo Pre-fills for Testing Admin Roles */}
            <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-2 font-mono">
                Select Administrative Clearance Level:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillQuickDemo("master_admin", "Ekonnet2026!")}
                  className="p-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-600 dark:text-orange-400 font-mono text-[10px] font-bold text-center transition"
                >
                  <span className="block text-xs font-black">Super Admin</span>
                  <span className="text-[9px] opacity-75">Full Root RBAC</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo("manager_sarah", "Ekonnet2026!")}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold text-center transition"
                >
                  <span className="block text-xs font-black">Management</span>
                  <span className="text-[9px] opacity-75">KYC & Approvals</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo("staff_alex", "Ekonnet2026!")}
                  className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold text-center transition"
                >
                  <span className="block text-xs font-black">Staff Officer</span>
                  <span className="text-[9px] opacity-75">Support & Audit</span>
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Trader Switcher Link */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-white/10 text-center">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Are you a platform customer or trader?{" "}
            </span>
            <Link
              href="/"
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
            >
              Go to Customer Trading Portal
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
