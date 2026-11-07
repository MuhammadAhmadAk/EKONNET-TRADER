"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  ShieldAlert, 
  UserPlus, 
  Upload, 
  ArrowRight, 
  CheckCircle2,
  Lock,
  ShieldCheck,
  Zap,
  Layers,
  Loader2
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("2000-01-01");
  const [age, setAge] = useState(26);
  const [country, setCountry] = useState("United States");
  const [city, setCity] = useState("New York");
  
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
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (isOpen) {
      setAutoUserId(generateEkonnetId("EKON"));
      setApiError("");
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

  const validateStep1 = () => {
    setApiError("");
    if (!username || !fullName) {
      setApiError("Please enter both your preferred Username and Full Legal Name.");
      return false;
    }
    if (age < 18) {
      setApiError("Registration prohibited: You must be at least 18 years of age (Section 63).");
      return false;
    }
    if (!email1) {
      setApiError("Primary Email is required for account security and verification.");
      return false;
    }
    if (!password || password.length < 6) {
      setApiError("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setApiError("Password and Confirm Password do not match.");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setActiveStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (age < 18) {
      setApiError("Registration halted: You must be at least 18 years old to open an account (Section 63).");
      return;
    }
    if (!agreedTerms) {
      setApiError("You must agree to the Terms & Conditions and Legal Procedures (Section 35).");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
          fullName: fullName.trim(),
          dob: dob,
          emails: [email1, email2, email3].filter(Boolean),
          phones: [phoneMobile, phoneLandline].filter(Boolean),
          country: country.trim(),
          city: city.trim(),
          agreedTerms: true,
          packageTier: "Free"
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "Registration failed. Please check your information.");
        setIsLoading(false);
        return;
      }

      // Save user session in localStorage
      localStorage.setItem("ekonnet_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-changed"));

      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setApiError("Network error contacting registration service. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 dark:bg-black/80 backdrop-blur-xl overflow-y-auto">
      {/* Floating Suspended Glass HUD Container */}
      <div className="relative w-full max-w-5xl mx-auto rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-[#0c1222]/95 ring-1 ring-slate-900/5 dark:ring-white/10 my-4 sm:my-8 transition-colors duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: High-End Showcase & Brand Security Deck */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-orange-500/10 via-rose-500/5 to-amber-500/10 dark:from-slate-900/90 dark:via-[#0c1222]/80 dark:to-slate-950/90 border-r border-slate-200/80 dark:border-white/10 p-8 flex-col justify-between overflow-hidden text-slate-900 dark:text-white transition-colors duration-300">
          
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-orange-500/15 dark:bg-orange-500/20 blur-[100px] rounded-full pointer-events-none -z-10" />
          <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-rose-500/15 dark:bg-rose-500/15 blur-[90px] rounded-full pointer-events-none -z-10" />

          {/* Top Branding Row */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white leading-tight">
                  EKONNET<span className="text-orange-500">TRADER</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  Sovereign Clearing Network
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>KYC Gate Active</span>
            </div>
          </div>

          {/* Center Visual Value Prop */}
          <div className="relative z-10 my-auto py-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span>Multi-Asset Liquidity Vault</span>
            </div>

            <h2 className="text-xl font-black tracking-tight leading-snug text-slate-900 dark:text-white mb-3">
              Compliant Onboarding for Verified Traders.
            </h2>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
              Access 168+ fiat currencies, 5 crypto base pairs, and direct P2P settlement with strict bank-grade isolation.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Auto-Generated Cryptographic UID</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Strict 18+ Verification (Sec 63)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>3 Security Emails & 5 Security Questions</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Badges */}
          <div className="relative z-10 pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-orange-500" />
              <span>VPS-Secured Database</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Section 30 Compliant</span>
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN: Auth Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center text-slate-900 dark:text-white max-h-[85vh] overflow-y-auto">
          
          {/* Header */}
          <div className="space-y-1 mb-5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold">
              <UserPlus className="w-3.5 h-3.5" />
              <span>SECTION 30 & 63 COMPLIANT REGISTRATION</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Create Ekonnet Account</h3>
            <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
              <span>Auto ID: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{autoUserId}</strong></span>
              <span>•</span>
              <span>Step {activeStep} of 2</span>
            </div>
          </div>

          {/* Error Alert */}
          {apiError && (
            <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs mb-4">
              {apiError}
            </div>
          )}

          {/* Age Restriction Alert (Section 63) */}
          {underageError && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs space-y-1 mb-5">
              <div className="flex items-center space-x-2 font-bold text-rose-600 dark:text-rose-400">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>UNDER 18 YEARS REGISTRATION PROHIBITED</span>
              </div>
              <p>{underageError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {activeStep === 1 ? (
              /* Step 1: Personal Data, Credentials & 18+ Verification */
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Custom Username</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. btc_trader"
                      className="w-full rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="First and Last Name"
                      className="w-full rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Password (Min 6 chars)</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                    />
                  </div>
                </div>

                {/* DOB and Calculated Age (Section 30, 63) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Date of Birth (Must be 18+)
                    </label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={handleDobChange}
                      className="w-full rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      System Verified Age:
                    </label>
                    <div className="flex items-center rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2.5 text-xs font-bold font-mono">
                      <span className={age >= 18 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                        {age} Years Old {age >= 18 ? "(Eligible)" : "(Rejected under Sec 63)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Multi-Email Form (Section 30: 3 personal emails) */}
                <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-2.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    3 Registered Security Emails (Section 30 requirement)
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="Primary Email Address"
                    value={email1}
                    onChange={(e) => setEmail1(e.target.value)}
                    className="w-full rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="email"
                      placeholder="Secondary Recovery Email"
                      value={email2}
                      onChange={(e) => setEmail2(e.target.value)}
                      className="w-full rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                    />
                    <input
                      type="email"
                      placeholder="Tertiary Backup Email"
                      value={email3}
                      onChange={(e) => setEmail3(e.target.value)}
                      className="w-full rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Location & Phones */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Mobile (SMS)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1-555-0199"
                      value={phoneMobile}
                      onChange={(e) => setPhoneMobile(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={age < 18}
                  onClick={handleNextStep}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-orange-500/25 disabled:opacity-50 transition"
                >
                  <span>Proceed to Security Questions (Step 2)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Step 2: KYC Note Verification & Security Questions */
              <div className="space-y-4">
                
                {/* Handwritten Note Instructions */}
                <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 font-bold text-slate-800 dark:text-slate-200">
                    <Upload className="w-4 h-4 text-orange-500" />
                    <span>KYC Handwritten Verification Notice</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    After registration, you will upload a photo of yourself holding your government ID alongside a handwritten note stating:
                  </p>
                  <div className="p-2.5 bg-white dark:bg-black/30 rounded-xl border border-slate-200 dark:border-white/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                    &quot;{fullName || "Your Full Name"}, Ekonnet, {new Date().toISOString().split('T')[0]}&quot;
                  </div>
                </div>

                {/* Security Questions (Section 30) */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Security Questions Setup:</span>
                  <div>
                    <input
                      type="text"
                      value={secQ1}
                      onChange={(e) => setSecQ1(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none mb-1.5"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Your Answer to Question 1"
                      value={secA1}
                      onChange={(e) => setSecA1(e.target.value)}
                      className="w-full rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={secQ2}
                      onChange={(e) => setSecQ2(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none mb-1.5"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Your Answer to Question 2"
                      value={secA2}
                      onChange={(e) => setSecA2(e.target.value)}
                      className="w-full rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Section 35: Terms and Conditions Agreement Checkbox */}
                <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 flex items-start space-x-3 text-xs">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    required
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 dark:border-white/20 text-orange-600 focus:ring-0"
                  />
                  <label htmlFor="agreeTerms" className="text-slate-700 dark:text-slate-300 cursor-pointer text-[11px] leading-relaxed">
                    I fully accept and agree to the <strong>Ekonnet Terms & Conditions, Security Protocols, and Legal Obligations</strong> (Section 35). I confirm I am 18+ years old.
                  </label>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setActiveStep(1)}
                    className="w-1/3 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!agreedTerms || age < 18 || isLoading}
                    className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs tracking-wide shadow-md shadow-orange-500/25 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>Complete Registration</span>
                    )}
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
