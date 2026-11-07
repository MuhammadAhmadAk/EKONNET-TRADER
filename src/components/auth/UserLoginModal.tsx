"use client";

import React, { useState } from "react";
import { 
  X, 
  Lock, 
  KeyRound, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  User as UserIcon,
  ShieldCheck,
  Zap,
  Layers,
  Loader2
} from "lucide-react";

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user?: any) => void;
}

export default function UserLoginModal({ isOpen, onClose, onSuccess }: UserLoginModalProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [step, setStep] = useState<"credentials" | "two_factor">("credentials");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [lockedUntil, setLockedUntil] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!identifier || !password) {
      setErrorMessage("Please enter your Username or Ekonnet User ID and Password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password,
          twoFactorCode: twoFactorCode.trim() || undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.isLocked) {
          setLockedUntil(`${data.remainingMinutes || 30}:00 Minutes`);
          setFailedAttempts(3);
          setErrorMessage(data.error || "SECURITY ALERT: Account is locked for 30 minutes due to consecutive failed attempts (Section 27.1).");
        } else {
          setFailedAttempts((prev) => prev + 1);
          setErrorMessage(data.error || "Invalid username or password.");
        }
        setIsLoading(false);
        return;
      }

      // Check if user has 2FA enabled and we haven't prompted yet
      if (data.user?.twoFactorEnabled && step === "credentials" && !twoFactorCode) {
        setStep("two_factor");
        setIsLoading(false);
        return;
      }

      // Save user session in localStorage and dispatch event for immediate reactivity
      localStorage.setItem("ekonnet_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-changed"));

      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMessage("Network error connecting to authentication server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickDemo = (demoId: string, demoPass: string) => {
    setIdentifier(demoId);
    setPassword(demoPass);
    setErrorMessage("");
    setLockedUntil(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto">
      {/* Floating Suspended Glass HUD Container */}
      <div className="relative w-full max-w-4xl mx-auto rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-white/75 dark:bg-[#080c16]/85 ring-1 ring-white/10 my-4 sm:my-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: High-End Showcase & Brand Security Deck */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-slate-900/90 via-[#0a0e1c]/80 to-slate-950/90 border-r border-white/10 p-8 flex-col justify-between overflow-hidden text-white">
          
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none -z-10" />
          <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-purple-500/15 blur-[90px] rounded-full pointer-events-none -z-10" />

          {/* Top Branding Row */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg">
                <Layers className="w-4 h-4 text-cyan-200" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-sm tracking-tight text-white leading-tight">
                  EKONNET<span className="text-cyan-400">TRADER</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Sovereign Clearing Network
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>99.99% Online</span>
            </div>
          </div>

          {/* Center Visual Value Prop */}
          <div className="relative z-10 my-auto py-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span>Direct Liquidity & P2P</span>
            </div>

            <h2 className="text-xl font-black tracking-tight leading-snug text-white mb-3">
              Institutional-Grade Speed. Zero Template Vulnerabilities.
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              Unified cross-border clearing across 14 payment rails and 5 base pairs. Live MongoDB auth engine.
            </p>

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Isolated Modular Resilience</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>3-Attempt Account Auto-Lockout</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Hardware 2FA / TOTP Verified</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Badges */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>TLS 1.3 Hardened</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Section 25 Compliant</span>
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN: Translucent Auth Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center text-slate-900 dark:text-white">
          
          {/* Header */}
          <div className="space-y-1.5 mb-6">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>SECURE TRADER SIGN IN</span>
            </div>
            <h3 className="text-2xl font-black text-white">Sign In to Ekonnet</h3>
            <p className="text-xs text-slate-400">
              Access your spot wallets, P2P direct trading desk, and cross-border payment gateway.
            </p>
          </div>

          {/* Lockout Warning */}
          {lockedUntil && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1 mb-5">
              <div className="flex items-center space-x-2 font-bold text-rose-400">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>ACCOUNT CURRENTLY LOCKED (30 MIN HOLD)</span>
              </div>
              <p>{errorMessage}</p>
            </div>
          )}

          {errorMessage && !lockedUntil && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs mb-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {step === "credentials" ? (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Username or User ID (e.g. EKON-000001, master_admin)
                  </label>
                  <div className="flex items-center rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-3 focus-within:border-blue-500 transition-colors">
                    <UserIcon className="w-4 h-4 text-slate-400 mr-2.5" />
                    <input
                      type="text"
                      required
                      disabled={!!lockedUntil || isLoading}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter Username or ID"
                      className="w-full bg-transparent text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <span className="text-[11px] text-slate-400 font-mono">Attempt {failedAttempts}/3</span>
                  </div>
                  <div className="flex items-center rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-3 focus-within:border-blue-500 transition-colors">
                    <Lock className="w-4 h-4 text-slate-400 mr-2.5" />
                    <input
                      type="password"
                      required
                      disabled={!!lockedUntil || isLoading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-transparent text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 2FA Step */}
                <div className="p-4 rounded-2xl bg-white/[0.02] dark:bg-black/25 border border-blue-500/30 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-blue-300">
                    <KeyRound className="w-4 h-4 text-blue-400" />
                    <span>STEP 2: 2FA AUTHENTICATOR CODE (SECTION 16)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Enter the 6-digit rolling code from your Authenticator app (or enter 123456 for test):
                  </p>
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center tracking-[0.5em] text-2xl font-black font-mono bg-white/[0.03] dark:bg-black/30 border border-blue-500/40 text-emerald-400 p-3 rounded-xl focus:outline-none"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={!!lockedUntil || isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>{step === "credentials" ? "Sign In to Platform" : "Confirm & Enter Platform"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Quick Demo Pre-fill Links for Testing */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <span className="text-[11px] text-slate-400 block mb-2 font-mono">Quick Test Accounts:</span>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <button 
                type="button"
                onClick={() => fillQuickDemo("master_admin", "Ekonnet2026!")}
                className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition font-mono"
              >
                Master Admin
              </button>
              <button 
                type="button"
                onClick={() => fillQuickDemo("manager_sarah", "Ekonnet2026!")}
                className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 transition font-mono"
              >
                Management
              </button>
              <button 
                type="button"
                onClick={() => fillQuickDemo("staff_alex", "Ekonnet2026!")}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition font-mono"
              >
                Staff (Alex)
              </button>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-slate-400">
            Trouble logging in?{" "}
            <button onClick={() => alert("Verification reset link sent to your registered emails.")} className="text-blue-400 hover:underline">
              Request Email Verification Link
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
