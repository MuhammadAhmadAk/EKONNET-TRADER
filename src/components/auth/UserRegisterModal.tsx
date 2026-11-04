"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  CheckCircle, 
  ShieldAlert, 
  UserPlus, 
  Upload, 
  ArrowRight, 
  CheckCircle2,
  Lock,
  ShieldCheck,
  Zap,
  Layers
} from "lucide-react";
import { generateEkonnetId, calculateAge } from "@/lib/utils";

interface UserRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newUser: any) => void;
}

export default function UserRegisterModal({ isOpen, onClose, onSuccess }: UserRegisterModalProps) {
  const [autoUserId, setAutoUserId] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("2000-01-01");
  const [age, setAge] = useState(26);
  const [maritalStatus, setMaritalStatus] = useState("Single");
  const [country, setCountry] = useState("United States");
  const [city, setCity] = useState("New York");
  const [sex, setSex] = useState("Male");
  
  // Section 30: 3 personal emails & 2 phones
  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");
  const [email3, setEmail3] = useState("");
  const [phoneMobile, setPhoneMobile] = useState("");
  const [phoneLandline, setPhoneLandline] = useState("");

  // Section 30: Security Questions
  const [secQ1, setSecQ1] = useState("What was your first school name?");
  const [secA1, setSecA1] = useState("");
  const [secQ2, setSecQ2] = useState("What city were you born in?");
  const [secA2, setSecA2] = useState("");

  // Terms & Conditions checkbox (Section 35)
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [underageError, setUnderageError] = useState("");
  const [activeStep, setActiveStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (isOpen) {
      setAutoUserId(generateEkonnetId("EKON"));
    }
  }, [isOpen]);

  // Recalculate age and enforce Section 63 (Under 18 prohibited)
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);
    const calculated = calculateAge(val);
    setAge(calculated);

    if (calculated < 18) {
      setUnderageError("SECTION 63 REGULATORY NOTICE: Persons under 18 years of age are strictly prohibited from opening an account on Ekonnet Trades & Payments Platform.");
    } else {
      setUnderageError("");
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (age < 18) {
      alert("Registration halted: You must be at least 18 years old to open an account (Section 63).");
      return;
    }
    if (!agreedTerms) {
      alert("You must agree to the Terms & Conditions and Legal Procedures (Section 35).");
      return;
    }

    const newUser = {
      id: autoUserId,
      username: username || "trader_" + autoUserId.split("-")[1],
      fullName,
      emails: [email1, email2, email3].filter(Boolean),
      phones: [phoneMobile, phoneLandline].filter(Boolean),
      age,
      country,
      city,
      kycStatus: "pending",
      packageTier: "Free",
      walletBalances: { USD: 0, BTC: 0, XRP: 0, ETH: 0, BCH: 0 }
    };

    onSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      {/* Floating Suspended Glass HUD Container */}
      <div className="relative w-full max-w-5xl mx-auto rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-white/75 dark:bg-[#080c16]/85 ring-1 ring-white/10 my-4 sm:my-8">
        
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
          <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-purple-500/20 blur-[100px] rounded-full pointer-events-none -z-10" />
          <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-blue-500/15 blur-[90px] rounded-full pointer-events-none -z-10" />

          {/* Top Branding Row */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg">
                <Layers className="w-4 h-4 text-cyan-200" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-sm tracking-tight text-white leading-tight">
                  EKONNET<span className="text-purple-400">TRADER</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Sovereign Clearing Network
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>KYC Gate Active</span>
            </div>
          </div>

          {/* Center Visual Value Prop */}
          <div className="relative z-10 my-auto py-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span>Multi-Asset Liquidity Vault</span>
            </div>

            <h2 className="text-xl font-black tracking-tight leading-snug text-white mb-3">
              Compliant Onboarding for Verified Traders.
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              Access 168+ fiat currencies, 5 crypto base pairs, and direct P2P settlement with strict bank-grade isolation.
            </p>

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Auto-Generated Cryptographic UID</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Strict 18+ Verification (Sec 63)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>3 Security Emails & 5 Security Questions</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Badges */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>Plesk-Secured Node</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Section 30 Compliant</span>
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN: Translucent Auth Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center text-slate-900 dark:text-white max-h-[85vh] overflow-y-auto">
          
          {/* Header */}
          <div className="space-y-1 mb-5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
              <UserPlus className="w-3.5 h-3.5" />
              <span>SECTION 30 & 63 COMPLIANT REGISTRATION</span>
            </div>
            <h3 className="text-2xl font-black text-white">Create Ekonnet Account</h3>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span>Auto ID: <strong className="text-emerald-400 font-mono">{autoUserId}</strong></span>
              <span>•</span>
              <span>Step {activeStep} of 2</span>
            </div>
          </div>

          {/* Age Restriction Alert (Section 63) */}
          {underageError && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs space-y-1 mb-5">
              <div className="flex items-center space-x-2 font-bold text-rose-400">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>UNDER 18 YEARS REGISTRATION PROHIBITED</span>
              </div>
              <p>{underageError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {activeStep === 1 ? (
              /* Step 1: Personal Data & 18+ Verification */
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Custom Username</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. btc_master"
                      className="w-full rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="First and Last Name"
                      className="w-full rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* DOB and Calculated Age (Section 30, 63) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Date of Birth (Must be 18+)
                    </label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={handleDobChange}
                      className="w-full rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      System Verified Age:
                    </label>
                    <div className="flex items-center rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-2.5 text-xs font-bold font-mono">
                      <span className={age >= 18 ? "text-emerald-400" : "text-rose-400"}>
                        {age} Years Old {age >= 18 ? "(Eligible)" : "(Rejected under Sec 63)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Multi-Email Form (Section 30: 3 personal emails) */}
                <div className="p-3.5 rounded-2xl bg-white/[0.02] dark:bg-black/20 border border-white/10 space-y-2.5">
                  <span className="text-xs font-bold text-slate-200 block">
                    3 Registered Security Emails (Section 30 requirement)
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="Primary Email Address (Verification Link sent here)"
                    value={email1}
                    onChange={(e) => setEmail1(e.target.value)}
                    className="w-full rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="email"
                      placeholder="Secondary Recovery Email"
                      value={email2}
                      onChange={(e) => setEmail2(e.target.value)}
                      className="w-full rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-2 text-xs text-white focus:outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Tertiary Backup Email"
                      value={email3}
                      onChange={(e) => setEmail3(e.target.value)}
                      className="w-full rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Location & Phones */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Mobile (SMS)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1-555-0199"
                      value={phoneMobile}
                      onChange={(e) => setPhoneMobile(e.target.value)}
                      className="w-full rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={age < 18}
                  onClick={() => setActiveStep(2)}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 disabled:opacity-50 transition"
                >
                  <span>Proceed to KYC & Security Setup (Step 2)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Step 2: KYC Photo Guidelines & Security Questions */
              <div className="space-y-3.5">
                
                {/* KYC Photo Instructions as mandated in Section 27, 30 */}
                <div className="p-3.5 rounded-2xl bg-white/[0.02] dark:bg-black/20 border border-purple-500/30 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 font-bold text-purple-300">
                    <Upload className="w-4 h-4 text-purple-400" />
                    <span>MANDATORY KYC PHOTO WITH HANDWRITTEN NOTE</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Hold your official ID alongside a handwritten note stating:
                  </p>
                  <div className="p-2.5 bg-white/[0.03] dark:bg-black/30 rounded-xl border border-white/10 text-emerald-400 font-mono text-[11px]">
                    &quot;{fullName || "Your Full Name"}, Ekonnet, {new Date().toISOString().split('T')[0]}&quot;
                  </div>
                </div>

                {/* Security Questions (Section 30) */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-200 block">Security Questions Setup:</span>
                  <div>
                    <input
                      type="text"
                      value={secQ1}
                      onChange={(e) => setSecQ1(e.target.value)}
                      className="w-full rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-2 text-xs text-slate-300 focus:outline-none mb-1.5"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Your Answer to Question 1"
                      value={secA1}
                      onChange={(e) => setSecA1(e.target.value)}
                      className="w-full rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={secQ2}
                      onChange={(e) => setSecQ2(e.target.value)}
                      className="w-full rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-2 text-xs text-slate-300 focus:outline-none mb-1.5"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Your Answer to Question 2"
                      value={secA2}
                      onChange={(e) => setSecA2(e.target.value)}
                      className="w-full rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Section 35: Terms and Conditions Agreement Checkbox */}
                <div className="p-3 rounded-xl bg-white/[0.02] dark:bg-black/20 border border-white/10 flex items-start space-x-3 text-xs">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    required
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 text-purple-600 focus:ring-0"
                  />
                  <label htmlFor="agreeTerms" className="text-slate-300 cursor-pointer text-[11px] leading-relaxed">
                    I fully accept and agree to the <strong>Ekonnet Terms & Conditions, Security Protocols, and Legal Obligations</strong> (Section 35). I confirm I am 18+ years old.
                  </label>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="w-1/3 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 text-xs font-bold transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!agreedTerms || age < 18}
                    className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50"
                  >
                    Complete Registration
                  </button>
                </div>

              </div>
            )}

          </form>

        </div>

      </div>
    </div>
  );
}
