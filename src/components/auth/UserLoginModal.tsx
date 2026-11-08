"use client";

import React, { useState } from "react";
import { 
  X, 
  Lock, 
  KeyRound, 
  ShieldAlert, 
  ArrowRight, 
  User as UserIcon,
  ShieldCheck, 
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user?: any) => void;
  onSwitchToRegister?: () => void;
}

export default function UserLoginModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  onSwitchToRegister 
}: UserLoginModalProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      setErrorMessage("Please enter your Username/Email and Password.");
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
          setErrorMessage(data.error || "Account locked for 30 minutes due to consecutive failed attempts.");
        } else {
          setFailedAttempts((prev) => prev + 1);
          setErrorMessage(data.error || "Invalid username or password.");
        }
        setIsLoading(false);
        return;
      }

      // Check if user has 2FA enabled
      if (data.user?.twoFactorEnabled && step === "credentials" && !twoFactorCode) {
        setStep("two_factor");
        setIsLoading(false);
        return;
      }

      // Save user session in localStorage
      localStorage.setItem("ekonnet_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-changed"));

      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMessage("Network error connecting to auth server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-black/80 backdrop-blur-md">
      
      {/* Centered Compact Auth Card - No Inner Scrolling */}
      <div className="relative w-full max-w-md rounded-[8px] border border-slate-200/80 dark:border-white/10 shadow-xl backdrop-blur-2xl bg-white dark:bg-[#0c1222] p-6 sm:p-8 text-slate-900 dark:text-white transition-all">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-[8px] text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-[8px] bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center shadow-sm">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome to Ekonnet
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sign in to access your spot wallets and trading desk
            </p>
          </div>
        </div>

        {/* Lockout Warning */}
        {lockedUntil && (
          <div className="p-3 rounded-[8px] bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2 mb-4">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
            <span>Account locked for {lockedUntil}. Please retry later.</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && !lockedUntil && (
          <div className="p-3 rounded-[8px] bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          {step === "credentials" ? (
            <>
              {/* Username / Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Username or Email
                </label>
                <div className="flex items-center rounded-[8px] bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 px-3.5 py-2.5 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition">
                  <UserIcon className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    required
                    disabled={!!lockedUntil || isLoading}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. farhan@ekonnet.com"
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {failedAttempts > 0 && (
                    <span className="text-[10px] text-amber-500 font-mono font-medium">
                      Attempt {failedAttempts}/3
                    </span>
                  )}
                </div>
                <div className="flex items-center rounded-[8px] bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 px-3.5 py-2.5 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition">
                  <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={!!lockedUntil || isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 ml-1 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* 2FA Step */
            <div className="p-4 rounded-[8px] bg-orange-500/5 dark:bg-black/25 border border-orange-500/30 space-y-2 text-center">
              <div className="flex items-center justify-center space-x-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                <KeyRound className="w-4 h-4 text-orange-500" />
                <span>Two-Factor Authentication</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Enter the 6-digit rolling code from your Authenticator app:
              </p>
              <input
                type="text"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="000000"
                className="w-full text-center tracking-[0.4em] text-xl font-black font-mono bg-white dark:bg-black/40 border border-orange-500/40 text-orange-600 dark:text-orange-400 py-2.5 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!!lockedUntil || isLoading}
            className="w-full py-3 rounded-[8px] bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>{step === "credentials" ? "Sign In to Account" : "Verify & Sign In"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Footer Navigation */}
        <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <span>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onSwitchToRegister) onSwitchToRegister();
              }}
              className="text-orange-600 dark:text-orange-400 font-bold hover:underline"
            >
              Register
            </button>
          </span>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit SSL Secured</span>
          </div>
        </div>

      </div>
    </div>
  );
}
