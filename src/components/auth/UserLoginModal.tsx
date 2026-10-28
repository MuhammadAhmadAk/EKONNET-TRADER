"use client";

import React, { useState } from "react";
import { X, Lock, KeyRound, ShieldAlert, ArrowRight, CheckCircle2, User as UserIcon } from "lucide-react";

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserLoginModal({ isOpen, onClose, onSuccess }: UserLoginModalProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [step, setStep] = useState<"credentials" | "two_factor">("credentials");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [lockedUntil, setLockedUntil] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Simulate 3-attempt lockout (Section 25)
    if (failedAttempts >= 2 && password !== "correct123") {
      setFailedAttempts(3);
      setLockedUntil("30:00 Minutes");
      setErrorMessage("SECURITY ALERT: 3 consecutive failed attempts detected. Your account is temporarily locked for 30 minutes in accordance with Section 25.");
      return;
    }

    if (step === "credentials") {
      if (!identifier || !password) {
        setErrorMessage("Please enter your Username or Ekonnet User ID and Password.");
        return;
      }
      // Advance to 2FA step (Section 16)
      setStep("two_factor");
    } else {
      if (!twoFactorCode || twoFactorCode.length < 6) {
        setErrorMessage("Please enter your 6-digit TOTP Authenticator code.");
        return;
      }
      // Successful auth
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-[#111827] border border-[#1F293D] p-7 shadow-2xl glow-blue">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>SECURE USER SIGN IN (TLS 1.3)</span>
          </div>
          <h3 className="text-2xl font-black text-white">Sign In to Ekonnet</h3>
          <p className="text-xs text-gray-400">
            Access your spot wallets, P2P escrow trading desk, and cross-border payment portal.
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
                <label className="text-xs font-semibold text-gray-300 mb-1.5 block">
                  Username or User ID (e.g. EKON-819204)
                </label>
                <div className="flex items-center rounded-xl bg-[#0B0F19] border border-[#1F293D] p-3 focus-within:border-blue-500 transition-colors">
                  <UserIcon className="w-4 h-4 text-gray-500 mr-2.5" />
                  <input
                    type="text"
                    disabled={!!lockedUntil}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your Username or ID"
                    className="w-full bg-transparent text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">Password</label>
                  <span className="text-[11px] text-gray-500 font-mono">Attempt {failedAttempts}/3</span>
                </div>
                <div className="flex items-center rounded-xl bg-[#0B0F19] border border-[#1F293D] p-3 focus-within:border-blue-500 transition-colors">
                  <Lock className="w-4 h-4 text-gray-500 mr-2.5" />
                  <input
                    type="password"
                    disabled={!!lockedUntil}
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
              <div className="p-4 rounded-2xl bg-[#141C2E] border border-blue-500/30 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-300">
                  <KeyRound className="w-4 h-4 text-blue-400" />
                  <span>STEP 2: 2FA AUTHENTICATOR CODE (SECTION 16)</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Open your Proton or Google Authenticator App and enter your 6-digit rolling code:
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] text-2xl font-black font-mono bg-[#0B0F19] border border-blue-500/40 text-emerald-400 p-3 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1.5 block">
                  Security Question: What was your first pet name?
                </label>
                <input
                  type="text"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  placeholder="Your answer"
                  className="w-full rounded-xl bg-[#0B0F19] border border-[#1F293D] p-3 text-sm text-white focus:outline-none"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={!!lockedUntil}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{step === "credentials" ? "Continue to 2FA" : "Confirm & Enter Platform"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="mt-5 text-center text-xs text-gray-500">
          Trouble logging in?{" "}
          <button onClick={() => alert("Verification reset link will be sent to your 3 registered emails.")} className="text-blue-400 hover:underline">
            Request Email Magic Verification Link
          </button>
        </div>

      </div>
    </div>
  );
}
